# Base del curso y adaptaciones

| Referencia del profesor | Uso en biblioteca |
|---|---|
| Exam/Specialty/Patient: controller → interfaz service → implementación → repository | CRUD de Category, Book y Client |
| IGenericRepo, ICRUD y CRUDImpl | Reutilización de CRUD, validación de existencia y convención `setId` + nombre de entidad en update |
| DTO y MapperConfig/ModelMapper | Contratos separados de entidades; mapeo explícito de categoría del libro |
| Lombok y RequiredArgsConstructor | Inyección por constructor con dependencias finales |
| ResponseEntity y ServletUriComponentsBuilder | 201 con Location, 200 en lecturas/edición y 204 en borrado |
| CustomErrorTemplate y advice global | Respuestas JSON de validación, inexistencia y conflictos |
| Medic → Specialty | Book → Category, selección por ID y resolución de categoría existente |
| Consult → ConsultDetail, clase de transacciones | Reserva y detalles persistidos desde un único servicio transaccional |
| Wizard manual/asistido | Selección en memoria de cliente/libros y un solo POST al confirmar |
| Search y búsqueda por paciente | Historial de reservas filtrado por ID del cliente |
| GenericService, stores de pantalla y httpResource | CRUD HTTP y lecturas reactivas, recarga de tablas y filtro de reservas |
| Signal Forms, model y esquema de validación | Formularios por entidad, límites coherentes con DTO y columnas |
| MatDialog, confirmación y notificación | Alta/edición en diálogo, confirmación al eliminar y mensajes al usuario |

## Adaptaciones justificadas

- El dominio utiliza las cinco entidades mínimas del PDF. `DetailReservation` ya vincula reserva y libro, por lo que no se copia una tabla puente adicional equivalente a `consult_exam`.
- Los DTO de lectura del detalle no incluyen su reserva padre; así se evita la recursión JSON sin exponer la entidad completa.
- Las referencias se resuelven por ID en los servicios. Un cliente, libro o categoría inexistente recibe 404.
- Las reglas de tamaño se mantienen iguales en DTO, BD y formulario, corrigiendo diferencias observadas entre versiones del material.
- La lista de detalles exige contenido y valida cada elemento; `NotNull` sobre la lista no basta.
- Los borrados con referencias reciben 409 y no eliminan reservas por cascada.
- El interceptor propaga los errores para que los formularios conserven sus datos y `finalize` libere el estado de carga. No se copia el consumo general con `EMPTY` del ejemplo.
- La notificación utiliza MatSnackBar directamente desde un servicio compartido; no necesita mantener un signal con el último texto para disparar mensajes idénticos.
- La pantalla de reserva es un formulario con resumen, sin pasos de médico o consultorio que no pertenecen a biblioteca.
- Spring Boot es 4.1.2, generado desde IntelliJ, frente a 4.1.0 del material. Se conserva Java 25, ModelMapper 3.2.6 y la arquitectura. Angular se mantiene en la versión mayor 22.
- H2 solo se incorpora como dependencia de pruebas para comprobar transacciones sin tocar datos personales ni requerir PostgreSQL en cada ejecución de tests.
- No se incorporan seguridad, IA de negocio, Jasper, Chart.js, Storage ni Azure, que quedan fuera del alcance mínimo de la evaluación.

Las fuentes del curso se estudian fuera del repositorio de entrega y permanecen sin modificar. Los nombres de clases y referencias indican la procedencia de los patrones; la aplicación funciona sin tener esos materiales en el equipo.
