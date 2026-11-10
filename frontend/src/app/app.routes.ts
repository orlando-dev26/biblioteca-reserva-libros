import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'pages/book', pathMatch: 'full' },
  {
    path: 'pages/category',
    loadComponent: () =>
      import('./pages/category/category.component').then((m) => m.CategoryComponent),
    title: 'Categorías · Biblioteca',
  },
  {
    path: 'pages/book',
    loadComponent: () => import('./pages/book/book.component').then((m) => m.BookComponent),
    title: 'Libros · Biblioteca',
  },
  {
    path: 'pages/client',
    loadComponent: () => import('./pages/client/client.component').then((m) => m.ClientComponent),
    title: 'Clientes · Biblioteca',
  },
  {
    path: 'pages/reservation',
    loadComponent: () =>
      import('./pages/reservation/reservation.component').then((m) => m.ReservationComponent),
    title: 'Reservar · Biblioteca',
  },
  {
    path: 'pages/reservation-list',
    loadComponent: () =>
      import('./pages/reservation-list/reservation-list.component').then(
        (m) => m.ReservationListComponent,
      ),
    title: 'Reservas · Biblioteca',
  },
  { path: '**', redirectTo: 'pages/book' },
];
