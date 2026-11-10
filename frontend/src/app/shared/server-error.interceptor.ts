import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  return next(req).pipe(
    catchError((error) => {
      notification.show(
        error.status === 0
          ? 'No se puede conectar con el servidor. Comprueba que el backend esté iniciado.'
          : (error.error?.message ?? 'No se puede completar la operación.'),
      );
      // Se propaga: el componente conserva el formulario y finalize libera el botón.
      return throwError(() => error);
    }),
  );
};
