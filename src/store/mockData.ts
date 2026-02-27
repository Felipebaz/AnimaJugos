import { Cliente } from "../domain/models/Cliente"
import { Ingrediente } from "../domain/models/Ingrediente"
import { Producto } from "../domain/models/Producto"
import { Receta } from "../domain/models/Receta"
import { RecetaItem } from "../domain/models/RecetaItem"
import { Pedido } from "../domain/models/Pedido"
import { PedidoItem } from "../domain/models/PedidoItem"

// --- Clientes ---
export const clientesMock: Array<Cliente> = [
  new Cliente(1, "Juan Pérez", "Av. Siempre Viva 742", "11-2345-6789"),
  new Cliente(2, "María García", "Calle Falsa 123", "11-9876-5432"),
  new Cliente(3, "Dietética Vida Sana", "Av. Corrientes 3500", "11-5555-1234"),
  new Cliente(4, "Gym Power Fit", "Libertador 800", "11-4444-5678"),
]

// --- Ingredientes ---
export const ingredientesMock: Array<Ingrediente> = [
  new Ingrediente(1, "Naranja", "u"),
  new Ingrediente(2, "Espinaca", "g"),
  new Ingrediente(3, "Manzana verde", "u"),
  new Ingrediente(4, "Jengibre", "g"),
  new Ingrediente(5, "Limón", "u"),
  new Ingrediente(6, "Zanahoria", "u"),
  new Ingrediente(7, "Pepino", "u"),
  new Ingrediente(8, "Apio", "g"),
  new Ingrediente(9, "Cúrcuma", "g"),
  new Ingrediente(10, "Miel", "ml"),
]

// --- Productos ---
export const productosMock: Array<Producto> = [
  new Producto(1, "Jugo Verde Detox", "JUGO", 2500, true),
  new Producto(2, "Naranja Clásico", "JUGO", 2000, true),
  new Producto(3, "Zanahoria Naranja", "JUGO", 2200, true),
  new Producto(4, "Shot de Jengibre", "SHOT", 1500, true),
  new Producto(5, "Shot Cúrcuma & Limón", "SHOT", 1500, true),
]

// --- Recetas ---

// Jugo Verde Detox: espinaca 200g + manzana verde 2u + pepino 1u + jengibre 20g + limón 1u
const recetaVerde = new Receta(1, 1, 910)
recetaVerde.agregarItem(new RecetaItem(2, 200, "g"))
recetaVerde.agregarItem(new RecetaItem(3, 2, "u"))
recetaVerde.agregarItem(new RecetaItem(7, 1, "u"))
recetaVerde.agregarItem(new RecetaItem(4, 20, "g"))
recetaVerde.agregarItem(new RecetaItem(5, 1, "u"))

// Naranja Clásico: naranja 6u + limón 1u
const recetaNaranja = new Receta(2, 2, 910)
recetaNaranja.agregarItem(new RecetaItem(1, 6, "u"))
recetaNaranja.agregarItem(new RecetaItem(5, 1, "u"))

// Zanahoria Naranja: zanahoria 4u + naranja 3u + jengibre 15g
const recetaZanahoria = new Receta(3, 3, 910)
recetaZanahoria.agregarItem(new RecetaItem(6, 4, "u"))
recetaZanahoria.agregarItem(new RecetaItem(1, 3, "u"))
recetaZanahoria.agregarItem(new RecetaItem(4, 15, "g"))

// Shot de Jengibre: jengibre 50g + limón 2u + miel 10ml
const recetaShotJengibre = new Receta(4, 4, 60)
recetaShotJengibre.agregarItem(new RecetaItem(4, 50, "g"))
recetaShotJengibre.agregarItem(new RecetaItem(5, 2, "u"))
recetaShotJengibre.agregarItem(new RecetaItem(10, 10, "ml"))

// Shot Cúrcuma & Limón: cúrcuma 30g + limón 2u + jengibre 20g + miel 10ml
const recetaShotCurcuma = new Receta(5, 5, 60)
recetaShotCurcuma.agregarItem(new RecetaItem(9, 30, "g"))
recetaShotCurcuma.agregarItem(new RecetaItem(5, 2, "u"))
recetaShotCurcuma.agregarItem(new RecetaItem(4, 20, "g"))
recetaShotCurcuma.agregarItem(new RecetaItem(10, 10, "ml"))

export const recetasMock: Array<Receta> = [
  recetaVerde,
  recetaNaranja,
  recetaZanahoria,
  recetaShotJengibre,
  recetaShotCurcuma,
]

// --- Pedidos ---
const pedido1 = new Pedido(1, "2026-W09", new Date("2026-02-23"), new Date("2026-02-27"))
pedido1.agregarItem(new PedidoItem(1, 1, 6))  // Juan: 6 Jugo Verde
pedido1.agregarItem(new PedidoItem(1, 2, 4))  // Juan: 4 Naranja Clásico
pedido1.agregarItem(new PedidoItem(2, 1, 3))  // María: 3 Jugo Verde
pedido1.agregarItem(new PedidoItem(3, 3, 10)) // Dietética: 10 Zanahoria Naranja
pedido1.agregarItem(new PedidoItem(3, 4, 20)) // Dietética: 20 Shot Jengibre
pedido1.agregarItem(new PedidoItem(4, 4, 30)) // Gym: 30 Shot Jengibre
pedido1.agregarItem(new PedidoItem(4, 5, 15)) // Gym: 15 Shot Cúrcuma

const pedido2 = new Pedido(2, "2026-W10", new Date("2026-03-02"), new Date("2026-03-06"))
pedido2.agregarItem(new PedidoItem(1, 2, 5))  // Juan: 5 Naranja Clásico
pedido2.agregarItem(new PedidoItem(2, 1, 4))  // María: 4 Jugo Verde
pedido2.agregarItem(new PedidoItem(3, 3, 8))  // Dietética: 8 Zanahoria Naranja

export const pedidosMock: Array<Pedido> = [pedido1, pedido2]