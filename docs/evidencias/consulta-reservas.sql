-- Ejecutar en Query Tool, conectado a biblioteca_db.
-- Tablas del modelo mínimo.
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('category', 'book', 'client', 'reservation', 'detail_reservation')
ORDER BY table_name;

-- Fecha, cliente y libros de cada reserva persistida.
SELECT r.id_reservation,
       r.reservation_date,
       c.first_name || ' ' || c.last_name AS cliente,
       string_agg(b.title, ' | ' ORDER BY b.title) AS libros
FROM reservation r
JOIN client c ON c.id_client = r.id_client
JOIN detail_reservation d ON d.id_reservation = r.id_reservation
JOIN book b ON b.id_book = d.id_book
GROUP BY r.id_reservation, r.reservation_date, c.first_name, c.last_name
ORDER BY r.id_reservation DESC;
