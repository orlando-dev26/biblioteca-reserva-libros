package com.biblioteca.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
  private Integer idBook;

  @NotBlank
  @Size(max = 150)
  private String title;

  @NotBlank
  @Size(max = 100)
  private String author;

  @NotBlank
  @Size(max = 20)
  private String isbn;

  @NotNull private Boolean available;
  @NotNull @Positive private Integer idCategory;

  @com.fasterxml.jackson.annotation.JsonProperty(
      access = com.fasterxml.jackson.annotation.JsonProperty.Access.READ_ONLY)
  private String categoryName;
}
