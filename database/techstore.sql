-- TechStore: Tienda en Línea de Productos de Tecnología
-- Modelo relacional (MySQL)

CREATE DATABASE IF NOT EXISTS tienda_online CHARACTER SET utf8mb4;
USE tienda_online;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    tipo_usuario ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE resenas (
    id_resena INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE wishlist (
    id_wishlist INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Datos de ejemplo

INSERT INTO categorias (nombre, descripcion) VALUES
('Celulares', 'Teléfonos inteligentes de distintas marcas'),
('Laptops', 'Computadoras portátiles para trabajo y gaming'),
('Audífonos', 'Audífonos con y sin cable'),
('Tablets', 'Tablets para trabajo y entretenimiento'),
('Smartwatches', 'Relojes inteligentes'),
('Accesorios', 'Cargadores, fundas, mouse, teclados y más');

INSERT INTO productos (id_categoria, nombre, descripcion, precio, cantidad, imagen, estado) VALUES
(1, 'Celular Galaxy A54', 'Pantalla 6.4", 128GB, cámara triple', 2499.00, 15, 'galaxy_a54.jpg', 'activo'),
(1, 'iPhone 13', '128GB, chip A15 Bionic', 5999.00, 8, 'iphone13.jpg', 'activo'),
(2, 'Laptop Lenovo IdeaPad 3', 'Ryzen 5, 8GB RAM, 512GB SSD', 3899.00, 10, 'lenovo_ideapad3.jpg', 'activo'),
(2, 'Laptop HP Pavilion Gaming', 'Core i5, 16GB RAM, RTX 3050', 6499.00, 5, 'hp_pavilion.jpg', 'activo'),
(3, 'Audífonos JBL Tune 510BT', 'Inalámbricos, Bluetooth 5.0', 249.00, 30, 'jbl_tune510.jpg', 'activo'),
(4, 'Tablet Samsung Galaxy Tab A9', '8.7", 64GB', 1199.00, 12, 'tab_a9.jpg', 'activo'),
(5, 'Smartwatch Xiaomi Mi Band 8', 'Monitor de ritmo cardiaco, notificaciones', 299.00, 20, 'miband8.jpg', 'activo'),
(6, 'Mouse Logitech M170', 'Inalámbrico, USB receptor', 89.00, 40, 'logitech_m170.jpg', 'activo'),
-- Celulares (id_categoria 1)
(1, 'iPhone 15', '128GB, chip A16 Bionic, cámara de 48MP', 7499.00, 6, 'iphone15.jpg', 'activo'),
(1, 'Samsung Galaxy S23', '256GB, pantalla AMOLED 6.1", cámara triple', 6999.00, 7, 'galaxy_s23.jpg', 'activo'),
(1, 'Xiaomi Redmi Note 13', '256GB, pantalla AMOLED 120Hz', 1899.00, 18, 'redmi_note13.jpg', 'activo'),
(1, 'Motorola Edge 40', '256GB, carga rápida 68W', 3299.00, 10, 'moto_edge40.jpg', 'activo'),
(1, 'Samsung Galaxy A34', '128GB, pantalla Super AMOLED 6.6"', 2199.00, 14, 'galaxy_a34.jpg', 'activo'),
(1, 'Xiaomi Poco X6', '256GB, procesador Snapdragon', 2799.00, 12, 'poco_x6.jpg', 'activo'),
(1, 'iPhone SE (2022)', '128GB, chip A15 Bionic', 3799.00, 9, 'iphone_se.jpg', 'activo'),
(1, 'Huawei Nova 11', '256GB, cámara de 60MP', 3499.00, 8, 'huawei_nova11.jpg', 'activo'),
-- Laptops (id_categoria 2)
(2, 'MacBook Air M2', '8GB RAM, 256GB SSD, chip M2', 9999.00, 5, 'macbook_air_m2.jpg', 'activo'),
(2, 'Dell Inspiron 15', 'Core i5, 8GB RAM, 512GB SSD', 4299.00, 10, 'dell_inspiron15.jpg', 'activo'),
(2, 'Asus Vivobook 15', 'Core i3, 8GB RAM, 256GB SSD', 3299.00, 12, 'asus_vivobook15.jpg', 'activo'),
(2, 'Acer Aspire 5', 'Ryzen 5, 8GB RAM, 512GB SSD', 3799.00, 9, 'acer_aspire5.jpg', 'activo'),
(2, 'Lenovo ThinkPad E14', 'Core i7, 16GB RAM, 512GB SSD', 5999.00, 6, 'thinkpad_e14.jpg', 'activo'),
(2, 'HP Envy x360', 'Ryzen 7, 16GB RAM, pantalla táctil convertible', 6799.00, 5, 'hp_envy_x360.jpg', 'activo'),
(2, 'Asus ROG Strix G15', 'Core i7, 16GB RAM, RTX 4060', 9499.00, 4, 'asus_rog_strix.jpg', 'activo'),
(2, 'Dell XPS 13', 'Core i7, 16GB RAM, 512GB SSD, pantalla InfinityEdge', 8999.00, 5, 'dell_xps13.jpg', 'activo'),
-- Audífonos (id_categoria 3)
(3, 'Sony WH-1000XM4', 'Over-ear, cancelación de ruido activa', 1899.00, 10, 'sony_wh1000xm4.jpg', 'activo'),
(3, 'Apple AirPods Pro 2', 'Inalámbricos, cancelación de ruido activa', 1699.00, 15, 'airpods_pro2.jpg', 'activo'),
(3, 'Samsung Galaxy Buds2', 'Inalámbricos, estuche de carga', 599.00, 20, 'galaxy_buds2.jpg', 'activo'),
(3, 'Xiaomi Redmi Buds 4', 'Inalámbricos, resistentes al agua', 249.00, 25, 'redmi_buds4.jpg', 'activo'),
(3, 'JBL Tune 130NC', 'Inalámbricos, cancelación de ruido activa', 399.00, 18, 'jbl_tune130nc.jpg', 'activo'),
(3, 'Beats Studio Buds', 'Inalámbricos, cancelación de ruido activa', 899.00, 12, 'beats_studio_buds.jpg', 'activo'),
(3, 'Skullcandy Crusher', 'Over-ear, graves ajustables', 799.00, 10, 'skullcandy_crusher.jpg', 'activo'),
(3, 'Sony WF-C500', 'Inalámbricos, hasta 20h de batería', 399.00, 16, 'sony_wfc500.jpg', 'activo'),
(3, 'Logitech Zone 300', 'Con micrófono, ideal para videollamadas', 349.00, 14, 'logitech_zone300.jpg', 'activo'),
-- Tablets (id_categoria 4)
(4, 'iPad 10ma generación', '64GB, pantalla Liquid Retina 10.9"', 3499.00, 8, 'ipad_10gen.jpg', 'activo'),
(4, 'iPad Air M1', '64GB, chip M1, pantalla 10.9"', 5999.00, 5, 'ipad_air_m1.jpg', 'activo'),
(4, 'Lenovo Tab M10', '32GB, pantalla 10.1"', 899.00, 15, 'lenovo_tab_m10.jpg', 'activo'),
(4, 'Samsung Galaxy Tab S9', '128GB, pantalla AMOLED 11"', 5499.00, 6, 'galaxy_tab_s9.jpg', 'activo'),
(4, 'Xiaomi Pad 6', '128GB, pantalla 144Hz', 2299.00, 10, 'xiaomi_pad6.jpg', 'activo'),
(4, 'iPad Mini 6', '64GB, pantalla 8.3"', 4499.00, 6, 'ipad_mini6.jpg', 'activo'),
(4, 'Huawei MatePad 11', '128GB, pantalla 2.5K', 2799.00, 9, 'huawei_matepad11.jpg', 'activo'),
(4, 'Amazon Fire HD 10', '32GB, pantalla Full HD', 799.00, 20, 'fire_hd10.jpg', 'activo'),
(4, 'Samsung Galaxy Tab A8', '64GB, pantalla 10.5"', 1299.00, 14, 'galaxy_tab_a8.jpg', 'activo'),
-- Smartwatches (id_categoria 5)
(5, 'Apple Watch SE', 'GPS, caja de 40mm', 2999.00, 8, 'apple_watch_se.jpg', 'activo'),
(5, 'Samsung Galaxy Watch6', 'GPS, caja de 44mm, monitor de salud', 2299.00, 10, 'galaxy_watch6.jpg', 'activo'),
(5, 'Amazfit Bip 5', 'Pantalla 1.91", batería de larga duración', 399.00, 20, 'amazfit_bip5.jpg', 'activo'),
(5, 'Xiaomi Watch S1', 'GPS, monitor de oxígeno en sangre', 899.00, 12, 'xiaomi_watch_s1.jpg', 'activo'),
(5, 'Huawei Watch Fit 3', 'Pantalla AMOLED, hasta 10 días de batería', 699.00, 14, 'huawei_watch_fit3.jpg', 'activo'),
(5, 'Garmin Forerunner 55', 'GPS, orientado a corredores', 1499.00, 8, 'garmin_forerunner55.jpg', 'activo'),
(5, 'Apple Watch Series 9', 'GPS, caja de 45mm', 4299.00, 5, 'apple_watch_s9.jpg', 'activo'),
(5, 'Samsung Galaxy Watch FE', 'GPS, caja de 40mm', 1699.00, 9, 'galaxy_watch_fe.jpg', 'activo'),
(5, 'Amazfit GTS 4', 'Pantalla AMOLED, GPS integrado', 799.00, 11, 'amazfit_gts4.jpg', 'activo'),
-- Accesorios (id_categoria 6)
(6, 'Teclado Logitech K380', 'Bluetooth, multi-dispositivo', 249.00, 20, 'logitech_k380.jpg', 'activo'),
(6, 'Cargador Anker 20W', 'Carga rápida USB-C', 149.00, 30, 'anker_20w.jpg', 'activo'),
(6, 'Power Bank Xiaomi 10000mAh', 'Carga rápida, doble puerto USB', 199.00, 25, 'powerbank_xiaomi.jpg', 'activo'),
(6, 'Funda para iPhone 15', 'Silicona, protección antigolpes', 99.00, 40, 'funda_iphone15.jpg', 'activo'),
(6, 'Manos libres con micrófono', 'Con cable, conector 3.5mm', 59.00, 35, 'manos_libres.jpg', 'activo'),
(6, 'Mochila para laptop Targus', 'Hasta 15.6", resistente al agua', 349.00, 15, 'mochila_targus.jpg', 'activo'),
(6, 'Base refrigerante para laptop', 'Con ventiladores, hasta 17"', 199.00, 12, 'base_refrigerante.jpg', 'activo'),
(6, 'Cable USB-C a Lightning', '1 metro, carga rápida', 79.00, 40, 'cable_usbc_lightning.jpg', 'activo'),
(6, 'Hub USB-C multipuerto', '7 en 1, HDMI, USB 3.0, lector SD', 249.00, 18, 'hub_usbc.jpg', 'activo');

INSERT INTO usuarios (nombre, apellido, correo, password, telefono, direccion, tipo_usuario) VALUES
('Admin', 'Sistema', 'admin@techstore.com', '$2y$10$examplehashvalueaquiXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', '00000000', 'Oficina central', 'administrador');
