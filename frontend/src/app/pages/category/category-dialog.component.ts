import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { finalize, Observable } from 'rxjs';
import { Category } from '../../model/library';
import { CategoryForm } from '../../forms/category.form';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-category-dialog',
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
  providers: [CategoryForm],
  template: ` <h2 mat-dialog-title>{{ data ? 'Editar la categoría' : 'Nueva categoría' }}</h2>
    <form [formRoot]="entry.fields" (submit)="save($event)">
      <mat-dialog-content
        ><div class="form-grid">
          <mat-form-field appearance="outline"
            ><mat-label>Nombre</mat-label><input matInput [formField]="entry.fields.name" />
            @if (entry.fields.name().touched() && entry.fields.name().invalid()) {
              <mat-error>Este campo es obligatorio</mat-error>
            }</mat-form-field
          ><mat-form-field appearance="outline"
            ><mat-label>Descripción</mat-label
            ><input matInput [formField]="entry.fields.description" />
            @if (entry.fields.description().touched() && entry.fields.description().invalid()) {
              <mat-error>Este campo es obligatorio</mat-error>
            }</mat-form-field
          ><mat-checkbox [formField]="entry.fields.state">Activa</mat-checkbox>
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
export class CategoryDialogComponent {
  readonly entry = inject(CategoryForm);
  readonly data = inject<Category | null>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<CategoryDialogComponent>);
  private readonly service = inject(CategoryService);
  private readonly notification = inject(NotificationService);
  readonly saving = signal(false);

  constructor() {
    if (this.data) this.entry.patch(this.data);
  }
  save(event: Event) {
    event.preventDefault();
    if (this.entry.isInvalid() || this.saving()) return;
    this.saving.set(true);
    const item = this.entry.value();
    const operation: Observable<unknown> = this.data
      ? this.service.update(this.data.idCategory!, item)
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
