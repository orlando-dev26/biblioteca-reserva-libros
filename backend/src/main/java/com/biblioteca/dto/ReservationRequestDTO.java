package com.biblioteca.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequestDTO {
  @NotNull private java.time.LocalDateTime reservationDate;
  @NotNull @Positive private Integer idClient;
  @NotEmpty private java.util.List<@NotNull @Valid DetailRequestDTO> details;
}
