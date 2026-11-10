import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { routes } from './app.routes';
import { serverErrorInterceptor } from './shared/server-error.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
registerLocaleData(es);
function paginator() {
  const p = new MatPaginatorIntl();
  p.itemsPerPageLabel = 'Registros por página';
  p.nextPageLabel = 'Página siguiente';
  p.previousPageLabel = 'Página anterior';
  p.firstPageLabel = 'Primera página';
  p.lastPageLabel = 'Última página';
  p.getRangeLabel = (page, size, length) =>
    length
      ? `${page * size + 1}–${Math.min((page + 1) * size, length)} de ${length}`
      : '0 registros';
  return p;
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([serverErrorInterceptor])),
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: MatPaginatorIntl, useFactory: paginator },
  ],
};
