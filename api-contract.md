# Contrato de la API — TechStore

Base URL en desarrollo (dentro de XAMPP htdocs): `http://localhost/Tienda en Linea - Proyecto Final/tienda-online/api/`

| Método | Endpoint | Operación | Estado |
|--------|----------|-----------|--------|
| GET | `/api/productos.php` | Consultar todos los productos | ✅ Implementado |
| GET | `/api/productos.php?id={id}` | Consultar un producto | ✅ Implementado |
| POST | `/api/productos.php` | Crear producto | ✅ Implementado |
| PUT | `/api/productos.php?id={id}` | Actualizar producto | ✅ Implementado |
| DELETE | `/api/productos.php?id={id}` | Eliminar producto | ✅ Implementado |
| GET | `/api/categorias.php` | Consultar categorías | ✅ Implementado |
| POST | `/api/pedidos.php` | Crear pedido | ⏳ Pendiente (backend) — RF11, RF13 |
| POST | `/api/auth.php` | Iniciar sesión (correo + password) | ⏳ Pendiente (backend) — RF02. El frontend ya envía `{correo, password}` y espera 200/401 |
| POST | `/api/usuarios.php` | Registrar usuario | ⏳ Pendiente (backend) — RF01. El frontend ya envía `{nombre, apellido, correo, password, telefono, direccion}` |
| GET/POST/PUT/DELETE | `/api/categorias.php` | CRUD de categorías | ⏳ Pendiente (backend) — RF17, hoy solo tiene GET |
| GET/POST/PUT/DELETE | `/api/usuarios.php` | CRUD de usuarios (admin) | ⏳ Pendiente (backend) — RF18 |

## Ejemplo de respuesta — GET /api/productos.php

```json
[
  {
    "id_producto": 1,
    "id_categoria": 1,
    "nombre": "Celular Galaxy A54",
    "descripcion": "Pantalla 6.4\", 128GB, cámara triple",
    "precio": "2499.00",
    "cantidad": 15,
    "imagen": "galaxy_a54.jpg",
    "estado": "activo"
  }
]
```

## Convenciones

- Todas las respuestas son JSON.
- Los errores devuelven `{ "error": "mensaje" }` con el código HTTP correspondiente (404, 405, 500).
- Los endpoints de escritura (POST/PUT) esperan el cuerpo como JSON (`Content-Type: application/json`).

## Frontend — completo

Todas las vistas de cliente (inicio, catálogo con búsqueda/filtros, detalle de producto, carrito) y el panel de administración de productos ya están implementados en HTML/CSS/JS y consumen la API de arriba. El carrito usa `localStorage` mientras no exista sesión de backend; al finalizar compra, el botón queda listo para conectarse a `POST /api/pedidos.php` en cuanto ese endpoint exista (ver `assets/js/carrito.js`).

Lo que falta es 100% backend (PHP/MySQL): completar `model/Usuario.php`, `model/Pedido.php`, sus controladores, y los endpoints marcados como pendientes arriba.
