import { Service, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
function localNow() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
@Service({ autoProvided: false })
export class ReservationForm {
  readonly model = signal<{ idClient: number | null; reservationDate: string }>({
    idClient: null,
    reservationDate: localNow(),
  });
  readonly fields = form(this.model, (p) => {
    required(p.idClient);
    required(p.reservationDate);
  });
  reset() {
    this.model.set({ idClient: null, reservationDate: localNow() });
  }
}
