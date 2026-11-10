# Requisitos de la evaluación

La implementación cubre los requisitos funcionales y técnicos del PDF «Sistema de Reserva de Libros para una Biblioteca». La comprobación automática se complementa con la revisión manual de las pantallas y sus capturas.

| Requisito | Implementación y evidencia |
|---|---|
| Spring Boot 4.x y REST/JSON | Spring Boot 4.1.2 en `backend/pom.xml`; controladores bajo `/v1` |
| Angular 22 y consumo REST/JSON | Angular 22 en `frontend/package.json`; servicios con HttpClient y stores con httpResource |
| Cinco entidades y relaciones | Category, Book, Client, Reservation y DetailReservation en `backend/src/main/java/com/biblioteca/model` |
| CRUD de categorías | CategoryController, CategoryServiceImpl y pantalla `/pages/category` |
| CRUD de libros | BookController, BookServiceImpl y pantalla `/pages/book` |
| CRUD de clientes | ClientController, ClientServiceImpl y pantalla `/pages/client` |
| Reserva de uno o varios libros | ReservationRequestDTO y `ReservationServiceImpl.saveTransactional`; pruebas de un detalle y varios detalles |
| Reserva y detalles relacionados | Referencia padre asignada en el servicio; persistencia en una sola transacción y prueba de rollback |
| Fecha, cliente y libros en consultas | ReservationDTO y detalles con BookDTO; API y pantalla `/pages/reservation-list` |
| Consulta por cliente | `GET /v1/reservations/client/{idClient}` y selector de cliente en el listado |
| Requests con @Valid | Validación en los cuatro controladores; validación anidada de detalles en ReservationRequestDTO |
| Control global de excepciones | ResponseExceptionHandler; JSON uniforme para errores 400, 404, 409 y 500 |
| Persistencia PostgreSQL | Conexión local a `biblioteca_db`, verificación HTTP y persistencia real documentadas |
| Responsabilidades separadas | Controller, interfaces/service, implementaciones, repository, model, DTO y config; pages/services/store/forms/shared en Angular |
| DTO recomendados | DTO de entrada y lectura; ModelMapper y resolución de referencias por ID |
| Pantallas sencillas y funcionales | Tres catálogos con alta/edición/borrado; registro y consulta de reservas. Pruebas de componentes correctas; revisión manual final y capturas por completar |
| Spec previa | [.agents/features/reserva-libros.md](../.agents/features/reserva-libros.md), con requisitos previos y resultados posteriores |
| Definición e instrucciones del agente | [.agents/subagents/biblioteca-developer.md](../.agents/subagents/biblioteca-developer.md); perfil aplicado durante el desarrollo, sin afirmar ejecución de un subagente separado |
| README para ejecutar ambos proyectos y configurar BD | [README](../README.md): requisitos, configuración externa, comandos y rutas |
| .gitignore y protección de credenciales | `.env.local`, artefactos Java, dependencias Angular y configuración local del IDE excluidos |

## Relación con las clases

La aplicación adapta los patrones del profesor al dominio que solicita el PDF. El CRUD de Exam/Specialty/Patient sirve de base para los tres catálogos; Medic–Specialty corresponde a Book–Category; Consult–ConsultDetail corresponde al registro de reserva y sus libros. Se mantienen DTO, ModelMapper, CRUD genérico, inyección por constructor, respuestas HTTP, stores, Signal Forms y Angular Material.

El detalle está en [base del curso](base-del-curso.md). La evaluación no requiere reproducir todos los módulos de MediApp. Spring Security es opcional; no exige IA de negocio, reportes, gráficos, almacenamiento cloud ni despliegue Azure. Tampoco exige préstamos, devoluciones, multas, pagos o inventario avanzado. No exige copiar un diseño visual complejo.

## Estado de verificación y entrega

- 6 pruebas backend y 9 pruebas frontend correctas; ambos proyectos compilan. La integración adicional con PostgreSQL comprueba persistencia, CRUD y consultas.
- La colección incluye 30 peticiones. Se validan formato, variables, cuerpos JSON y sintaxis de scripts; 12 consultas y errores esperados se comprueban contra la API local, con 23 aserciones. Once capturas de Postman documentan consultas, alta de reserva, consulta por cliente, validación y actualización/eliminación del libro de prueba.
- El README presenta veintinueve capturas reales: ocho del navegador, once de Postman y diez de PostgreSQL/código. Las principales se muestran en secciones desplegables y tres vistas adicionales se enlazan para consulta. Se documentan las cinco tablas, tres reservas persistidas, las capas del backend, el método transaccional y el servicio HTTP de Angular. Quedan la captura del formulario de reserva y completar la revisión manual de los flujos.
- Repositorio público: [orlando-dev26/biblioteca-reserva-libros](https://github.com/orlando-dev26/biblioteca-reserva-libros). La entrega del enlace al destino indicado por el PDF permanece pendiente.
- El PDF indica como fecha máxima el 30 de septiembre sin año. La vigencia del plazo se confirma con el profesor.

Los comandos y límites de las comprobaciones se describen en [verificación](verificacion.md).
