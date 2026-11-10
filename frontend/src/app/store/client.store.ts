import { computed, inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Client } from '../model/library';
import { ClientService } from '../services/client.service';
@Service({ autoProvided: false })
export class ClientStore {
  private readonly service = inject(ClientService);
  readonly resource = httpResource<Client[]>(() => this.service.resourceUrl, { defaultValue: [] });
  readonly items = computed(() => (this.resource.hasValue() ? this.resource.value() : []));
  readonly loading = this.resource.isLoading;
  reload() {
    this.resource.reload();
  }
}
