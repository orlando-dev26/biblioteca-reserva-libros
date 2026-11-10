import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Book } from '../../model/library';
import { ClientStore } from '../../store/client.store';
import { BookStore } from '../../store/book.store';
import { ReservationForm } from '../../forms/reservation.form';
import { ReservationService } from '../../services/reservation.service';
import { NotificationService } from '../../shared/notification.service';
@Component({
  selector: 'app-reservation',
  imports: [
    FormField,
    FormRoot,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    RouterLink,
  ],
  providers: [ClientStore, BookStore, ReservationForm],
  templateUrl: './reservation.component.html',
})
export class ReservationComponent {
  readonly clients = inject(ClientStore);
  readonly books = inject(BookStore);
  readonly entry = inject(ReservationForm);
  private readonly service = inject(ReservationService);
  private readonly notification = inject(NotificationService);
  readonly selected = signal<Book[]>([]);
  readonly term = signal('');
  readonly saving = signal(false);
  readonly saved = signal(false);
  readonly available = computed(() =>
    this.books
      .items()
      .filter(
        (b) =>
          b.available &&
          !this.selected().some((s) => s.idBook === b.idBook) &&
          (b.title + ' ' + b.author + ' ' + b.categoryName)
            .toLowerCase()
            .includes(this.term().toLowerCase()),
      ),
  );
  readonly client = computed(() =>
    this.clients.items().find((c) => c.idClient === this.entry.model().idClient),
  );
  readonly canSave = computed(
    () => !this.entry.fields().invalid() && this.selected().length > 0 && !this.saving(),
  );
  add(book: Book) {
    if (this.saving()) return;
    this.saved.set(false);
    this.selected.update((items) => [...items, book]);
  }
  remove(id: number) {
    if (!this.saving()) this.selected.update((items) => items.filter((b) => b.idBook !== id));
  }
  search(event: Event) {
    this.term.set((event.target as HTMLInputElement).value);
  }
  save(event: Event) {
    event.preventDefault();
    if (!this.canSave()) return;
    this.saving.set(true);
    this.saved.set(false);
    const value = this.entry.model();
    const date =
      value.reservationDate.length === 16 ? value.reservationDate + ':00' : value.reservationDate;
    this.service
      .saveTransactional({
        idClient: value.idClient!,
        reservationDate: date,
        details: this.selected().map((b) => ({ idBook: b.idBook! })),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.notification.show('Reserva registrada correctamente');
          this.selected.set([]);
          this.entry.reset();
          this.term.set('');
          this.saved.set(true);
          this.books.reload();
        },
        error: () => {},
      });
  }
}
