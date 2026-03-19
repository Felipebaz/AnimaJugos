-- Schema para el sistema de gestión de jugos/bebidas

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL DEFAULT '',
    contacto TEXT NOT NULL DEFAULT ''
);

CREATE TABLE ingredientes (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    unidad TEXT NOT NULL
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('JUGO', 'SHOT')),
    precio NUMERIC(10,2) NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE recetas (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    volumen_base_ml INTEGER NOT NULL DEFAULT 910
);

CREATE TABLE receta_items (
    id SERIAL PRIMARY KEY,
    receta_id INTEGER NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    ingrediente_id INTEGER NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
    cantidad NUMERIC(10,3) NOT NULL,
    unidad TEXT NOT NULL
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    semana TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
);

CREATE TABLE pedido_items (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0)
);

CREATE TABLE precio_ingredientes (
    id SERIAL PRIMARY KEY,
    ingrediente_id INTEGER NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
    precio_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
    semana TEXT NOT NULL,
    UNIQUE (ingrediente_id, semana)
);
