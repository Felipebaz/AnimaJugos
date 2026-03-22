-- ============================================
-- Seed: Sistema de Gestión de Jugos
-- IDs legibles tipo TEXT
-- ============================================

-- ============================================
-- CLIENTES
-- ============================================
INSERT INTO clientes (id, nombre, direccion, contacto) VALUES
  ('cli-juan',      'Juan Pérez',          'Av. Siempre Viva 742',  '11-2345-6789'),
  ('cli-maria',     'María García',        'Calle Falsa 123',       '11-9876-5432'),
  ('cli-dietetica', 'Dietética Vida Sana', 'Av. Corrientes 3500',   '11-5555-1234'),
  ('cli-gym',       'Gym Power Fit',       'Libertador 800',        '11-4444-5678');

-- ============================================
-- INGREDIENTES
-- ============================================
INSERT INTO ingredientes (id, nombre, unidad) VALUES
  ('ing-naranja',     'Naranja',       'g'),
  ('ing-espinaca',    'Espinaca',      'g'),
  ('ing-manzana',     'Manzana verde', 'g'),
  ('ing-jengibre',    'Jengibre',      'g'),
  ('ing-limon',       'Limón',         'g'),
  ('ing-zanahoria',   'Zanahoria',     'g'),
  ('ing-pepino',      'Pepino',        'g'),
  ('ing-apio',        'Apio',          'g'),
  ('ing-curcuma',     'Cúrcuma',       'g'),
  ('ing-pimienta',    'Pimienta',      'g'),
  ('ing-remolacha',   'Remolacha',     'g'),
  ('ing-kale',        'Kale',          'g'),
  ('ing-brocoli',     'Brócoli',       'g'),
  ('ing-menta',       'Menta',         'hojas');

-- ============================================
-- PRODUCTOS
-- ============================================
INSERT INTO productos (id, nombre, tipo, precio, activo) VALUES
  ('prod-verde',   'Jugo Verde',                  'JUGO', 450, true),
  ('prod-naranja', 'Jugo Naranja',                'JUGO', 450, true),
  ('prod-rojo',    'Jugo Rojo',                   'JUGO', 450, true),
  ('prod-shot',    'Shot de Cúrcuma y Jengibre',  'SHOT', 320, true);

-- ============================================
-- RECETAS
-- ============================================
INSERT INTO recetas (id, producto_id, volumen_base_ml) VALUES
  ('rec-verde',   'prod-verde',   910),
  ('rec-naranja', 'prod-naranja', 910),
  ('rec-rojo',    'prod-rojo',    910),
  ('rec-shot',    'prod-shot',    60);

-- ============================================
-- RECETA ITEMS
-- ============================================
INSERT INTO receta_items (receta_id, ingrediente_id, cantidad, unidad) VALUES
  -- Jugo Verde
  ('rec-verde', 'ing-pepino',    400, 'g'),
  ('rec-verde', 'ing-manzana',   360, 'g'),
  ('rec-verde', 'ing-espinaca',  250, 'g'),
  ('rec-verde', 'ing-apio',      140, 'g'),
  ('rec-verde', 'ing-limon',     130, 'g'),
  ('rec-verde', 'ing-kale',       30, 'g'),
  ('rec-verde', 'ing-brocoli',    25, 'g'),
  ('rec-verde', 'ing-jengibre',    8, 'g'),

  -- Jugo Naranja
  ('rec-naranja', 'ing-naranja',    550, 'g'),
  ('rec-naranja', 'ing-zanahoria',  425, 'g'),
  ('rec-naranja', 'ing-limon',       70, 'g'),
  ('rec-naranja', 'ing-curcuma',     18, 'g'),
  ('rec-naranja', 'ing-jengibre',     8, 'g'),
  ('rec-naranja', 'ing-menta',        3, 'hojas'),

  -- Jugo Rojo
  ('rec-rojo', 'ing-pepino',     400, 'g'),
  ('rec-rojo', 'ing-manzana',    370, 'g'),
  ('rec-rojo', 'ing-remolacha',  275, 'g'),
  ('rec-rojo', 'ing-limon',      100, 'g'),
  ('rec-rojo', 'ing-apio',        63, 'g'),
  ('rec-rojo', 'ing-curcuma',     10, 'g'),
  ('rec-rojo', 'ing-jengibre',     5, 'g'),

  -- Shot de Cúrcuma y Jengibre
  ('rec-shot', 'ing-jengibre',  50, 'g'),
  ('rec-shot', 'ing-curcuma',   30, 'g'),
  ('rec-shot', 'ing-limon',     40, 'g'),
  ('rec-shot', 'ing-naranja',   30, 'g'),
  ('rec-shot', 'ing-pimienta',   2, 'g');

-- ============================================
-- PEDIDOS
-- ============================================
INSERT INTO pedidos (id, semana, fecha_inicio, fecha_fin) VALUES
  ('ped-w09', '2026-W09', '2026-02-23', '2026-02-27'),
  ('ped-w10', '2026-W10', '2026-03-02', '2026-03-06');

-- ============================================
-- PEDIDO ITEMS
-- ============================================
INSERT INTO pedido_items (pedido_id, cliente_id, producto_id, cantidad) VALUES
  -- Semana W09
  ('ped-w09', 'cli-juan',      'prod-verde',   6),
  ('ped-w09', 'cli-juan',      'prod-naranja', 4),
  ('ped-w09', 'cli-maria',     'prod-verde',   3),
  ('ped-w09', 'cli-dietetica', 'prod-rojo',   10),
  ('ped-w09', 'cli-dietetica', 'prod-shot',   20),
  ('ped-w09', 'cli-gym',       'prod-shot',   30),
  -- Semana W10
  ('ped-w10', 'cli-juan',      'prod-naranja', 5),
  ('ped-w10', 'cli-maria',     'prod-verde',   4),
  ('ped-w10', 'cli-dietetica', 'prod-rojo',    8);