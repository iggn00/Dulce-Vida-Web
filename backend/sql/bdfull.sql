-- Reinicio completo de la base de datos (¡ATENCIÓN! Esto eliminará todos los datos previos)
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `dulcevidadb`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE DATABASE IF NOT EXISTS `dulcevidadb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE `dulcevidadb`;

CREATE TABLE IF NOT EXISTS `Usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `rol` VARCHAR(45) NOT NULL DEFAULT 'USUARIO',
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Categorias` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  PRIMARY KEY (`id_categoria`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Productos` (
  `id_producto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL,
  `imagen_url` VARCHAR(255) NULL,
  `ingredientes` TEXT NULL,
  `estado` ENUM('disponible', 'agotado') NOT NULL DEFAULT 'disponible',
  `id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_producto`),
  INDEX `fk_Productos_Categorias_idx` (`id_categoria` ASC),
  CONSTRAINT `fk_Productos_Categorias`
    FOREIGN KEY (`id_categoria`)
    REFERENCES `Categorias` (`id_categoria`)
    ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Clientes` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NULL,
  PRIMARY KEY (`id_cliente`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Pedidos` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `fecha_pedido` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_cliente` INT NOT NULL,
  `direccion_entrega` VARCHAR(255) NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `estado` ENUM('pendiente', 'en_preparacion', 'en_camino', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id_pedido`),
  INDEX `fk_Pedidos_Clientes_idx` (`id_cliente` ASC),
  CONSTRAINT `fk_Pedidos_Clientes`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `Clientes` (`id_cliente`)
    ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Detalle_Pedido` (
  `id_detalle` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` INT NOT NULL,
  `id_producto` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  INDEX `fk_Detalle_Pedido_Pedidos_idx` (`id_pedido` ASC),
  INDEX `fk_Detalle_Pedido_Productos_idx` (`id_producto` ASC),
  CONSTRAINT `fk_Detalle_Pedido_Pedidos`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `Pedidos` (`id_pedido`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Detalle_Pedido_Productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `Productos` (`id_producto`)
    ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;


-- Usuario admin inicial (con rol explícito)
INSERT INTO `Usuario` (`nombre`, `email`, `password`, `rol`) VALUES ('Dueña Pastelería', 'admin@dulcevida.cl', 'admin123', 'ADMINISTRADOR');


INSERT INTO `Categorias` (`nombre`, `descripcion`) VALUES
('Tortas', 'Tortas personalizadas para toda ocasión.'),
('Pasteles', 'Porciones individuales de deliciosos pasteles.'),
('Galletas', 'Galletas artesanales con distintos sabores.'),
('Cupcakes', 'Cupcakes decorados y rellenos.'),
('Postres fríos', 'Postres para disfrutar bien helados.');

INSERT INTO `Productos` (`nombre`, `descripcion`, `precio`, `stock`, `estado`, `imagen_url`, `ingredientes`, `id_categoria`) VALUES
('Torta de Chocolate Intenso', 'Bizcocho de chocolate húmedo relleno de manjar y cubierto con ganache.', 25000, 10, 'disponible', 'url_imagen_torta_choco.jpg', 'Harina, huevos, chocolate semi-amargo, manjar, mantequilla, azúcar, cacao en polvo', 1),
('Pie de Limón', 'Clásico pie de limón con base de galleta y merengue suizo.', 12000, 15, 'disponible', 'url_imagen_pie.jpg', 'Galletas de vainilla, mantequilla, limones frescos, huevos, leche condensada, azúcar', 1),
('Cupcake de Vainilla', 'Cupcake de vainilla con frosting de queso crema y chispas de colores.', 1500, 30, 'disponible', 'url_imagen_cupcake.jpg', 'Harina, huevos, mantequilla, azúcar, vainilla, queso crema, chispas de colores', 4),
('Galletas de Avena y Miel', 'Pack de 6 galletas de avena y miel, crujientes y saludables.', 3500, 40, 'agotado', 'url_imagen_galletas.jpg', 'Avena integral, miel de abeja, mantequilla, harina integral, canela, nueces', 3),
('Cheesecake de Frutos Rojos', 'Suave cheesecake sobre una base de galleta, cubierto con mermelada casera de frutos rojos.', 18000, 12, 'agotado', 'url_imagen_cheesecake.jpg', 'Queso crema, galletas Graham, fresas, frambuesas, arándanos, azúcar, crema de leche', 5);

-- Formulario de contacto: tabla para almacenar envíos desde la web
CREATE TABLE IF NOT EXISTS `Contactos` (
  `id_contacto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `asunto` VARCHAR(200) NULL,
  `mensaje` TEXT NOT NULL,
  `fecha_envio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_contacto`)
) ENGINE=InnoDB;

INSERT INTO `Contactos` (`nombre`, `email`, `asunto`, `mensaje`) VALUES (
  'Cliente Demo', 'cliente@correo.com', 'Consulta de ejemplo', 'Hola, me interesa cotizar una torta personalizada.'
);

