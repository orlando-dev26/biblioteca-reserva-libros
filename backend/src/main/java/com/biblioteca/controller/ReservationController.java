package com.biblioteca.controller;

import com.biblioteca.dto.*;
import com.biblioteca.model.Reservation;
import com.biblioteca.service.IReservationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/reservations")
public class ReservationController {
  private final IReservationService service;
  private final ModelMapper defaultMapper;

  @PostMapping
  public ResponseEntity<Void> save(@Valid @RequestBody ReservationRequestDTO dto) {
    Reservation result = service.saveTransactional(dto);
    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(result.getIdReservation())
                .toUri())
        .build();
  }

  @GetMapping
  public ResponseEntity<List<ReservationDTO>> findAll() {
    return ResponseEntity.ok(service.findAll().stream().map(this::toDto).toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ReservationDTO> findById(@PathVariable Integer id) {
    return ResponseEntity.ok(toDto(service.findById(id)));
  }

  @GetMapping("/client/{idClient}")
  public ResponseEntity<List<ReservationDTO>> findByClient(@PathVariable Integer idClient) {
    return ResponseEntity.ok(service.findByClient(idClient).stream().map(this::toDto).toList());
  }

  private ReservationDTO toDto(Reservation entity) {
    return defaultMapper.map(entity, ReservationDTO.class);
  }
}
