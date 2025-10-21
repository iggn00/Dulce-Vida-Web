# Dulce Vida Web

Este repositorio contiene:
- `backend/`: API REST en Spring Boot (Java) conectada a la Base de Datos.
- `frontend/`: Aplicación React (Vite) que replica el sitio estático y agrega panel de administrador.
- `frontend/public/img`: Imágenes públicas (migradas desde el sitio estático original).
- `backend/sql/`: scripts SQL para crear y poblar la base de datos.

## Desarrollo local

1. Backend (Spring Boot):
	- Configura tu base de datos como corresponda (ver scripts en `Base de datos/`).
	- Inicia el backend en el puerto 8080:
	  - Windows PowerShell:
		 - `cd backend`
		 - `./mvnw.cmd spring-boot:run`

2. Frontend (Vite + React):
	- Variables: `frontend/.env` contiene `VITE_API_URL=http://localhost:8080`.
	- Inicia el frontend en el puerto 5173:
	  - Windows PowerShell:
		 - `cd frontend`
		 - `npm install`
		 - `npm run dev`
	- El servidor de desarrollo proxyará `/api` y `/img` al backend.

## Rutas principales
- Público: `/` (Home), `/productos`, `/nosotros`, `/contacto`
- Sesión: `/login`, `/register`, `/carrito`
- Admin: `/admin/dashboard`, `/admin/productos`, `/admin/usuarios`

## Build unificado (servir React desde Spring Boot)
El build de Vite se genera directamente en `backend/src/main/resources/static`, no se requiere copiar.

1. Genera el build de React:
	- `cd frontend`
	- `npm run build`

2. Inicia el backend normalmente (`./mvnw.cmd spring-boot:run`).
	- Spring Boot servirá los archivos desde `backend/src/main/resources/static`.

Notas:
- Las imágenes públicas están en `frontend/public/img` y se sirven bajo `/img/...` automáticamente por Vite/Spring (en build).
- Subidas de productos se guardan en `uploads/imagenes_productos` (creada automáticamente).

## Autenticación
- Login simple a `/api/login` sin JWT (validación directa contra BD). No hay manejo de tokens.

## Panel de Admin
- Dashboard: totales y bajo stock (umbral=5).
- Productos: listar/crear/editar/inhabilitar, subir imagen, búsqueda y filtro por categoría.
- Usuarios: listar/crear/editar/eliminar, búsqueda por nombre/email.

## Licencia
Proyecto académico/educativo. Ajusta según tus necesidades.
