-- -----------------------------------------------------
-- Tabla `Usuario`: Para el inicio de sesión del administrador
-- Solo habrá un usuario, el dueño de la pastelería.
-- -----------------------------------------------------
USE `DulceVidaDB`;

CREATE TABLE IF NOT EXISTS `Usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- La contraseña debe guardarse encriptada
  `rol` VARCHAR(45) NOT NULL DEFAULT 'ADMINISTRADOR',
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB;
