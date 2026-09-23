-- Migración RF13 (proceso de pago) para una base tienda_online ya existente.
-- Si la base se crea desde cero con techstore.sql no hace falta ejecutar este archivo.

USE tienda_online;

ALTER TABLE pedidos
    MODIFY estado ENUM('pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    ADD COLUMN metodo_pago ENUM('tarjeta', 'transferencia', 'contra_entrega') AFTER estado,
    ADD COLUMN referencia_pago VARCHAR(50) AFTER metodo_pago,
    ADD COLUMN direccion_envio VARCHAR(255) AFTER referencia_pago,
    ADD COLUMN telefono_contacto VARCHAR(20) AFTER direccion_envio;
