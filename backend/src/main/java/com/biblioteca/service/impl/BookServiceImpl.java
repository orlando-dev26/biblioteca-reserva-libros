package com.biblioteca.service.impl;

import com.biblioteca.exception.ModelNotFoundException;
import com.biblioteca.model.Book;
import com.biblioteca.repo.*;
import com.biblioteca.service.IBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class BookServiceImpl extends CRUDImpl<Book, Integer> implements IBookService {
  private final IBookRepo repo;
  private final ICategoryRepo categoryRepo;

  @Override
  protected IGenericRepo<Book, Integer> getRepo() {
    return repo;
  }

  private void prepare(Book b) {
    Integer id = b.getCategory().getIdCategory();
    b.setCategory(
        categoryRepo
            .findById(id)
            .orElseThrow(
                () -> new ModelNotFoundException("No se encuentra la categoría con ID " + id)));
    b.setTitle(b.getTitle().strip());
    b.setAuthor(b.getAuthor().strip());
    b.setIsbn(b.getIsbn().strip());
  }

  @Override
  public Book save(Book b) throws Exception {
    b.setIdBook(null);
    prepare(b);
    return super.save(b);
  }

  @Override
  public Book update(Integer id, Book b) throws Exception {
    findById(id);
    prepare(b);
    return super.update(id, b);
  }
}
