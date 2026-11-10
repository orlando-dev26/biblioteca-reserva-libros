# Guía de capturas

Las capturas documentan la aplicación funcionando y su integración. El PDF exige el código, README, Spec y definición del agente; no establece un número obligatorio de capturas. Esta guía organiza las evidencias para el README y anexos.

Usa datos de demostración, ventana maximizada y zoom del navegador al 100 %. Conserva los nombres de archivo indicados. Evita mostrar contraseñas, `.env.local`, tokens o ventanas personales. No vuelvas a iniciar el backend si el puerto 8080 ya está ocupado por la aplicación.

Evidencia disponible: ocho capturas de navegador, once de Postman y diez de PostgreSQL/IntelliJ/VS Code. El README muestra veintiséis imágenes y enlaza tres vistas complementarias: veintinueve capturas en total. Las consultas del libro de prueba, su edición y borrado muestran 200, 200 y 204 con pruebas aprobadas. La evidencia BD/código incluye las cinco tablas, tres reservas en la consulta SQL, el método transaccional y el servicio HTTP Angular. Falta la captura 04 del formulario de reserva antes de confirmar. La captura 13 puede mejorarse mostrando Body enviado y Headers/Location de la respuesta existente, sin crear otra reserva.

## 1. Navegador

Abre `http://localhost:4200` y actualiza con Ctrl + F5. Deja visibles el menú y el contenido de la pantalla.

| Archivo | Qué abrir y mostrar |
|---|---|
| `01-categorias.png` | `/pages/category`: tabla con nombre, descripción, estado y acciones |
| `02-libros.png` | `/pages/book`: título, autor, ISBN, categoría, disponibilidad y acciones |
| `03-clientes.png` | `/pages/client`: Laura y Diego, cédulas DEMO y correos de prueba |
| `04-reserva-seleccion.png` | `/pages/reservation`: cliente Laura, fecha y dos libros seleccionados; resumen antes de confirmar |
| `05-reservas.png` | Después de confirmar una sola vez, `/pages/reservation-list`: fecha, Laura y los dos libros persistidos |
| `06-filtro-cliente.png` | Listado con filtro Laura seleccionado y sus reservas |
| `07-cliente-sin-reservas.png` | Cambia el filtro a Diego; debe verse el estado vacío mientras no tenga reservas |

Si la reserva no se guarda o la tabla no se actualiza, conserva la pantalla con el error para revisarla antes de seguir. No reserves a nombre de Diego durante esta demostración.

Capturas adicionales útiles:

- `08-editar-libro.png`: abre Editar en un libro; muestra sus datos y la categoría seleccionada. Puedes cancelar para conservar el ejemplo.
- `09-validacion-libro.png`: muestra el título obligatorio en Nuevo libro y Guardar deshabilitado. Disponible en el README.
- `09b-validacion-cliente.png` (opcional): abre Nuevo cliente, introduce un correo inválido y cambia de campo; muestra la validación y Guardar deshabilitado. Cancela al terminar.

Durante la revisión manual también registra, edita y elimina un registro de prueba sin relaciones en cada catálogo; comprueba la recarga de tablas, confirmación/cancelación de borrado, selección/quitar libros, prevención de doble envío y actualización de una ruta interna. Las capturas complementan esas acciones; una imagen estática por sí sola no demuestra todos los pasos del CRUD.

## 2. Postman

Para completar las evidencias principales, se priorizan seis capturas adicionales: crear reserva con dos libros (13), consultar su detalle (14), consultar por cliente (15), email inválido (16), actualizar libro (11) y eliminar libro (12). Los cuatro GET de preparación ya están documentados. La captura 17 de disponibilidad es adicional. El PDF no exige una imagen de cada petición: el CRUD completo de las tres entidades sigue formando parte de las comprobaciones, aunque el README muestre una selección representativa.

Importa los dos archivos de `docs/postman`, selecciona **Biblioteca local** y abre **Biblioteca — Evaluación final**. Ejecuta primero las cuatro peticiones de **01 Preparación y consultas**, en orden. La [guía de la colección](../postman/README.md) describe las variables y cada carpeta.

En las capturas deja visibles nombre, método, URL y código HTTP. En POST/PUT muestra el Body de la solicitud y la respuesta. Usa el visor JSON de la respuesta y amplía el panel para leerlo.

| Archivo | Carpeta y petición | Qué debe verse |
|---|---|---|
| `10-postman-libros.png` | 01 Preparación → 02 Listar libros | GET, 200 y JSON con categoría/disponibilidad |
| `11-postman-editar-libro.png` | 02 CRUD → Libros: ejecuta 01 Crear, 02 Consultar y 03 Actualizar | PUT, Body del libro de prueba y respuesta 200 con título actualizado |
| `12-postman-eliminar-libro.png` | En el mismo CRUD, 04 Eliminar | DELETE y 204 sin cuerpo; después envía 05 para confirmar 404 |
| `13-postman-crear-reserva.png` | 03 Reservas → 01 Registrar reserva de dos libros | POST, Body con dos detalles, 201 y **Headers → Location** en la respuesta |
| `14-postman-reserva-detalle.png` | 03 Reservas → 02 Consultar reserva registrada | GET, 200 y JSON expandido con fecha, cliente y los dos libros |
| `15-postman-reservas-cliente.png` | 03 Reservas → 03 Consultar por cliente | GET con el ID del cliente y respuesta 200 con sus reservas |
| `16-postman-validacion.png` | 04 Validaciones → 01 Cliente con email inválido | Body inválido, 400 y campos datetime/message/details |
| `17-postman-no-disponible.png` | 04 Validaciones → 04 Libro no disponible | 409 y mensaje de disponibilidad |

Las subcarpetas CRUD de Categorías y Clientes también se ejecutan de 01 a 05; sus capturas adicionales son opcionales. Los errores 400/404/409 de la carpeta Validaciones son resultados esperados. **Test Results** muestra las comprobaciones automáticas de cada respuesta.

Los POST correctos de reservas agregan registros permanentes de demostración. Basta enviarlos una vez por caso; no es necesario ejecutar repetidamente toda la colección. Para mostrar una reserva de un solo libro, envía 05 y luego 06 de la carpeta Reservas.

## 3. PostgreSQL / pgAdmin

Conecta a **biblioteca_db**, abre **Query Tool** y carga `docs/evidencias/consulta-reservas.sql`.

- `18-postgresql-reservas.png`: ejecuta la segunda consulta seleccionando desde su SELECT hasta el punto y coma. Muestra la conexión biblioteca_db, la consulta y el resultado con fecha, cliente y libros agrupados. En el árbol lateral puedes desplegar Schemas → public → Tables.
- La primera consulta enumera las cinco tablas del modelo y sirve como comprobación adicional.

## 4. Código en IntelliJ y VS Code

El PDF permite revisar el código en el repositorio. Estas imágenes son de apoyo y no necesitan mostrar todos los archivos.

| Archivo | Qué abrir |
|---|---|
| `19-backend-transaccion.png` | IntelliJ: abre `backend/pom.xml` como proyecto; en `src/main/java/com/biblioteca` despliega controller, dto, model, repo y service. Abre `service/impl/ReservationServiceImpl.java` y muestra `@Transactional`, la asignación cliente/libros y la referencia padre del detalle. El método comienza alrededor de la línea 25 |
| `20-frontend-integracion.png` | VS Code: abre la carpeta `frontend`. En dos editores lado a lado muestra `src/app/services/reservation.service.ts` y el método `save` de `src/app/pages/reservation/reservation.component.ts`; deja visible el árbol con forms/model/pages/services/shared/store |
| `21-spec-agente.png` (opcional) | VS Code: abre la carpeta raíz `biblioteca`; muestra `.agents/features/reserva-libros.md` y `.agents/subagents/biblioteca-developer.md`, con objetivos, instrucciones y criterios |

Una captura adicional de `ClientDTO.java` y `ResponseExceptionHandler.java` puede apoyar las validaciones, pero la respuesta 400 de Postman ya muestra su comportamiento.

## Organización

Envía las imágenes en grupos: navegador, Postman y luego BD/código. Se guardan en esta carpeta. El README presenta las capturas principales junto a la funcionalidad correspondiente; las adicionales pueden agruparse en una sección desplegable. Se incorporan las imágenes reales después de revisar su contenido.
