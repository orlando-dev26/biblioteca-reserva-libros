import { Service } from '@angular/core';
import { Client } from '../model/library';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment';
@Service()
export class ClientService extends GenericService<Client> {
  protected override url = `${environment.HOST}/v1/clients`;
}
