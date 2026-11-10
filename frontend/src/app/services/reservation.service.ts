import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationRequest } from '../model/library';
import { environment } from '../../environments/environment';
@Service()
export class ReservationService {
  private readonly http = inject(HttpClient);
  readonly resourceUrl = `${environment.HOST}/v1/reservations`;
  saveTransactional(dto: ReservationRequest) {
    return this.http.post<void>(this.resourceUrl, dto);
  }
}
