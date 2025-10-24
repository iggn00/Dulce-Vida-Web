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

---

## 🔄 Migraciones recientes

### v2.1 – Campos RUT/DV, Región y Comuna en Usuario

Se agregaron los campos chilenos al registro de usuario:
- `rut` (solo dígitos, sin puntos ni guion)
- `dv` (dígito verificador: 1–9 o K)
- `region`
- `comuna`

También se añadió la restricción de unicidad compuesta `UNIQUE (rut, dv)`.

Si ya tienes la base creada y no quieres recrearla, puedes aplicar esta migración manualmente:

```sql
ALTER TABLE Usuario
	ADD COLUMN rut VARCHAR(12) NOT NULL,
	ADD COLUMN dv CHAR(1) NOT NULL,
	ADD COLUMN region VARCHAR(100) NOT NULL,
	ADD COLUMN comuna VARCHAR(100) NOT NULL;

-- Normaliza valores iniciales de ejemplo para cuentas existentes (ajusta según tu data)
UPDATE Usuario SET rut = '11111111', dv = 'K', region = 'Región Metropolitana de Santiago', comuna = 'Santiago' WHERE rut IS NULL OR rut = '';

-- Restringe DV a los valores permitidos y agrega unicidad
ALTER TABLE Usuario
	ADD CONSTRAINT chk_usuario_dv CHECK (dv IN ('1','2','3','4','5','6','7','8','9','K')),
	ADD CONSTRAINT uk_usuario_rut_dv UNIQUE (rut, dv);
```

> Nota: Si tu servidor MySQL no soporta CHECK, omite la línea del CHECK y valida a nivel de aplicación (ya está implementado en el backend).

---

**Versión:** 2.1  
**Última actualización:** 24/10/2025
