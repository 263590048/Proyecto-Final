# Casos y rutinas de prueba — TechStore

Casos de prueba manuales, pensados para ejecutarse contra el entorno de desarrollo
(`http://localhost/Tienda en Linea - Proyecto Final/tienda-online/`) durante la
presentación del proyecto. La columna **Resultado obtenido** se completa al ejecutar cada
caso.

Los casos marcados ✅ ya se ejecutaron (vía `curl` contra la API y/o en el navegador) el
2026-09-21 y pasaron. El resto queda para ejecutarse en vivo durante la presentación.

## Autenticación y cuentas (RF01, RF02, RF18)

| ID | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| CP01 | Registro de cliente nuevo | En `registro.php`, llenar nombre, apellido, correo, contraseña (≥6 caracteres) y enviar | Se crea el usuario (`tipo_usuario = cliente`) y redirige a `login.php` | ✅ Verificado en navegador |
| CP02 | Registro con correo duplicado | Repetir CP01 con el mismo correo | La API responde 400 con "Ya existe una cuenta con ese correo" y el formulario muestra el error | ✅ Verificado (curl) |
| CP03 | Login con credenciales correctas | En `login.php`, ingresar el correo/contraseña de CP01 | Redirige a `index.php`; queda sesión activa (`$_SESSION['id_usuario']`) | ✅ Verificado en navegador |
| CP04 | Login con contraseña incorrecta | Ingresar correo válido y contraseña errónea | La API responde 401 y se muestra "Correo o contraseña incorrectos" | ✅ Verificado (curl) |
| CP04b | Recuperar contraseña | En `login.php` → "¿Olvidaste tu contraseña?", ingresar el correo, abrir el enlace (en modo desarrollo se muestra en pantalla) y fijar una contraseña nueva | Se puede iniciar sesión con la nueva contraseña y ya no con la anterior; redirige a `login.php` | ✅ Verificado (curl + navegador) 2026-09-22 |
| CP04c | Enlace de recuperación inválido | Reusar un enlace ya usado, uno vencido (> 30 min), uno anterior a otra solicitud, o contraseñas que no coinciden | Responde 400 "El enlace no es válido o ya venció..." / "Las contraseñas no coinciden"; un correo no registrado recibe el mismo mensaje genérico | ✅ Verificado (curl) 2026-09-22 |
| CP05 | Acceso a `api/usuarios.php` sin sesión de administrador | Hacer `GET /api/usuarios.php` sin haber iniciado sesión como admin | Responde 403 "Acceso restringido a administradores" | ✅ Verificado (curl) |
| CP06 | Administrar usuarios | Iniciar sesión como `admin@techstore.com`, ir a panel admin → pestaña Usuarios, editar el tipo de un usuario y eliminarlo | La tabla de usuarios se actualiza sin recargar la página | ✅ Verificado (curl + navegador) |
| CP06b | Crear usuario desde el panel | Como administrador, en admin → Usuarios → "+ Agregar usuario", llenar nombre, apellido, correo, contraseña y tipo "Administrador" | El usuario aparece en la tabla con el tipo elegido y puede iniciar sesión | ✅ Verificado (curl + navegador) 2026-09-22 |
| CP06c | Registro público no puede crear administradores | `POST /api/usuarios.php` sin sesión y con `"tipo_usuario":"administrador"` | Responde 201 pero la cuenta se crea como `cliente` | ✅ Verificado (curl) 2026-09-22 |
| CP06d | Panel admin protegido | Abrir `admin.php` sin sesión y luego con una sesión de cliente | En ambos casos redirige a `login.php` (302); con sesión de administrador se muestra el panel | ✅ Verificado (curl) 2026-09-22 |
| CP06e | XSS en datos de usuarios | Registrar un cliente con nombre `Eve'><img src=x onerror=...>`, comprar, dejar una reseña y una dirección de envío con `<img src=x onerror=...>`; abrir el detalle del producto, `resenas.php`, admin (Usuarios, Pedidos, Reseñas, botón Editar) y `confirmacion.php` | El código se muestra como texto y no se ejecuta en ninguna página | ✅ Verificado en navegador 2026-09-22 |
| CP07 | Cerrar sesión | `DELETE /api/auth.php` (o el flujo de logout de la UI) | La sesión se destruye; una siguiente petición a `GET /api/auth.php` responde 401 | ✅ Verificado (curl) |

## Catálogo y búsqueda (RF04–RF07)

| ID | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| CP08 | Ver catálogo completo | Entrar a `productos.php` | Se listan los productos activos con imagen, nombre, categoría, precio y disponibilidad | |
| CP09 | Buscar por nombre | Escribir "iphone" en el buscador del catálogo | Solo se muestran productos cuyo nombre contiene "iphone" | |
| CP10 | Filtrar por categoría y rango de precio | Seleccionar categoría "Laptops" y un rango de precio | Solo se muestran laptops dentro del rango indicado | |
| CP10b | Ordenar por popularidad | En `productos.php`, elegir "Ordenar por: Más vendidos" y luego "Mejor calificados" | Los productos se reordenan según unidades vendidas / promedio de reseñas; las tarjetas muestran "⭐ promedio (n) · X vendidos" | ✅ Verificado en navegador 2026-09-22 |
| CP10c | Rango de precio y calificación | Poner precio mínimo 1000 y máximo 2000; luego "Calificación: 4 ★ o más" | Solo aparecen productos cuyo precio (de oferta, si tiene) está en el rango y cuyo promedio es ≥ 4 | ✅ Verificado en navegador 2026-09-22 |
| CP11 | Ver detalle de producto | Hacer clic en un producto del catálogo | Se muestra `producto.php` con descripción completa, galería (imagen/imagen2) y reseñas | |

## Carrito y pedidos (RF08–RF13)

| ID | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| CP12 | Agregar producto al carrito | Desde el catálogo o el detalle, click en "Agregar al carrito" | El producto aparece en `carrito.php` / popover del carrito con cantidad 1 | |
| CP13 | Modificar cantidad en el carrito | En `carrito.php`, aumentar la cantidad de un producto | El subtotal y total se recalculan correctamente | |
| CP14 | Eliminar producto del carrito | Quitar un producto del carrito | El producto desaparece y el total se actualiza | |
| CP15 | Crear pedido con stock suficiente | `POST /api/pedidos.php` con `id_usuario` e `items` válidos | Responde 201 con `id_pedido`; el stock del producto se descuenta en `productos.cantidad` | ✅ Verificado (curl) |
| CP16 | Crear pedido con stock insuficiente | Pedir una cantidad mayor a `productos.cantidad` disponible | Responde 400 "Stock insuficiente para el producto {id}"; no se crea el pedido ni se descuenta stock | ✅ Verificado (curl) |
| CP17 | Consultar historial de pedidos | `GET /api/pedidos.php?id_usuario={id}` | Devuelve los pedidos de ese usuario ordenados por fecha descendente | ✅ Verificado (curl) |
| CP18 | Actualizar estado de un pedido | `PUT /api/pedidos.php?id={id}` con `{"estado":"pagado"}` | El pedido cambia de estado; un estado inválido responde 400 | ✅ Verificado (curl) |

## Pago y confirmación (RF13, RF20)

| ID | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| CP29 | Pagar con tarjeta válida | En `checkout.php` elegir "Tarjeta", usar `4242 4242 4242 4242`, vencimiento futuro, CVV `123` y confirmar | Responde 201; el pedido queda `pagado` con `referencia_pago = "Tarjeta •••• 4242"` y redirige a `confirmacion.php` | ✅ Verificado (curl + navegador) 2026-09-22 |
| CP30 | Tarjeta rechazada por el banco | Repetir CP29 con `4000 0000 0000 0002` | Responde 402 "El banco rechazó la tarjeta..."; no se crea el pedido ni se descuenta stock | ✅ Verificado (curl + navegador) 2026-09-22 |
| CP31 | Datos de tarjeta inválidos | Número que no pasa Luhn (`4242 4242 4242 4241`) o tarjeta vencida | Responde 400 con "El número de tarjeta no es válido" / "La tarjeta está vencida..." | ✅ Verificado (curl) 2026-09-22 |
| CP32 | Pedido sin dirección de envío o con método inválido | `POST /api/pedidos.php` con `direccion_envio` vacío, o `metodo_pago = "bitcoin"` | Responde 400 "Debe indicar la dirección de envío" / "Método de pago inválido" | ✅ Verificado (curl) 2026-09-22 |
| CP33 | Pagar por transferencia | En `checkout.php` elegir "Transferencia bancaria" y confirmar | El pedido queda `pendiente`; la confirmación muestra los datos de la cuenta y el monto a transferir | ✅ Verificado (curl + navegador) 2026-09-22 |
| CP34 | Confirmación del pedido | Tras CP29, revisar `confirmacion.php?id={id}` | Muestra número de pedido, fecha, estado, método de pago, dirección, productos y total; "Imprimir comprobante" abre el diálogo de impresión | ✅ Verificado en navegador 2026-09-22 |
| CP35 | Confirmación de un pedido ajeno | Abrir `confirmacion.php?id={id}` de otro cliente | La API responde 403 y se redirige a `login.php` | |

## Reseñas y wishlist (RF14, RF15)

| ID | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| CP19 | Reseñar un producto comprado | Con un usuario que ya tiene un pedido con ese producto, `POST /api/resenas.php` | Responde 201; la reseña aparece en el detalle del producto con el promedio recalculado | ✅ Verificado (curl) |
| CP20 | Reseñar un producto no comprado | Repetir CP19 con un producto que el usuario nunca compró | Responde 400 "Solo puedes reseñar productos que hayas comprado" | ✅ Verificado (curl) |
| CP20b | Ver todas las reseñas | Entrar a `resenas.php` | Se listan todas las reseñas con producto, categoría, estrellas, autor y fecha; el resumen muestra el promedio general y cuántas hay de cada calificación | ✅ Verificado en navegador 2026-09-22 |
| CP20c | Filtrar reseñas | En `resenas.php`, hacer clic en la barra de 3 ★, luego filtrar por categoría "Accesorios", ordenar por "Peor calificadas" y buscar "batería" | La lista y el contador ("Mostrando X de Y") se actualizan sin recargar la página | ✅ Verificado en navegador 2026-09-22 |
| CP21 | Agregar y quitar de la lista de deseos | `POST` y luego `DELETE` en `api/wishlist.php` para el mismo usuario/producto | El producto se agrega y luego se elimina correctamente de la wishlist | ✅ Verificado (curl) |

## Panel de administración (RF16–RF18)

| ID | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| CP22 | Crear producto | En admin → Productos → "Agregar producto", llenar el formulario y guardar | El producto aparece en la tabla y en el catálogo público | |
| CP22b | Crear producto con imagen subida | En admin → "Agregar producto", elegir la categoría en el `select`, seleccionar un archivo JPG en "Imagen principal" y guardar | La vista previa aparece antes de guardar; el producto se crea con `imagen = "subidas/..."` y se ve con su foto en el catálogo | ✅ Verificado en navegador 2026-09-22 |
| CP22c | Subida de imagen no válida | `POST /api/imagenes.php` con un archivo de texto renombrado a `.jpg`, o sin sesión de admin | Responde 400 "Formato no permitido..." / 403 respectivamente; un `.php` dentro de `subidas/` no se ejecuta (403) | ✅ Verificado (curl) 2026-09-22 |
| CP23 | Editar producto | Editar precio/stock de un producto existente | Los cambios se reflejan de inmediato en la tabla y en `producto.php` | |
| CP24 | Eliminar producto | Eliminar un producto desde la tabla de admin | El producto deja de aparecer en el catálogo | |
| CP24b | Moderar reseñas | En admin → Reseñas, filtrar por "1 estrella" y eliminar una reseña | La reseña desaparece de la tabla, de `resenas.php` y del detalle del producto; el resumen se recalcula. Sin sesión de admin, `DELETE /api/resenas.php?id={id}` responde 403 | ✅ Verificado (curl + navegador) 2026-09-22 |
| CP25 | CRUD de categorías | En admin → Categorías, crear, editar y eliminar una categoría de prueba | Los cambios se reflejan en la tabla y en los filtros del catálogo | ✅ Verificado (curl) |

## API (RF19)

| ID | Caso de prueba | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| CP26 | Método no soportado | Hacer `PATCH /api/productos.php` (método no implementado) | Responde 405 "Método no permitido" | ✅ Verificado (curl) |
| CP27 | Recurso inexistente | `GET /api/productos.php?id=99999` | Responde 404 "Producto no encontrado" | ✅ Verificado (curl) |
| CP28 | Respuesta en JSON | Cualquier endpoint de `api/` | El header `Content-Type` es `application/json; charset=utf-8` y el cuerpo es JSON válido | ✅ Verificado (curl) |
