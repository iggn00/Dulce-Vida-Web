# Documento de Testing – Dulce Vida Web

## 1. Introducción y Propósito
El objetivo del plan de pruebas es validar los requerimientos funcionales críticos de la plataforma: autenticación segura (JWT + refresh), flujo de carrito y generación de boleta, protección de rutas y render correcto de componentes UI. Las pruebas buscan asegurar regresión mínima durante la evolución del frontend y la lógica de negocio del backend.

## 2. Herramientas y Configuración
Frontend:
- Vitest 2 + JSDOM
- React Testing Library (RTL)
- @testing-library/user-event para interacción

Backend:
- JUnit 5
- Mockito para mocks de repositorios/servicios
- Spring Boot Test para integración puntual

Ejecución Frontend:
```bash
cd frontend
npm test
```
Ejecución Backend (principal suite Maven):
```bash
cd backend
./mvnw test
```

## 3. Plan de Testing
### 3.1 Componentes / Pages Seleccionados (Frontend)
1. LoginPage – Render y manejo de mensaje error.
2. ProtectedRoute – Redirección cuando no autenticado y permisos.
3. ProductCard – Muestra nombre y precio formateado.
4. Lógica de Carrito (unidad pura) – Agregar e incrementar cantidad.
5. AuthContext – Estado inicial sin token y flujo refresh.
6. HistorialComprasPage – Render de boletas paginadas y apertura de detalles.

### 3.2 Casos Clave Backend (Resumen ya cubierto en pruebas existentes)
- Hash seguro BCrypt (cost configurable) y cambio de contraseña.
- Generación boleta: correlativo, IVA (19%), subtotal vs total.
- Rotación refresh token y revocación anterior.
- Rate limiting login (5 intentos / 5 minutos).
- Ajuste de stock en checkout (agotado si llega a <= 0).

### 3.3 Cobertura Esperada
- Frontend: >=5 pruebas unitarias/integración (cumplido y extendido a 6).
- Backend: Servicios críticos (UsuarioServicio, CarritoServicio, AuthControlador) probados en suite existente.

## 4. Ejemplos de Código (Frontend)
Ejemplo prueba `LoginPage`:
```js
import { render, screen } from '@testing-library/react'
import LoginPage from '../src/pages/LoginPage.jsx'
test('renderiza título login', () => {
	render(<LoginPage />)
	expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument()
})
```
Ejemplo lógica carrito:
```js
function addItem(state, producto, cantidad = 1) {
	const existing = state.find(i => i.id === producto.id)
	if (existing) return state.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i)
	return [...state, { id: producto.id, nombre: producto.nombre, cantidad }]
}
```

## 5. Resultados de los Testing
Frontend: 6 pruebas (AuthContextRefresh, CartContextLogic, LoginPage, ProductCard, ProtectedRoute, HistorialComprasPage) pasan en estado verde. Backend: archivos de reporte Surefire muestran éxito en AuthControladorTest, CarritoServicioTest, ProductoServicioTest y UsuarioServicioTest.

## 6. Conclusión
La suite actual cubre los requerimientos exigidos en la rúbrica para autenticación, carrito, boleta y protección de rutas. Se deja espacio para futuras pruebas de accesibilidad y performance si se amplía el alcance.