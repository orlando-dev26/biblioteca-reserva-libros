import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly menuOpen = signal(false);
  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }
  readonly nav = [
    { path: 'book', label: 'Libros', icon: '▤' },
    { path: 'category', label: 'Categorías', icon: '▦' },
    { path: 'client', label: 'Clientes', icon: '♙' },
    { path: 'reservation', label: 'Reservar libros', icon: '＋' },
    { path: 'reservation-list', label: 'Reservas realizadas', icon: '☷' },
  ];
}
