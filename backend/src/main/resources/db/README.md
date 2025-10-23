# 📁 Scripts de Base de Datos

## Archivo Principal

### `init.sql`
**Script único y completo** para inicializar la base de datos del sistema Dulce Vida.

#### Características:
- ✅ **Idempotente** - Puede ejecutarse múltiples veces sin errores
- ✅ **Auto-limpieza** - Elimina tablas viejas automáticamente
- ✅ **Bien documentado** - Comentarios detallados en cada sección
- ✅ **Datos iniciales** - Incluye categorías, productos y usuario admin
- ✅ **Verificación integrada** - Muestra resumen al finalizar

#### Contenido:
1. Configuración inicial (DB, charset, timezone)
2. Eliminación de tablas existentes
3. Creación de 7 tablas con constraints e índices
4. Inserción de 5 categorías
5. Inserción de 15 productos
6. Inserción de usuario administrador
7. Verificación y mensaje de éxito

#### Cómo ejecutar:

**MySQL Workbench:**
```
File → Open SQL Script → Seleccionar init.sql → Execute (⚡)
```

**Línea de comandos:**
```bash
mysql -u root -p < init.sql
```

**PowerShell:**
```powershell
Get-Content init.sql | mysql -u root -p
```

---

## 📊 Estructura de la Base de Datos

```
dulcevidadb
├── Usuario           (Usuarios del sistema)
├── Categorias        (Categorías de productos)
├── Productos         (Catálogo de productos)
├── Clientes          (Información de clientes)
├── Pedidos           (Pedidos/Carrito)
├── Detalle_Pedido    (Items de cada pedido)
└── Contactos         (Mensajes de contacto)
```

---

## 🔐 Credenciales por Defecto

**Usuario Administrador:**
- Email: `admin@dulcevida.cl`
- Password: `admin123`
- Rol: `ADMINISTRADOR`

---

## 📝 Notas Importantes

- La tabla se llama **`Categorias`** (plural) para coincidir con la entidad JPA
- Si existía una tabla `Categoria` (singular), será eliminada automáticamente
- Los INSERT usan `ON DUPLICATE KEY UPDATE` para evitar duplicados
- Todas las tablas usan `ENGINE=InnoDB` y charset `utf8mb4`

---

**Versión:** 2.0  
**Última actualización:** 23/10/2025
