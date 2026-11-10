import { Service, signal } from '@angular/core';
import { form, required, maxLength, email } from '@angular/forms/signals';
import { Client } from '../model/library';
@Service({ autoProvided: false })
export class ClientForm {
  readonly model = signal<Client>({ firstName: '', lastName: '', cedula: '', email: '' });
  readonly fields = form(this.model, (p) => {
    required(p.firstName);
    maxLength(p.firstName, 100);
    required(p.lastName);
    maxLength(p.lastName, 100);
    required(p.cedula);
    maxLength(p.cedula, 20);
    required(p.email);
    maxLength(p.email, 100);
    email(p.email);
  });
  patch(value: Client) {
    this.model.set({ ...value });
  }
  value() {
    return this.model();
  }
  isInvalid() {
    return this.fields().invalid();
  }
}
