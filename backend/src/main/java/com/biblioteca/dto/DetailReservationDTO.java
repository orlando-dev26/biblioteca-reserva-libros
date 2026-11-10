package com.biblioteca.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailReservationDTO {
  private Integer idDetailReservation;
  private BookDTO book;
}
