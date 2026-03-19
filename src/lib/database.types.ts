export interface Database {
	public: {
		Tables: {
			clientes: {
				Row: {
					id: number;
					nombre: string;
					direccion: string;
					contacto: string;
				};
				Insert: {
					id?: number;
					nombre: string;
					direccion: string;
					contacto: string;
				};
				Update: {
					id?: number;
					nombre?: string;
					direccion?: string;
					contacto?: string;
				};
				Relationships: [];
			};
			ingredientes: {
				Row: {
					id: number;
					nombre: string;
					unidad: string;
				};
				Insert: {
					id?: number;
					nombre: string;
					unidad: string;
				};
				Update: {
					id?: number;
					nombre?: string;
					unidad?: string;
				};
				Relationships: [];
			};
			productos: {
				Row: {
					id: number;
					nombre: string;
					tipo: string;
					precio: number;
					activo: boolean;
				};
				Insert: {
					id?: number;
					nombre: string;
					tipo: string;
					precio: number;
					activo?: boolean;
				};
				Update: {
					id?: number;
					nombre?: string;
					tipo?: string;
					precio?: number;
					activo?: boolean;
				};
				Relationships: [];
			};
			recetas: {
				Row: {
					id: number;
					producto_id: number;
					volumen_base_ml: number;
				};
				Insert: {
					id?: number;
					producto_id: number;
					volumen_base_ml?: number;
				};
				Update: {
					id?: number;
					producto_id?: number;
					volumen_base_ml?: number;
				};
				Relationships: [
					{
						foreignKeyName: "recetas_producto_id_fkey";
						columns: ["producto_id"];
						referencedRelation: "productos";
						referencedColumns: ["id"];
					},
				];
			};
			receta_items: {
				Row: {
					id: number;
					receta_id: number;
					ingrediente_id: number;
					cantidad: number;
					unidad: string;
				};
				Insert: {
					id?: number;
					receta_id: number;
					ingrediente_id: number;
					cantidad: number;
					unidad: string;
				};
				Update: {
					id?: number;
					receta_id?: number;
					ingrediente_id?: number;
					cantidad?: number;
					unidad?: string;
				};
				Relationships: [
					{
						foreignKeyName: "receta_items_receta_id_fkey";
						columns: ["receta_id"];
						referencedRelation: "recetas";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "receta_items_ingrediente_id_fkey";
						columns: ["ingrediente_id"];
						referencedRelation: "ingredientes";
						referencedColumns: ["id"];
					},
				];
			};
			pedidos: {
				Row: {
					id: number;
					semana: string;
					fecha_inicio: string;
					fecha_fin: string;
				};
				Insert: {
					id?: number;
					semana: string;
					fecha_inicio: string;
					fecha_fin: string;
				};
				Update: {
					id?: number;
					semana?: string;
					fecha_inicio?: string;
					fecha_fin?: string;
				};
				Relationships: [];
			};
			pedido_items: {
				Row: {
					id: number;
					pedido_id: number;
					cliente_id: number;
					producto_id: number;
					cantidad: number;
				};
				Insert: {
					id?: number;
					pedido_id: number;
					cliente_id: number;
					producto_id: number;
					cantidad: number;
				};
				Update: {
					id?: number;
					pedido_id?: number;
					cliente_id?: number;
					producto_id?: number;
					cantidad?: number;
				};
				Relationships: [
					{
						foreignKeyName: "pedido_items_pedido_id_fkey";
						columns: ["pedido_id"];
						referencedRelation: "pedidos";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "pedido_items_cliente_id_fkey";
						columns: ["cliente_id"];
						referencedRelation: "clientes";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "pedido_items_producto_id_fkey";
						columns: ["producto_id"];
						referencedRelation: "productos";
						referencedColumns: ["id"];
					},
				];
			};
			precio_ingredientes: {
				Row: {
					id: number;
					ingrediente_id: number;
					precio_unitario: number;
					semana: string;
				};
				Insert: {
					id?: number;
					ingrediente_id: number;
					precio_unitario: number;
					semana: string;
				};
				Update: {
					id?: number;
					ingrediente_id?: number;
					precio_unitario?: number;
					semana?: string;
				};
				Relationships: [
					{
						foreignKeyName: "precio_ingredientes_ingrediente_id_fkey";
						columns: ["ingrediente_id"];
						referencedRelation: "ingredientes";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
}

// Convenience row types
export type Cliente = Database["public"]["Tables"]["clientes"]["Row"];
export type ClienteInsert = Database["public"]["Tables"]["clientes"]["Insert"];
export type Ingrediente = Database["public"]["Tables"]["ingredientes"]["Row"];
export type IngredienteInsert = Database["public"]["Tables"]["ingredientes"]["Insert"];
export type Producto = Database["public"]["Tables"]["productos"]["Row"];
export type ProductoInsert = Database["public"]["Tables"]["productos"]["Insert"];
export type Receta = Database["public"]["Tables"]["recetas"]["Row"];
export type RecetaItem = Database["public"]["Tables"]["receta_items"]["Row"];
export type RecetaItemInsert = Database["public"]["Tables"]["receta_items"]["Insert"];
export type Pedido = Database["public"]["Tables"]["pedidos"]["Row"];
export type PedidoInsert = Database["public"]["Tables"]["pedidos"]["Insert"];
export type PedidoItem = Database["public"]["Tables"]["pedido_items"]["Row"];
export type PedidoItemInsert = Database["public"]["Tables"]["pedido_items"]["Insert"];
export type PrecioIngrediente = Database["public"]["Tables"]["precio_ingredientes"]["Row"];
export type PrecioIngredienteInsert = Database["public"]["Tables"]["precio_ingredientes"]["Insert"];

export interface RecetaConItems extends Receta {
	receta_items: Array<RecetaItem>;
}

export interface PedidoConItems extends Pedido {
	pedido_items: Array<PedidoItem>;
}
