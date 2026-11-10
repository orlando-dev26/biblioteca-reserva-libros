export interface Category {
  idCategory?: number;
  name: string;
  description: string;
  state: boolean;
}
export interface Client {
  idClient?: number;
  firstName: string;
  lastName: string;
  cedula: string;
  email: string;
}
export interface Book {
  idBook?: number;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  idCategory: number | null;
  categoryName?: string;
}
export interface ReservationRequest {
  reservationDate: string;
  idClient: number;
  details: { idBook: number }[];
}
export interface Reservation {
  idReservation: number;
  reservationDate: string;
  client: Client;
  details: { idDetailReservation: number; book: Book }[];
}
