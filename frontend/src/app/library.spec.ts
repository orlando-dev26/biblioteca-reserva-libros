import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryComponent } from './pages/category/category.component';
import { ClientComponent } from './pages/client/client.component';
import { BookComponent } from './pages/book/book.component';
import { CategoryDialogComponent } from './pages/category/category-dialog.component';
import { ClientDialogComponent } from './pages/client/client-dialog.component';
import { BookDialogComponent } from './pages/book/book-dialog.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ReservationListComponent } from './pages/reservation-list/reservation-list.component';
import { environment } from '../environments/environment';
const api = `${environment.HOST}/v1`;
const category = { idCategory: 1, name: 'Literatura', description: 'Ficción', state: true };
const client = {
  idClient: 1,
  firstName: 'Laura',
  lastName: 'Mendoza',
  cedula: 'DEMO-001',
  email: 'laura@example.test',
};
const book = {
  idBook: 1,
  title: 'El principito',
  author: 'Antoine de Saint-Exupéry',
  isbn: '123',
  available: true,
  idCategory: 1,
  categoryName: 'Literatura',
};

describe('Integración de componentes y formularios de biblioteca', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => {
    try {
      TestBed.inject(HttpTestingController).verify();
    } finally {
      TestBed.resetTestingModule();
    }
  });
  for (const [component, path, record, label] of [
    [CategoryComponent, 'categories', category, 'Literatura'],
    [ClientComponent, 'clients', client, 'Laura'],
    [BookComponent, 'books', book, 'El principito'],
  ] as const) {
    it(`renderiza el catálogo ${path} con los datos HTTP`, async () => {
      const fixture = TestBed.createComponent(component as Type<unknown>);
      fixture.detectChanges();
      TestBed.inject(HttpTestingController).expectOne(`${api}/${path}`).flush([record]);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(label);
      expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(1);
    });
  }
  it('impide guardar categorías vacías y envía un alta válida', async () => {
    const close = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close } },
      ],
    });
    const fixture = TestBed.createComponent(CategoryDialogComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.entry.isInvalid()).toBe(true);
    fixture.componentInstance.entry.patch({
      name: 'Literatura',
      description: 'Ficción',
      state: true,
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.entry.isInvalid()).toBe(false);
    fixture.componentInstance.save(new Event('submit'));
    TestBed.inject(HttpTestingController)
      .expectOne((r) => r.url === `${api}/categories` && r.method === 'POST')
      .flush(null, { status: 201, statusText: 'Created' });
    expect(close).toHaveBeenCalledWith(true);
  });
  it('valida email de clientes y mantiene el formulario después de un error', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(ClientDialogComponent);
    fixture.detectChanges();
    fixture.componentInstance.entry.patch({ ...client, email: 'incorrecto' });
    expect(fixture.componentInstance.entry.isInvalid()).toBe(true);
    fixture.componentInstance.entry.patch(client);
    fixture.componentInstance.save(new Event('submit'));
    TestBed.inject(HttpTestingController)
      .expectOne(`${api}/clients`)
      .flush({ message: 'Error' }, { status: 500, statusText: 'Error' });
    expect(fixture.componentInstance.saving()).toBe(false);
    expect(fixture.componentInstance.entry.value().firstName).toBe('Laura');
  });
  it('renderiza el selector de categorías al editar un libro', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: book },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(BookDialogComponent);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne(`${api}/categories`).flush([category]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.entry.value().idCategory).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Literatura');
  });
  it('envía una sola reserva con varios libros y limpia tras éxito', async () => {
    const fixture = TestBed.createComponent(ReservationComponent);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`${api}/books`).flush([book, { ...book, idBook: 2, title: 'Otro libro' }]);
    http.expectOne(`${api}/clients`).flush([client]);
    await fixture.whenStable();
    fixture.detectChanges();
    const page = fixture.componentInstance;
    page.entry.model.set({ idClient: 1, reservationDate: '2026-11-09T19:30' });
    page.add(book);
    page.add({ ...book, idBook: 2, title: 'Otro libro' });
    page.save(new Event('submit'));
    page.save(new Event('submit'));
    const request = http.expectOne((r) => r.url === `${api}/reservations` && r.method === 'POST');
    expect(request.request.body.details).toEqual([{ idBook: 1 }, { idBook: 2 }]);
    expect(request.request.body.reservationDate).toBe('2026-11-09T19:30:00');
    request.flush(null, { status: 201, statusText: 'Created' });
    fixture.detectChanges();
    expect(page.selected().length).toBe(0);
    expect(page.saving()).toBe(false);
    expect(page.saved()).toBe(true);
    TestBed.tick();
    http.expectOne(`${api}/books`).flush([book]);
    await fixture.whenStable();
  });
  it('conserva la selección de reserva si el servidor rechaza el envío', async () => {
    const fixture = TestBed.createComponent(ReservationComponent);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`${api}/books`).flush([book]);
    http.expectOne(`${api}/clients`).flush([client]);
    await fixture.whenStable();
    const page = fixture.componentInstance;
    page.entry.model.set({ idClient: 1, reservationDate: '2026-11-09T19:30' });
    page.add(book);
    page.save(new Event('submit'));
    http
      .expectOne(`${api}/reservations`)
      .flush({ message: 'No disponible' }, { status: 409, statusText: 'Conflict' });
    expect(page.selected().length).toBe(1);
    expect(page.saving()).toBe(false);
    expect(page.saved()).toBe(false);
  });
  it('muestra fecha, cliente y libros y consulta el filtro por cliente', async () => {
    const fixture = TestBed.createComponent(ReservationListComponent);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`${api}/clients`).flush([client]);
    http
      .expectOne(`${api}/reservations`)
      .flush([
        {
          idReservation: 1,
          reservationDate: '2026-11-09T19:30:00',
          client,
          details: [{ idDetailReservation: 1, book }],
        },
      ]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('El principito');
    expect(fixture.nativeElement.textContent).toContain('Laura Mendoza');
    fixture.componentInstance.store.clientId.set(1);
    fixture.detectChanges();
    http.expectOne(`${api}/reservations/client/1`).flush([]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Este cliente todavía no tiene reservas');
  });
});
