CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Schema para el sistema de gestión de jugos/bebidas

CREATE TABLE clientes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL DEFAULT '',
    contacto TEXT NOT NULL DEFAULT ''
);

CREATE TABLE ingredientes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    nombre TEXT NOT NULL,
    unidad TEXT NOT NULL
);

CREATE TABLE productos (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('JUGO', 'SHOT')),
    precio NUMERIC(10,2) NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE recetas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    producto_id TEXT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    volumen_base_ml INTEGER NOT NULL DEFAULT 910,
    UNIQUE (producto_id)
);

CREATE TABLE receta_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    receta_id TEXT NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    ingrediente_id TEXT NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
    cantidad NUMERIC(10,3) NOT NULL,
    unidad TEXT NOT NULL,
    UNIQUE (receta_id, ingrediente_id)
);

CREATE TABLE pedidos (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    semana TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
);

CREATE TABLE pedido_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    pedido_id TEXT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    producto_id TEXT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0)
);

CREATE TABLE precio_ingredientes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    ingrediente_id TEXT NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
    precio_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
    semana TEXT NOT NULL,
    UNIQUE (ingrediente_id, semana)
);