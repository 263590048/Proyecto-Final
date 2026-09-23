# Contrato de la API — TechStore

Base URL en desarrollo (dentro de XAMPP htdocs): `http://localhost/Tienda en Linea - Proyecto Final/tienda-online/api/`

| Método | Endpoint | Operación | Estado |
|--------|----------|-----------|--------|
| GET | `/api/productos.php` | Consultar todos los productos activos (público). Incluye `vendidos`, `promedio_calificacion` y `total_resenas` para ordenar por popularidad | ✅ Implementado — RF04, RF06 |
| GET | `/api/productos.php?id={id}` | Consultar un producto (público) | ✅ Implementado |
| POST | `/api/productos.php` | Crear producto (solo administradores) | ✅ Implementado — RF16 |
| PUT | `/api/productos.php?id={id}` | Actualizar producto (solo administradores) | ✅ Implementado — RF16 |
| DELETE | `/api/productos.php?id={id}` | Eliminar producto (solo administradores) | ✅ Implementado — RF16 |
| GET | `/api/categorias.php` | Consultar categorías (público) | ✅ Implementado |
| POST | `/api/imagenes.php` | Subir la imagen de un producto (`multipart/form-data`, campo `imagen`; JPG, PNG o WEBP de hasta 3 MB, validado por contenido). Devuelve `{imagen: "subidas/xxx.jpg"}`; solo administradores | ✅ Implementado — RF16 |
| POST | `/api/recuperar.php` | Solicitar enlace para restablecer la contraseña (`{correo}`); responde igual exista o no el correo. En modo desarrollo incluye `enlace_desarrollo` | ✅ Implementado — RF03 |
| PUT | `/api/recuperar.php` | Fijar la nueva contraseña (`{token, password, confirmacion}`); el token es de un solo uso y vence a los 30 minutos | ✅ Implementado — RF03 |
| POST | `/api/pedidos.php` | Crear y pagar pedido (`{items:[{id_producto, cantidad}], direccion_envio, telefono_contacto, metodo_pago, tarjeta?}`); requiere sesión, `id_usuario` se toma de `$_SESSION`. `metodo_pago`: `tarjeta` \| `transferencia` \| `contra_entrega`; con `tarjeta` se envía `{titular, numero, mes, anio, cvv}`. Responde 402 si la pasarela rechaza el pago | ✅ Implementado — RF11, RF13 |
| GET | `/api/pedidos.php` | Historial de pedidos del usuario autenticado (requiere sesión) | ✅ Implementado — RF12 |
| GET | `/api/pedidos.php?todos=1` | Listado completo de pedidos, con datos del cliente (solo administradores) | ✅ Implementado — RF13 |
| GET | `/api/pedidos.php?id={id}` | Detalle de un pedido con sus productos (solo el dueño o un admin) | ✅ Implementado — RF12 |
| PUT | `/api/pedidos.php?id={id}` | Actualizar estado del pedido (`{estado}`); solo administradores | ✅ Implementado — RF13 |
| GET | `/api/resenas.php?id_producto={id}` | Listar reseñas y promedio de un producto (público) | ✅ Implementado — RF14 |
| DELETE | `/api/resenas.php?id={id}` | Eliminar una reseña (moderación; solo administradores). 404 si no existe | ✅ Implementado — RF14 |
| GET | `/api/resenas.php` | Todas las reseñas de la tienda con producto y categoría, más resumen general (`total`, `promedio`, `distribucion` por estrellas); público | ✅ Implementado — RF14 |
| POST | `/api/resenas.php` | Crear reseña (`{id_producto, calificacion, comentario}`); requiere sesión y haber comprado el producto | ✅ Implementado — RF07, RF14 |
| GET | `/api/wishlist.php` | Listar la lista de deseos del usuario autenticado (requiere sesión) | ✅ Implementado — RF15 |
| POST | `/api/wishlist.php` | Agregar producto a la lista de deseos (`{id_producto}`); requiere sesión | ✅ Implementado — RF15 |
| DELETE | `/api/wishlist.php?id_producto={id}` | Quitar producto de la lista de deseos; requiere sesión | ✅ Implementado — RF15 |
| POST | `/api/auth.php` | Iniciar sesión (correo + password), inicia sesión PHP | ✅ Implementado — RF02 |
| GET | `/api/auth.php` | Consultar el usuario de la sesión activa | ✅ Implementado — RF02 |
| DELETE | `/api/auth.php` | Cerrar sesión | ✅ Implementado — RF02 |
| POST | `/api/usuarios.php` | Registrar usuario. Público: siempre crea `cliente` (se ignora `tipo_usuario`). Si lo hace un administrador desde el panel, puede elegir `cliente` o `administrador` | ✅ Implementado — RF01, RF18 |
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
- Los errores devuelven `{ "error": "mensaje" }` con el código HTTP correspondiente (400, 401, 402, 403, 404, 405, 500).
- Los endpoints de escritura (POST/PUT) esperan el cuerpo como JSON (`Content-Type: application/json`).

## Frontend — completo

Todas las vistas de cliente (inicio, catálogo con búsqueda/filtros, detalle de producto con reseñas y lista de deseos, carrito, historial de pedidos) y el panel de administración (productos, categorías y usuarios, incluida la creación de usuarios) ya están implementadas en HTML/CSS/JS y consumen la API de arriba:

- El carrito usa `localStorage` para armar el pedido; "Finalizar compra" lleva a `checkout.php` (RF13), donde el cliente indica dirección de envío y método de pago y se hace `POST /api/pedidos.php` con la sesión activa (`assets/js/checkout.js`). Si el cliente no ha iniciado sesión, se le redirige a `login.php`.
- El pago con tarjeta es **simulado** (`model/Pago.php`): valida titular, número (algoritmo de Luhn), vencimiento y CVV, y cobra dentro de la misma transacción que registra el pedido; si se rechaza, se hace rollback. Solo se guarda `Tarjeta •••• 1234` en `pedidos.referencia_pago`, nunca el número completo ni el CVV. Tarjeta de prueba aprobada: `4242 4242 4242 4242`; rechazada: `4000 0000 0000 0002`. Con tarjeta el pedido queda `pagado`; con transferencia o contra entrega queda `pendiente` hasta que el admin confirme.
- `confirmacion.php?id={id}` (RF20) muestra el comprobante del pedido: número, fecha, estado, método de pago, dirección, productos y total, con opción de imprimir. También se abre desde "Ver comprobante" en `mis-pedidos.php`.
- El header (`assets/js/cart-utils.js`, función `actualizarEstadoSesion`) consulta `GET /api/auth.php` en cada página y muestra "Hola, {nombre}" + "Salir" cuando hay sesión activa, o "Iniciar sesión" si no la hay. A los clientes también les muestra un enlace a su lista de deseos.
- `producto.php` muestra las reseñas del producto con su promedio, un formulario para publicar una reseña propia (si hay sesión) y un botón para agregar/quitar de la lista de deseos (`assets/js/producto.js`).
- `mis-pedidos.php` (RF12) lista el historial de pedidos del cliente autenticado, con detalle expandible por pedido (`assets/js/mis-pedidos.js`).
- `resenas.php` (RF14) muestra todas las reseñas de la tienda con el promedio general y la distribución por estrellas; se pueden buscar por producto o comentario, filtrar por categoría y calificación, y ordenar (`assets/js/resenas.js`). Está enlazada en el menú de todas las páginas.
- `lista-deseos.php` (RF15) muestra los productos guardados, con opción de agregarlos al carrito o quitarlos (`assets/js/lista-deseos.js`).

- `admin.php` (pestaña Pedidos) lista todos los pedidos con los datos del cliente y permite cambiar su estado (RF13).
- `admin.php` (pestaña Reseñas) lista todas las reseñas con producto, cliente, calificación y comentario; se pueden filtrar por estrellas y eliminar las inapropiadas.

- Catálogo (`productos.php`, RF06): además de búsqueda y categorías, tiene rango de precio (mínimo y máximo, sobre el precio de oferta si existe), calificación mínima, "Solo disponibles" y orden por más vendidos, mejor calificados o precio. Cada tarjeta muestra su promedio de reseñas y unidades vendidas.
- Panel admin → Productos: la categoría se elige de un `select` cargado desde `api/categorias.php`, y las imágenes se suben con `input type="file"` (con vista previa) a `assets/img/productos/subidas/`. Esa carpeta necesita permiso de escritura para el usuario de Apache y tiene un `.htaccess` que impide ejecutar scripts y listar archivos.
- Recuperar contraseña (RF03): `login.php` → "¿Olvidaste tu contraseña?" → `recuperar.php` → enlace → `restablecer.php?token=...`. Los tokens se guardan hasheados (SHA-256) en `recuperaciones_password`.

## Configuración para producción (`config/app.php`)

- `URL_BASE`: la URL pública del hosting (se usa para armar el enlace de recuperación, en vez de confiar en el header `Host`).
- `MODO_DESARROLLO = false`: el enlace de recuperación se envía por correo con `mail()` en lugar de mostrarse en pantalla. Requiere que el hosting tenga el envío de correo configurado.

## Pendiente

- Publicar el repositorio en GitHub y desplegar el proyecto en un hosting para obtener la URL de producción.
