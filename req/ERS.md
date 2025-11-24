# ERS - Dulce Vida Web

## 1. Introducción
Sistema e-commerce para pastelería que permite a clientes explorar catálogo, gestionar un carrito, emitir compras (boletas) y a administradores administrar productos, usuarios y monitorear ventas. Arquitectura basada en **React 19** y **Spring Boot 3** con autenticación **JWT**.

## 2. Alcance
Incluye: autenticación, autorización por roles (CLIENTE/ADMINISTRADOR), gestión de productos, flujo de compra y emisión de boleta, historial paginado, panel administrador, contactos básicos y cambio de contraseña. No incluye: pasarela de pago real, facturación electrónica oficial, multi‑tenancy, internacionalización.

## 3. Actores
- Cliente: Navega catálogo, administra carrito, realiza checkout, consulta historial.
- Administrador: CRUD productos/usuarios, visualiza compras globales.
- Sistema Externo (opcional futuro): Pasarela de pago (placeholder).

## 4. Requisitos Funcionales
1. Autenticación JWT con refresh y logout seguro.
2. Hashing de contraseñas (BCrypt cost configurable, por defecto 11).
3. Registro y login usuarios (validación email único).
4. CRUD Productos (nombre, descripción, precio, stock, imagen, categoría).
5. CRUD Categorías (nombre único, relación 1:N con productos).
6. Carrito: agregar/quitar productos, ajustar cantidades, persistencia por usuario.
7. Checkout: genera Pedido, descuenta stock, crea Boleta correlativa y Detalles.
8. Historial de compras paginado para cliente (consulta boletas propias).
9. Dashboard administrador: listado paginado de boletas globales.
10. Cambio de contraseña con verificación hash actual.
11. Gestión básica de contactos (almacenamiento mensajes).
12. Paginación en listados (productos, boletas).

## 5. Requisitos No Funcionales
- Seguridad: JWT HS256, secreto >=256 bits Base64, rotación refresh, rate limiting login.
- Rendimiento: Tiempo medio de respuesta API < 1s en operaciones CRUD estándar.
- Escalabilidad: Stateless en capa web (tokens, no sesión servidor para lógica principal).
- Mantenibilidad: Capas separadas (controlador, servicio, repositorio, modelo, dto).
- Calidad: Pruebas unitarias y de integración backend; 6 pruebas frontend con RTL/Vitest.
- Confiabilidad: Manejo de excepciones centralizado (GlobalExceptionHandler).
- Portabilidad: Configuración mediante `application.properties` y variables de entorno.

## 6. Modelo de Datos (Resumen Entidades)
- Usuario(id, nombre, email, passwordHash, rol, activo, creadoEn)
- Producto(id, nombre, descripcion, precio, stock, imagenUrl, categoria_id)
- Categoria(id, nombre)
- Pedido(id, usuario_id, estado, creadoEn)
- Detalle_Pedido(id, pedido_id, producto_id, cantidad, precioUnitario)
- Boleta(idBoleta, numero, fechaEmision, subtotal, iva, total, pedido_id, usuario_id)
- Detalle_Boleta(idDetalleBoleta, boleta_id, producto_id, cantidad, precioUnitario, totalLinea)
- Refresh_Token(id, usuario_id, token, revocado, creadoEn, expiracion)
- Contacto(id, nombre, email, mensaje, creadoEn)

Relaciones Clave:
- Usuario 1:N Pedido
- Pedido 1:N Detalle_Pedido
- Pedido 1:1 Boleta
- Boleta 1:N Detalle_Boleta
- Categoria 1:N Producto
- Usuario 1:N Refresh_Token

## 7. Reglas de Negocio
- IVA fijo 19%: `iva = round(subtotal * 0.19)`.
- Total boleta = subtotal + iva.
- Numeración boleta correlativa incremental (sin huecos salvo fallos transaccionales rollbacks).
- Stock nunca negativo; checkout falla si algún producto no tiene cantidad suficiente.
- Refresh token rotado en cada `/auth/refresh`; anterior marcado como revocado.
- Contraseña mínima 8 caracteres (validación en registro/cambio password).
- Intentos de login: máximo 5 cada 5 minutos por IP/email (rate limiting simple).

## 8. Paginación
- Parámetros estándar `page` (0-based) y `size`.
- Boletas cliente: `GET /api/boletas/mias?page=0&size=5`.
- Boletas admin: `GET /api/boletas/admin?page=0&size=10`.
- Respuesta conforme a `Page<>` de Spring (content, totalPages, totalElements).

## 9. Suposiciones
- Un pedido se asocia a exactamente una boleta.
- No se manejan devoluciones / notas de crédito en esta etapa.
- El carrito se reconstruye a partir de estado en servidor al autenticarse (persistencia ligada a usuario, no anónimo prolongado).

## 10. Riesgos
- Exposición de secreto JWT si no se configura variable entorno segura.
- Falta de índice en columnas de búsqueda podría degradar rendimiento con crecimiento de datos.
- Uso de correlativo simple podría requerir separación futura para entornos multi‑nodo.

## 11. Validación
Pruebas JUnit cubren generación de boleta, ajuste stock, hash de contraseña y autenticación. Pruebas frontend verifican flujos críticos de UI y protección de rutas.

## 12. Trazabilidad (Mapa rápido RF -> Artefactos)
| RF | Artefactos |
|----|------------|
| 1  | SecurityConfig, JwtAuthenticationFilter, AuthControlador |
| 4-7 | CarritoServicio, Pedido repositorio, BoletaServicio/Controlador |
| 8-9 | BoletaControlador endpoints `/mias`, `/admin` |
| 10 | UsuarioServicio (cambio contraseña) |
| 12 | Controladores con parámetros `page`, `size` |

---
Documento ERS ampliado para cumplir rúbrica de Experiencia 3.