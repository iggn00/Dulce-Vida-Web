-- -----------------------------------------------------
-- Datos de prueba / seeds
-- Ejecutar después de crear las tablas
-- -----------------------------------------------------
USE `DulceVidaDB`;

-- Usuario administrador (recuerda encriptar la contraseña en tu aplicación)
INSERT INTO `Usuario` (`nombre`, `email`, `password`) VALUES ('Dueña Pastelería', 'admin@dulcevida.cl', 'admin123');

-- Categorías de productos
INSERT INTO `Categorias` (`nombre`, `descripcion`) VALUES
('Tortas', 'Tortas personalizadas para toda ocasión.'),
('Pasteles', 'Porciones individuales de deliciosos pasteles.'),
('Galletas', 'Galletas artesanales con distintos sabores.'),
('Cupcakes', 'Cupcakes decorados y rellenos.'),
('Postres fríos', 'Postres para disfrutar bien helados.');

-- Productos de ejemplo
INSERT INTO `Productos` (`nombre`, `descripcion`, `precio`, `stock`, `imagen_url`, `id_categoria`) VALUES
('Torta de Chocolate Intenso', 'Bizcocho de chocolate húmedo relleno de manjar y cubierto con ganache.', 25000, 10, 'url_imagen_torta_choco.jpg', 1),
('Pie de Limón', 'Clásico pie de limón con base de galleta y merengue suizo.', 12000, 15, 'url_imagen_pie.jpg', 1),
('Cupcake de Vainilla', 'Cupcake de vainilla con frosting de queso crema y chispas de colores.', 1500, 30, 'url_imagen_cupcake.jpg', 4),
('Galletas de Avena y Miel', 'Pack de 6 galletas de avena y miel, crujientes y saludables.', 3500, 40, 'url_imagen_galletas.jpg', 3),
('Cheesecake de Frutos Rojos', 'Suave cheesecake sobre una base de galleta, cubierto con mermelada casera de frutos rojos.', 18000, 12, 'url_imagen_cheesecake.jpg', 5);
