# Descripción del problema — TechStore

## Contexto y problema

Los pequeños y medianos comercios de tecnología (celulares, laptops, audífonos, tablets,
smartwatches y accesorios) suelen vender de forma presencial o a través de redes sociales,
sin un catálogo centralizado, sin control de inventario en tiempo real y sin un historial
formal de pedidos. Esto genera:

- Pérdida de ventas por falta de visibilidad del catálogo fuera del horario de atención.
- Errores de inventario (vender un producto que ya no hay en stock).
- Falta de trazabilidad: no queda un registro ordenado de qué compró cada cliente ni en qué
  estado va su pedido.
- Dificultad para que el cliente compare precios, ofertas y reseñas antes de comprar.

## Objetivo de la solución

Desarrollar una aplicación web (TechStore) que permita:

- A los **clientes**: explorar un catálogo de productos de tecnología, buscar y filtrar,
  ver el detalle de cada producto (incluyendo reseñas de otros clientes), armar un carrito,
  generar un pedido y consultar su historial de compras.
- A los **administradores**: gestionar el catálogo (productos y categorías) y los usuarios
  registrados desde un panel propio, sin tocar la base de datos directamente.

## Alcance (versión Alpha)

Como indica el lineamiento del proyecto, esta es una versión Alpha: el diseño y algunas
decisiones pudieron variar durante el desarrollo por necesidad técnica o por feedback de
usuarios de prueba. El alcance actual cubre:

- Catálogo público con búsqueda, filtros (categoría, precio, popularidad, disponibilidad) y
  detalle de producto con reseñas.
- Registro e inicio de sesión de clientes (RF01, RF02).
- Carrito de compras y generación de pedidos con control de stock (RF08–RF11).
- Historial de pedidos por cliente (RF12).
- Reseñas y calificaciones, solo para quien ya compró el producto (RF14).
- Lista de deseos (RF15).
- Panel de administración con CRUD de productos, categorías y usuarios (RF16–RF18).
- API REST en JSON para todas las operaciones anteriores (RF19).

Fuera de alcance por ahora: pasarela de pago real (el flujo de pago queda simulado al
registrar el pedido), recuperación de contraseña por correo (RF03) y notificaciones por
correo al confirmar un pedido (RF20).

## Referencia tomada como base

Para la estructura del catálogo, el carrito y el panel de administración se tomó como
referencia el patrón de tiendas en línea de electrónica ya existentes (catálogo por
categorías, ficha de producto con galería y reseñas, carrito persistente y checkout en un
solo paso), buscando mantener una experiencia conocida para el usuario y evitar errores de
usabilidad ya resueltos por ese tipo de sitios.

## Requerimientos

El detalle completo de requerimientos funcionales, no funcionales y las historias de
usuario (product backlog) está en [requerimientos.md](requerimientos.md).

## Wireframes y mockups

Diseñados en Figma:
https://www.figma.com/design/e0K8YSaoy8YGbqZxH628bI/TechStore---Wireframes-y-Mockups

Incluye wireframe y mockup de las 5 pantallas principales: inicio, catálogo, carrito,
panel de administración y detalle de producto — ya implementadas en el proyecto.

## Tecnologías utilizadas

| Capa | Tecnología | Motivo |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript (vanilla, `fetch`) | Sin dependencias externas ni build step; suficiente para las interacciones necesarias (filtros, carrito, modales del admin) y facilita explicar el código fuente tal cual se ejecuta en el navegador. |
| Backend | PHP 8 | Requisito del programa de estudios; se estructura en capas siguiendo el patrón **MVC** (Modelo–Vista–Controlador). |
| Base de datos | MySQL (motor relacional de XAMPP) | Relaciones claras entre usuarios, productos, categorías, pedidos y reseñas; se aprovechan llaves foráneas, transacciones (al crear un pedido) y restricciones (`CHECK` en calificación de reseñas). |
| Acceso a datos | PDO con consultas preparadas | Evita inyección SQL; es el driver estándar recomendado para PHP + MySQL. |
| Servidor | Apache (XAMPP) | Entorno de desarrollo local estándar para PHP. |
| Seguridad | `password_hash()` / `password_verify()`, sesiones PHP (`$_SESSION`) | Las contraseñas nunca se guardan en texto plano; las rutas de administración validan `tipo_usuario === 'administrador'` contra la sesión activa. |

**Nota sobre el modelo de datos:** el proyecto usa una única base de datos **relacional**
(MySQL). No se usa una base NoSQL porque los datos (usuarios, productos, pedidos, reseñas)
tienen relaciones fijas y consultas que se benefician de llaves foráneas e integridad
referencial (por ejemplo, no permitir un pedido de un producto que no existe). El diseño
equivalente en una base **NoSQL (MongoDB)** —colecciones, documentos de ejemplo, índices y la
comparación con el modelo relacional— está en
[`database/modelo-nosql.md`](../database/modelo-nosql.md).

## Estructura básica del proyecto (MVC)

```
tienda-online/
├── config/conexion.php      # Configuración de conexión PDO a MySQL
├── model/                   # Acceso a datos (una clase por tabla principal)
├── controller/               # Reglas de negocio y validaciones, entre la vista y el modelo
├── api/                      # Endpoints REST (uno por recurso), consumidos por las vistas
├── assets/js/                # Lógica de cada vista (fetch a la API, render, formularios)
├── assets/css/                # Estilos
└── *.php                     # Vistas (index, productos, producto, carrito, login, registro, admin)
```

- **URL base** (desarrollo, XAMPP): `http://localhost/Tienda en Linea - Proyecto Final/tienda-online/`
- **Configuración de base de datos**: [tienda-online/config/conexion.php](tienda-online/config/conexion.php)
- **Rutas**: no hay un router central; cada vista es un archivo `.php` directo y cada
  recurso de la API es un archivo `.php` dentro de `api/` (por ejemplo `api/productos.php`).
  El contrato completo de la API está en [api-contract.md](api-contract.md).
