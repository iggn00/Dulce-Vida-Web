<h1 align="center">💐 Perfulandia</h1>
<h3 align="center">Sistema de Gestión para Perfumería — Interfaz Web + API REST</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Java-17-007396?style=for-the-badge&logo=openjdk" />
  <img src="https://img.shields.io/badge/Build-Maven-C71A36?style=for-the-badge&logo=apachemaven" />
  <img src="https://img.shields.io/badge/Views-Thymeleaf-005F0F?style=for-the-badge&logo=thymeleaf" />
</p>

<p align="center">
  <b>Aplicación web monolítica en Spring Boot para administrar usuarios, roles y productos de Perfulandia, con vistas HTML y una API REST completa.</b>
</p>

---

## 🧾 Descripción del proyecto

Perfulandia es un sistema web enfocado en la gestión de una perfumería. El proyecto ofrece:

- Interfaz HTML para perfiles de Administrador, Cliente, Empleado y Gerente.
- API REST para CRUD de Permisos, Productos, Administradores, Clientes, Empleados y Gerentes.
- Arquitectura MVC con controladores web y endpoints RESTful.

---

## 🌐 Vistas principales (Interfaz Web)

Accesos rápidos en tu entorno local (puerto por defecto 8080):

- 👨‍💼 Administrador → [http://localhost:8080/administrador](http://localhost:8080/administrador)
- 👥 Cliente → [http://localhost:8080/cliente](http://localhost:8080/cliente)
- 🧑‍🔧 Empleado → [http://localhost:8080/empleado](http://localhost:8080/empleado)
- 👨‍💼 Gerente → [http://localhost:8080/gerente](http://localhost:8080/gerente)
- 🔐 Permiso → [http://localhost:8080/permiso](http://localhost:8080/permiso)
- 🛒 Producto → [http://localhost:8080/producto](http://localhost:8080/producto)

---

## ⚙️ Tecnologías utilizadas

- ☕ Spring Boot (MVC, REST)
- 🧩 Spring Web
- 🗂️ (Opcional) Spring Data JPA / Hibernate
- 🧪 Bean Validation
- 🧵 Thymeleaf (vistas HTML)
- 🏗️ Maven como sistema de build

> Nota: La base de datos es configurable según tu `application.properties` (por ejemplo, H2/MySQL). 

---

## 🧩 Estructura del proyecto (referencial)

```
experiencia-2_-caso-perfulandia/
│
├── src/
│   ├── main/
│   │   ├── java/…/perfulandia/
│   │   │   ├── controller/        # Controladores MVC y REST
│   │   │   ├── service/           # Lógica de negocio
│   │   │   ├── repository/        # Acceso a datos (JPA si aplica)
│   │   │   └── model/             # Entidades/DTOs
│   │   └── resources/
│   │       ├── templates/         # Vistas Thymeleaf (administrador, cliente, etc.)
│   │       ├── static/            # CSS/JS/imagenes
│   │       └── application.properties
│   └── test/                      # Pruebas unitarias
│
└── pom.xml
```

---

## 💻 Instalación y ejecución

### 1) Clonar el repositorio
```bash
git clone https://github.com/iggn00/Experiencia-2_-Caso-Perfulandia.git
cd Experiencia-2_-Caso-Perfulandia
```

### 2) Requisitos
- JDK 17+
- Maven 3.9+

### 3) Configurar aplicación (opcional)
Edita `src/main/resources/application.properties` para base de datos, puerto, etc.

### 4) Ejecutar en desarrollo
```bash
mvn spring-boot:run
```

o bien empaquetar y ejecutar:

```bash
mvn clean package
java -jar target/*.jar
```

📍 Accede en el navegador a:
- Interfaz: [http://localhost:8080](http://localhost:8080)
- Vistas específicas: ver sección “Vistas principales”

---

## 📡 API REST — Endpoints

A continuación, el catálogo de endpoints disponibles en `http://localhost:8080`:

### 🔐 Permisos
| Acción                  | Método | URL                                      |
|------------------------|--------|------------------------------------------|
| Listar todos           | GET    | `/api/permiso`                           |
| Detalle por ID         | GET    | `/api/permiso/{id}`                      |
| Crear                  | POST   | `/api/permiso`                           |
| Modificar              | PUT    | `/api/permiso/{id}`                      |
| Eliminar               | DELETE | `/api/permiso/{id}`                      |

### 🛒 Productos
| Acción                  | Método | URL                                      |
|------------------------|--------|------------------------------------------|
| Listar todos           | GET    | `/api/productos`                         |
| Detalle por ID         | GET    | `/api/productos/{id}`                    |
| Crear                  | POST   | `/api/productos`                         |
| Modificar              | PUT    | `/api/productos/{id}`                    |
| Eliminar               | DELETE | `/api/productos/{id}`                    |

### 👨‍💼 Administradores
| Acción                  | Método | URL                                      |
|------------------------|--------|------------------------------------------|
| Listar todos           | GET    | `/api/administradores`                   |
| Detalle por ID         | GET    | `/api/administradores/{id}`              |
| Crear                  | POST   | `/api/administradores`                   |
| Modificar              | PUT    | `/api/administradores/{id}`              |
| Eliminar               | DELETE | `/api/administradores/{id}`              |

### 👥 Clientes
| Acción                  | Método | URL                                      |
|------------------------|--------|------------------------------------------|
| Listar todos           | GET    | `/api/clientes`                          |
| Detalle por ID         | GET    | `/api/clientes/{id}`                     |
| Crear                  | POST   | `/api/clientes`                          |
| Modificar              | PUT    | `/api/clientes/{id}`                     |
| Eliminar               | DELETE | `/api/clientes/{id}`                     |

### 🧑‍🔧 Empleados
| Acción                  | Método | URL                                      |
|------------------------|--------|------------------------------------------|
| Listar todos           | GET    | `/api/empleados`                         |
| Detalle por ID         | GET    | `/api/empleados/{id}`                    |
| Crear                  | POST   | `/api/empleados`                         |
| Modificar              | PUT    | `/api/empleados/{id}`                    |
| Eliminar               | DELETE | `/api/empleados/{id}`                    |

### 👨‍💼 Gerentes
| Acción                  | Método | URL                                      |
|------------------------|--------|------------------------------------------|
| Listar todos           | GET    | `/api/gerentes`                          |
| Detalle por ID         | GET    | `/api/gerentes/{id}`                     |
| Crear                  | POST   | `/api/gerentes`                          |
| Modificar              | PUT    | `/api/gerentes/{id}`                     |
| Eliminar               | DELETE | `/api/gerentes/{id}`                     |

> 🔎 Documentación interactiva (si está habilitada): [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 📚 Ejemplos rápidos (cURL)

Listar productos:
```bash
curl -X GET http://localhost:8080/api/productos
```

Crear un producto (JSON de ejemplo):
```bash
curl -X POST http://localhost:8080/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Perfume Aurora","precio":19990,"stock":25}'
```

---

## 🧭 Funcionalidades principales

- ✅ Vistas HTML para roles clave: Administrador, Cliente, Empleado y Gerente
- ✅ CRUD de Permisos, Productos, Administradores, Clientes, Empleados y Gerentes
- ✅ API REST organizada por recursos
- 🚧 Validaciones y mejoras de UX en formularios (en progreso)
- 🚧 Documentación Swagger y pruebas automatizadas (en progreso)

---

## 🪄 Próximos pasos

- 🔐 Autenticación/autorización por roles
- 🧪 Pruebas unitarias e integración
- 🧾 Documentación OpenAPI/Swagger completa
- 🐳 Contenerización con Docker y perfiles por entorno
- 🗄️ Migraciones de base de datos (Flyway/Liquibase)

---

## 👥 Autor

| Nombre        | Rol                     | Contacto                                  |
|---------------|-------------------------|-------------------------------------------|
| **iggn00**    | Desarrollador FullStack | [@iggn00](https://github.com/iggn00)      |

---

## 🪶 Nota final

<p align="center">
  <b>“Fragancias que inspiran, tecnología que organiza.”</b>
</p>
