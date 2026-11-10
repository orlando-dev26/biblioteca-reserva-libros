# Verificación

Fecha: 9 de noviembre de 2026, America/Lima.

Actualización de evidencias visuales: 10 de noviembre de 2026.

| Comprobación | Resultado |
|---|---|
| Backend: pruebas automatizadas | 6 pruebas, 0 fallos, 0 errores, 0 omitidas |
| Backend: JAR ejecutable | Empaquetado correcto con Maven Wrapper y Java 25 |
| Angular: pruebas de componentes | 9 pruebas, todas correctas, con Vitest/jsdom |
| Angular: producción | Compilación correcta; aviso de tamaño inicial de 716,05 kB sobre presupuesto de aviso de 500 kB |
| PostgreSQL | Conexión real a biblioteca_db; tablas JPA y persistencia comprobadas |
| Evidencia visual de PostgreSQL | Capturas de las cinco tablas en biblioteca_db y consulta JOIN con tres reservas persistidas |
| CRUD en PostgreSQL | Alta con Location, lectura, actualización y borrado de registros temporales propios en categorías, libros y clientes |
| Integridad en PostgreSQL | Borrar una categoría con libro asociado devuelve 409 |
| Reservas en PostgreSQL | Reserva de dos libros persistida y recuperada con cliente, títulos y categorías |
| Consulta por cliente | Devuelve sus reservas o un array vacío si no tiene registros |
| CORS | Preflight desde http://localhost:4200 aceptado para API local |
| Arranque con archivo local | JAR iniciado desde backend, cargando .env.local mediante Spring Config Import |
| Git | Rama local main; .env.local, target, node_modules y .idea excluidos |
| Repositorio público | [orlando-dev26/biblioteca-reserva-libros](https://github.com/orlando-dev26/biblioteca-reserva-libros), rama main |
| Copia limpia | 111 archivos candidatos de entrega, sin credenciales ni artefactos; Maven package con 6 pruebas y npm ci/test/build correctos utilizando caché de paquetes |
| Colección Postman | 30 peticiones; cuerpos/variables y sintaxis de scripts comprobados. 12 consultas y errores esperados contra la API local, con 23 aserciones correctas |
| Ejecución en la aplicación Postman | Cuatro capturas de GET categorías/libros/clientes/reservas: 200 OK y 2/2 comprobaciones correctas en cada petición |
| Reserva y validación en Postman | POST reserva 201 (2/2), GET detalle 200 (2/2), GET por cliente 200 (1/1) y email inválido 400 (2/2). La reserva consultada contiene dos libros |
| Libro de prueba en Postman | GET del libro 6 con 200, PUT del mismo ID con título/disponibilidad modificados y 200, DELETE con 204; 1/1 comprobaciones aprobadas en cada petición |
| Evidencia visual del navegador | Ocho capturas revisadas: catálogos, historial, filtro por cliente, estado vacío, edición y validación de libros. Registro de reserva y comprobación manual completa de CRUD pendientes |
| Evidencia visual de código | Capas y método transaccional del backend; estructura frontend y servicio HttpClient de reservas |

## Cobertura de backend

Las pruebas de integración arrancan un servidor HTTP real contra H2 en memoria con perfil `test`. Comprueban contratos de alta/edición/borrado, mapeo de categoría, campos vacíos, email, JSON/fechas incorrectos, IDs inexistentes, lista vacía, validación de detalles, libros repetidos/no disponibles y restricciones de borrado.

Una prueba impone temporalmente una restricción en la tabla detalle de la BD aislada, provoca un fallo después del primer detalle y comprueba que ni la cabecera ni los detalles aumentan. Así se verifica el rollback, además de comprobar la presencia de `@Transactional`.

La comprobación adicional contra PostgreSQL utiliza registros temporales propios y los elimina al terminar. La carga inicial de demostración se describe en `datos-demo.mjs`; durante la revisión manual pueden existir registros adicionales creados desde la aplicación o Postman.

La prueba de reservas comprueba explícitamente tanto una reserva de un libro como otra de varios libros. La verificación desde copia limpia no incluye `.env.local` y utiliza el perfil H2 para las pruebas del backend.

## Cobertura de frontend

Las pruebas instancian y renderizan componentes en jsdom y simulan HTTP con HttpTestingController. Cubren tablas con datos, formularios inválidos/válidos, edición de libro con categoría, solicitud de reserva con varios libros, prevención de doble envío, limpieza tras éxito, conservación de selección tras error y filtro de reservas por cliente.

Las pruebas de componentes no equivalen a una prueba manual en navegador contra PostgreSQL. La revisión manual de las cinco pantallas y sus capturas se completa siguiendo la [guía de capturas](evidencias/GUIA.md).

Ocho capturas del navegador documentan los tres catálogos, reservas de uno y dos libros, filtro por Laura, estado vacío de Diego, carga de datos del libro en edición y validación de título obligatorio con Guardar deshabilitado. Estas imágenes se incorporan al README. No demuestran por sí solas toda la secuencia de alta/edición/borrado ni el envío de una reserva desde el formulario; esas acciones y la captura de selección previa a confirmar continúan pendientes.

## Colección Postman

La colección contiene 30 peticiones, con variables para los IDs reales, validación del código HTTP y del formato de errores. La comprobación adicional ejecuta 12 consultas y errores esperados contra el backend local: preparación, detalle de reserva, consulta por cliente, lista vacía, correo inválido, reserva vacía, libro repetido, no disponible e inexistente. Pasan 23 aserciones. No ejecuta altas, cambios ni borrados exitosos y no modifica los datos existentes.

Cuatro capturas de la aplicación Postman muestran el entorno Biblioteca local y las consultas de categorías, libros, clientes y reservas con respuesta 200 OK y 2/2 comprobaciones correctas por petición. Se incorporan al README junto con las cuatro evidencias siguientes. Los CRUD y las altas de reservas disponen además de las verificaciones de backend descritas anteriormente. El orden de las peticiones está en [Postman](postman/README.md).

Otras cuatro capturas documentan el alta de reserva con 201, su consulta con dos detalles, las reservas por cliente y el rechazo de un email inválido con 400. El alta muestra 2/2 comprobaciones aprobadas, pero la captura no tiene visibles el Body enviado ni la cabecera Location; esos paneles se pueden mostrar conservando la respuesta existente.

Tres capturas adicionales documentan la consulta del libro de prueba con ID 6, su actualización con título y disponibilidad modificados y su eliminación: estados 200, 200 y 204, respectivamente, con 1/1 comprobaciones aprobadas en cada caso. El problema previo de ID vacío queda resuelto para estas operaciones. Las tres imágenes se incluyen en el README.

## Límites conocidos

- El paquete inicial de Angular deja un aviso de tamaño; la compilación termina correctamente y el límite de error de 1 MB permanece igual.
- Las búsquedas y paginación de los catálogos operan sobre la colección cargada en el cliente, adecuado al alcance sencillo. No se presentan como paginación de servidor.
- La configuración académica utiliza `ddl-auto: update`; no incorpora migraciones ni despliegue de producción.
- Java 25 muestra avisos de APIs internas utilizadas por Lombok/ModelMapper. No impiden las pruebas ni el arranque comprobado.
- La evidencia de navegador es parcial. Falta el formulario de reserva con selección de libros y completar la comprobación manual de los flujos. Las evidencias Postman, BD y código disponibles se presentan en el README. En la captura SQL algunas celdas se abrevian por el ancho de las columnas; la consulta completa y los tres registros son visibles.
