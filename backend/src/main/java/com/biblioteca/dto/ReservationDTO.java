package com.biblioteca.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
  private Integer idReservation;
  private java.time.LocalDateTime reservationDate;
  private ClientDTO client;
  private java.util.List<DetailReservationDTO> details;
}
