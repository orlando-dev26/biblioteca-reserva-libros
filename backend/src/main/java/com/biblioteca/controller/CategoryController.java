package com.biblioteca.controller;

import com.biblioteca.dto.CategoryDTO;
import com.biblioteca.model.Category;
import com.biblioteca.service.ICategoryService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/categories")
public class CategoryController {
  private final ICategoryService service;
  private final ModelMapper defaultMapper;

  @GetMapping
  public ResponseEntity<List<CategoryDTO>> findAll() throws Exception {
    return ResponseEntity.ok(service.findAll().stream().map(this::toDto).toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<CategoryDTO> findById(@PathVariable Integer id) throws Exception {
    return ResponseEntity.ok(toDto(service.findById(id)));
  }

  @PostMapping
  public ResponseEntity<Void> save(@Valid @RequestBody CategoryDTO dto) throws Exception {
    Category saved = service.save(defaultMapper.map(dto, Category.class));
    return ResponseEntity.created(
            ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getIdCategory())
                .toUri())
        .build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<CategoryDTO> update(
      @PathVariable Integer id, @Valid @RequestBody CategoryDTO dto) throws Exception {
    return ResponseEntity.ok(toDto(service.update(id, defaultMapper.map(dto, Category.class))));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }

  private CategoryDTO toDto(Category entity) {
    return defaultMapper.map(entity, CategoryDTO.class);
  }
}
