-- -----------------------------------------------------
-- Tablas `Clientes`, `Pedidos` y `Detalle_Pedido`
-- -----------------------------------------------------
USE `DulceVidaDB`;

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
