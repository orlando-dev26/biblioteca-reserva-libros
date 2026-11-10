import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: ` <h2 mat-dialog-title>Eliminar registro</h2>
    <mat-dialog-content
      >¿Deseas eliminar «{{ data }}»? Esta acción elimina el registro
      seleccionado.</mat-dialog-content
    >
    <mat-dialog-actions align="end"
      ><button mat-button (click)="ref.close(false)">Cancelar</button
      ><button mat-flat-button class="danger-button" (click)="ref.close(true)">
        Eliminar
      </button></mat-dialog-actions
    >`,
})
export class ConfirmDialogComponent {
  readonly data = inject<string>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<ConfirmDialogComponent>);
}
