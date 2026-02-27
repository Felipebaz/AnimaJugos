import { create } from "zustand"
import type { Cliente } from "../domain/models/Cliente"
import type { Ingrediente } from "../domain/models/Ingrediente"
import type { Producto } from "../domain/models/Producto"
import type { Receta } from "../domain/models/Receta"
import type { Pedido } from "../domain/models/Pedido"
import {
  clientesMock,
  ingredientesMock,
  productosMock,
  recetasMock,
  pedidosMock,
} from "./mockData"

interface AppStore {
  // estado
  clientes: Array<Cliente>
  ingredientes: Array<Ingrediente>
  productos: Array<Producto>
  recetas: Array<Receta>
  pedidos: Array<Pedido>

  // Clientes
  agregarCliente: (c: Cliente) => void
  eliminarCliente: (id: number) => void

  // Productos
  agregarProducto: (p: Producto) => void
  actualizarProducto: (id: number, datos: Partial<Producto>) => void
  eliminarProducto: (id: number) => void

  // Ingredientes
  agregarIngrediente: (index: Ingrediente) => void
  eliminarIngrediente: (id: number) => void

  // Recetas
  agregarReceta: (r: Receta) => void
  eliminarReceta: (id: number) => void

  // Pedidos
  agregarPedido: (p: Pedido) => void
  eliminarPedido: (id: number) => void

  // Helpers
  getProductoById: (id: number) => Producto | undefined
  getIngredienteById: (id: number) => Ingrediente | undefined
  getClienteById: (id: number) => Cliente | undefined
  getRecetaPorProducto: (productoId: number) => Receta | undefined
}

export const useAppStore = create<AppStore>((set, get) => ({
  // estado inicial
  clientes: clientesMock,
  ingredientes: ingredientesMock,
  productos: productosMock,
  recetas: recetasMock,
  pedidos: pedidosMock,

  // Clientes
  agregarCliente: (c: Cliente): void =>{
    set((s) => ({ clientes: [...s.clientes, c] }))},
  eliminarCliente: (id: number): void =>{
    set((s) => ({ clientes: s.clientes.filter((c) => c.id !== id) }))},


  // Productos
  agregarProducto: (p: Producto): void =>{
    set((s) => ({ productos: [...s.productos, p] }))},
  actualizarProducto: (id, datos): void =>{
    set((s) => ({
      productos: s.productos.map((p) =>
        p.id === id ? Object.assign(p, datos) : p
      ),
    }))},
  eliminarProducto: (id): void =>{
    set((s) => ({ productos: s.productos.filter((p) => p.id !== id) }))},

  // Ingredientes
  agregarIngrediente: (index: Ingrediente): void =>{
    set((s) => ({ ingredientes: [...s.ingredientes, index] }))},
  eliminarIngrediente: (id): void =>{
    set((s) => ({ ingredientes: s.ingredientes.filter((index) => index.id !== id) }))},

  // Recetas
  agregarReceta: (r: Receta): void =>{
    set((s) => ({ recetas: [...s.recetas, r] }))},
  eliminarReceta: (id): void =>{
    set((s) => ({ recetas: s.recetas.filter((r) => r.id !== id) }))},

  // Pedidos
  agregarPedido: (p: Pedido): void =>{
    set((s) => ({ pedidos: [...s.pedidos, p] }))},
  eliminarPedido: (id): void =>{
    set((s) => ({ pedidos: s.pedidos.filter((p) => p.id !== id) }))},

  // Helpers - usan get() para acceder al estado actual
  getProductoById: (id): Producto | undefined=>{
    return get().productos.find((p) => p.id === id)},
  getIngredienteById: (id): Ingrediente | undefined =>{
    return get().ingredientes.find((index) => index.id === id)},
  getClienteById: (id): Cliente | undefined  =>{
    return get().clientes.find((c) => c.id === id)},
  getRecetaPorProducto: (productoId): Receta | undefined =>{
    return get().recetas.find((r) => r.productoId === productoId)},
}))
