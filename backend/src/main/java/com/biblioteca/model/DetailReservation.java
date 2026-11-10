package com.biblioteca.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(
    name = "detail_reservation",
    uniqueConstraints =
        @UniqueConstraint(
            name = "uk_reservation_book",
            columnNames = {"id_reservation", "id_book"}))
public class DetailReservation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Integer idDetailReservation;

  @ManyToOne(optional = false)
  @JoinColumn(
      name = "id_reservation",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_detail_reservation"))
  @ToString.Exclude
  private Reservation reservation;

  @ManyToOne(optional = false)
  @JoinColumn(name = "id_book", nullable = false, foreignKey = @ForeignKey(name = "fk_detail_book"))
  private Book book;
}
