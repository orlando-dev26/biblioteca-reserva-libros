import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { finalize, Observable } from 'rxjs';
import { Book } from '../../model/library';
import { BookForm } from '../../forms/book.form';
import { BookService } from '../../services/book.service';
import { NotificationService } from '../../shared/notification.service';
import { CategoryStore } from '../../store/category.store';
@Component({
  selector: 'app-book-dialog',
  imports: [
    FormField,
    FormRoot,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  providers: [BookForm, CategoryStore],
  template: ` <h2 mat-dialog-title>{{ data ? 'Editar el libro' : 'Nuevo libro' }}</h2>
    <form [formRoot]="entry.fields" (submit)="save($event)">
      <mat-dialog-content
        ><div class="form-grid">
          <mat-form-field appearance="outline"
            ><mat-label>Título</mat-label><input matInput [formField]="entry.fields.title" />
            @if (entry.fields.title().touched() && entry.fields.title().invalid()) {
              <mat-error>Este campo es obligatorio</mat-error>
            }</mat-form-field
          ><mat-form-field appearance="outline"
            ><mat-label>Autor</mat-label><input matInput [formField]="entry.fields.author" />
            @if (entry.fields.author().touched() && entry.fields.author().invalid()) {
              <mat-error>Este campo es obligatorio</mat-error>
            }</mat-form-field
          ><mat-form-field appearance="outline"
            ><mat-label>ISBN</mat-label><input matInput [formField]="entry.fields.isbn" />
            @if (entry.fields.isbn().touched() && entry.fields.isbn().invalid()) {
              <mat-error>Este campo es obligatorio</mat-error>
            }</mat-form-field
          ><mat-form-field appearance="outline"
            ><mat-label>Categoría</mat-label
            ><mat-select [formField]="entry.fields.idCategory">
              @for (c of categories.items(); track c.idCategory) {
                <mat-option [value]="c.idCategory">{{ c.name }}</mat-option>
              }
            </mat-select>
            @if (!categories.loading() && !categories.items().length) {
              <mat-hint>Crea primero una categoría.</mat-hint>
            }</mat-form-field
          ><mat-checkbox [formField]="entry.fields.available">Disponible</mat-checkbox>
        </div></mat-dialog-content
      >
      <mat-dialog-actions align="end"
        ><button mat-button type="button" [disabled]="saving()" (click)="ref.close(false)">
          Cancelar</button
        ><button mat-flat-button type="submit" [disabled]="entry.isInvalid() || saving()">
          {{ saving() ? 'Guardando…' : 'Guardar' }}
        </button></mat-dialog-actions
      >
    </form>`,
})
export class BookDialogComponent {
  readonly entry = inject(BookForm);
  readonly data = inject<Book | null>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<BookDialogComponent>);
  private readonly service = inject(BookService);
  private readonly notification = inject(NotificationService);
  readonly saving = signal(false);
  readonly categories = inject(CategoryStore);
  constructor() {
    if (this.data) this.entry.patch(this.data);
  }
  save(event: Event) {
    event.preventDefault();
    if (this.entry.isInvalid() || this.saving()) return;
    this.saving.set(true);
    const item = this.entry.value();
    const operation: Observable<unknown> = this.data
      ? this.service.update(this.data.idBook!, item)
      : this.service.save(item);
    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.notification.show(this.data ? 'Cambios guardados' : 'Registro creado');
        this.ref.close(true);
      },
      error: () => {},
    });
  }
}
