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
  (1, 'Naranja', 'g'),
  (2, 'Espinaca', 'g'),
  (3, 'Manzana verde', 'g'),
  (4, 'Jengibre', 'g'),
  (5, 'Limón', 'g'),
  (6, 'Zanahoria', 'g'),
  (7, 'Pepino', 'g'),
  (8, 'Apio', 'g'),
  (9, 'Cúrcuma', 'g'),
  (10, 'Pimienta', 'u'),
  (11, 'Remolacha', 'g'),
  (12, 'Kale', 'g'),
  (13, 'Brocoli', 'g');

SELECT setval('ingredientes_id_seq', 10);

-- Productos
INSERT INTO productos (id, nombre, tipo, precio, activo) VALUES
  (1, 'Jugo Verde Detox', 'JUGO', 450, true),
  (2, 'Zanahoria Naranja', 'JUGO', 450, true),
  

SELECT setval('productos_id_seq', 5);

-- Recetas
INSERT INTO recetas (id, producto_id, volumen_base_ml) VALUES
  (1, 1, 910),
  (2, 2, 910),
  (3, 3, 910),
  (4, 4, 60),
  (5, 5, 60);

SELECT setval('recetas_id_seq', 5);

-- Receta Items
INSERT INTO receta_items (receta_id, ingrediente_id, cantidad, unidad) VALUES
  -- Jugo Verde Detox
  (1, 2, 200, 'g'),
  (1, 3, 2, 'u'),
  (1, 7, 1, 'u'),
  (1, 4, 20, 'g'),
  (1, 5, 1, 'u'),
  -- Naranja Clásico
  (2, 1, 6, 'u'),
  (2, 5, 1, 'u'),
  -- Zanahoria Naranja
  (3, 6, 4, 'u'),
  (3, 1, 3, 'u'),
  (3, 4, 15, 'g'),
  -- Shot de Jengibre
  (4, 4, 50, 'g'),
  (4, 5, 2, 'u'),
  (4, 10, 10, 'ml'),
  -- Shot Cúrcuma & Limón
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
  (1, 1, 1, 6),
  (1, 1, 2, 4),
  (1, 2, 1, 3),
  (1, 3, 3, 10),
  (1, 3, 4, 20),
  (1, 4, 4, 30),
  (1, 4, 5, 15),
  (2, 1, 2, 5),
  (2, 2, 1, 4),
  (2, 3, 3, 8);
