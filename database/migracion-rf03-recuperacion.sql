-- Migración RF03 (recuperar contraseña) para una base tienda_online ya existente.
-- Si la base se crea desde cero con techstore.sql no hace falta ejecutar este archivo.

USE tienda_online;

-- RF03: tokens para recuperar la contraseña (solo se guarda el hash SHA-256 del token)
CREATE TABLE recuperaciones_password (
    id_recuperacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expira DATETIME NOT NULL,
    usado TINYINT(1) NOT NULL DEFAULT 0,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
