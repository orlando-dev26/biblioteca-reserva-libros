import { Service } from '@angular/core';
import { Book } from '../model/library';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment';
@Service()
export class BookService extends GenericService<Book> {
  protected override url = `${environment.HOST}/v1/books`;
}
