package com.biblioteca;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class LibraryIntegrationTests {
  @LocalServerPort int port;
  @Autowired JdbcTemplate jdbc;
  private final HttpClient http = HttpClient.newHttpClient();
  private final JsonMapper json = JsonMapper.builder().build();

  private HttpResponse<String> request(String method, String path, String body) throws Exception {
    return http.send(
        HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/v1" + path))
            .header("Content-Type", "application/json")
            .method(
                method,
                body == null
                    ? HttpRequest.BodyPublishers.noBody()
                    : HttpRequest.BodyPublishers.ofString(body))
            .build(),
        HttpResponse.BodyHandlers.ofString());
  }

  private int create(String path, String body) throws Exception {
    var response = request("POST", path, body);
    assertThat(response.statusCode()).as(response.body()).isEqualTo(201);
    String location = response.headers().firstValue("Location").orElseThrow();
    return Integer.parseInt(location.substring(location.lastIndexOf('/') + 1));
  }

  private String reservation(int client, int... books) {
    String details =
        java.util.Arrays.stream(books)
            .mapToObj(id -> "{\"idBook\":" + id + "}")
            .collect(java.util.stream.Collectors.joining(","));
    return "{\"idClient\":"
        + client
        + ",\"reservationDate\":\"2026-11-09T19:30:00\",\"details\":["
        + details
        + "]}";
  }

  private int category() throws Exception {
    return create(
        "/categories",
        "{\"name\":\"Literatura\",\"description\":\"Obras de ficción\",\"state\":true}");
  }

  private int client() throws Exception {
    return create(
        "/clients",
        "{\"firstName\":\"Ana\",\"lastName\":\"Lectura\",\"cedula\":\"TEST-123\",\"email\":\"ana@example.test\"}");
  }

  private int book(int category, boolean available) throws Exception {
    return create(
        "/books",
        "{\"title\":\"Libro de prueba\",\"author\":\"Autora\",\"isbn\":\"TEST-ISBN\",\"available\":"
            + available
            + ",\"idCategory\":"
            + category
            + "}");
  }

  @Test
  void catalogCrudAndRelationshipMapping() throws Exception {
    int category = category();
    int book = book(category, true);
    int client = client();
    JsonNode b = json.readTree(request("GET", "/books/" + book, null).body());
    assertThat(b.get("categoryName").asText()).isEqualTo("Literatura");
    assertThat(b.get("idBook").asInt()).isEqualTo(book);
    assertThat(
            request(
                    "PUT",
                    "/books/" + book,
                    "{\"idBook\":999999,\"title\":\" Nuevo título \",\"author\":\"Autora\",\"isbn\":\"XYZ\",\"available\":false,\"idCategory\":"
                        + category
                        + "}")
                .statusCode())
        .isEqualTo(200);
    b = json.readTree(request("GET", "/books/" + book, null).body());
    assertThat(b.get("title").asText()).isEqualTo("Nuevo título");
    assertThat(b.get("idBook").asInt()).isEqualTo(book);
    assertThat(request("DELETE", "/categories/" + category, null).statusCode()).isEqualTo(409);
    assertThat(request("DELETE", "/books/" + book, null).statusCode()).isEqualTo(204);
    assertThat(request("GET", "/books/" + book, null).statusCode()).isEqualTo(404);
    assertThat(request("DELETE", "/categories/" + category, null).statusCode()).isEqualTo(204);
    assertThat(request("DELETE", "/clients/" + client, null).statusCode()).isEqualTo(204);
  }

  @Test
  void validatesCatalogsNestedDetailsAndJson() throws Exception {
    assertThat(
            request(
                    "POST",
                    "/categories",
                    "{\"name\":\"   \",\"description\":\"x\",\"state\":true}")
                .statusCode())
        .isEqualTo(400);
    assertThat(
            request(
                    "POST",
                    "/clients",
                    "{\"firstName\":\"Ana\",\"lastName\":\"Test\",\"cedula\":\"12\",\"email\":\"invalido\"}")
                .statusCode())
        .isEqualTo(400);
    assertThat(request("POST", "/reservations", reservation(client())).statusCode()).isEqualTo(400);
    assertThat(
            request(
                    "POST",
                    "/reservations",
                    "{\"idClient\":1,\"reservationDate\":\"2026-11-09T19:00:00\",\"details\":[{\"idBook\":null}]}")
                .statusCode())
        .isEqualTo(400);
    var response = request("POST", "/reservations", "{\"reservationDate\":\"fecha incorrecta\"}");
    assertThat(response.statusCode()).isEqualTo(400);
    assertThat(json.readTree(response.body()).has("message")).isTrue();
    assertThat(request("GET", "/clients/999999", null).statusCode()).isEqualTo(404);
  }

  @Test
  void reservationsPersistMultipleBooksAndFilterByClient() throws Exception {
    int c = category(), client = client(), anotherClient = client();
    int b1 = book(c, true), b2 = book(c, true);
    int id = create("/reservations", reservation(client, b1, b2));
    JsonNode r = json.readTree(request("GET", "/reservations/" + id, null).body());
    assertThat(r.get("details").size()).isEqualTo(2);
    assertThat(r.get("client").get("firstName").asText()).isEqualTo("Ana");
    assertThat(r.get("details").get(0).get("book").get("categoryName").asText())
        .isEqualTo("Literatura");
    assertThat(r.get("reservationDate").asText()).startsWith("2026-11-09T19:30");
    assertThat(json.readTree(request("GET", "/reservations/client/" + client, null).body()).size())
        .isEqualTo(1);
    assertThat(
            json.readTree(request("GET", "/reservations/client/" + anotherClient, null).body())
                .size())
        .isZero();
    assertThat(request("GET", "/reservations/client/999999", null).statusCode()).isEqualTo(404);
    assertThat(request("DELETE", "/clients/" + client, null).statusCode()).isEqualTo(409);
    assertThat(request("DELETE", "/books/" + b1, null).statusCode()).isEqualTo(409);
    assertThat(
            json.readTree(request("GET", "/books/" + b1, null).body()).get("available").asBoolean())
        .isTrue();
    int singleId = create("/reservations", reservation(client, b1));
    JsonNode single = json.readTree(request("GET", "/reservations/" + singleId, null).body());
    assertThat(single.get("details").size()).isEqualTo(1);
  }

  @Test
  void rejectsDuplicatesUnavailableAndMissingReferencesWithoutPartialReservation()
      throws Exception {
    int c = category(), client = client(), available = book(c, true), unavailable = book(c, false);
    long before = jdbc.queryForObject("select count(*) from reservation", Long.class);
    assertThat(
            request("POST", "/reservations", reservation(client, available, available))
                .statusCode())
        .isEqualTo(400);
    assertThat(
            request("POST", "/reservations", reservation(client, available, unavailable))
                .statusCode())
        .isEqualTo(409);
    assertThat(
            request("POST", "/reservations", reservation(client, available, 999999)).statusCode())
        .isEqualTo(404);
    assertThat(jdbc.queryForObject("select count(*) from reservation", Long.class))
        .isEqualTo(before);
  }

  @Test
  void databaseFailureRollsBackHeaderAndDetails() throws Exception {
    int c = category(), client = client(), b1 = book(c, true), b2 = book(c, true);
    long headers = jdbc.queryForObject("select count(*) from reservation", Long.class);
    long details = jdbc.queryForObject("select count(*) from detail_reservation", Long.class);
    jdbc.execute(
        "alter table detail_reservation add constraint test_failure check (id_book <> " + b2 + ")");
    try {
      assertThat(request("POST", "/reservations", reservation(client, b1, b2)).statusCode())
          .isEqualTo(409);
      assertThat(jdbc.queryForObject("select count(*) from reservation", Long.class))
          .isEqualTo(headers);
      assertThat(jdbc.queryForObject("select count(*) from detail_reservation", Long.class))
          .isEqualTo(details);
    } finally {
      jdbc.execute("alter table detail_reservation drop constraint test_failure");
    }
  }
}
