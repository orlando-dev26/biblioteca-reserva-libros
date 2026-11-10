import { inject, Service } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Service()
export class NotificationService {
  private readonly snack = inject(MatSnackBar);
  show(message: string) {
    this.snack.open(message, 'Cerrar', {
      duration: 5500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
