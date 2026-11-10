import { Service, signal } from '@angular/core';
import { form, required, maxLength, email } from '@angular/forms/signals';
import { Book } from '../model/library';
@Service({ autoProvided: false })
export class BookForm {
  readonly model = signal<Book>({
    title: '',
    author: '',
    isbn: '',
    available: true,
    idCategory: null,
  });
  readonly fields = form(this.model, (p) => {
    required(p.title);
    maxLength(p.title, 150);
    required(p.author);
    maxLength(p.author, 100);
    required(p.isbn);
    maxLength(p.isbn, 20);
    required(p.idCategory);
  });
  patch(value: Book) {
    this.model.set({ ...value });
  }
  value() {
    return this.model();
  }
  isInvalid() {
    return this.fields().invalid();
  }
}
