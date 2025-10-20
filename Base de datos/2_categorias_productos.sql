-- -----------------------------------------------------
-- Tablas `Categorias` y `Productos`
-- -----------------------------------------------------
USE `DulceVidaDB`;

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
  `estado` ENUM('disponible', 'agotado') NOT NULL DEFAULT 'disponible',
  `id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_producto`),
  INDEX `fk_Productos_Categorias_idx` (`id_categoria` ASC),
  CONSTRAINT `fk_Productos_Categorias`
    FOREIGN KEY (`id_categoria`)
    REFERENCES `Categorias` (`id_categoria`)
    ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;
