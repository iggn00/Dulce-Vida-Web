CREATE DATABASE IF NOT EXISTS dulcevidadb 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;


USE dulcevidadb;


SET time_zone = '-03:00';






DROP TABLE IF EXISTS Detalle_Pedido;
DROP TABLE IF EXISTS Pedidos;
DROP TABLE IF EXISTS Clientes;
DROP TABLE IF EXISTS Contactos;


DROP TABLE IF EXISTS Productos;
DROP TABLE IF EXISTS Categorias;
DROP TABLE IF EXISTS Categoria;  
DROP TABLE IF EXISTS Usuario;







CREATE TABLE Usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMINISTRADOR', 'USUARIO')),
  estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  rut VARCHAR(12) NOT NULL,
  dv CHAR(1) NOT NULL CHECK (dv IN ('1','2','3','4','5','6','7','8','9','K')),
  region VARCHAR(100) NOT NULL,
  comuna VARCHAR(100) NOT NULL,
  UNIQUE KEY uk_rut_dv (rut, dv),
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE Categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



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



CREATE TABLE Clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



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





INSERT INTO Categorias (nombre, descripcion) VALUES
  ('Tortas', 'Tortas para toda ocasión'),
  ('Galletas', 'Galletas artesanales y cookies'),
  ('Pasteles', 'Pasteles individuales y familiares'),
  ('Cheesecakes', 'Cheesecakes cremosos y deliciosos'),
  ('Macarons', 'Macarons franceses de diferentes sabores')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);






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






INSERT INTO Usuario (nombre, email, password, rol, estado, rut, dv, region, comuna) VALUES
  ('Administrador', 'admin@dulcevida.cl', 'admin123', 'ADMINISTRADOR', 'activo', '11111111', 'K', 'Región Metropolitana de Santiago', 'Santiago')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Actualizar password admin a hash BCrypt (costo 11) si sigue en texto plano
UPDATE Usuario SET password = '$2a$11$u9q1xEw1Y4G9UO1O/77hLuNqjYqSdz8CA0nV..OZXS6jttuPAo9l6' WHERE email='admin@dulcevida.cl' AND password='admin123';

-- Tablas adicionales (si no existen) para boletas y refresh tokens
CREATE TABLE IF NOT EXISTS Refresh_Token (
  id_refresh BIGINT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(200) NOT NULL UNIQUE,
  id_usuario INT NOT NULL,
  expira_en DATETIME NOT NULL,
  revocado TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_refresh_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Boleta (
  id_boleta INT AUTO_INCREMENT PRIMARY KEY,
  numero BIGINT UNIQUE,
  id_pedido INT NOT NULL,
  fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
  subtotal DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_boleta_pedido FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_numero (numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Detalle_Boleta (
  id_detalle_boleta INT AUTO_INCREMENT PRIMARY KEY,
  id_boleta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  total_linea DECIMAL(10,2) NOT NULL CHECK (total_linea >= 0),
  CONSTRAINT fk_detalle_boleta FOREIGN KEY (id_boleta) REFERENCES Boleta(id_boleta) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detalle_boleta_producto FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_boleta (id_boleta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos demo de boleta
INSERT IGNORE INTO Clientes (nombre,email) VALUES ('Cliente Demo','cliente@demo.cl');
INSERT IGNORE INTO Pedidos (id_cliente, estado, total) VALUES ((SELECT id_cliente FROM Clientes WHERE email='cliente@demo.cl'),'confirmado',19990);
SET @pid = (SELECT id_pedido FROM Pedidos ORDER BY id_pedido DESC LIMIT 1);
INSERT IGNORE INTO Boleta (numero,id_pedido,subtotal,iva,total) VALUES (1,@pid,16840,3200,20040);






SELECT 
  (SELECT COUNT(*) FROM Categorias) AS 'Categorías',
  (SELECT COUNT(*) FROM Productos) AS 'Productos',
  (SELECT COUNT(*) FROM Usuario) AS 'Usuarios';


SELECT '✓ Base de datos inicializada correctamente' AS 'ESTADO';




