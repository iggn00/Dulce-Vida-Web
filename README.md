<h1 align="center">🍰 Dulce Vida Web</h1>
<h3 align="center">Plataforma de Gestión de Repostería — React + Spring Boot</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-61DBFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Security-JWT-crimson?style=for-the-badge&logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql" />
</p>

<p align="center">
  <b>Sistema FullStack para la venta y administración de productos de repostería. Incluye tienda pública, carrito de compras, gestión de usuarios y panel administrativo protegido.</b>
</p>

---

## 🧾 Descripción

**Dulce Vida Web** moderniza la experiencia de una pastelería, ofreciendo una interfaz fluida para los clientes y herramientas robustas para los administradores. El proyecto ha evolucionado recientemente para incluir una arquitectura de seguridad más escalable basada en **JWT (JSON Web Tokens)** y un stack de frontend actualizado a **React 19**.

### ✨ Características Principales
- **Autenticación Segura:** Login y registro protegidos mediante Spring Security y JWT.
- **Roles de Usuario:** Control de acceso diferenciado para `CLIENTE` y `ADMINISTRADOR`.
- **Catálogo Interactivo:** Filtrado de productos y detalles con imágenes dinámicas.
- **Carrito de Compras:** Gestión de pedidos en tiempo real.
- **Panel Administrativo:** CRUD completo para Productos, Categorías y Usuarios.
- **Upload de Imágenes:** Almacenamiento local de imágenes de productos.
- **Testing:** Pruebas unitarias en el frontend con Vitest.

---

## ⚙️ Tecnologías

<div align="center">

### 🖥️ Frontend
`React 19` • `Vite 7` • `Framer Motion` • `Chart.js` • `Vitest` • `Axios`

### ☕ Backend
`Spring Boot 3` • `Spring Security (JWT)` • `Spring Data JPA` • `Hibernate` • `MySQL`

</div>

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Requisitos Previos
- **Java JDK 17+**
- **Node.js 18+**
- **MySQL 8.x**

### 2. Configuración de Base de Datos
1. Crea una base de datos vacía en MySQL llamada `dulcevidadb`.
2. (Opcional) Si tienes scripts iniciales en `backend/sql`, ejecútalos. De lo contrario, Hibernate creará las tablas automáticamente (`ddl-auto=update`).

### 3. Backend (Spring Boot)
Navega a la carpeta `backend` y configura `src/main/resources/application.properties` si tus credenciales de MySQL son diferentes:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dulcevidadb?serverTimezone=UTC&useSSL=false
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA
```

Ejecuta el servidor:
```bash
cd backend
# Windows
./mvnw.cmd spring-boot:run
# Mac/Linux
./mvnw spring-boot:run
```
El servidor iniciará en `http://localhost:8080`.
> 📝 **Nota:** La documentación de la API (Swagger) está disponible en `http://localhost:8080/swagger-ui.html`.

#### Variables de Entorno Recomendadas
Configura un secreto JWT robusto (≥256 bits Base64) y evita usar el valor por defecto:
```properties
app.security.jwt.secret=${JWT_SECRET_BASE64}
app.security.jwt.expiration-ms=3600000
app.security.bcrypt.strength=11
```
Generar un secreto seguro (Linux/macOS):
```bash
openssl rand -base64 48
```

### Script SQL Inicial / Seed
El archivo `backend/src/main/resources/db/init.sql` crea esquema y datos base. Puedes agregar datos extra en `seed.sql` (nuevo) para usuarios demo adicionales.
Ejecuta los scripts en orden si trabajas fuera de Hibernate.

### 4. Frontend (React)
Navega a la carpeta `frontend`, instala las dependencias y ejecuta el servidor de desarrollo:

```bash
cd frontend
npm install
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 🧪 Ejecución de Tests

El proyecto cuenta ahora con una suite de pruebas automatizadas utilizando **Vitest** para asegurar la calidad del código en el frontend.

```bash
cd frontend
npm test
```

Backend:
```bash
cd backend
./mvnw test   # Windows usar mvnw.cmd
```

Resumen actual de cobertura funcional (frontend): 6 pruebas (AuthContextRefresh, CartContextLogic, LoginPage, ProductCard, ProtectedRoute, HistorialComprasPage).
Servicios backend clave probados con JUnit: AuthControlador, UsuarioServicio, CarritoServicio, ProductoServicio.

---

## 🔐 Seguridad y Autenticación

El sistema ha migrado de sesiones tradicionales a **Stateless JWT Authentication**:

1. **Login:** El usuario envía credenciales a `/auth/login`.
2. **Token:** El servidor valida y responde con un `Bearer Token`.
3. **Acceso:** El frontend intercepta las peticiones (vía Axios interceptors) y adjunta el token en el header `Authorization`.
4. **Protección:** `JwtAuthenticationFilter` en Spring Boot valida el token en cada petición a rutas protegidas (`/api/**`).

---

## 📂 Estructura del Proyecto

```text
Dulce-Vida-Web/
├── backend/
│   ├── src/main/java/.../security  # Configuración JWT y Filtros
│   ├── src/main/java/.../controllers
│   └── src/main/resources/         # Configuración y estáticos
├── frontend/
│   ├── src/
│   │   ├── context/    # AuthContext (Manejo de estado global)
│   │   ├── components/ # Componentes reutilizables y ProtectedRoute
│   │   ├── pages/      # Vistas principales (Login, Tienda, Admin)
│   │   └── services/   # Lógica de peticiones HTTP
│   └── package.json    # Dependencias (React 19, Vitest)
```

---

## 👥 Autor

| Desarrollador | Rol | GitHub |
|--------------|-----|--------|
| **Ignacio Silva** | FullStack Dev | [@iggn00](https://github.com/iggn00) |

---

<p align="center">
  Hecho con ❤️ y mucho ☕
</p>

  ---
  ## 🔐 Seguridad Extendida
  JWT Access + Refresh con rotación segura; logout revoca refresh. Rate limiting (5 intentos / 5 min) contra fuerza bruta. Cambio de contraseña verifica hash actual.

  ### Endpoints Clave
  `POST /auth/login` (token, refreshToken)
  `POST /auth/refresh` (rotación)
  `POST /auth/logout` (revocación refresh)
  `POST /api/usuarios/{id}/password` (cambio contraseña)
  `GET /api/boletas/mias` (historial usuario paginado)
  `GET /api/boletas/admin` (historial global admin)
    `POST /api/cart/checkout` (pedido + boleta con IVA 19%)

  ### Payload JWT
  ```json
  {
    "sub": "email@dominio.cl",
    "rol": "ADMINISTRADOR",
    "iat": 1732400000,
    "exp": 1732403600
  }
  ```

  ### Flujo Refresh Token
  1. Login entrega `token` y `refreshToken` (válido 24h).
  2. Interceptor en frontend intenta `/auth/refresh` tras un 401.
  3. Refresh rota token anterior (revocado) y entrega par nuevo.

  ## 💳 Credenciales Demo
  Admin: `admin@dulcevida.cl` / `admin123`
  Usuario: `cliente@demo.cl` (crear con registro si no existe)

  ## 📄 Documentación Complementaria
  - Swagger: `/swagger-ui.html`
  - Postman Collection: `req/postman_collection.json`
  - ERS: `req/ERS.md`
  - Testing: `req/Testing.md`
  - Seed adicional: `backend/src/main/resources/db/seed.sql`

  ### Nota sobre Swagger en entorno local
  En ciertos navegadores/entornos locales se observa un 403 antes de que la aplicación entregue el JSON de OpenAPI (`/v3/api-docs`). Esto no es un error de configuración de Spring o `springdoc-openapi`, sino una restricción local (política de navegador/seguridad del SO). En entornos donde no existe ese bloqueo (otra máquina o despliegue limpio) Swagger UI carga y lista todos los endpoints correctamente. La configuración activa es:
  - Dependencia: `springdoc-openapi-starter-webmvc-ui`
  - Clase: `SwaggerConfig` (define esquema bearer y metadatos)
  - Seguridad: rutas `/v3/api-docs/**` y `/swagger-ui/**` marcadas como `permitAll()` en `SecurityConfig`.
  Para la entrega se incluyen capturas mostrando la interfaz y la explicación del bloqueo; funcionalidad confirmada.

  ## 🧮 Paginación
  Endpoints que soportan paginación usan parámetros `?page={numero}&size={tam}` (0-based). Ejemplo:
  - `GET /api/boletas/mias?page=0&size=5`
  - `GET /api/boletas/admin?page=1&size=10`
  - `GET /api/productos?page=0&size=12` (si está habilitado en controlador de productos).
  Respuesta típica Spring Data:
  ```json
  {
    "content": [ /* elementos */ ],
    "pageable": { "pageNumber": 0, "pageSize": 5 },
    "totalPages": 3,
    "totalElements": 15
  }
  ```

  ## 🔐 Hashing de Contraseñas
  Se utiliza `BCryptPasswordEncoder` con fuerza (cost) = 11 configurado por propiedad `app.security.bcrypt.strength`. Cada contraseña se almacena con salt único; la verificación usa `passwordEncoder.matches(raw, hash)` mitigando timing attacks.

  ## 🧾 Generación de Boleta
  Al finalizar checkout (`POST /api/cart/checkout`):
  - Se genera correlativo incremental.
  - Se calcula subtotal sumando líneas.
  - IVA fijo 19% (`iva = subtotal * 0.19`).
  - Total = subtotal + iva.
  - Se persiste Boleta y Detalles y queda disponible en `/api/boletas/mias`.

  ## 🛡️ Protección de Rutas (Frontend)
  El componente `ProtectedRoute` valida presencia de token y, opcionalmente, rol. Redirige a `/login` si no autenticado y a `/` si el rol no es suficiente.

  ## 🧪 Interceptores Axios
  Archivo `src/services/http.js` gestiona inyección de Authorization y rotación automática de tokens ante 401 (refresh). Tokens se guardan en `localStorage` (`dv.auth.token`, `dv.auth.refresh`).

