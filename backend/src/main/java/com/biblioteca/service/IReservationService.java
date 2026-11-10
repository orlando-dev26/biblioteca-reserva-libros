package com.biblioteca.service;

import com.biblioteca.dto.ReservationRequestDTO;
import com.biblioteca.model.Reservation;
import java.util.List;

public interface IReservationService {
  Reservation saveTransactional(ReservationRequestDTO dto);

  List<Reservation> findAll();

  Reservation findById(Integer id);

  List<Reservation> findByClient(Integer idClient);
}
