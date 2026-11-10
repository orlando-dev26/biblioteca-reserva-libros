package com.biblioteca.config;

import com.biblioteca.dto.BookDTO;
import com.biblioteca.model.Book;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.*;

@Configuration
public class MapperConfig {
  @Bean
  public ModelMapper defaultMapper() {
    ModelMapper mapper = new ModelMapper();
    // Evita que idCategory se confunda con el ID del libro al escribir.
    mapper.createTypeMap(BookDTO.class, Book.class).addMappings(m -> m.skip(Book::setIdBook));
    mapper
        .createTypeMap(Book.class, BookDTO.class)
        .addMappings(
            m -> {
              m.map(s -> s.getCategory().getIdCategory(), BookDTO::setIdCategory);
              m.map(s -> s.getCategory().getName(), BookDTO::setCategoryName);
            });
    return mapper;
  }
}
