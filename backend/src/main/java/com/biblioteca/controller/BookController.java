package com.biblioteca.controller;

import com.biblioteca.dto.BookDTO;
import com.biblioteca.model.Book;
import com.biblioteca.service.IBookService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/books")
public class BookController {
  private final IBookService service;
  private final ModelMapper defaultMapper;

  @GetMapping
  public ResponseEntity<List<BookDTO>> findAll() throws Exception {
    return ResponseEntity.ok(service.findAll().stream().map(this::toDto).toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookDTO> findById(@PathVariable Integer id) throws Exception {
    return ResponseEntity.ok(toDto(service.findById(id)));
  }

  @PostMapping
  public ResponseEntity<Void> save(@Valid @RequestBody BookDTO dto) throws Exception {
    Book saved = service.save(defaultMapper.map(dto, Book.class));
    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getIdBook())
                .toUri())
        .build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<BookDTO> update(@PathVariable Integer id, @Valid @RequestBody BookDTO dto)
      throws Exception {
    return ResponseEntity.ok(toDto(service.update(id, defaultMapper.map(dto, Book.class))));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }

  private BookDTO toDto(Book entity) {
    return defaultMapper.map(entity, BookDTO.class);
  }
}
