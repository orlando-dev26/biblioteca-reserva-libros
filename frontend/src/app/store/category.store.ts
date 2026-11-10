import { computed, inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Category } from '../model/library';
import { CategoryService } from '../services/category.service';
@Service({ autoProvided: false })
export class CategoryStore {
  private readonly service = inject(CategoryService);
  readonly resource = httpResource<Category[]>(() => this.service.resourceUrl, {
    defaultValue: [],
  });
  readonly items = computed(() => (this.resource.hasValue() ? this.resource.value() : []));
  readonly loading = this.resource.isLoading;
  reload() {
    this.resource.reload();
  }
}
