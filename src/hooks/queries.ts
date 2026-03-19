import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import * as api from "../lib/api";
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
} from "../lib/database.types";

// ---- Query keys ----

export const queryKeys = {
	clientes: ["clientes"] as const,
	ingredientes: ["ingredientes"] as const,
	productos: ["productos"] as const,
	recetas: ["recetas"] as const,
	pedidos: ["pedidos"] as const,
	preciosSemana: (semana: string): readonly [string, string] =>
		["precios", semana] as const,
};

// ---- Clientes ----

export function useClientes(): UseQueryResult<Array<Cliente>> {
	return useQuery({
		queryKey: queryKeys.clientes,
		queryFn: api.fetchClientes,
	});
}

export function useInsertCliente(): UseMutationResult<Cliente, Error, ClienteInsert> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.insertCliente,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.clientes });
		},
	});
}

export function useUpdateCliente(): UseMutationResult<
	Cliente,
	Error,
	{ id: number; campos: Partial<ClienteInsert> }
> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, campos }) => api.updateCliente(id, campos),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.clientes });
		},
	});
}

export function useDeleteCliente(): UseMutationResult<void, Error, number> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.deleteCliente,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.clientes });
		},
	});
}

// ---- Ingredientes ----

export function useIngredientes(): UseQueryResult<Array<Ingrediente>> {
	return useQuery({
		queryKey: queryKeys.ingredientes,
		queryFn: api.fetchIngredientes,
	});
}

export function useInsertIngrediente(): UseMutationResult<Ingrediente, Error, IngredienteInsert> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.insertIngrediente,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.ingredientes });
		},
	});
}

export function useUpdateIngrediente(): UseMutationResult<
	Ingrediente,
	Error,
	{ id: number; campos: Partial<IngredienteInsert> }
> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, campos }) => api.updateIngrediente(id, campos),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.ingredientes });
		},
	});
}

export function useDeleteIngrediente(): UseMutationResult<void, Error, number> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.deleteIngrediente,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.ingredientes });
		},
	});
}

// ---- Productos ----

export function useProductos(): UseQueryResult<Array<Producto>> {
	return useQuery({
		queryKey: queryKeys.productos,
		queryFn: api.fetchProductos,
	});
}

export function useInsertProducto(): UseMutationResult<Producto, Error, ProductoInsert> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.insertProducto,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.productos });
		},
	});
}

export function useUpdateProducto(): UseMutationResult<
	Producto,
	Error,
	{ id: number; campos: Partial<ProductoInsert> }
> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, campos }) => api.updateProducto(id, campos),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.productos });
		},
	});
}

export function useDeleteProducto(): UseMutationResult<void, Error, number> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.deleteProducto,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.productos });
		},
	});
}

// ---- Recetas ----

export function useRecetas(): UseQueryResult<Array<RecetaConItems>> {
	return useQuery({
		queryKey: queryKeys.recetas,
		queryFn: api.fetchRecetas,
	});
}

// ---- Pedidos ----

export function usePedidos(): UseQueryResult<Array<PedidoConItems>> {
	return useQuery({
		queryKey: queryKeys.pedidos,
		queryFn: api.fetchPedidos,
	});
}

export function useInsertPedido(): UseMutationResult<PedidoConItems, Error, PedidoInsert> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.insertPedido,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.pedidos });
		},
	});
}

export function useAddItemToPedido(): UseMutationResult<void, Error, PedidoItemInsert> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.addItemToPedido,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.pedidos });
		},
	});
}

export function useDeletePedido(): UseMutationResult<void, Error, number> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.deletePedido,
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: queryKeys.pedidos });
		},
	});
}

// ---- Precios ----

export function usePreciosSemana(
	semana: string
): UseQueryResult<Array<PrecioIngrediente>> {
	return useQuery({
		queryKey: queryKeys.preciosSemana(semana),
		queryFn: () => api.fetchPreciosSemana(semana),
		enabled: semana.length > 0,
	});
}

export function useUpsertPrecio(): UseMutationResult<
	PrecioIngrediente,
	Error,
	PrecioIngredienteInsert
> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.upsertPrecioIngrediente,
		onSuccess: async (_data, variables) => {
			await qc.invalidateQueries({
				queryKey: queryKeys.preciosSemana(variables.semana),
			});
		},
	});
}
