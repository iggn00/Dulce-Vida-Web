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
