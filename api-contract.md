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
| POST | `/api/pedidos.php` | Crear pedido (`{id_usuario, items:[{id_producto, cantidad}]}`) | ✅ Implementado — RF11 |
| GET | `/api/pedidos.php?id_usuario={id}` | Historial de pedidos del usuario | ✅ Implementado — RF12 |
| GET | `/api/pedidos.php?id={id}` | Detalle de un pedido con sus productos | ✅ Implementado — RF12 |
| PUT | `/api/pedidos.php?id={id}` | Actualizar estado del pedido (`{estado}`) | ✅ Implementado — RF13 |
| GET | `/api/resenas.php?id_producto={id}` | Listar reseñas y promedio de un producto | ✅ Implementado — RF14 |
| POST | `/api/resenas.php` | Crear reseña (`{id_usuario, id_producto, calificacion, comentario}`); requiere que el usuario haya comprado el producto | ✅ Implementado — RF07, RF14 |
| GET | `/api/wishlist.php?id_usuario={id}` | Listar lista de deseos del usuario | ✅ Implementado — RF15 |
| POST | `/api/wishlist.php` | Agregar producto a la lista de deseos (`{id_usuario, id_producto}`) | ✅ Implementado — RF15 |
| DELETE | `/api/wishlist.php?id_usuario={id}&id_producto={id}` | Quitar producto de la lista de deseos | ✅ Implementado — RF15 |
| POST | `/api/auth.php` | Iniciar sesión (correo + password) | ⏳ Pendiente (backend) — RF02. El frontend ya envía `{correo, password}` y espera 200/401 |
| POST | `/api/usuarios.php` | Registrar usuario | ⏳ Pendiente (backend) — RF01. El frontend ya envía `{nombre, apellido, correo, password, telefono, direccion}` |
| GET/POST/PUT/DELETE | `/api/categorias.php` | CRUD de categorías | ⏳ Pendiente (backend) — RF17, hoy solo tiene GET |
| GET/POST/PUT/DELETE | `/api/usuarios.php` | CRUD de usuarios (admin) | ⏳ Pendiente (backend) — RF18 |

Nota: como `auth.php`/sesiones (RF02) todavía no existen, `pedidos`, `resenas` y `wishlist` reciben `id_usuario` directamente en el cuerpo/query en vez de tomarlo de una sesión. Cuando se implemente el login, conviene reemplazar esos parámetros por `$_SESSION['id_usuario']`.

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

Lo que falta es 100% backend (PHP/MySQL): completar `model/Usuario.php` y los endpoints marcados como pendientes arriba (auth, registro y CRUD de usuarios/categorías). `model/Pedido.php`, `model/Resena.php` y `model/Wishlist.php` con sus controladores y endpoints ya están implementados.
