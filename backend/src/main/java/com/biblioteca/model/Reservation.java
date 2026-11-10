package com.biblioteca.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Reservation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Integer idReservation;

  @Column(nullable = false)
  private java.time.LocalDateTime reservationDate;

  @ManyToOne(optional = false)
  @JoinColumn(
      name = "id_client",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_reservation_client"))
  private Client client;

  @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
  @ToString.Exclude
  private java.util.List<DetailReservation> details = new java.util.ArrayList<>();
}
