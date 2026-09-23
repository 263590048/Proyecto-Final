# Contrato de la API — TechStore

Base URL en desarrollo (dentro de XAMPP htdocs): `http://localhost/Tienda en Linea - Proyecto Final/tienda-online/api/`

| Método | Endpoint | Operación | Estado |
|--------|----------|-----------|--------|
| GET | `/api/productos.php` | Consultar todos los productos (público) | ✅ Implementado |
| GET | `/api/productos.php?id={id}` | Consultar un producto (público) | ✅ Implementado |
| POST | `/api/productos.php` | Crear producto (solo administradores) | ✅ Implementado — RF16 |
| PUT | `/api/productos.php?id={id}` | Actualizar producto (solo administradores) | ✅ Implementado — RF16 |
| DELETE | `/api/productos.php?id={id}` | Eliminar producto (solo administradores) | ✅ Implementado — RF16 |
| GET | `/api/categorias.php` | Consultar categorías (público) | ✅ Implementado |
| POST | `/api/pedidos.php` | Crear pedido (`{items:[{id_producto, cantidad}]}`); requiere sesión, `id_usuario` se toma de `$_SESSION` | ✅ Implementado — RF11 |
| GET | `/api/pedidos.php` | Historial de pedidos del usuario autenticado (requiere sesión) | ✅ Implementado — RF12 |
| GET | `/api/pedidos.php?todos=1` | Listado completo de pedidos, con datos del cliente (solo administradores) | ✅ Implementado — RF13 |
| GET | `/api/pedidos.php?id={id}` | Detalle de un pedido con sus productos (solo el dueño o un admin) | ✅ Implementado — RF12 |
| PUT | `/api/pedidos.php?id={id}` | Actualizar estado del pedido (`{estado}`); solo administradores | ✅ Implementado — RF13 |
| GET | `/api/resenas.php?id_producto={id}` | Listar reseñas y promedio de un producto (público) | ✅ Implementado — RF14 |
| POST | `/api/resenas.php` | Crear reseña (`{id_producto, calificacion, comentario}`); requiere sesión y haber comprado el producto | ✅ Implementado — RF07, RF14 |
| GET | `/api/wishlist.php` | Listar la lista de deseos del usuario autenticado (requiere sesión) | ✅ Implementado — RF15 |
| POST | `/api/wishlist.php` | Agregar producto a la lista de deseos (`{id_producto}`); requiere sesión | ✅ Implementado — RF15 |
| DELETE | `/api/wishlist.php?id_producto={id}` | Quitar producto de la lista de deseos; requiere sesión | ✅ Implementado — RF15 |
| POST | `/api/auth.php` | Iniciar sesión (correo + password), inicia sesión PHP | ✅ Implementado — RF02 |
| GET | `/api/auth.php` | Consultar el usuario de la sesión activa | ✅ Implementado — RF02 |
| DELETE | `/api/auth.php` | Cerrar sesión | ✅ Implementado — RF02 |
| POST | `/api/usuarios.php` | Registrar usuario (público) | ✅ Implementado — RF01 |
| GET | `/api/usuarios.php` | Listar/consultar usuarios (solo administradores) | ✅ Implementado — RF18 |
| PUT | `/api/usuarios.php?id={id}` | Actualizar usuario (solo administradores) | ✅ Implementado — RF18 |
| DELETE | `/api/usuarios.php?id={id}` | Eliminar usuario (solo administradores) | ✅ Implementado — RF18 |
| POST | `/api/categorias.php` | Crear categoría (solo administradores) | ✅ Implementado — RF17 |
| PUT | `/api/categorias.php?id={id}` | Actualizar categoría (solo administradores) | ✅ Implementado — RF17 |
| DELETE | `/api/categorias.php?id={id}` | Eliminar categoría (solo administradores) | ✅ Implementado — RF17 |

Todos los endpoints de escritura (`pedidos`, `resenas`, `wishlist`, `productos`, `categorias`, `usuarios`) usan `$_SESSION` para saber quién hace la petición; ninguno confía en un `id_usuario` enviado por el cliente.

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

Todas las vistas de cliente (inicio, catálogo con búsqueda/filtros, detalle de producto con reseñas y lista de deseos, carrito, historial de pedidos) y el panel de administración (productos, categorías y usuarios) ya están implementadas en HTML/CSS/JS y consumen la API de arriba:

- El carrito usa `localStorage` para armar el pedido; al finalizar compra hace `POST /api/pedidos.php` con la sesión activa (`assets/js/carrito.js`). Si el cliente no ha iniciado sesión, se le redirige a `login.php`.
- El header (`assets/js/cart-utils.js`, función `actualizarEstadoSesion`) consulta `GET /api/auth.php` en cada página y muestra "Hola, {nombre}" + "Salir" cuando hay sesión activa, o "Iniciar sesión" si no la hay. A los clientes también les muestra un enlace a su lista de deseos.
- `producto.php` muestra las reseñas del producto con su promedio, un formulario para publicar una reseña propia (si hay sesión) y un botón para agregar/quitar de la lista de deseos (`assets/js/producto.js`).
- `mis-pedidos.php` (RF12) lista el historial de pedidos del cliente autenticado, con detalle expandible por pedido (`assets/js/mis-pedidos.js`).
- `lista-deseos.php` (RF15) muestra los productos guardados, con opción de agregarlos al carrito o quitarlos (`assets/js/lista-deseos.js`).

- `admin.php` (pestaña Pedidos) lista todos los pedidos con los datos del cliente y permite cambiar su estado (RF13).

## Pendiente

- RF03: recuperación de contraseña (no implementada).
- Publicar el repositorio en GitHub y desplegar el proyecto en un hosting para obtener la URL de producción.
