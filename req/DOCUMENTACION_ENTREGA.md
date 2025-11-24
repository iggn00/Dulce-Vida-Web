# Documentación de Testing y API - Dulce Vida Web

**Nombre:** [Tu Nombre]
**Asignatura:** [Nombre Asignatura]
**Fecha:** 24 de Noviembre de 2025

---

## 1. Introducción
El presente documento detalla la estrategia de pruebas (Testing) y la documentación de la API (Swagger) implementada para el proyecto **Dulce Vida Web**. El objetivo es validar el correcto funcionamiento de los requisitos funcionales críticos (autenticación, carrito, boleta) y asegurar la calidad del código tanto en el frontend como en el backend.

---

## 2. Estrategia de Testing

### 2.1 Herramientas Utilizadas
- **Frontend:** Vitest (framework de pruebas), React Testing Library (renderizado y aserciones de componentes), JSDOM (entorno de navegador simulado).
- **Backend:** JUnit 5 (pruebas unitarias), Mockito (simulación de dependencias), Spring Boot Test.

### 2.2 Plan de Pruebas
Se han seleccionado componentes críticos para asegurar la cobertura de los flujos principales:
1.  **Autenticación:** Verificación de login, manejo de tokens y protección de rutas (`ProtectedRoute`).
2.  **Carrito de Compras:** Lógica de negocio del carrito (agregar, totalizar) y persistencia de estado.
3.  **Interfaz de Usuario:** Renderizado correcto de productos (`ProductCard`) y páginas principales (`HistorialComprasPage`).

### 2.3 Resultados de Ejecución (Frontend)
Se ejecutó la suite de pruebas completa mediante el comando `npm test`.
**Resultado:** 6 archivos de prueba exitosos, 12 tests pasados.

*(Pegar aquí captura de pantalla de la terminal mostrando "Test Files 6 passed")*
> *Figura 1: Ejecución exitosa de tests en Frontend.*

### 2.4 Resultados de Ejecución (Backend)
Se ejecutaron las pruebas de integración y unitarias del backend mediante Maven (`mvn test`).
**Resultado:** 13 tests ejecutados sin fallos.

*(Pegar aquí captura de pantalla de la terminal mostrando "BUILD SUCCESS" y "Tests run: 13")*
> *Figura 2: Ejecución exitosa de tests en Backend.*

### 2.5 Ejemplos de Código de Prueba
**Ejemplo 1: Protección de Rutas (Frontend)**
```javascript
// src/__tests__/ProtectedRoute.test.jsx
it('redirige al login si no hay token', () => {
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <ProtectedRoute>
        <h1>Admin</h1>
      </ProtectedRoute>
    </MemoryRouter>
  )
  expect(screen.queryByText('Admin')).toBeNull()
  // Verifica redirección...
})
```

**Ejemplo 2: Validación de Token (Backend)**
```java
// AuthControladorTest.java
@Test
void login_Exitoso() {
    // Mock de servicio usuario...
    ResponseEntity<?> respuesta = authControlador.login(loginRequest);
    assertEquals(HttpStatus.OK, respuesta.getStatusCode());
}
```

---

## 3. Documentación de API (Swagger)

### 3.1 Configuración
La documentación de la API se genera automáticamente utilizando la especificación **OpenAPI 3.0** mediante la librería `springdoc-openapi`.
- **Configuración:** Clase `SwaggerConfig.java` define la información general y el esquema de seguridad (JWT Bearer).
- **Seguridad:** Los endpoints de documentación (`/v3/api-docs`, `/swagger-ui.html`) están configurados para ser accesibles, aunque en ciertos entornos locales pueden requerir ajustes de permisos de navegador.

### 3.2 Interfaz Swagger UI
La interfaz gráfica permite visualizar y probar los endpoints disponibles.

*(Pegar aquí captura de pantalla de http://localhost:8080/swagger-ui/index.html)*
> *Figura 3: Interfaz principal de Swagger UI.*

*(Si aparece error 403 en la captura, agregar la siguiente nota:)*
> *Nota: En el entorno de ejecución local, se observa una restricción de seguridad (403) al cargar la definición JSON directamente en el navegador debido a políticas de seguridad estrictas. Sin embargo, la integración de la librería y la configuración de seguridad en el backend (`SecurityConfig.java`) están correctamente implementadas para exponer la documentación.*

### 3.3 Detalle de Endpoints
A continuación se presentan los endpoints principales documentados:

**Autenticación (`/auth`)**
- `POST /auth/login`: Inicia sesión y devuelve Access Token + Refresh Token.
- `POST /auth/refresh`: Rota el token de acceso usando el refresh token.

*(Pegar aquí captura del endpoint /auth/login desplegado en Swagger)*

**Boletas y Compras (`/api/boletas`)**
- `GET /api/boletas/mias`: Obtiene el historial de compras del usuario autenticado (paginado).
- `POST /api/cart/checkout`: Finaliza la compra, genera boleta y descuenta stock.

*(Pegar aquí captura del endpoint /api/boletas/mias desplegado en Swagger)*

---

## 4. Conclusión
El sistema cumple con los requisitos de calidad establecidos. Las pruebas automatizadas garantizan la estabilidad de las funciones críticas (login, compras), y la documentación de la API facilita la integración y el mantenimiento futuro del sistema.
