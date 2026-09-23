# Esquema de la base de datos — Modelo relacional (MySQL)

Generado a partir de [techstore.sql](techstore.sql). Base de datos: `tienda_online`.

```mermaid
erDiagram
    USUARIOS ||--o{ PEDIDOS : realiza
    USUARIOS ||--o{ RESENAS : escribe
    USUARIOS ||--o{ WISHLIST : guarda
    USUARIOS ||--o{ RECUPERACIONES_PASSWORD : solicita
    CATEGORIAS ||--o{ PRODUCTOS : clasifica
    PRODUCTOS ||--o{ DETALLE_PEDIDO : incluido_en
    PRODUCTOS ||--o{ RESENAS : recibe
    PRODUCTOS ||--o{ WISHLIST : guardado_en
    PEDIDOS ||--o{ DETALLE_PEDIDO : contiene

    USUARIOS {
        int id_usuario PK
        varchar nombre
        varchar apellido
        varchar correo UK
        varchar password
        varchar telefono
        varchar direccion
        enum tipo_usuario "cliente | administrador"
        timestamp creado_en
    }

    CATEGORIAS {
        int id_categoria PK
        varchar nombre
        varchar descripcion
    }

    PRODUCTOS {
        int id_producto PK
        int id_categoria FK
        varchar nombre
        text descripcion
        decimal precio
        decimal precio_oferta
        int cantidad
        varchar imagen
        varchar imagen2
        enum estado "activo | inactivo"
    }

    PEDIDOS {
        int id_pedido PK
        int id_usuario FK
        datetime fecha
        decimal total
        enum estado "pendiente | pagado | procesando | enviado | entregado | cancelado"
        enum metodo_pago "tarjeta | transferencia | contra_entrega"
        varchar referencia_pago
        varchar direccion_envio
        varchar telefono_contacto
    }

    DETALLE_PEDIDO {
        int id_detalle PK
        int id_pedido FK
        int id_producto FK
        int cantidad
        decimal precio
    }

    RESENAS {
        int id_resena PK
        int id_usuario FK
        int id_producto FK
        int calificacion "1 a 5"
        text comentario
        datetime fecha
    }

    WISHLIST {
        int id_wishlist PK
        int id_usuario FK
        int id_producto FK
    }

    RECUPERACIONES_PASSWORD {
        int id_recuperacion PK
        int id_usuario FK
        char token_hash "SHA-256 del token, UNIQUE"
        datetime expira
        tinyint usado
        datetime creado_en
    }
```

## Notas del diseño

- **usuarios → pedidos / resenas / wishlist** (1 a N): un usuario puede tener varios
  pedidos, reseñas y productos en su lista de deseos.
- **categorias → productos** (1 a N): cada producto pertenece a una sola categoría.
- **pedidos → detalle_pedido → productos** (N a N resuelto con tabla intermedia): un pedido
  incluye varios productos y un producto puede estar en varios pedidos; `detalle_pedido`
  guarda además el `precio` congelado al momento de la compra (no se recalcula si el
  producto cambia de precio después).
- **resenas**: relaciona usuario y producto; a nivel de aplicación (no de esquema) solo se
  permite crear una reseña si el usuario ya compró ese producto (`Resena::crear()` en
  `model/Resena.php`), verificando contra `detalle_pedido`.
- Todas las llaves foráneas usan `INT` con `FOREIGN KEY` explícita para mantener integridad
  referencial (por ejemplo, no se puede borrar una categoría con productos asociados sin
  antes resolver esa relación).

## Modelo NoSQL

El diseño equivalente en MongoDB (colecciones, qué se embebe y qué se referencia, documentos
de ejemplo, índices y consultas) está en [modelo-nosql.md](modelo-nosql.md).

La aplicación usa una única base de datos relacional (MySQL) porque no hay datos con
estructura variable o de alto volumen no relacional que justifiquen NoSQL — todas las entidades (usuarios, productos, pedidos, reseñas) tienen relaciones
fijas y se benefician de integridad referencial y transacciones (por ejemplo, al crear un
pedido se descuenta stock y se inserta el detalle dentro de una misma transacción, ver
`Pedido::crear()` en `tienda-online/model/Pedido.php`).
