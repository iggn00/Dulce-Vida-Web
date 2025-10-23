-- Crear base de datos (si el usuario tiene permisos) y seleccionar
CREATE DATABASE IF NOT EXISTS dulcevidadb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dulcevidadb;

-- Tablas
CREATE TABLE IF NOT EXISTS Usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMINISTRADOR','USUARIO')),
  estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo','inactivo'))
);

CREATE TABLE IF NOT EXISTS Categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(1000) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible','agotado')),
  id_categoria INT NOT NULL,
  imagen_url VARCHAR(255),
  ingredientes TEXT,
  CONSTRAINT fk_productos_categoria FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
);

-- Categorías (idempotentes por nombre)
INSERT INTO Categoria (nombre)
SELECT 'Tortas' WHERE NOT EXISTS (SELECT 1 FROM Categoria WHERE nombre = 'Tortas');
INSERT INTO Categoria (nombre)
SELECT 'Galletas' WHERE NOT EXISTS (SELECT 1 FROM Categoria WHERE nombre = 'Galletas');
INSERT INTO Categoria (nombre)
SELECT 'Pasteles' WHERE NOT EXISTS (SELECT 1 FROM Categoria WHERE nombre = 'Pasteles');
INSERT INTO Categoria (nombre)
SELECT 'Cheesecakes' WHERE NOT EXISTS (SELECT 1 FROM Categoria WHERE nombre = 'Cheesecakes');
INSERT INTO Categoria (nombre)
SELECT 'Macarons' WHERE NOT EXISTS (SELECT 1 FROM Categoria WHERE nombre = 'Macarons');

-- Productos (idempotentes por nombre y referenciando categoría por nombre)
INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Torta Chocolate Clásica', 'Bizcocho húmedo de chocolate', 12990, 10, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Tortas'), NULL,
       'Harina, cacao, huevos, mantequilla'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Torta Chocolate Clásica');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Torta Tres Leches', 'Clásico latino', 11990, 8, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Tortas'), NULL,
       'Harina, huevos, leche, crema'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Torta Tres Leches');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Torta Red Velvet', 'Torta roja con crema', 13990, 5, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Tortas'), NULL,
       'Harina, cacao, colorante rojo, queso crema'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Torta Red Velvet');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Cookies Chips', 'Galletas con chispas de chocolate', 3990, 30, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Galletas'), NULL,
       'Harina, mantequilla, azúcar, chips chocolate'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Cookies Chips');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Cookies Avena', 'Galletas de avena', 3490, 20, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Galletas'), NULL,
       'Avena, harina, azúcar morena'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Cookies Avena');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Cookies Mantequilla', 'Clásicas de mantequilla', 2990, 25, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Galletas'), NULL,
       'Harina, mantequilla, azúcar'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Cookies Mantequilla');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Pastel de Frutas', 'Mixto de frutas', 6990, 12, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Pasteles'), NULL,
       'Harina, frutas de estación, crema'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Pastel de Frutas');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Pastel Mil Hojas', 'Clásico chileno', 8990, 7, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Pasteles'), NULL,
       'Harina, manjar, mantequilla'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Pastel Mil Hojas');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Pastel Zanahoria', 'Húmedo y especiado', 7990, 9, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Pasteles'), NULL,
       'Zanahoria, harina, nueces, especias'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Pastel Zanahoria');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Cheesecake Frutilla', 'Base de galletas y queso crema', 9990, 6, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Cheesecakes'), NULL,
       'Queso crema, frutillas, galletas'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Cheesecake Frutilla');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Cheesecake Maracuyá', 'Toque tropical', 9990, 4, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Cheesecakes'), NULL,
       'Queso crema, maracuyá, galletas'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Cheesecake Maracuyá');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Cheesecake Oreo', 'Para fans de chocolate', 10490, 3, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Cheesecakes'), NULL,
       'Queso crema, oreo, mantequilla'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Cheesecake Oreo');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Macarons Mix', 'Caja surtida', 8990, 15, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Macarons'), NULL,
       'Clara de huevo, azúcar, almendra'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Macarons Mix');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Macarons Vainilla', 'Sabor clásico', 7990, 18, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Macarons'), NULL,
       'Clara de huevo, azúcar, almendra, vainilla'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Macarons Vainilla');

INSERT INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes)
SELECT 'Macarons Frambuesa', 'Sabor frutal', 7990, 16, 'disponible',
       (SELECT id_categoria FROM Categoria WHERE nombre = 'Macarons'), NULL,
       'Clara de huevo, azúcar, almendra, frambuesa'
WHERE NOT EXISTS (SELECT 1 FROM Productos WHERE nombre = 'Macarons Frambuesa');

-- Usuario administrador por defecto (password sin encriptar por requerimiento)
INSERT INTO Usuario (nombre, email, password, rol, estado)
SELECT 'Administrador', 'admin@dulcevida.cl', 'admin123', 'ADMINISTRADOR', 'activo'
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE email = 'admin@dulcevida.cl');
