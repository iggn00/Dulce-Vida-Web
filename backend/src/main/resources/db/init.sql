-- =====================================================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS - DULCE VIDA
-- =====================================================================================================
-- Descripción: Script completo para crear y poblar la base de datos del sistema de pastelería
-- Autor: Sistema Dulce Vida
-- Fecha: 2025-10-23
-- Versión: 2.0
-- =====================================================================================================

-- -----------------------------------------------------------------------------------------------------
-- 1. CONFIGURACIÓN INICIAL
-- -----------------------------------------------------------------------------------------------------

-- Crear base de datos (si no existe) con codificación UTF-8
CREATE DATABASE IF NOT EXISTS dulcevidadb 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE dulcevidadb;

-- Configurar zona horaria
SET time_zone = '-03:00';

-- -----------------------------------------------------------------------------------------------------
-- 2. ELIMINACIÓN DE TABLAS EXISTENTES (en orden correcto por dependencias)
-- -----------------------------------------------------------------------------------------------------

-- Eliminar tablas dependientes primero
DROP TABLE IF EXISTS Detalle_Pedido;
DROP TABLE IF EXISTS Pedidos;
DROP TABLE IF EXISTS Clientes;
DROP TABLE IF EXISTS Contactos;

-- Eliminar tablas principales
DROP TABLE IF EXISTS Productos;
DROP TABLE IF EXISTS Categorias;
DROP TABLE IF EXISTS Categoria;  -- Eliminar tabla antigua si existe (singular)
DROP TABLE IF EXISTS Usuario;

-- -----------------------------------------------------------------------------------------------------
-- 3. CREACIÓN DE TABLAS
-- -----------------------------------------------------------------------------------------------------

-- Tabla: Usuario
-- Descripción: Almacena usuarios del sistema (administradores y clientes)
CREATE TABLE Usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMINISTRADOR', 'USUARIO')),
  estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Categorias
-- Descripción: Categorías de productos (Tortas, Galletas, etc.)
CREATE TABLE Categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Productos
-- Descripción: Catálogo de productos de la pastelería
CREATE TABLE Productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(1000) NOT NULL,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'agotado')),
  id_categoria INT NOT NULL,
  imagen_url VARCHAR(255),
  ingredientes TEXT,
  CONSTRAINT fk_productos_categoria 
    FOREIGN KEY (id_categoria) 
    REFERENCES Categorias(id_categoria)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_nombre (nombre),
  INDEX idx_estado (estado),
  INDEX idx_categoria (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Clientes
-- Descripción: Información de clientes (puede generarse automáticamente desde Usuario)
CREATE TABLE Clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Pedidos
-- Descripción: Pedidos realizados por clientes (incluye carrito temporal)
CREATE TABLE Pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado')),
  total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  direccion_entrega VARCHAR(255),
  CONSTRAINT fk_pedidos_cliente 
    FOREIGN KEY (id_cliente) 
    REFERENCES Clientes(id_cliente)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_cliente (id_cliente),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Detalle_Pedido
-- Descripción: Líneas de detalle de cada pedido (items del carrito)
CREATE TABLE Detalle_Pedido (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  CONSTRAINT fk_detalle_pedido 
    FOREIGN KEY (id_pedido) 
    REFERENCES Pedidos(id_pedido)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_detalle_producto 
    FOREIGN KEY (id_producto) 
    REFERENCES Productos(id_producto)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_pedido (id_pedido),
  INDEX idx_producto (id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Contactos
-- Descripción: Mensajes de contacto enviados desde el formulario web
CREATE TABLE Contactos (
  id_contacto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  mensaje TEXT NOT NULL,
  fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondido', 'archivado')),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------------------------------
-- 4. DATOS INICIALES - CATEGORÍAS
-- -----------------------------------------------------------------------------------------------------

INSERT INTO Categorias (nombre, descripcion) VALUES
  ('Tortas', 'Tortas para toda ocasión'),
  ('Galletas', 'Galletas artesanales y cookies'),
  ('Pasteles', 'Pasteles individuales y familiares'),
  ('Cheesecakes', 'Cheesecakes cremosos y deliciosos'),
  ('Macarons', 'Macarons franceses de diferentes sabores')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- -----------------------------------------------------------------------------------------------------
-- 5. DATOS INICIALES - PRODUCTOS
-- -----------------------------------------------------------------------------------------------------

-- Productos de categoría: TORTAS
INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes) VALUES
  ('Torta Chocolate Clásica', 
   'Bizcocho húmedo de chocolate con cobertura de ganache', 
   12990.00, 10, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Tortas'),
   NULL,
   'Harina, cacao, huevos, mantequilla, azúcar, chocolate'),
  
  ('Torta Tres Leches', 
   'Clásico latino con tres tipos de leche', 
   11990.00, 8, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Tortas'),
   NULL,
   'Harina, huevos, leche condensada, leche evaporada, crema de leche'),
  
  ('Torta Red Velvet', 
   'Torta roja aterciopelada con crema de queso', 
   13990.00, 5, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Tortas'),
   NULL,
   'Harina, cacao, colorante rojo, queso crema, buttermilk')
ON DUPLICATE KEY UPDATE stock = VALUES(stock);

-- Productos de categoría: GALLETAS
INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes) VALUES
  ('Cookies Chips Chocolate', 
   'Galletas crujientes con chispas de chocolate', 
   3990.00, 30, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Galletas'),
   NULL,
   'Harina, mantequilla, azúcar, chips de chocolate, vainilla'),
  
  ('Cookies Avena Pasas', 
   'Galletas de avena con pasas y canela', 
   3490.00, 20, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Galletas'),
   NULL,
   'Avena, harina integral, azúcar morena, pasas, canela'),
  
  ('Cookies Mantequilla', 
   'Clásicas galletas mantecosas', 
   2990.00, 25, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Galletas'),
   NULL,
   'Harina, mantequilla, azúcar, esencia de vainilla')
ON DUPLICATE KEY UPDATE stock = VALUES(stock);

-- Productos de categoría: PASTELES
INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes) VALUES
  ('Pastel de Frutas', 
   'Pastel con crema y frutas de estación', 
   6990.00, 12, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
   NULL,
   'Harina, frutas frescas, crema chantilly, bizcocho'),
  
  ('Pastel Mil Hojas', 
   'Clásico chileno con manjar', 
   8990.00, 7, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
   NULL,
   'Masa de hojaldre, manjar, azúcar flor'),
  
  ('Pastel Zanahoria', 
   'Pastel húmedo especiado con frosting', 
   7990.00, 9, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
   NULL,
   'Zanahoria, harina, nueces, especias, queso crema')
ON DUPLICATE KEY UPDATE stock = VALUES(stock);

-- Productos de categoría: CHEESECAKES
INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes) VALUES
  ('Cheesecake Frutilla', 
   'Cheesecake cremoso con salsa de frutillas', 
   9990.00, 6, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Cheesecakes'),
   NULL,
   'Queso crema, frutillas frescas, galletas, mantequilla'),
  
  ('Cheesecake Maracuyá', 
   'Cheesecake con toque tropical', 
   9990.00, 4, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Cheesecakes'),
   NULL,
   'Queso crema, pulpa de maracuyá, galletas, gelatina'),
  
  ('Cheesecake Oreo', 
   'Para los amantes del chocolate', 
   10490.00, 3, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Cheesecakes'),
   NULL,
   'Queso crema, galletas Oreo, mantequilla, chocolate')
ON DUPLICATE KEY UPDATE stock = VALUES(stock);

-- Productos de categoría: MACARONS
INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes) VALUES
  ('Macarons Mix', 
   'Caja surtida de 12 macarons de diferentes sabores', 
   8990.00, 15, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Macarons'),
   NULL,
   'Clara de huevo, azúcar flor, almendra molida, colorantes'),
  
  ('Macarons Vainilla', 
   'Caja de 6 macarons sabor vainilla', 
   7990.00, 18, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Macarons'),
   NULL,
   'Clara de huevo, azúcar flor, almendra, vainilla natural'),
  
  ('Macarons Frambuesa', 
   'Caja de 6 macarons sabor frambuesa', 
   7990.00, 16, 'disponible',
   (SELECT id_categoria FROM Categorias WHERE nombre = 'Macarons'),
   NULL,
   'Clara de huevo, azúcar flor, almendra, frambuesa deshidratada')
ON DUPLICATE KEY UPDATE stock = VALUES(stock);

-- -----------------------------------------------------------------------------------------------------
-- 6. DATOS INICIALES - USUARIOS
-- -----------------------------------------------------------------------------------------------------

-- Usuario administrador por defecto
INSERT INTO Usuario (nombre, email, password, rol, estado) VALUES
  ('Administrador', 'admin@dulcevida.cl', 'admin123', 'ADMINISTRADOR', 'activo')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- -----------------------------------------------------------------------------------------------------
-- 7. VERIFICACIÓN Y MENSAJES FINALES
-- -----------------------------------------------------------------------------------------------------

-- Mostrar resumen de datos insertados
SELECT 
  (SELECT COUNT(*) FROM Categorias) AS 'Categorías',
  (SELECT COUNT(*) FROM Productos) AS 'Productos',
  (SELECT COUNT(*) FROM Usuario) AS 'Usuarios';

-- Mensaje de éxito
SELECT '✓ Base de datos inicializada correctamente' AS 'ESTADO';

-- ===================================================================================================== 
-- FIN DEL SCRIPT
-- =====================================================================================================
