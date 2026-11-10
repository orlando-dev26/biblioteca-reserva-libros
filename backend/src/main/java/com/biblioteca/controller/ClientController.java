package com.biblioteca.controller;

import com.biblioteca.dto.ClientDTO;
import com.biblioteca.model.Client;
import com.biblioteca.service.IClientService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/clients")
public class ClientController {
  private final IClientService service;
  private final ModelMapper defaultMapper;

  @GetMapping
  public ResponseEntity<List<ClientDTO>> findAll() throws Exception {
    return ResponseEntity.ok(service.findAll().stream().map(this::toDto).toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ClientDTO> findById(@PathVariable Integer id) throws Exception {
    return ResponseEntity.ok(toDto(service.findById(id)));
  }

  @PostMapping
  public ResponseEntity<Void> save(@Valid @RequestBody ClientDTO dto) throws Exception {
    Client saved = service.save(defaultMapper.map(dto, Client.class));
    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getIdClient())
                .toUri())
        .build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<ClientDTO> update(
      @PathVariable Integer id, @Valid @RequestBody ClientDTO dto) throws Exception {
    return ResponseEntity.ok(toDto(service.update(id, defaultMapper.map(dto, Client.class))));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }

  private ClientDTO toDto(Client entity) {
    return defaultMapper.map(entity, ClientDTO.class);
  }
}
