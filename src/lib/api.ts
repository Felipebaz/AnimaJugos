import { supabase } from "./supabase";
import type {
	Cliente,
	ClienteInsert,
	Ingrediente,
	IngredienteInsert,
	Producto,
	ProductoInsert,
	RecetaConItems,
	PedidoConItems,
	PedidoInsert,
	PedidoItemInsert,
	PrecioIngrediente,
	PrecioIngredienteInsert,
} from "./database.types";

// ---- Clientes ----

export async function fetchClientes(): Promise<Array<Cliente>> {
	const { data, error } = await supabase
		.from("clientes")
		.select("*")
		.order("id");
	if (error) throw error;
	return data as Array<Cliente>;
}

export async function insertCliente(
	cliente: ClienteInsert
): Promise<Cliente> {
	const { data, error } = await supabase
		.from("clientes")
		.insert(cliente)
		.select()
		.single();
	if (error) throw error;
	return data as Cliente;
}

export async function updateCliente(
	id: number,
	campos: Partial<ClienteInsert>
): Promise<Cliente> {
	const { data, error } = await supabase
		.from("clientes")
		.update(campos)
		.eq("id", id)
		.select()
		.single();
	if (error) throw error;
	return data as Cliente;
}

export async function deleteCliente(id: number): Promise<void> {
	const { error } = await supabase.from("clientes").delete().eq("id", id);
	if (error) throw error;
}

// ---- Ingredientes ----

export async function fetchIngredientes(): Promise<Array<Ingrediente>> {
	const { data, error } = await supabase
		.from("ingredientes")
		.select("*")
		.order("id");
	if (error) throw error;
	return data as Array<Ingrediente>;
}

export async function insertIngrediente(
	ingrediente: IngredienteInsert
): Promise<Ingrediente> {
	const { data, error } = await supabase
		.from("ingredientes")
		.insert(ingrediente)
		.select()
		.single();
	if (error) throw error;
	return data as Ingrediente;
}

export async function updateIngrediente(
	id: number,
	campos: Partial<IngredienteInsert>
): Promise<Ingrediente> {
	const { data, error } = await supabase
		.from("ingredientes")
		.update(campos)
		.eq("id", id)
		.select()
		.single();
	if (error) throw error;
	return data as Ingrediente;
}

export async function deleteIngrediente(id: number): Promise<void> {
	const { error } = await supabase
		.from("ingredientes")
		.delete()
		.eq("id", id);
	if (error) throw error;
}

// ---- Productos ----

export async function fetchProductos(): Promise<Array<Producto>> {
	const { data, error } = await supabase
		.from("productos")
		.select("*")
		.order("id");
	if (error) throw error;
	return data as Array<Producto>;
}

export async function insertProducto(
	producto: ProductoInsert
): Promise<Producto> {
	const { data, error } = await supabase
		.from("productos")
		.insert(producto)
		.select()
		.single();
	if (error) throw error;
	return data as Producto;
}

export async function updateProducto(
	id: number,
	campos: Partial<ProductoInsert>
): Promise<Producto> {
	const { data, error } = await supabase
		.from("productos")
		.update(campos)
		.eq("id", id)
		.select()
		.single();
	if (error) throw error;
	return data as Producto;
}

export async function deleteProducto(id: number): Promise<void> {
	const { error } = await supabase.from("productos").delete().eq("id", id);
	if (error) throw error;
}

// ---- Recetas (con items nested) ----

export async function fetchRecetas(): Promise<Array<RecetaConItems>> {
	const { data, error } = await supabase
		.from("recetas")
		.select("*, receta_items(*)")
		.order("id");
	if (error) throw error;
	return data as unknown as Array<RecetaConItems>;
}

// ---- Pedidos (con items nested) ----

export async function fetchPedidos(): Promise<Array<PedidoConItems>> {
	const { data, error } = await supabase
		.from("pedidos")
		.select("*, pedido_items(*)")
		.order("id");
	if (error) throw error;
	return data as unknown as Array<PedidoConItems>;
}

export async function insertPedido(
	pedido: PedidoInsert
): Promise<PedidoConItems> {
	const { data, error } = await supabase
		.from("pedidos")
		.insert(pedido)
		.select("*, pedido_items(*)")
		.single();
	if (error) throw error;
	return data as unknown as PedidoConItems;
}

export async function addItemToPedido(
	item: PedidoItemInsert
): Promise<void> {
	const { error } = await supabase.from("pedido_items").insert(item);
	if (error) throw error;
}

export async function deletePedido(id: number): Promise<void> {
	const { error } = await supabase.from("pedidos").delete().eq("id", id);
	if (error) throw error;
}

// ---- Precios de ingredientes ----

export async function fetchPreciosSemana(
	semana: string
): Promise<Array<PrecioIngrediente>> {
	const { data, error } = await supabase
		.from("precio_ingredientes")
		.select("*")
		.eq("semana", semana);
	if (error) throw error;
	return data as Array<PrecioIngrediente>;
}

export async function upsertPrecioIngrediente(
	precio: PrecioIngredienteInsert
): Promise<PrecioIngrediente> {
	const { data, error } = await supabase
		.from("precio_ingredientes")
		.upsert(precio, {
			onConflict: "ingrediente_id,semana",
		})
		.select()
		.single();
	if (error) throw error;
	return data as PrecioIngrediente;
}
