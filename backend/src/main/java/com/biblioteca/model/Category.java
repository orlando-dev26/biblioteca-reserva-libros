package com.biblioteca.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Category {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Integer idCategory;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false, length = 250)
  private String description;

  @Column(nullable = false)
  private Boolean state;
}
