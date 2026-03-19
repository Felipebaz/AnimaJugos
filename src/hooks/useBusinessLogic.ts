import type { PedidoItem, RecetaItem } from "../lib/database.types";

export function calcularTotalUnidades(items: Array<PedidoItem>): number {
	return items.reduce((total, item) => total + item.cantidad, 0);
}

export function calcularTotalPorProducto(
	items: Array<PedidoItem>
): Map<number, number> {
	const totales = new Map<number, number>();
	for (const item of items) {
		const actual = totales.get(item.producto_id) ?? 0;
		totales.set(item.producto_id, actual + item.cantidad);
	}
	return totales;
}

export function escalarReceta(
	items: Array<RecetaItem>,
	volumenBase: number,
	volumenTarget: number
): Array<{ ingredienteId: number; cantidad: number; unidad: string }> {
	const factor = volumenTarget / volumenBase;
	return items.map((item) => ({
		ingredienteId: item.ingrediente_id,
		cantidad: Number((item.cantidad * factor).toFixed(3)),
		unidad: item.unidad,
	}));
}
