<h1 align="center">🍰 Dulce Vida Web</h1>
<h3 align="center">Catálogo y Gestión de Repostería — React + Spring Boot</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2018-61DBFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/Build-Vite%20%2B%20Maven-orange?style=for-the-badge" />
</p>

<p align="center">
  <b>Proyecto FullStack con frontend en React (Vite) y backend en Spring Boot (Java), con sesiones, carrito de compras y panel de administración.</b>
</p>

---

## 🧾 Descripción del proyecto

Dulce Vida Web es una plataforma para la gestión integral de productos de repostería. Incluye un catálogo público, carrito de compras con sesión y un panel administrativo para gestionar usuarios, categorías y productos (incluida la carga de imágenes).

- Frontend moderno con React 18 y Vite.
- Backend en Spring Boot 3, conectado a MySQL y autenticación basada en sesión (HttpSession).
- Scripts SQL para crear y poblar la base de datos.
- Opción de servir el build del frontend directamente desde Spring Boot para producción.

---

## 🖼️ Vistas principales

| 🛍️ Tienda pública | 🔐 Panel de Administración |
|-------------------|----------------------------|
| (Capturas próximamente) | (Capturas próximamente) |

---

## ⚙️ Tecnologías utilizadas

<details>
<summary>🖥️ <b>Frontend</b></summary>

- ⚛️ React 18 con Vite  
- 🎨 CSS y assets estáticos servidos desde `/frontend/public`  
- 🔗 Consumo de API vía `VITE_API_URL`  
- 🧭 Rutas públicas y de sesión (login, registro, carrito)  
</details>

<details>
<summary>☕ <b>Backend (Spring Boot)</b></summary>

- 🌱 Spring Boot 3 (Jakarta)  
- 🗄️ MySQL 8.x (conexión vía properties)  
- 🧪 Bean Validation y controladores REST  
- 🖼️ Servido de archivos estáticos e imágenes subidas  
- 🔐 Autenticación basada en sesión (HttpSession), sin JWT  
</details>

<details>
<summary>🏗️ <b>Arquitectura</b></summary>

- Monolito FullStack con separación de carpetas `frontend/` y `backend/`  
- Frontend en desarrollo con Vite; para prod, build servido por Spring Boot  
- Endpoints REST en `/auth` y `/api`  
</details>

---

## 🧩 Estructura del proyecto

```
Dulce-Vida-Web/
│
├── backend/                      # API Spring Boot (Java)
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/               # Recibe el build del frontend en producción
│   └── sql/                      # Scripts SQL: creación + datos de ejemplo
│
└── frontend/                     # App React (Vite)
    ├── public/
    │   └── img/                  # Imágenes públicas servidas como /img/...
    └── src/                      # Componentes, páginas, estilos
```

---

## 💻 Instalación y ejecución

### 🧱 1. Clonar el repositorio
```bash
git clone https://github.com/iggn00/Dulce-Vida-Web.git
cd Dulce-Vida-Web
```

### ⚙️ 2. Requisitos
- Java 17+ y Maven (o `mvnw`/`mvnw.cmd`)
- Node.js 18+ y npm
- MySQL 8.x (puedes usar XAMPP para levantar MySQL fácilmente)
- Cliente SQL (Workbench u otro)

### 🗄️ 3. Base de datos
- Inicia MySQL.
- Ejecuta los scripts de `backend/sql/` para crear la base y poblarla.
- Anota el nombre de la base y credenciales.

### 🔧 4. Configurar backend
Edita `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tu_basedatos?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

# Directorio para imágenes subidas de productos
app.uploads.dir=uploads/imagenes_productos
app.uploads.url-prefix=/uploads/imagenes_productos

# Control registro ADMIN por alta pública
app.registration.allowAdmin=false
```

### 🟢 5. Levantar backend
```bash
# Windows
cd backend && ./mvnw.cmd spring-boot:run

# macOS/Linux
cd backend && ./mvnw spring-boot:run
```
Por defecto: [http://localhost:8080](http://localhost:8080)

### 🔵 6. Levantar frontend
Configura `frontend/.env`:
```
VITE_API_URL=http://localhost:8080
```

Instala y arranca:
```bash
cd ../frontend
npm install
npm run dev
```
Frontend dev: [http://localhost:5173](http://localhost:5173)

---

## 🎯 Build para producción (unificado)

1) Generar build del frontend:
```bash
cd frontend
npm run build
```

2) Iniciar el backend (servirá el build desde `backend/src/main/resources/static`):
```bash
# Windows
cd ../backend && ./mvnw.cmd spring-boot:run
# macOS/Linux
cd ../backend && ./mvnw spring-boot:run
```

---

## 🔐 Autenticación y roles

- Sesiones con `HttpSession` (cookie `JSESSIONID`)  
- Prefijos recomendados:
  - `/auth` para login/registro/session/logout
  - `/api` para el resto del CRUD
- Roles: `USUARIO` y `ADMINISTRADOR`  
  - El registro público crea `USUARIO` por defecto (controlado por `app.registration.allowAdmin`)

---

## 📚 Endpoints clave

Base: `http://localhost:8080`

<details>
<summary>👤 <b>Autenticación</b></summary>

- POST `/auth/login`  
- POST `/auth/register`  
- GET  `/auth/session`  
- POST `/auth/logout`  

Alternativa compatible:
- POST `/api/login`
- GET  `/api/session`
- POST `/api/logout`
</details>

<details>
<summary>🍮 <b>Productos</b></summary>

- GET `/api/productos` (paginación opcional: `page`, `size`)  
- GET `/api/productos/{id}`  
- GET `/api/productos/buscar?q=...&categoria=...&idCategoria=...`  
- POST `/api/productos` (ADMIN)  
- PUT `/api/productos/{id}` (ADMIN)  
- DELETE `/api/productos/{id}` (ADMIN, soft delete)  
- DELETE `/api/productos/{id}/hard` (ADMIN, elimina físicamente)  
- PATCH `/api/productos/{id}/estado`  
- POST `/api/productos/{id}/imagen` (subida de imagen, form-data `archivo`)  
- GET `/api/productos/bajo-stock?umbral=5`
</details>

<details>
<summary>🏷️ <b>Categorías</b></summary>

- GET `/api/categorias`  
- GET `/api/categorias/{id}`  
- POST `/api/categorias` (ADMIN)  
- PUT `/api/categorias/{id}` (ADMIN)  
- DELETE `/api/categorias/{id}` (ADMIN)  
</details>

<details>
<summary>🛒 <b>Carrito</b></summary>

- GET `/api/cart`  
- POST `/api/cart/add` — body: `{ "idProducto": 123, "cantidad": 1 }`  
- DELETE `/api/cart/item/{idDetalle}`  
- DELETE `/api/cart/clear`  
- POST `/api/cart/checkout` (requiere usuario autenticado)  
</details>

<details>
<summary>📬 <b>Contacto</b></summary>

- POST `/api/contactos`  
- GET `/api/contactos` (ADMIN)  
</details>

---

## 🧭 Funcionalidades principales

- ✅ Catálogo público con filtros y detalle de producto  
- ✅ Carrito de compras con estado en sesión  
- ✅ Panel administrativo: productos, usuarios y categorías  
- ✅ Carga y servido de imágenes de productos  
- ✅ Rutas públicas y de sesión; control de roles básico  
- 🚧 Validaciones avanzadas, pruebas y documentación ampliada

---

## 💡 Consejos y solución de problemas

- Conexión MySQL: revisa `spring.datasource.*` y que MySQL esté activo  
- CORS/sesión: usa `VITE_API_URL=http://localhost:8080` y frontend en `5173`  
- Subida de imágenes: verifica permisos del directorio `app.uploads.dir`  
- Frontend en prod: recuerda `npm run build` antes de levantar el backend

---

## 👥 Autor

| Nombre   | Rol                     | Contacto                           |
|----------|-------------------------|------------------------------------|
| iggn00   | Desarrollador FullStack | [@iggn00](https://github.com/iggn00) |

---

## 🏁 Estado actual

| Estado | Funcionalidad                                          |
|-------:|--------------------------------------------------------|
| ✅     | Frontend y Backend integrados (sesiones)               |
| ✅     | CRUD de productos y categorías                         |
| ✅     | Carrito y checkout con validaciones básicas            |
| ✅     | Subida y servido de imágenes                           |
| 🚧     | Test automatizados, documentación ampliada y despliegue|

---

## 🪄 Próximos pasos

- 🔐 Endurecer autorización por rol en endpoints críticos  
- 🧪 Pruebas unitarias/e2e y CI básica  
- 🐳 Contenerización con Docker (multi-stage para Vite + Spring)  
- ☁️ Despliegue en servicios gestionados (Render, Railway, Vercel + API)  

---

## 🪶 Licencia y frase de cierre

<p align="center">
  <b>“Sabor a dulce, código impecable.”</b><br><br>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" />
</p>
