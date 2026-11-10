package com.biblioteca.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
  private Integer idClient;

  @NotBlank
  @Size(max = 100)
  private String firstName;

  @NotBlank
  @Size(max = 100)
  private String lastName;

  @NotBlank
  @Size(max = 20)
  private String cedula;

  @NotBlank
  @Email
  @Size(max = 100)
  private String email;
}
