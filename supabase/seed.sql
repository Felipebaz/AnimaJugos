-- Seed data: migrado desde mockData.ts

-- Clientes
INSERT INTO clientes (id, nombre, direccion, contacto) VALUES
  (1, 'Juan Pérez', 'Av. Siempre Viva 742', '11-2345-6789'),
  (2, 'María García', 'Calle Falsa 123', '11-9876-5432'),
  (3, 'Dietética Vida Sana', 'Av. Corrientes 3500', '11-5555-1234'),
  (4, 'Gym Power Fit', 'Libertador 800', '11-4444-5678');

SELECT setval('clientes_id_seq', 4);

-- Ingredientes
INSERT INTO ingredientes (id, nombre, unidad) VALUES
  (1, 'Naranja', 'u'),
  (2, 'Espinaca', 'g'),
  (3, 'Manzana verde', 'u'),
  (4, 'Jengibre', 'g'),
  (5, 'Limón', 'u'),
  (6, 'Zanahoria', 'u'),
  (7, 'Pepino', 'u'),
  (8, 'Apio', 'g'),
  (9, 'Cúrcuma', 'g'),
  (10, 'Miel', 'ml');

SELECT setval('ingredientes_id_seq', 10);

-- Productos
INSERT INTO productos (id, nombre, tipo, precio, activo) VALUES
  (1, 'Jugo Verde Detox', 'JUGO', 2500, true),
  (2, 'Naranja Clásico', 'JUGO', 2000, true),
  (3, 'Zanahoria Naranja', 'JUGO', 2200, true),
  (4, 'Shot de Jengibre', 'SHOT', 1500, true),
  (5, 'Shot Cúrcuma & Limón', 'SHOT', 1500, true);

SELECT setval('productos_id_seq', 5);

-- Recetas
INSERT INTO recetas (id, producto_id, volumen_base_ml) VALUES
  (1, 1, 910),  -- Jugo Verde Detox
  (2, 2, 910),  -- Naranja Clásico
  (3, 3, 910),  -- Zanahoria Naranja
  (4, 4, 60),   -- Shot de Jengibre
  (5, 5, 60);   -- Shot Cúrcuma & Limón

SELECT setval('recetas_id_seq', 5);

-- Receta Items
INSERT INTO receta_items (receta_id, ingrediente_id, cantidad, unidad) VALUES
  -- Jugo Verde Detox: espinaca 200g + manzana verde 2u + pepino 1u + jengibre 20g + limón 1u
  (1, 2, 200, 'g'),
  (1, 3, 2, 'u'),
  (1, 7, 1, 'u'),
  (1, 4, 20, 'g'),
  (1, 5, 1, 'u'),
  -- Naranja Clásico: naranja 6u + limón 1u
  (2, 1, 6, 'u'),
  (2, 5, 1, 'u'),
  -- Zanahoria Naranja: zanahoria 4u + naranja 3u + jengibre 15g
  (3, 6, 4, 'u'),
  (3, 1, 3, 'u'),
  (3, 4, 15, 'g'),
  -- Shot de Jengibre: jengibre 50g + limón 2u + miel 10ml
  (4, 4, 50, 'g'),
  (4, 5, 2, 'u'),
  (4, 10, 10, 'ml'),
  -- Shot Cúrcuma & Limón: cúrcuma 30g + limón 2u + jengibre 20g + miel 10ml
  (5, 9, 30, 'g'),
  (5, 5, 2, 'u'),
  (5, 4, 20, 'g'),
  (5, 10, 10, 'ml');

-- Pedidos
INSERT INTO pedidos (id, semana, fecha_inicio, fecha_fin) VALUES
  (1, '2026-W09', '2026-02-23', '2026-02-27'),
  (2, '2026-W10', '2026-03-02', '2026-03-06');

SELECT setval('pedidos_id_seq', 2);

-- Pedido Items
INSERT INTO pedido_items (pedido_id, cliente_id, producto_id, cantidad) VALUES
  -- Pedido 1 (W09)
  (1, 1, 1, 6),   -- Juan: 6 Jugo Verde
  (1, 1, 2, 4),   -- Juan: 4 Naranja Clásico
  (1, 2, 1, 3),   -- María: 3 Jugo Verde
  (1, 3, 3, 10),  -- Dietética: 10 Zanahoria Naranja
  (1, 3, 4, 20),  -- Dietética: 20 Shot Jengibre
  (1, 4, 4, 30),  -- Gym: 30 Shot Jengibre
  (1, 4, 5, 15),  -- Gym: 15 Shot Cúrcuma
  -- Pedido 2 (W10)
  (2, 1, 2, 5),   -- Juan: 5 Naranja Clásico
  (2, 2, 1, 4),   -- María: 4 Jugo Verde
  (2, 3, 3, 8);   -- Dietética: 8 Zanahoria Naranja
