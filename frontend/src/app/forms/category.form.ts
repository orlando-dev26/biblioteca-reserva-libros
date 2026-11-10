import { Service, signal } from '@angular/core';
import { form, required, maxLength, email } from '@angular/forms/signals';
import { Category } from '../model/library';
@Service({ autoProvided: false })
export class CategoryForm {
  readonly model = signal<Category>({ name: '', description: '', state: true });
  readonly fields = form(this.model, (p) => {
    required(p.name);
    maxLength(p.name, 100);
    required(p.description);
    maxLength(p.description, 250);
  });
  patch(value: Category) {
    this.model.set({ ...value });
  }
  value() {
    return this.model();
  }
  isInvalid() {
    return this.fields().invalid();
  }
}
