package com.biblioteca.service.impl;

import com.biblioteca.model.Category;
import com.biblioteca.repo.*;
import com.biblioteca.service.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl extends CRUDImpl<Category, Integer> implements ICategoryService {
  private final ICategoryRepo repo;

  @Override
  protected IGenericRepo<Category, Integer> getRepo() {
    return repo;
  }

  private void normalize(Category e) {
    e.setName(e.getName().strip());
    e.setDescription(e.getDescription().strip());
  }

  @Override
  public Category save(Category e) throws Exception {
    e.setIdCategory(null);
    normalize(e);
    return super.save(e);
  }

  @Override
  public Category update(Integer id, Category e) throws Exception {
    normalize(e);
    return super.update(id, e);
  }
}
