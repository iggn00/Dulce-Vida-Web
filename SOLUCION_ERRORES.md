# 🔧 Solución a los Errores de Base de Datos

## Problemas Identificados

### 1. ❌ EntityNotFoundException: Unable to find Categoria with id 1

**Causa:** 
- El script SQL creaba la tabla `Categoria` (singular)
- La entidad JPA esperaba `Categorias` (plural)
- Faltaba el campo `descripcion` en la tabla

### 2. ❌ IllegalStateException: No autenticado

**Causa:** 
- El controlador del carrito no manejaba adecuadamente usuarios no autenticados

---

## ✅ Cambios Realizados

### Archivos Modificados:

1. **`backend/src/main/resources/db/init.sql`** ⭐ ARCHIVO ÚNICO
   - ✅ Script completamente reescrito y estructurado profesionalmente
   - ✅ Tabla `Categorias` (plural) con campo `descripcion`
   - ✅ Todas las tablas con índices, constraints y ENGINE=InnoDB
   - ✅ Documentación completa con secciones numeradas
   - ✅ Datos iniciales organizados por categorías
   - ✅ Elimina automáticamente la tabla `Categoria` (singular) si existe
   - ✅ INSERT con ON DUPLICATE KEY UPDATE (idempotente)
   - ✅ Verificación final con resumen de datos

2. **`backend/src/main/java/com/dulcevida/backend/controlador/CarritoControlador.java`**
   - ✅ Agregado manejo de excepciones para usuarios no autenticados
   - ✅ Retorna HTTP 401 con mensaje JSON en lugar de error 500

---

## 📋 Pasos Para Aplicar la Solución

### ⚡ Solución Rápida (RECOMENDADO)

**Ejecuta el único script SQL necesario:**

#### Opción 1: MySQL Workbench
1. Abre MySQL Workbench
2. Conecta a tu servidor local
3. Ve a **File → Open SQL Script**
4. Selecciona: `backend/src/main/resources/db/init.sql`
5. Presiona el icono de rayo ⚡ (Execute)
6. Verifica el mensaje: `✓ Base de datos inicializada correctamente`

#### Opción 2: Línea de Comandos MySQL
```bash
mysql -u root -p < backend/src/main/resources/db/init.sql
```

#### Opción 3: PowerShell (si MySQL está en PATH)
```powershell
cd backend
Get-Content src/main/resources/db/init.sql | mysql -u root -p
```

### 🔄 Después de Ejecutar el Script

**Reinicia la aplicación Spring Boot:**
1. Detén la aplicación actual (Ctrl+C en terminal)
2. Ejecuta nuevamente desde Maven o IDE
3. La aplicación debe iniciar sin errores

---

## 🧪 Verificar que Funcione

### 1. Verifica las tablas en MySQL:
```sql
USE dulcevidadb;
SHOW TABLES;
```

**Resultado esperado:**
```
+----------------------+
| Tables_in_dulcevidadb|
+----------------------+
| Categorias           |  ← PLURAL ✓
| Clientes             |
| Contactos            |
| Detalle_Pedido       |
| Pedidos              |
| Productos            |
| Usuario              |
+----------------------+
```

### 2. Verifica los datos insertados:
```sql
SELECT * FROM Categorias;
-- Debe mostrar 5 categorías con descripción

SELECT COUNT(*) AS Total FROM Productos;
-- Debe mostrar 15 productos

SELECT nombre, rol FROM Usuario;
-- Debe mostrar el administrador
```

### 3. Prueba los endpoints:

**Productos (sin autenticación):**
```
GET http://localhost:8080/api/productos
```
✅ Debe retornar 15 productos sin errores

**Carrito (sin autenticación):**
```
GET http://localhost:8080/api/cart
```
✅ Debe retornar HTTP 401: `{"error": "Usuario no autenticado"}`

---

## 📊 Estructura del Script SQL Único

El archivo `init.sql` está organizado en **7 secciones**:

1. **Configuración Inicial** - Crear DB, seleccionar, configurar zona horaria
2. **Eliminación de Tablas** - Elimina tablas en orden correcto (incluye `Categoria` antigua)
3. **Creación de Tablas** - Todas las tablas con constraints, índices y comentarios
4. **Datos: Categorías** - 5 categorías con descripciones
5. **Datos: Productos** - 15 productos organizados por categoría
6. **Datos: Usuarios** - Usuario administrador por defecto
7. **Verificación** - Muestra resumen y mensaje de éxito

---

## 🎯 Ventajas de Este Script

✅ **Un solo archivo** - No necesitas múltiples scripts  
✅ **Idempotente** - Puedes ejecutarlo múltiples veces sin errores  
✅ **Bien documentado** - Comentarios claros en cada sección  
✅ **Profesional** - Incluye índices, constraints, ENGINE especificado  
✅ **Auto-limpieza** - Elimina tablas viejas automáticamente  
✅ **Verificación integrada** - Muestra resumen al finalizar  

---

## 💡 Características Técnicas

- **Encoding:** UTF-8 (utf8mb4_unicode_ci)
- **Engine:** InnoDB (transaccional)
- **Constraints:** Foreign Keys con CASCADE y RESTRICT
- **Índices:** En columnas frecuentemente consultadas
- **Validaciones:** CHECK constraints en estados y precios
- **Timezone:** Configurada para Chile (-03:00)

---

## 🆘 Si Persisten los Errores

1. **Verifica que solo exista la tabla `Categorias` (plural):**
   ```sql
   SHOW TABLES LIKE 'Categoria%';
   ```
   Solo debe aparecer `Categorias` (plural)

2. **Verifica la estructura de Categorias:**
   ```sql
   DESC Categorias;
   ```
   Debe incluir: id_categoria, nombre, descripcion

3. **Limpia la compilación de Maven:**
   ```bash
   cd backend
   mvn clean package
   ```

4. **Reinicia completamente la aplicación**

---

¡Con este único script SQL, tu aplicación está lista para funcionar! 🎉
