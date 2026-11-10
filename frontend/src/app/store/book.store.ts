import { computed, inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Book } from '../model/library';
import { BookService } from '../services/book.service';
@Service({ autoProvided: false })
export class BookStore {
  private readonly service = inject(BookService);
  readonly resource = httpResource<Book[]>(() => this.service.resourceUrl, { defaultValue: [] });
  readonly items = computed(() => (this.resource.hasValue() ? this.resource.value() : []));
  readonly loading = this.resource.isLoading;
  reload() {
    this.resource.reload();
  }
}
