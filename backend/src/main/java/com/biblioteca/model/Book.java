package com.biblioteca.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Book {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Integer idBook;

  @Column(nullable = false, length = 150)
  private String title;

  @Column(nullable = false, length = 100)
  private String author;

  @Column(nullable = false, length = 20)
  private String isbn;

  @Column(nullable = false)
  private Boolean available;

  @ManyToOne(optional = false)
  @JoinColumn(
      name = "id_category",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_book_category"))
  private Category category;
}
