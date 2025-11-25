# DulceVida Frontend – SPA React

Frontend del proyecto **DulceVida**, pastelería online desarrollada como proyecto académico DUOC.
Implementado como **Single Page Application (SPA)** usando **React**, **Vite** y consumo de API REST del backend.

---

## 1. Instrucciones de instalación

### Requisitos previos

- **Node.js** 20.x (recomendado)
- **npm** (incluido con Node.js)

### Instalación de dependencias

Desde la carpeta `frontend`:

```powershell
cd frontend
npm install
```

Esto descargará todas las dependencias definidas en `package.json`.

---

## 2. Instrucciones de ejecución

### Entorno de desarrollo

Desde la carpeta `frontend`:

```powershell
cd frontend
npm run dev
```

- La aplicación se levanta por defecto en: `http://localhost:5173`
- Asegúrate de tener el **backend** corriendo en `http://localhost:8080` (según configuración por defecto) para poder consumir la API.

### Build para producción

```powershell
cd frontend
npm run build
```

El resultado quedará en la carpeta `dist/`.

---

## 3. Testing del frontend

El frontend utiliza **Vitest** y **React Testing Library** para las pruebas.

### Ejecutar todos los tests

```powershell
cd frontend
npm test
```

### Ejecutar un test específico

Por ejemplo, sólo `LoginPage.test.jsx`:

```powershell
cd frontend
npm test -- LoginPage.test.jsx
```

Los tests se encuentran en `src/__tests__/` y cubren, entre otros:

- `AuthContextRefresh.test.jsx` – manejo de sesión.
- `CartContextLogic.test.jsx` – lógica del carrito de compras.
- `LoginPage.test.jsx` – flujo de autenticación.
- `ProtectedRoute.test.jsx` – protección de rutas según rol.

---

## 4. Configuración de la API

La URL base del backend se configura en los servicios del frontend (por ejemplo en `src/services/api.js` o variables de entorno `.env`).

Por defecto, el proyecto está pensado para apuntar a:

```text
http://localhost:8080
```

Si el backend se ejecuta en otra URL o puerto, actualiza la configuración correspondiente.

---

## 5. Notas para evaluación académica (DUOC)

- Frontend construido con **React + Vite**, organizado en capas:
	- `components/`, `pages/`, `context/`, `services/`, `styles/`.
- Manejo de estado global con **Context API** para autenticación y carrito.
- Testing automatizado con **Vitest** y **React Testing Library**.
- Integración completa con el backend documentado en `backend/README.md` (Swagger + Postman).
