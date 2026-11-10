# Biblioteca: catálogos y reserva de libros

| Dato | Valor |
|---|---|
| Estado | Implementación completada y comprobada automáticamente; revisión visual pendiente |
| Fecha | 9 de noviembre de 2026 |
| Alcance | Backend y frontend |
| Referencias del curso | CRUD Exam/Specialty/Patient, relación Medic–Specialty, ConsultServiceImpl.saveTransactional, wizard y búsqueda de consultas |

Esta spec se escribe antes del código. La segunda parte se completa después, con cambios y verificaciones efectivamente realizados. Los criterios permanecen pendientes mientras no exista evidencia.

## Parte 1 — Especificación

### Problema y objetivo

Una biblioteca registra categorías, libros y clientes, y reserva uno o más libros para un cliente. La aplicación permite consultar las reservas y conocer su fecha, cliente y libros.

Se mantiene el enfoque del profesor: backend con capas y DTO; frontend standalone con servicios HTTP, stores, Signal Forms y Angular Material. El registro sigue el patrón cabecera/detalle de la consulta médica, adaptado a las cinco entidades de la evaluación.

### Requisitos de la evaluación

- Spring Boot 4.x, Angular 22, REST y JSON.
- CRUD de categorías, libros y clientes.
- Reserva con al menos un detalle, cada detalle asociado a un libro.
- Listado de reservas y consulta por cliente.
- Validación con `@Valid` y manejo global de excepciones.
- Persistencia en PostgreSQL; se utiliza la base local `biblioteca_db`.
- Spec previa y definición del agente de desarrollo incluidas en el repositorio.
- README de ejecución y `.gitignore` al preparar la entrega.

### Fuera de alcance

Préstamos, devoluciones, multas, pagos, cantidades de inventario, notificaciones, autenticación, roles, chatbot, RAG, reportes PDF, gráficos y despliegue cloud. Las funcionalidades opcionales requieren una decisión posterior; no se agregan para completar un ejemplo del curso.

### Decisiones propuestas para este proyecto

Las siguientes reglas concretan puntos que el PDF no detalla; no se presentan como exigencias literales del profesor:

- Código y rutas en inglés, interfaz en español.
- IDs `Integer` generados por la BD. Nombres `idCategory`, `idBook`, `idClient`, `idReservation` e `idDetailReservation`, compatibles con los nombres de entidades y la convención del CRUD del curso.
- Strings obligatorios rechazan espacios en blanco. Se recortan entradas de texto antes de persistir.
- Cédula como texto, sin imponer formato de un país; ISBN como texto, sin exigir un algoritmo de validación no solicitado.
- `available` indica si el libro puede seleccionarse para una nueva reserva. Se rechazan libros no disponibles. Registrar una reserva no cambia automáticamente ese indicador ni impide otra reserva del mismo libro: no se simula un préstamo ni un stock.
- Dentro de una misma reserva no se repite un libro.
- La fecha se registra como fecha/hora local (`LocalDateTime`), en JSON `yyyy-MM-dd'T'HH:mm:ss`, sin añadir una conversión implícita a UTC.
- Las categorías, clientes y libros referenciados no se eliminan en cascada. Un borrado incompatible con una FK devuelve un conflicto comprensible.
- `state` de categoría se administra como booleano; no modifica automáticamente libros ni reservas.
- Los datos se muestran con los nombres actuales de las entidades relacionadas; no se crean snapshots históricos.

### Modelo y validaciones

Los límites son decisiones uniformes de implementación: DTO, columnas y formularios deben coincidir.

| Entidad | Campos y reglas |
|---|---|
| Category | `idCategory`; `name` obligatorio, 1–100; `description` obligatoria, 1–250; `state` booleano obligatorio |
| Book | `idBook`; `title` obligatorio, 1–150; `author` obligatorio, 1–100; `isbn` obligatorio, 1–20; `available` booleano obligatorio; categoría existente |
| Client | `idClient`; `firstName` y `lastName` obligatorios, 1–100; `cedula` obligatoria, 1–20; `email` obligatorio, formato válido, máximo 100 |
| Reservation | `idReservation`; `reservationDate` obligatoria; cliente existente; lista no vacía de detalles |
| DetailReservation | `idDetailReservation`; reserva padre; libro existente |

Relaciones: `Book → Category`, `Reservation → Client`, `Reservation → DetailReservation[]`, `DetailReservation → Book`.

Las relaciones se resuelven por ID en el servicio. No se aceptan como confiables los nombres o propiedades de entidades anidadas enviados por el navegador. Los IDs de alta los genera el servidor. En actualización manda el ID de la ruta.

### Arquitectura backend

Paquete propuesto: `com.biblioteca`. Carpetas: `controller`, `service`, `service/impl`, `repo`, `model`, `dto`, `config`, `exception`.

Los catálogos reutilizan `IGenericRepo`, `ICRUD` y `CRUDImpl` del enfoque del curso. Se mantiene inyección por constructor con campos finales y Lombok; controllers dependen de interfaces de servicio. DTO y ModelMapper separan contratos de persistencia. Los mapeos se comprueban en ambos sentidos y en relaciones, sin agregar beans redundantes.

Dependencias base: Spring Web MVC, Data JPA, Validation, PostgreSQL, Lombok y ModelMapper 3.2.6. Java 25, Maven Wrapper y Spring Boot 4.x, con versiones concretas fijadas cuando se genere el proyecto. No agregar Spring Security ni Spring AI al arranque mínimo.

### Contrato de los catálogos

Para cada recurso `/v1/categories`, `/v1/books`, `/v1/clients`:

| Método y ruta | Respuesta |
|---|---|
| GET colección | 200 con array JSON, incluido `[]` si está vacío |
| GET colección/{id} | 200 con DTO; 404 si no existe |
| POST colección | 201 con cabecera Location |
| PUT colección/{id} | 200 con DTO actualizado; 404 si no existe |
| DELETE colección/{id} | 204; 404 si no existe; 409 si tiene referencias que impiden borrarlo |

Book recibe `idCategory` y su respuesta permite mostrar el nombre de categoría. Los DTO de lectura no exponen relaciones inversas que produzcan ciclos.

### Contrato de reservas

| Método y ruta | Respuesta |
|---|---|
| POST /v1/reservations | 201 con Location al registrar toda la reserva |
| GET /v1/reservations | 200 con reservas, cliente, fecha y libros |
| GET /v1/reservations/{id} | 200 con reserva y detalles; 404 si no existe |
| GET /v1/reservations/client/{idClient} | 200 con array, incluido vacío si el cliente existe y no tiene reservas; 404 si no existe el cliente |

Solicitud de alta:

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

Los IDs del ejemplo representan registros existentes, no datos que se presupongan en la BD. La respuesta de lectura incluye como mínimo IDs, fecha, nombre/apellido de cliente y título/autor de cada libro. El detalle no vuelve a incluir la reserva padre.

No se exige modificar ni eliminar reservas.

### Registro transaccional

1. Validar fecha, ID de cliente y lista no vacía de detalles con validación anidada explícita.
2. Resolver cliente y libros existentes; comprobar disponibilidad y ausencia de libros repetidos.
3. Construir la reserva y establecer la referencia padre en cada detalle.
4. Guardar cabecera y detalles mediante JPA y cascada, dentro de un único método de servicio `@Transactional`.
5. Si falla la operación, no dejar cabecera ni detalles parciales.

`DetailReservation` tiene su propio ID: ya cumple la relación reserva/libro y no necesita una segunda tabla equivalente a `consult_exam`.

### Errores

Formato común, siguiendo `CustomErrorTemplate` del profesor: `datetime`, `message`, `details`.

- 400: validación, JSON/fecha incorrectos o libro repetido dentro de la solicitud.
- 404: entidad solicitada o referenciada inexistente.
- 409: libro no disponible o borrado bloqueado por relaciones.
- 500: fallo inesperado, sin exponer credenciales ni mensajes SQL internos.

La lista de detalles usa validación de tamaño mínimo y de cada elemento; `@NotNull` por sí solo no basta. La referencia padre se asigna en servidor y no se exige en JSON.

### Frontend

Carpetas: `model`, `services`, `store`, `forms`, `pages`, `shared`. Se conserva `store` singular como en el proyecto del profesor. Servicios con `GenericService` para CRUD, lecturas con `httpResource`, mutaciones con `HttpClient`, estado con signals y valores derivados con computed.

Los stores/formularios de pantalla tienen alcance de componente. Notificación compartida puede ser singleton. Las suscripciones y los indicadores de carga deben cerrar correctamente tanto con éxito como con error; no copiar `EMPTY` sin revisar sus efectos.

Cinco pantallas:

1. `/pages/category`: tabla y diálogo de alta/edición, estado y confirmación al borrar.
2. `/pages/book`: tabla con categoría y disponibilidad; diálogo con selector de categoría.
3. `/pages/client`: tabla y diálogo con validaciones.
4. `/pages/reservation`: cliente, fecha/hora, selector de libros disponibles, lista de seleccionados, quitar libro y confirmar. Un solo POST al guardar; impedir envío duplicado mientras está pendiente.
5. `/pages/reservation-list`: fecha, cliente y libros; filtro por cliente y opción de ver todas. Un cliente sin reservas muestra un estado vacío comprensible.

Angular Material/CDK y Signal Forms; sin mezclar Material, Bootstrap y PrimeNG. El formulario y su lista se reinician después de una reserva confirmada; un fallo conserva la selección y muestra el mensaje del backend. El listado se refresca después de mutaciones exitosas. No se presentan filtros de una página como búsqueda de toda la colección.

### Archivos previstos

- `backend/pom.xml`, Maven Wrapper y configuración externa de datasource.
- Entidades/DTO/repositorios/servicios/controllers de las cinco entidades y soporte compartido.
- `frontend/package.json`, lockfile, rutas, configuración HTTP, Material y environments.
- Modelos, servicios, stores, formularios y páginas indicados.
- `.agents/subagents/biblioteca-developer.md`, esta spec y evidencia real del trabajo.
- `.gitignore`, documentación de ejecución y capturas funcionales al terminar. El README final se redacta al concluir, en presente.

### Entorno

- BD creada: `biblioteca_db`; usuario comprobado por Query Tool: `postgres`; puerto: `5432`.
- Java y javac del usuario: 25.0.5 en la sesión PowerShell preparada.
- Angular Language Service instalado y carpeta propia marcada como confiable en VS Code.
- La contraseña no se escribe en la spec ni en Git. La conexión JDBC se verifica cuando exista el backend; la sesión de pgAdmin no demuestra esa integración todavía.

### Criterios de aceptación

- [x] Los tres CRUD cumplen métodos, códigos HTTP, Location y validación.
- [x] Los nombres de categoría y cliente aparecen correctamente en lecturas anidadas.
- [x] Una reserva con un libro se registra y se consulta. — Comprobación explícita incluida en la prueba de integración de reservas.
- [x] Una reserva con varios libros guarda exactamente sus detalles.
- [x] Solicitud sin detalles, con IDs inválidos o libro repetido recibe el error definido.
- [x] Un libro no disponible produce 409 y no deja reserva parcial.
- [x] Un fallo de persistencia revierte cabecera y detalles; se comprueba con prueba controlada.
- [x] La consulta por cliente distingue resultados, lista vacía y cliente inexistente.
- [x] No hay ciclos JSON ni borrado accidental de reservas por cascada.
- [ ] Las cinco pantallas funcionan desde el navegador contra el backend real.
- [x] La pantalla evita doble envío y conserva entradas ante un error. — Comprobado en pruebas de componentes; pendiente repetir visualmente.
- [x] Backend compila, frontend compila y pasan verificaciones funcionales pertinentes.
- [x] La configuración permite conectar a una BD exclusiva sin credenciales versionadas.
- [x] Spec, instrucciones del agente y verificación real están en la entrega.
- [x] Se comprueba ejecución desde una copia limpia antes de publicar. — Backend empaquetado con seis pruebas y frontend instalado desde lockfile, probado y compilado, sin .env.local ni artefactos del directorio de trabajo. Falta revisión visual antes de publicar.

## Parte 2 — Implementación y verificación

Funcionalidades pendientes. El usuario genera la estructura inicial del backend con IntelliJ después de esta spec: Spring Boot 4.1.2, Java 25, Maven Wrapper 3.3.4/Maven 3.10.0 y las dependencias de Web MVC, JPA, Validation, PostgreSQL y Lombok.

Preparación del 9 de noviembre de 2026: el agente principal lee y aplica el perfil `biblioteca-developer.md` para revisar la configuración inicial. Compara el POM con el material del profesor y agrega ModelMapper 3.2.6 y la exclusión de Lombok del JAR empaquetado. Se conserva el procesador de anotaciones existente para compilación y pruebas. Esto documenta uso del perfil por el agente principal, no ejecución automática de un subagente.

Verificación de esta preparación: se comprueba estructura XML y presencia única de la dependencia/configuración. No se ejecutan Maven, tests, aplicación ni conexión JDBC en esta etapa. No se dan por cumplidos los criterios funcionales.

Al implementar, registrar: archivos cambiados, decisiones adaptadas, comandos realmente ejecutados, resultados observados, errores pendientes y capturas de la aplicación. No marcar como comprobado un criterio que solo se revisa estáticamente.

### Desarrollo autorizado y realizado

El 9 de noviembre el usuario autoriza expresamente implementar toda la evaluación. El agente principal aplica este documento y el perfil de desarrollo; no delega ni afirma una ejecución automática por existir la carpeta `.agents`.

Se implementan las cinco entidades, DTO, repositorios, interfaces/servicios, controllers, ModelMapper, CORS y advice global. `CRUDImpl` adapta la convención de reflexión del curso. `ReservationServiceImpl.saveTransactional` resuelve relaciones y guarda cabecera/detalles en una transacción. Los DTO de lectura evitan el ciclo reserva/detalle.

El frontend incluye las cinco pantallas previstas, formularios y stores por entidad, servicios genéricos, diálogos, confirmación, notificación, filtro por cliente y rutas diferidas. La reserva envía un solo POST con los libros seleccionados. Material/CDK, Signal Forms y `httpResource` siguen el enfoque del profesor.

El resultado y los límites se detallan en `docs/verificacion.md`; la correspondencia con los ejemplos del curso se registra en `docs/base-del-curso.md`. El README presenta ejecución, BD, API, pruebas, spec y agente en tiempo presente.

### Comandos y evidencias

- Maven Wrapper `test`: 6 pruebas correctas, con H2 aislado; incluye fallo forzado de persistencia para demostrar rollback.
- Maven Wrapper `package`: compila; el primer reempaquetado final queda bloqueado por el JAR abierto en Windows. Tras detener exclusivamente la instancia creada para pruebas, `package -DskipTests` genera correctamente el ejecutable, conservando la evidencia de las pruebas previas.
- `npm test -- --watch=false`: 9 pruebas de componentes correctas.
- `npm run build`: correcto, con aviso de paquete inicial de 716,05 kB; no se aumentan los presupuestos para silenciarlo.
- PostgreSQL real: CRUD con registros temporales retirados al terminar, reserva de dos libros, mapeos y filtro por cliente comprobados mediante HTTP.
- JAR final: arranque desde `backend` sin pasar contraseña en la línea de comandos; Spring importa el archivo local ignorado.
- Git local `main` inicializado; `git check-ignore` confirma exclusiones de credenciales y artefactos. No hay remoto ni publicación.

### Adaptaciones y pendientes

Los dialogs reciben la fila y la copian al modelo, como Medic en el curso; no realizan un GET adicional por ID. La notificación usa MatSnackBar directamente y el interceptor propaga errores para que `finalize` libere el formulario. La reserva utiliza un formulario/resumen en lugar de copiar los pasos médicos que no pertenecen al dominio.

La revisión visual en Brave no se completa: el control de aplicaciones se detiene al no poder determinar con seguridad la URL activa. No se intenta eludir esa detención ni se marca como verificado el criterio de navegador. Quedan capturas del usuario y comprobación visual antes de publicar.

La copia limpia se prepara con los 111 archivos candidatos de Git, excluyendo credenciales, node_modules, target e IDE. En esa copia Maven `package` ejecuta las seis pruebas, incluida la reserva de un solo libro; npm `ci` instala desde lockfile y pasan las nueve pruebas y el build. Se reutiliza únicamente el caché local de paquetes descargados, sin copiar dependencias instaladas ni el archivo de credenciales. No aparecen enlaces locales rotos ni credenciales literales en la auditoría de candidatos.
