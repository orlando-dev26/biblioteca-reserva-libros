package com.biblioteca.service.impl;

import com.biblioteca.model.Client;
import com.biblioteca.repo.*;
import com.biblioteca.service.IClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl extends CRUDImpl<Client, Integer> implements IClientService {
  private final IClientRepo repo;

  @Override
  protected IGenericRepo<Client, Integer> getRepo() {
    return repo;
  }

  private void normalize(Client e) {
    e.setFirstName(e.getFirstName().strip());
    e.setLastName(e.getLastName().strip());
    e.setCedula(e.getCedula().strip());
    e.setEmail(e.getEmail().strip());
  }

  @Override
  public Client save(Client e) throws Exception {
    e.setIdClient(null);
    normalize(e);
    return super.save(e);
  }

  @Override
  public Client update(Integer id, Client e) throws Exception {
    normalize(e);
    return super.update(id, e);
  }
}
