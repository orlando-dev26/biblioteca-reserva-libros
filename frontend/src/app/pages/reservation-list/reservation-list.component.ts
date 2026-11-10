import { Component, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReservationStore } from '../../store/reservation.store';
import { ClientStore } from '../../store/client.store';
@Component({
  selector: 'app-reservation-list',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  providers: [ReservationStore, ClientStore],
  templateUrl: './reservation-list.component.html',
})
export class ReservationListComponent {
  readonly store = inject(ReservationStore);
  readonly clients = inject(ClientStore);
  readonly booksCount = computed(() =>
    this.store.items().reduce((n, r) => n + r.details.length, 0),
  );
}
