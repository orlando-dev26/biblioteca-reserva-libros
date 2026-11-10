import { Service, inject, signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Reservation } from '../model/library';
import { ReservationService } from '../services/reservation.service';
@Service({ autoProvided: false })
export class ReservationStore {
  private readonly service = inject(ReservationService);
  readonly clientId = signal<number | null>(null);
  readonly resource = httpResource<Reservation[]>(
    () =>
      this.clientId()
        ? `${this.service.resourceUrl}/client/${this.clientId()}`
        : this.service.resourceUrl,
    { defaultValue: [] },
  );
  readonly items = computed(() => (this.resource.hasValue() ? this.resource.value() : []));
  reload() {
    this.resource.reload();
  }
}
