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
| POST | `/api/auth.php` | Iniciar sesión (correo + password), inicia sesión PHP | ✅ Implementado — RF02 |
| GET | `/api/auth.php` | Consultar el usuario de la sesión activa | ✅ Implementado — RF02 |
| DELETE | `/api/auth.php` | Cerrar sesión | ✅ Implementado — RF02 |
| POST | `/api/usuarios.php` | Registrar usuario (público) | ✅ Implementado — RF01 |
| GET | `/api/usuarios.php` | Listar/consultar usuarios (solo administradores) | ✅ Implementado — RF18 |
| PUT | `/api/usuarios.php?id={id}` | Actualizar usuario (solo administradores) | ✅ Implementado — RF18 |
| DELETE | `/api/usuarios.php?id={id}` | Eliminar usuario (solo administradores) | ✅ Implementado — RF18 |
| POST | `/api/categorias.php` | Crear categoría | ✅ Implementado — RF17 |
| PUT | `/api/categorias.php?id={id}` | Actualizar categoría | ✅ Implementado — RF17 |
| DELETE | `/api/categorias.php?id={id}` | Eliminar categoría | ✅ Implementado — RF17 |

Nota: `pedidos`, `resenas` y `wishlist` siguen recibiendo `id_usuario` directamente en el cuerpo/query en vez de tomarlo de `$_SESSION['id_usuario']`. Ahora que el login existe, conviene migrarlos a la sesión (pendiente, no incluido en este cambio para no tocar flujos de carrito/checkout ya probados).

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

Todas las vistas de cliente (inicio, catálogo con búsqueda/filtros, detalle de producto, carrito) y el panel de administración (productos, categorías y usuarios) ya están implementados en HTML/CSS/JS y consumen la API de arriba. El carrito usa `localStorage` mientras el checkout no esté conectado a `POST /api/pedidos.php` (ver `assets/js/carrito.js`).

## Pendiente

- Conectar el botón de checkout del carrito a `POST /api/pedidos.php` usando `$_SESSION['id_usuario']` en vez de pedirlo al cliente.
- Migrar `pedidos`, `resenas` y `wishlist` para tomar `id_usuario` de la sesión en vez de recibirlo en la petición.
- RF03: recuperación de contraseña (no implementada).
