# 🍰 Dulce Vida Web

Bienvenido/a al repositorio de Dulce Vida, un proyecto hecho con cariño para presentar y administrar productos de repostería. Incluye:
- Backend en Spring Boot (Java) con MySQL y sesiones.
- Frontend en React (Vite) con panel de administración, carrito y páginas públicas.
- Scripts SQL para crear y poblar la base de datos.

Con esta guía, nadie se pierde. Prometido. 💖

## Estructura

- `backend/`: API REST en Spring Boot (Java) conectada a MySQL.
- `frontend/`: Aplicación React (Vite).
- `frontend/public/img/`: Imágenes públicas servidas como `/img/...`.
- `backend/sql/`: Scripts SQL para crear y poblar la base.

---

## Requisitos

- Java 17+ (Spring Boot 3 usa Jakarta)
- Maven (o el wrapper incluido `mvnw`/`mvnw.cmd`)
- Node.js 18+ y npm
- MySQL 8.x
- XAMPP (para levantar MySQL fácilmente; Apache opcional)
- MySQL Workbench (o tu cliente SQL favorito)

---

## ¿Cómo lo inicio? (paso a paso con amor)

1) Base de datos (XAMPP + Workbench)
- Abre XAMPP y enciende MySQL (Apache puede quedar encendido también si lo usas).
- Abre MySQL Workbench y ejecuta los scripts en `backend/sql/`:
  - Crea la base de datos y tablas.
  - Inserta los datos de ejemplo.
- Recuerda el nombre de la base de datos para la configuración del backend.

2) Backend (Spring Boot)
- Como te gusta hacerlo:
  - Abre el repo en tu IDE (VS Code/IntelliJ).
  - Ve a `DulceVidaAplicacion.java` (clase principal de Spring Boot) y presiona “Run”.
- Alternativa por terminal:
  - Windows: `cd backend && ./mvnw.cmd spring-boot:run`
  - macOS/Linux: `cd backend && ./mvnw spring-boot:run`
- Por defecto levanta en `http://localhost:8080`.

3) Frontend (Vite + React)
- Variables:
  - Crea o valida `frontend/.env` con:
    - `VITE_API_URL=http://localhost:8080`
- Arranque:
  - `cd frontend`
  - `npm install`
  - `npm run dev`
- Se abre en `http://localhost:5173`. El dev server proxya `/api` y `/img` al backend.

¡Listo! Entra a `http://localhost:5173` y disfruta.

---

## Configuración del backend

Edita `backend/src/main/resources/application.properties` según tu entorno:

```properties
# Conexión a MySQL (XAMPP suele usar root sin contraseña)
spring.datasource.url=jdbc:mysql://localhost:3306/tu_basedatos?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

# Directorio donde se guardan imágenes subidas de productos
app.uploads.dir=uploads/imagenes_productos
# Prefijo público con el que se servirán las imágenes subidas
app.uploads.url-prefix=/uploads/imagenes_productos

# Controla si el registro público puede crear cuentas ADMIN
app.registration.allowAdmin=false
```

Notas:
- Cambia `tu_basedatos` por el nombre real creado con los scripts.
- Si tu usuario MySQL tiene contraseña, colócala en `spring.datasource.password`.
- El directorio `uploads/imagenes_productos` se crea automáticamente al subir imágenes.

---

## Build unificado (servir React desde Spring Boot)

Para producción o sin Vite en dev:

1) Genera el build del frontend:
- `cd frontend`
- `npm run build`

2) Inicia el backend:
- Windows: `cd backend && ./mvnw.cmd spring-boot:run`
- macOS/Linux: `cd backend && ./mvnw spring-boot:run`

El build de Vite se coloca en `backend/src/main/resources/static` y Spring Boot lo sirve automáticamente.

---

## Rutas principales del sitio

- Público: `/` (Home), `/productos`, `/nosotros`, `/contacto`
- Sesión: `/login`, `/register`, `/carrito`
- Admin: `/admin/dashboard`, `/admin/productos`, `/admin/usuarios`

---

## Autenticación

- Sesiones con `HttpSession` (sin JWT). El navegador almacena la cookie `JSESSIONID`.
- Endpoints disponibles en dos prefijos:
  - Preferidos para login/registro: `/auth`
  - Compatibles con el resto del API: `/api`

Roles:
- `USUARIO` y `ADMINISTRADOR`.
- El registro público asigna `USUARIO` por defecto (a menos que `app.registration.allowAdmin=true`).

---

## Endpoints del API

Base: `http://localhost:8080`

Autenticación (/auth)
- POST `/auth/login`
  - Body: `{ "email": "user@correo.com", "password": "..." }`
  - Devuelve datos del usuario y crea sesión.
- POST `/auth/register`
  - Crea usuario; si no está permitido crear ADMIN por registro, asigna `USUARIO`.
- GET `/auth/session`
  - Devuelve el usuario autenticado según la sesión.
- POST `/auth/logout`
  - Invalida la sesión.

Autenticación alternativa (/api)
- POST `/api/login`
- GET `/api/session`
- POST `/api/logout`

Usuarios (/api/usuarios) [requiere ADMIN salvo alta pública en POST]
- GET `/api/usuarios` → Listar usuarios.
- GET `/api/usuarios/{id}` → Detalle.
- GET `/api/usuarios/buscar?q=texto` → Búsqueda por nombre/email.
- POST `/api/usuarios` → Crear usuario.
  - Si no hay sesión o no es ADMIN, el rol se controla por `app.registration.allowAdmin`.
  - Si es ADMIN, puede crear con cualquier rol válido.
- PUT `/api/usuarios/{id}` → Actualizar.
- DELETE `/api/usuarios/{id}` → Eliminar.

Productos (/api/productos)
- GET `/api/productos` → Listar.
- GET `/api/productos?page={n}&size={m}` → Listar paginado.
- GET `/api/productos/{id}` → Detalle.
- GET `/api/productos/buscar?q=...&categoria=...&idCategoria=...`
  - Filtros por texto, nombre de categoría o id de categoría.
- POST `/api/productos` → Crear (ADMIN).
- PUT `/api/productos/{id}` → Actualizar (ADMIN).
- DELETE `/api/productos/{id}` → Inhabilitar (ADMIN).
- DELETE `/api/productos/{id}/hard` → Eliminar definitivamente (ADMIN). Intenta borrar la imagen física asociada.
- PATCH `/api/productos/{id}/estado` → Cambiar estado.
  - Body: `{ "estado": "disponible" | "agotado" }` (validación estricta).
- POST `/api/productos/{id}/restaurar` → Marca como `disponible` (ADMIN).
- POST `/api/productos/{id}/imagen` → Subir imagen (ADMIN).
  - Form-data: campo `archivo` (imagen, máx. 10MB). Guarda archivo en `app.uploads.dir` y expone URL con `app.uploads.url-prefix`.
- GET `/api/productos/bajo-stock?umbral=5` → Lista productos con stock bajo (umbral configurable).

Categorías (/api/categorias)
- GET `/api/categorias` → Listar.
- GET `/api/categorias/{id}` → Detalle.
- POST `/api/categorias` → Crear (ADMIN).
- PUT `/api/categorias/{id}` → Actualizar (ADMIN).
- DELETE `/api/categorias/{id}` → Eliminar (ADMIN).

Carrito (/api/cart)
- GET `/api/cart` → Obtiene el carrito de la sesión.
- POST `/api/cart/add` → Agregar producto.
  - Body: `{ "idProducto": 123, "cantidad": 1 }` (cantidad por defecto: 1).
- DELETE `/api/cart/item/{idDetalle}` → Quitar ítem del carrito.
- DELETE `/api/cart/clear` → Limpiar carrito.
- POST `/api/cart/checkout` → Finalizar compra.
  - Requiere usuario autenticado; maneja errores de validación.

Contacto (/api/contactos)
- POST `/api/contactos` → Crear mensaje de contacto.
- GET `/api/contactos` → Listar mensajes.

Archivos estáticos
- Imágenes públicas: `/img/...` sirven desde `frontend/public/img`.

Nota: Esta lista se basa en los controladores detectados y puede estar incompleta. Puedes explorar más en el buscador de código: [Buscar @RestController en el repo](https://github.com/search?q=repo%3Aiggn00%2FDulce-Vida-Web+%40RestController&type=code).

---

## Comandos útiles

Backend
- Dev:
  - Windows: `cd backend && ./mvnw.cmd spring-boot:run`
  - macOS/Linux: `cd backend && ./mvnw spring-boot:run`
- Build:
  - Windows: `cd backend && ./mvnw.cmd clean package`
  - macOS/Linux: `cd backend && ./mvnw clean package`

Frontend
- Dev: `cd frontend && npm run dev`
- Build: `cd frontend && npm run build`

---

## Solución de problemas

- “No conecta a MySQL”
  - Verifica MySQL encendido en XAMPP.
  - Revisa `spring.datasource.url`, usuario y contraseña.
- “Sesión no persiste o CORS”
  - Levanta frontend en `http://localhost:5173` y backend en `http://localhost:8080`.
  - Usa `VITE_API_URL=http://localhost:8080`. Vite proxya `/api` y `/img`.
- “Error al subir imagen”
  - Verifica permisos de escritura y existencia de `app.uploads.dir`.
  - Asegura que el archivo sea imagen válida y menor a 10MB.
- “No carga el frontend en producción”
  - Ejecuta `npm run build` en `frontend` y luego arranca el backend.

---

## Licencia

Proyecto académico/educativo. Úsalo y ajústalo como necesites.

Hecho con mucho amor para que nadie se pierda. 💕
