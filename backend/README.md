# DulceVida Backend – API REST

Backend del proyecto **DulceVida**, pastelería online desarrollada como proyecto académico DUOC.
Implementado en **Spring Boot 3**, con **JWT** para autenticación y documentación de API con **Swagger** y **Postman Collection**.

---

## 1. Instrucciones de instalación

### Requisitos previos

- **Java** 21 (JDK)
- **Maven Wrapper** (incluido en el proyecto: `mvnw` / `mvnw.cmd`)
- **MySQL** 8.x
- Git (opcional, si clonas el repositorio)

### Configuración de base de datos

1. Crear la base de datos en MySQL:

```sql
CREATE DATABASE dulcevidadb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Verificar/ajustar credenciales en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dulcevidadb?serverTimezone=UTC&useSSL=false&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
```

(Modifica `username` y `password` según tu entorno local.)

3. El proyecto está configurado con `spring.jpa.hibernate.ddl-auto=update`, por lo que las tablas se crearán/ajustarán automáticamente al iniciar la aplicación.
   Además, el arranque ejecuta `src/main/resources/db/seed.sql` para crear datos de ejemplo si la base está vacía (categorías, productos demo, usuario de prueba, etc.).

### Instalación de dependencias

Desde la carpeta `backend`:

```powershell
cd backend
.\mvnw clean install
```

Esto descarga dependencias, compila y ejecuta los tests del backend.

---

## 2. Instrucciones de ejecución

Desde la carpeta `backend`:

```powershell
cd backend
.\mvnw spring-boot:run
```

- La aplicación se levanta por defecto en: `http://localhost:8080`
- Página de bienvenida (frontend compilado embebido): `http://localhost:8080/`

Para detenerla, presiona `Ctrl + C` en la terminal.

---

## 3. Credenciales de prueba

Los datos exactos pueden variar según tu `seed.sql`, pero el sistema está pensado para trabajar al menos con:

### Usuario administrador

- **Email**: `admin@gmail.com`
- **Password**: `12345678`
- **Rol**: `ADMINISTRADOR`

### Usuario cliente

- **Email**: `cliente@gmail.com`
- **Password**: `12345678`
- **Rol**: `USUARIO`

> Si necesitas credenciales exactas para la defensa, revisa y ajusta según `src/main/resources/db/seed.sql` y actualiza aquí los valores finales.

---

## 4. Documentación de la API

La API está documentada con **springdoc-openapi** (OpenAPI 3) y Swagger UI.

### Swagger UI (OpenAPI)

- **URL Swagger UI**:  
  `http://localhost:8080/swagger-ui.html`

- **Esquema OpenAPI (JSON)**:  
  `http://localhost:8080/v3/api-docs`

En Swagger encontrarás, entre otros, el endpoint de login:

```http
POST /auth/login
```

Cuerpo de ejemplo:

```json
{
  "email": "admin@gmail.com",
  "password": "12345678"
}
```

Además, Swagger está configurado con esquema de seguridad **JWT Bearer** (`bearerAuth`), por lo que puedes:

1. Hacer login en `/auth/login`.
2. Copiar el `token` JWT de la respuesta.
3. Pulsar el botón **Authorize** en Swagger.
4. Pegar el token en el formato: `Bearer <token>`.

### Postman Collection

En la raíz del repositorio (`/req`) se incluye una colección para pruebas manuales:

- Archivo: `req/postman_collection.json`

Para usarla:

1. Abrir Postman.
2. Importar el archivo `postman_collection.json`.
3. Configurar, si existe, la variable de entorno `BASE_URL` a:

   ```text
   http://localhost:8080
   ```

4. Ejecutar las requests de la colección (auth, productos, carrito, etc.).

---

## 5. Notas para evaluación académica (DUOC)

- Proyecto desarrollado con arquitectura en capas (`controlador`, `servicio`, `repositorio`, `dto`, `modelo`).
- Autenticación y autorización con **JWT** y roles (`ADMINISTRADOR`, `USUARIO`).
- Documentación actualizada y accesible vía Swagger y Postman, acorde a la rúbrica solicitada.
