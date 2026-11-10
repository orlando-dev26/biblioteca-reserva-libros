package com.biblioteca.service.impl;

import com.biblioteca.exception.ModelNotFoundException;
import com.biblioteca.repo.IGenericRepo;
import com.biblioteca.service.ICRUD;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public abstract class CRUDImpl<T, ID> implements ICRUD<T, ID> {
  protected abstract IGenericRepo<T, ID> getRepo();

  @Override
  public T save(T entity) throws Exception {
    return getRepo().save(entity);
  }

  @Override
  public T update(ID id, T entity) throws Exception {
    findById(id);
    // Convención del CRUD del curso: Book -> setIdBook(Integer).
    entity
        .getClass()
        .getMethod("setId" + entity.getClass().getSimpleName(), id.getClass())
        .invoke(entity, id);
    return getRepo().save(entity);
  }

  @Override
  @Transactional(readOnly = true)
  public List<T> findAll() {
    return getRepo().findAll();
  }

  @Override
  @Transactional(readOnly = true)
  public T findById(ID id) {
    return getRepo()
        .findById(id)
        .orElseThrow(() -> new ModelNotFoundException("No se encuentra el registro con ID " + id));
  }

  @Override
  public void delete(ID id) {
    findById(id);
    getRepo().deleteById(id);
    getRepo().flush();
  }
}
