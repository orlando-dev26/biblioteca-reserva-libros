package com.biblioteca.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {
  private ResponseEntity<Object> error(HttpStatus status, String message, WebRequest request) {
    return ResponseEntity.status(status)
        .body(new CustomErrorTemplate(LocalDateTime.now(), message, request.getDescription(false)));
  }

  @ExceptionHandler(ModelNotFoundException.class)
  public ResponseEntity<Object> notFound(ModelNotFoundException ex, WebRequest r) {
    return error(HttpStatus.NOT_FOUND, ex.getMessage(), r);
  }

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<Object> conflict(BusinessException ex, WebRequest r) {
    return error(HttpStatus.CONFLICT, ex.getMessage(), r);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Object> invalid(IllegalArgumentException ex, WebRequest r) {
    return error(HttpStatus.BAD_REQUEST, ex.getMessage(), r);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<Object> integrity(DataIntegrityViolationException ex, WebRequest r) {
    return error(
        HttpStatus.CONFLICT,
        "El registro tiene datos relacionados y no puede eliminarse, o incumple una restricción de integridad",
        r);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex, HttpHeaders h, HttpStatusCode s, WebRequest r) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .sorted()
            .collect(Collectors.joining("; "));
    return error(HttpStatus.BAD_REQUEST, message, r);
  }

  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(
      HttpMessageNotReadableException ex, HttpHeaders h, HttpStatusCode s, WebRequest r) {
    return error(
        HttpStatus.BAD_REQUEST,
        "Revisa el JSON y los tipos de datos. La fecha debe usar yyyy-MM-dd'T'HH:mm:ss",
        r);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> unexpected(Exception ex, WebRequest r) {
    org.slf4j.LoggerFactory.getLogger(getClass()).error("Error inesperado en la API", ex);
    return error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "No se puede completar la operación. Inténtalo de nuevo",
        r);
  }
}
