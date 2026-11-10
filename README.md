# Biblioteca — Reserva de libros

Aplicación Full Stack para administrar categorías, libros y clientes, registrar reservas de uno o más libros y consultar el historial por cliente.

## Funcionalidades

- CRUD de categorías con nombre, descripción y estado.
- CRUD de libros con título, autor, ISBN, disponibilidad y categoría.
- CRUD de clientes con nombres, apellidos, cédula y correo electrónico.
- Registro de reservas con fecha/hora, cliente y varios libros.
- Consulta de reservas con sus libros y filtro por cliente.
- Validación de formularios y requests; respuestas globales de error.

El registro de la reserva y sus detalles se ejecuta en una sola transacción. Una solicitud vacía, con libros repetidos, inexistentes o no disponibles se rechaza sin guardar registros parciales. La disponibilidad se administra en el catálogo; una reserva no representa un préstamo ni descuenta stock. La aplicación conserva las relaciones existentes al impedir borrados que afectan reservas.

## Tecnologías

| Parte | Tecnologías |
|---|---|
| Backend | Java 25, Spring Boot 4.1.2, Maven Wrapper, Spring Web MVC, Spring Data JPA, Jakarta Validation, Lombok y ModelMapper 3.2.6 |
| Frontend | Angular 22, Angular Material/CDK, Signal Forms, signals, httpResource y RxJS |
| Persistencia | PostgreSQL local |
| Pruebas | JUnit, Spring Boot, H2 aislado para integración; Vitest y jsdom para componentes Angular |

## Requisitos

- JDK 25 y `JAVA_HOME` apuntando a ese JDK.
- Node.js compatible con Angular 22 y npm. El entorno comprobado utiliza Node 26.13.0 y npm 11.20.0.
- PostgreSQL iniciado y una base de datos propia.
- Acceso a Maven Central y al registro npm para la primera descarga de dependencias.

Maven Wrapper descarga la versión de Maven del proyecto. No se requiere una instalación global de Maven.

## Estructura

```text
biblioteca/
├── backend/
│   ├── src/main/java/com/biblioteca/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repo/
│   │   └── service/impl/
│   ├── src/test/
│   ├── .env.example
│   ├── iniciar.ps1
│   └── datos-demo.mjs
├── frontend/src/app/
│   ├── forms/
│   ├── model/
│   ├── pages/
│   ├── services/
│   ├── shared/
│   └── store/
├── .agents/
│   ├── features/reserva-libros.md
│   └── subagents/biblioteca-developer.md
└── docs/
    ├── postman/
    └── evidencias/
```

## Base de datos

En pgAdmin o psql, con un usuario que dispone del permiso correspondiente:

```sql
CREATE DATABASE biblioteca_db;
```

El backend crea/actualiza las cinco tablas a partir de las entidades JPA mediante `ddl-auto: update`. No es necesario crear tablas manualmente. Esta configuración se utiliza para el entorno académico local.

Desde `backend`, copia `.env.example` a `.env.local` y configura tus propios valores:

```dotenv
DB_URL=jdbc:postgresql://localhost:5432/biblioteca_db
DB_USERNAME=postgres
DB_PASSWORD=TU_CONTRASENA_LOCAL
```

`.env.local` está excluido de Git. Spring lo importa al ejecutar desde la carpeta `backend`; también admite esas variables en el entorno del proceso. Las credenciales no se incluyen en el repositorio.

## Ejecución del backend

Desde una terminal situada en `backend`, con Java 25 seleccionado:

```powershell
.\mvnw.cmd spring-boot:run
```

Alternativamente, el script PowerShell carga la configuración local y permite seleccionar el JDK:

```powershell
.\iniciar.ps1 -JavaHome 'RUTA_A_TU_JDK_25'
```

En IntelliJ se abre `backend/pom.xml`, se selecciona Project SDK 25 y Maven Wrapper, y se ejecuta `BackendApplication` con directorio de trabajo `backend`. El archivo `.env.local` se resuelve desde ese directorio.

La API está disponible en `http://localhost:8080/v1`. `SERVER_PORT` cambia el puerto del backend y `FRONT_URL` configura el origen CORS permitido, que por defecto es `http://localhost:4200`.

## Ejecución del frontend

En otra terminal, desde `frontend`:

```powershell
npm ci
npm start
```

Abre `http://localhost:4200`. La URL de la API se configura en `frontend/src/environments/environment.ts` y apunta por defecto a `http://localhost:8080`. Si cambia el puerto del backend, actualiza esa URL.

| Pantalla | Ruta |
|---|---|
| Libros | `/pages/book` |
| Categorías | `/pages/category` |
| Clientes | `/pages/client` |
| Registrar reserva | `/pages/reservation` |
| Consultar reservas | `/pages/reservation-list` |

## Datos de demostración

Con el backend iniciado, desde `backend`:

```powershell
node datos-demo.mjs
```

El script agrega ejemplos ficticios: tres categorías, cuatro libros, dos clientes y una reserva con dos libros. Busca los registros existentes antes de agregarlos y no los sobrescribe. El correo de los clientes utiliza el dominio de prueba `example.test`.

Para trabajar desde cero: registra una categoría, agrega sus libros, registra un cliente y crea una reserva.

## API

Los recursos `/v1/categories`, `/v1/books` y `/v1/clients` exponen:

| Método | Ruta | Resultado |
|---|---|---|
| GET | `/v1/{recurso}` | Lista, 200 |
| GET | `/v1/{recurso}/{id}` | Detalle, 200 |
| POST | `/v1/{recurso}` | Alta, 201 con `Location` |
| PUT | `/v1/{recurso}/{id}` | Actualización, 200 |
| DELETE | `/v1/{recurso}/{id}` | Eliminación, 204 |

Reservas:

| Método | Ruta | Resultado |
|---|---|---|
| POST | `/v1/reservations` | Reserva completa, 201 con `Location` |
| GET | `/v1/reservations` | Historial con cliente y libros |
| GET | `/v1/reservations/{id}` | Reserva por ID |
| GET | `/v1/reservations/client/{idClient}` | Reservas de un cliente |

Ejemplo de solicitud, usando IDs existentes:

```json
{
  "reservationDate": "2026-11-09T19:30:00",
  "idClient": 1,
  "details": [
    { "idBook": 1 },
    { "idBook": 2 }
  ]
}
```

La fecha usa hora local y formato ISO sin zona. Cédula e ISBN se tratan como texto. Los errores devuelven `datetime`, `message` y `details`: 400 para datos inválidos, 404 para registros inexistentes y 409 para conflictos de disponibilidad o integridad.

## Pruebas y compilación

Backend, desde `backend`:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

Las pruebas usan el perfil `test` y una base H2 en memoria; no escriben en PostgreSQL ni requieren su contraseña. Comprueban CRUD, mapeos, validación anidada, reservas, consulta por cliente, restricciones de borrado y rollback ante un fallo provocado en persistencia.

Frontend, desde `frontend`:

```powershell
npm test -- --watch=false
npm run build
```

Las pruebas de componentes comprueban tablas, formularios, validación de correo, selector de categoría, envío de una sola reserva con varios libros y conservación de datos ante errores. El compilado de producción queda en `frontend/dist/frontend/browser`.

Los resultados y el alcance de la verificación se registran en [docs/verificacion.md](docs/verificacion.md). El paquete inicial supera el umbral de aviso de 500 kB y permanece dentro del límite de error de 1 MB; la compilación termina correctamente.

## Postman

Importa [la colección](docs/postman/Biblioteca.postman_collection.json) y [el entorno local](docs/postman/Biblioteca-local.postman_environment.json). Selecciona **Biblioteca local** y ejecuta primero las cuatro consultas de **01 Preparación y consultas** para cargar los IDs reales.

La colección reúne 30 peticiones: consultas, CRUD de los tres catálogos, reservas de uno o varios libros, filtro por cliente y validaciones. Los CRUD utilizan registros propios de prueba; las reservas correctas permanecen en la base de demostración. La [guía de Postman](docs/postman/README.md) describe el orden y las respuestas esperadas.

## Especificación y documentación

- [Spec previa: catálogos y reserva de libros](.agents/features/reserva-libros.md).
- [Perfil del agente de desarrollo](.agents/subagents/biblioteca-developer.md).
- [Instrucciones del proyecto](AGENTS.md).
- [Relación con los patrones del curso](docs/base-del-curso.md).

La arquitectura adapta el CRUD y la consulta maestro/detalle de MediApp al dominio de biblioteca. La [matriz de requisitos](docs/cumplimiento.md) relaciona cada punto de la evaluación con su implementación.

## Evidencias

Las capturas funcionales se organizan en `docs/evidencias`. La [guía de capturas](docs/evidencias/GUIA.md) identifica las pantallas, peticiones y archivos que documentan cada caso.

### Catálogo de libros

La pantalla presenta título, autor, ISBN, categoría y disponibilidad, con búsqueda, paginación y acciones de mantenimiento.

![Catálogo de libros con categoría y disponibilidad](docs/evidencias/02-libros.png)

<details open>
<summary>Categorías y clientes</summary>

Las categorías organizan los libros por nombre, descripción y estado.

![Administración de categorías](docs/evidencias/01-categorias.png)

El catálogo de clientes presenta nombres, apellidos, cédula y correo electrónico.

![Administración de clientes](docs/evidencias/03-clientes.png)

</details>

### Reservas realizadas

El historial muestra fecha, cliente y libros de cada reserva. La consulta incluye ejemplos de reservas de un libro y de varios libros.

![Historial con reservas de uno y dos libros](docs/evidencias/05-reservas.png)

<details open>
<summary>Consulta por cliente y estado sin resultados</summary>

El filtro permite consultar las reservas de un cliente.

![Reservas filtradas por Laura Mendoza](docs/evidencias/06-filtro-cliente.png)

Un cliente sin reservas presenta un estado vacío.

![Consulta de Diego Torres sin reservas](docs/evidencias/07-cliente-sin-reservas.png)

</details>

<details open>
<summary>Edición de libros y validación de formularios</summary>

El formulario de edición carga los datos del libro y su categoría actual.

![Edición de libro con selector de categoría](docs/evidencias/08-editar-libro.png)

Los campos obligatorios muestran su validación y el botón Guardar permanece deshabilitado mientras el formulario es inválido.

![Validación de título obligatorio al registrar un libro](docs/evidencias/09-validacion-libro.png)

</details>

### Servicios REST en Postman

Las consultas devuelven JSON y estado HTTP 200. Las respuestas de libros incluyen su categoría; las reservas contienen fecha, cliente y detalles con sus libros.

<details open>
<summary>Consultas de categorías, libros, clientes y reservas</summary>

![GET de categorías con respuesta 200 y pruebas correctas](docs/evidencias/10a-postman-categorias.png)

![GET de libros con categoría y disponibilidad](docs/evidencias/10-postman-libros.png)

![GET de clientes con respuesta JSON](docs/evidencias/10b-postman-clientes.png)

![GET de reservas con fecha, cliente y detalles](docs/evidencias/10c-postman-reservas.png)

</details>

<details open>
<summary>Registro de reserva, detalle y consulta por cliente</summary>

El registro devuelve 201 Created y un cuerpo de respuesta vacío.

![Registro de reserva con respuesta 201 Created](docs/evidencias/13-postman-crear-reserva.png)

La consulta de la reserva registrada muestra al cliente y los dos libros asociados.

![Detalle de reserva con cliente y dos libros](docs/evidencias/14-postman-reserva-detalle.png)

La consulta por cliente devuelve sus reservas con los detalles correspondientes.

![Consulta de reservas por cliente con respuesta 200](docs/evidencias/15-postman-reservas-cliente.png)

</details>

<details open>
<summary>Validación de correo electrónico</summary>

Un correo inválido devuelve 400 Bad Request y una respuesta JSON con fecha, mensaje y detalle de la solicitud.

![Error de validación de email con respuesta 400](docs/evidencias/16-postman-validacion.png)

</details>

<details open>
<summary>Consulta, actualización y eliminación de un libro de prueba</summary>

La consulta recupera el libro de prueba con su ID y categoría.

![Consulta del libro de prueba con respuesta 200](docs/evidencias/11a-postman-libro-creado.png)

La actualización devuelve el mismo ID con el título y disponibilidad modificados.

![Actualización del libro con respuesta 200](docs/evidencias/11-postman-editar-libro.png)

La eliminación devuelve 204 No Content y un cuerpo de respuesta vacío.

![Eliminación del libro de prueba con respuesta 204](docs/evidencias/12-postman-eliminar-libro.png)

</details>

### Persistencia en PostgreSQL

<details open>
<summary>Modelo de cinco tablas y consulta de reservas</summary>

La base de datos contiene las tablas book, category, client, reservation y detail_reservation.

![Cinco tablas del modelo de biblioteca en PostgreSQL](docs/evidencias/18a-postgresql-tablas.png)

La consulta relaciona reservas, clientes, detalles y libros para mostrar los registros persistidos.

![Consulta SQL de las reservas persistidas en biblioteca_db](docs/evidencias/18-postgresql-reservas.png)

[Vista general del esquema en pgAdmin](docs/evidencias/18b-postgresql-esquema.png).

</details>

### Arquitectura e integración

<details open>
<summary>Backend: capas y registro transaccional</summary>

El servicio de reservas valida referencias, disponibilidad y libros repetidos. Asigna la reserva padre a cada detalle y guarda la operación dentro de un método con `@Transactional`.

![Servicio transaccional de reserva y sus detalles](docs/evidencias/19-backend-transaccion.png)

La estructura separa configuración, controladores, DTO, excepciones y entidades.

![Capas del backend en IntelliJ IDEA](docs/evidencias/19a-backend-capas.png)

Los repositorios y servicios mantienen interfaces e implementaciones separadas, con reutilización del CRUD.

![Repositorios e interfaces e implementaciones de servicios](docs/evidencias/19c-backend-servicios.png)

[Vista adicional de modelos y repositorios](docs/evidencias/19b-backend-repositorios.png).

</details>

<details open>
<summary>Frontend: servicio HTTP, formularios y stores</summary>

ReservationService envía el registro mediante HttpClient al recurso `/v1/reservations` y obtiene la dirección del backend desde la configuración de entorno.

![Servicio Angular para registrar reservas mediante HTTP](docs/evidencias/20-frontend-integracion.png)

La estructura organiza formularios, modelos, páginas, servicios, componentes compartidos y stores.

![Formularios, servicios y stores del frontend](docs/evidencias/20b-frontend-formularios-stores.png)

[Vista general del frontend en VS Code](docs/evidencias/20a-frontend-estructura.png).

</details>
