import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { finalize, Observable } from 'rxjs';
import { Client } from '../../model/library';
import { ClientForm } from '../../forms/client.form';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-client-dialog',
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
  providers: [ClientForm],
  template: ` <h2 mat-dialog-title>{{ data ? 'Editar el cliente' : 'Nuevo cliente' }}</h2>
    <form [formRoot]="entry.fields" (submit)="save($event)">
      <mat-dialog-content
        ><div class="form-grid">
          <mat-form-field appearance="outline"
            ><mat-label>Nombres</mat-label><input matInput [formField]="entry.fields.firstName" />
            @if (entry.fields.firstName().touched() && entry.fields.firstName().invalid()) {
              <mat-error>Este campo es obligatorio</mat-error>
            }</mat-form-field
          ><mat-form-field appearance="outline"
            ><mat-label>Apellidos</mat-label><input matInput [formField]="entry.fields.lastName" />
            @if (entry.fields.lastName().touched() && entry.fields.lastName().invalid()) {
              <mat-error>Este campo es obligatorio</mat-error>
            }</mat-form-field
          ><mat-form-field appearance="outline"
            ><mat-label>Cédula</mat-label><input matInput [formField]="entry.fields.cedula" />
            @if (entry.fields.cedula().touched() && entry.fields.cedula().invalid()) {
              <mat-error>Este campo es obligatorio</mat-error>
            }</mat-form-field
          ><mat-form-field appearance="outline"
            ><mat-label>Correo electrónico</mat-label
            ><input matInput type="email" [formField]="entry.fields.email" />
            @if (entry.fields.email().touched() && entry.fields.email().invalid()) {
              <mat-error>Introduce un correo válido</mat-error>
            }
          </mat-form-field>
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
export class ClientDialogComponent {
  readonly entry = inject(ClientForm);
  readonly data = inject<Client | null>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<ClientDialogComponent>);
  private readonly service = inject(ClientService);
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
      ? this.service.update(this.data.idClient!, item)
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
