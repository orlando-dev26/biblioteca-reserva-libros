package com.biblioteca.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailRequestDTO {
  @NotNull @Positive private Integer idBook;
}
