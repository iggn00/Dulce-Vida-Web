-- Seed adicional para datos de prueba extendidos
USE dulcevidadb;

-- Usuarios demo adicionales (contraseñas deben ser hasheadas fuera de este script si seguridad estricta)
INSERT IGNORE INTO Usuario (nombre,email,password,rol,estado,rut,dv,region,comuna) VALUES
 ('Cliente Demo','cliente@demo.cl','$2a$11$u9q1xEw1Y4G9UO1O/77hLuNqjYqSdz8CA0nV..OZXS6jttuPAo9l6','USUARIO','activo','22222222','5','Región Metropolitana de Santiago','Maipú');

-- Categoría y producto extra
INSERT IGNORE INTO Categorias (nombre, descripcion) VALUES ('Brownies','Brownies artesanales');
INSERT IGNORE INTO Productos (nombre, descripcion, precio, stock, estado, id_categoria, imagen_url, ingredientes) VALUES
 ('Brownie Nuez','Brownie húmedo con nueces',3490,25,'disponible',(SELECT id_categoria FROM Categorias WHERE nombre='Brownies'),NULL,'Harina,cacao,nueces,chocolate');

-- Verificación rápida
SELECT COUNT(*) AS usuarios FROM Usuario;
SELECT COUNT(*) AS productos FROM Productos;
