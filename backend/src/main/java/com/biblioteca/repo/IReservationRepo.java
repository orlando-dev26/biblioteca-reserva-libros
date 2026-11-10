package com.biblioteca.repo;

import com.biblioteca.model.Reservation;

public interface IReservationRepo extends IGenericRepo<Reservation, Integer> {
  java.util.List<Reservation> findByClientIdClientOrderByIdReservationDesc(Integer idClient);
}
