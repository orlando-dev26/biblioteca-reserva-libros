# Colección de Postman

La carpeta contiene:

- `Biblioteca.postman_collection.json`: colección **Biblioteca — Evaluación final**, formato 2.1, con 30 peticiones y comprobaciones de respuesta.
- `Biblioteca-local.postman_environment.json`: entorno **Biblioteca local**, con `baseUrl=http://localhost:8080/v1`.

## Importación

1. Inicia el backend en el puerto 8080. Si ya está iniciado, utiliza esa instancia.
2. En Postman, abre **Import** y selecciona ambos archivos JSON de esta carpeta.
3. Selecciona el entorno **Biblioteca local**.
4. En **Collections**, abre **Biblioteca — Evaluación final**.
5. No configura autenticación: la API local no requiere token ni contraseña de PostgreSQL.

La [documentación de importación de Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data) describe la importación de archivos.

## Orden de ejecución

### 01 Preparación y consultas

Envía con **Send**, en este orden:

1. `01 Listar categorías`.
2. `02 Listar libros`.
3. `03 Listar clientes`.
4. `04 Listar reservas`.

Estas consultas leen los IDs reales y los guardan como variables de colección. No es necesario escribir IDs manualmente. Requieren los ejemplos de `backend/datos-demo.mjs`: dos libros disponibles, uno no disponible y los clientes Laura/Diego. La preparación se repite si se reinicia la BD o se modifican esos ejemplos.

### 02 CRUD de catálogos

Abre cada subcarpeta: **Categorías**, **Libros**, **Clientes**. Ejecuta sus cinco peticiones en orden:

| Petición | Respuesta esperada |
|---|---|
| 01 Crear | 201; ID guardado desde la cabecera Location |
| 02 Consultar creado | 200 y JSON del registro |
| 03 Actualizar | 200 y JSON actualizado |
| 04 Eliminar | 204, sin cuerpo |
| 05 Comprobar eliminado | 404 y error JSON |

Cada subcarpeta trabaja con su propio registro de prueba y lo elimina al terminar. Esos registros no se usan en reservas. El libro de prueba referencia una categoría de demostración existente. Cada clic adicional en Crear agrega otro registro; para una pasada basta un envío.

Si `idCrudBook` está vacío o aparece en rojo en la URL, ejecuta primero **Libros → 01 Crear — 201 y Location**. Esa petición carga el ID desde Location. Continúa con 02 Consultar creado, 03 Actualizar y 04 Eliminar. Las consultas generales de Preparación cargan `idBook`, que corresponde a los ejemplos; el CRUD utiliza su variable independiente `idCrudBook`. Una petición a `/books/` sin ID no comprueba la edición o eliminación de un libro y debe repetirse con el ID cargado.

### 03 Reservas

1. `01 Registrar reserva de dos libros`: 201. El cuerpo de respuesta está vacío; abre **Headers** para ver **Location**.
2. `02 Consultar reserva registrada`: 200. La respuesta muestra fecha, cliente y los dos detalles con sus libros.
3. `03 Consultar por cliente`: 200. Muestra las reservas de Laura.
4. `04 Cliente sin reservas`: 200 y `[]`, mientras Diego no tenga reservas.
5. Opcional para documentar ambos casos: `05 Registrar reserva de un libro` y después `06 Consultar reserva de un libro`.

Las reservas exitosas permanecen en la base de demostración y aparecen en la web. Cada POST crea una reserva nueva; utiliza Laura para conservar a Diego como ejemplo sin reservas. La fecha se genera en hora local antes del envío.

### 04 Validaciones y excepciones

Los errores son respuestas esperadas para demostrar las validaciones:

- Cliente con email inválido: 400.
- Reserva sin libros: 400.
- Libro repetido dentro de la reserva: 400.
- Libro no disponible: 409.
- Libro inexistente: 404.

Abre **Test Results** para ver las comprobaciones. Una respuesta 400/404/409 pasa su prueba cuando coincide con el caso previsto. Las pruebas verifican los campos `datetime`, `message` y `details` del error JSON.

## Capturas

Mantén visibles nombre de petición, método, URL, código HTTP y respuesta. Para POST/PUT muestra **Body → raw → JSON** en la solicitud. Para las altas con 201 muestra **Headers → Location** en la respuesta. Amplía el panel de respuesta para que el JSON se lea.

La lista de archivos y pantallas está en [la guía de evidencias](../evidencias/GUIA.md).
