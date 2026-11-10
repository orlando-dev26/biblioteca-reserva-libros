import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Service({ autoProvided: false })
export abstract class GenericService<T> {
  protected readonly http = inject(HttpClient);
  protected abstract url: string;
  get resourceUrl() {
    return this.url;
  }
  findAll() {
    return this.http.get<T[]>(this.url);
  }
  findById(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }
  save(item: T) {
    return this.http.post<void>(this.url, item);
  }
  update(id: number, item: T) {
    return this.http.put<T>(`${this.url}/${id}`, item);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
