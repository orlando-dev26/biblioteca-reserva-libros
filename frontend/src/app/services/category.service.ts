import { Service } from '@angular/core';
import { Category } from '../model/library';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment';
@Service()
export class CategoryService extends GenericService<Category> {
  protected override url = `${environment.HOST}/v1/categories`;
}
