CREATE DATABASE IF NOT EXISTS dulcevidadb 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE dulcevidadb;

SET time_zone = '-03:00';

DROP TABLE IF EXISTS Detalle_Boleta;
DROP TABLE IF EXISTS Boleta;
DROP TABLE IF EXISTS Refresh_Token;
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

INSERT INTO Productos (
    nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes
) VALUES
      ('Torta Chocolate Clásica',
       'Bizcocho húmedo de chocolate con relleno y cobertura de ganache de chocolate semiamargo.',
       13990.00, 8, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Tortas'),
       'img/prod/tortadech.png',
       'Harina, cacao, huevos, mantequilla, azúcar, chocolate semiamargo, crema'),

      ('Cheesecake de Frutilla',
       'Cheesecake cremoso sobre base de galletas, cubierto con salsa y trozos de frutilla.',
       10990.00, 6, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Cheesecakes'),
       'img/prod/cheesecakefut.png',
       'Queso crema, frutillas, galletas, mantequilla, azúcar, crema'),

      ('Brownie de Nuez',
       'Brownie intenso de chocolate con trozos de nuez, húmedo y fudgy.',
       3990.00, 24, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
       'img/prod/brownienuez.png',
       'Chocolate, mantequilla, huevos, azúcar, harina, nueces'),

      ('Tiramisú Clásico',
       'Postre italiano con capas de bizcochos remojados en café y crema de mascarpone.',
       9990.00, 5, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
       'img/prod/tiramisu.png',
       'Queso mascarpone, huevos, azúcar, café, bizcochos de soletilla, cacao'),

      ('Pie de Limón',
       'Pie con base de galleta, relleno cremoso y merengue italiano dorado.',
       9490.00, 8, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
       'img/prod/piedelimon.png',
       'Galletas, mantequilla, leche condensada, jugo de limón, huevos, azúcar'),

      ('Rolls de Canela',
       'Rolls esponjosos de canela con glaseado de vainilla.',
       6990.00, 10, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
       'img/prod/rolldecanela.png',
       'Harina, levadura, leche, mantequilla, azúcar, canela, vainilla'),

      ('Trenza de Hojaldre con Frutas',
       'Hojaldre crujiente relleno con crema pastelera y frutas.',
       7490.00, 8, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
       'img/prod/hojaldre.png',
       'Harina, mantequilla, crema pastelera, frutas frescas, azúcar'),

      ('Pastel de Chocolate Individual',
       'Pastel individual de chocolate con cobertura brillante.',
       3490.00, 20, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
       'img/prod/pastelch.png',
       'Harina, cacao, huevos, mantequilla, azúcar, chocolate'),

      ('Cupcakes Vainilla y Chocolate (6 unidades)',
       'Caja de 6 cupcakes con frosting cremoso.',
       5990.00, 18, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Pasteles'),
       'img/prod/cupcakes.png',
       'Harina, huevos, leche, mantequilla, azúcar, cacao, vainilla'),

      ('Cookies Chips de Chocolate (12 unidades)',
       'Galletas con muchas chispas de chocolate.',
       3990.00, 30, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Galletas'),
       'img/prod/cookies.png',
       'Harina, mantequilla, azúcar, huevos, chips de chocolate, vainilla'),

      ('Caja Macarons Mix (12 unidades)',
       'Surtido de macarons de sabores variados.',
       8990.00, 15, 'disponible',
       (SELECT id_categoria FROM Categorias WHERE nombre = 'Macarons'),
       'img/prod/macaronsmix.png',
       'Claras de huevo, azúcar flor, almendra molida, rellenos saborizados');

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

SELECT
    (SELECT COUNT(*) FROM Categorias) AS 'Categorías',
    (SELECT COUNT(*) FROM Productos) AS 'Productos',
    (SELECT COUNT(*) FROM Usuario) AS 'Usuarios';

SELECT '✓ Base de datos inicializada correctamente' AS 'ESTADO';
