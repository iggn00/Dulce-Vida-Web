# 🍰 Dulce Vida Web

**Plataforma FullStack para gestión y venta de repostería**  
Frontend: React + Vite | Backend: Spring Boot | Autenticación: JWT

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-61DBFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Security-JWT-crimson?style=for-the-badge&logo=jsonwebtokens" alt="JWT" />
  <img src="https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" />
</p>

Resumen: Dulce Vida Web es una aplicación fullstack para una pastelería que incluye tienda pública, carrito de compras, gestión de usuarios y un panel administrativo protegido para administrar productos, categorías y pedidos.

---

## ✨ Características principales

- Autenticación segura con JWT (Access + Refresh token, rotación y revocación de refresh tokens).
- Roles: `CLIENTE` y `ADMINISTRADOR` (control de acceso).
- Catálogo de productos con imágenes, filtros y paginación.
- Carrito de compras y proceso de checkout (generación de boleta con IVA).
- Panel administrativo con CRUD para Productos, Categorías y Usuarios.
- Upload de imágenes (almacenamiento local).
- Rate limiting y protección contra fuerza bruta en endpoints de autenticación.
- Tests: Vitest (frontend) y JUnit (backend).

---

## 🧭 Estructura del repositorio

Dulce-Vida-Web/
├── backend/ — Spring Boot (API, seguridad, persistencia)  
├── frontend/ — React + Vite (UI, context, rutas protegidas)  
└── Requerimiento/ — documentación y colecciones (Postman, ERS, testing)

Dentro de frontend:
- src/context — AuthContext, CartContext
- src/components — componentes reutilizables y ProtectedRoute
- src/pages — vistas (Login, Tienda, Admin)
- src/services — Axios, interceptores y lógica HTTP

Dentro de backend:
- src/main/java/.../security — configuración JWT y filtros
- src/main/java/.../controllers — controladores REST
- src/main/resources — configuración, SQL de inicialización y assets

---

## ⚙️ Tecnologías

Frontend
- React 19, Vite 7, Framer Motion, Chart.js, Axios, Vitest

Backend
- Spring Boot 3, Spring Security (JWT), Spring Data JPA, Hibernate, MySQL 8

Herramientas
- Maven, Node.js 18+, Java 17+, OpenSSL (generación secrets)

---

## 🚀 Instalación y ejecución (local)

Requisitos
- Java JDK 17+
- Node.js 18+
- MySQL 8.x

1) Crear la base de datos
- Crea una base en MySQL llamada `dulcevidadb`:
  ```sql
  CREATE DATABASE dulcevidadb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
  ```

2) Backend — configurar y ejecutar
- Edita backend/src/main/resources/application.properties según tu entorno (usuario/contraseña):
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/dulcevidadb?serverTimezone=UTC&useSSL=false
  spring.datasource.username=root
  spring.datasource.password=TU_CONTRASEÑA
  ```
- Variables de seguridad recomendadas:
  ```properties
  app.security.jwt.secret=${JWT_SECRET_BASE64}        # >=256 bits en Base64
  app.security.jwt.expiration-ms=3600000
  app.security.bcrypt.strength=11
  ```
  Generar secreto seguro (Linux/macOS):
  ```bash
  openssl rand -base64 48
  ```
- Ejecutar backend:
  ```bash
  cd backend
  # Linux/macOS
  ./mvnw spring-boot:run
  # Windows
  ./mvnw.cmd spring-boot:run
  ```
- Servidor por defecto: http://localhost:8080  
- Swagger UI: http://localhost:8080/swagger-ui.html  
  (Si observas 403 en `/v3/api-docs`, revisa la configuración de seguridad y la clase `SwaggerConfig`.)

3) Frontend — instalar y ejecutar
- Instalar dependencias y levantar frontend:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- Frontend por defecto: http://localhost:5173

---

## 🧩 Configuración de tokens y storage

- Los tokens se guardan en localStorage con claves: `dv.auth.token`, `dv.auth.refresh`.
- Axios interceptor en `src/services/http.js` maneja la inyección del Authorization header y la rotación automática de tokens ante 401 (hace llamada a `/auth/refresh`).

Flujo típico:
1. POST /auth/login → devuelve { token, refreshToken }
2. El frontend usa `token` en Authorization: `Bearer <token>`
3. Si 401 por expiración, interceptor intenta `/auth/refresh`. Si falla, redirige a login.

---

## 🧪 Tests

Frontend (Vitest):
```bash
cd frontend
npm test
```

Backend (JUnit / Maven):
```bash
cd backend
./mvnw test   # Windows: mvnw.cmd
```

Resumen (actual):
- Frontend: 6 pruebas principales (AuthContextRefresh, CartContextLogic, LoginPage, ProductCard, ProtectedRoute, HistorialComprasPage).
- Backend: pruebas en controladores y servicios críticos (AuthController, UsuarioService, CarritoService, ProductoService).

---

## 🗃️ Scripts SQL y seed

- Script de inicialización: backend/src/main/resources/db/init.sql
- Seed adicional sugerido: backend/src/main/resources/db/seed.sql (puedes crear este archivo para datos demo adicionales).
- Ejecuta los scripts en el orden apropiado si no usas `spring.jpa.hibernate.ddl-auto=update`.

---

## 🔐 Seguridad y endpoints clave

- Autenticación stateless con JWT (Access + Refresh):
  - POST /auth/login — login (devuelve token + refreshToken)
  - POST /auth/refresh — rota refresh token y devuelve nuevo par
  - POST /auth/logout — revoca refresh token
- Otros endpoints clave:
  - POST /api/usuarios/{id}/password — cambiar contraseña (verifica hash actual)
  - GET /api/boletas/mias — historial del usuario (paginado)
  - GET /api/boletas/admin — historial global (admin)
  - POST /api/cart/checkout — finaliza pedido y genera boleta (IVA 19%)

Payload ejemplo del JWT:
```json
{
  "sub": "email@dominio.cl",
  "rol": "ADMINISTRADOR",
  "iat": 1732400000,
  "exp": 1732403600
}
```

Paginación (parámetros 0-based):
- GET /api/boletas/mias?page=0&size=5
- GET /api/productos?page=0&size=12

Respuesta típica (Spring Data Page):
```json
{
  "content": [ /* elementos */ ],
  "pageable": { "pageNumber": 0, "pageSize": 5 },
  "totalPages": 3,
  "totalElements": 15
}
```

Hashing de contraseñas:
- BCrypt con fuerza configurada por `app.security.bcrypt.strength` (por defecto 11).
- Sal por registro; verificación con BCryptPasswordEncoder.

Checkout / generación de boleta:
- Se calcula subtotal (sumatoria líneas), IVA = subtotal * 0.19, total = subtotal + iva.
- Se persiste Boleta y Detalles con correlativo incremental.

---

## 👥 Credenciales demo

- Admin: admin@dulcevida.cl / admin123  
- Usuario demo: cliente@demo.cl (si no existe, crear mediante registro)

> Nota: las credenciales demo se proveen para desarrollo. No uses contraseñas débiles en producción.

---

## 📦 Entregables / documentación adicional

- Swagger UI: /swagger-ui.html
- Postman Collection: req/postman_collection.json
- ERS: req/ERS.md
- Testing docs: req/Testing.md

---

## 🛠️ Contribuir

1. Haz fork del repositorio.
2. Crea una rama descriptiva: `feature/mi-cambio` o `fix/bug`.
3. Abre PR con descripción clara y tests si aplica.
4. Revisa las reglas de estilo y linters (añadir si existen).

Si quieres que cree directamente un PR con la actualización de este README, dímelo y lo hago con gusto.

---

## 📄 Licencia

Este proyecto puede estar bajo licencia MIT (u otra que prefieras). Añade un archivo LICENSE si quieres publicarlo con una licencia explícita.

---

## ✉️ Autor

Ignacio Silva — FullStack Dev — https://github.com/iggn00

Hecho con ❤️ y mucho ☕
