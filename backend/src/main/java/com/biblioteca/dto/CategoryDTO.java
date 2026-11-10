package com.biblioteca.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
  private Integer idCategory;

  @NotBlank
  @Size(max = 100)
  private String name;

  @NotBlank
  @Size(max = 250)
  private String description;

  @NotNull private Boolean state;
}
