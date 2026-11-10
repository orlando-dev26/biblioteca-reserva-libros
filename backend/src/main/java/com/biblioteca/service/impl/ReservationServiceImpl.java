package com.biblioteca.service.impl;

import com.biblioteca.dto.ReservationRequestDTO;
import com.biblioteca.exception.*;
import com.biblioteca.model.*;
import com.biblioteca.repo.*;
import com.biblioteca.service.IReservationService;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationServiceImpl implements IReservationService {
  private final IReservationRepo repo;
  private final IClientRepo clientRepo;
  private final IBookRepo bookRepo;

  @Override
  @Transactional
  public Reservation saveTransactional(ReservationRequestDTO dto) {
    Client client =
        clientRepo
            .findById(dto.getIdClient())
            .orElseThrow(
                () -> new ModelNotFoundException("No se encuentra el cliente seleccionado"));
    Reservation reservation = new Reservation();
    reservation.setClient(client);
    reservation.setReservationDate(dto.getReservationDate());
    Set<Integer> ids = new HashSet<>();
    dto.getDetails()
        .forEach(
            item -> {
              if (!ids.add(item.getIdBook()))
                throw new IllegalArgumentException(
                    "Un libro no puede repetirse en la misma reserva");
              Book book =
                  bookRepo
                      .findById(item.getIdBook())
                      .orElseThrow(
                          () ->
                              new ModelNotFoundException(
                                  "No se encuentra el libro con ID " + item.getIdBook()));
              if (!Boolean.TRUE.equals(book.getAvailable()))
                throw new BusinessException(
                    "El libro «" + book.getTitle() + "» no está disponible");
              DetailReservation detail = new DetailReservation();
              detail.setBook(book);
              detail.setReservation(reservation);
              reservation.getDetails().add(detail);
            });
    return repo.saveAndFlush(reservation);
  }

  @Override
  public List<Reservation> findAll() {
    return repo.findAll(Sort.by("idReservation").descending());
  }

  @Override
  public Reservation findById(Integer id) {
    return repo.findById(id)
        .orElseThrow(() -> new ModelNotFoundException("No se encuentra la reserva con ID " + id));
  }

  @Override
  public List<Reservation> findByClient(Integer id) {
    if (!clientRepo.existsById(id))
      throw new ModelNotFoundException("No se encuentra el cliente con ID " + id);
    return repo.findByClientIdClientOrderByIdReservationDesc(id);
  }
}
