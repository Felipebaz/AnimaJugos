import type { PedidoItem } from "./PedidoItem";

export class Pedido {
	public id: number;
	public semana: string; // ej: "2026-W02"
	public fechaInicio: Date;
	public fechaFin: Date;
	private items: Array<PedidoItem>;

	public constructor(
		id: number,
		semana: string,
		fechaInicio: Date,
		fechaFin: Date
	) {
		if (fechaFin < fechaInicio) {
			throw new Error("La fecha fin no puede ser anterior a la fecha inicio");
		}

		this.id = id;
		this.semana = semana;
		this.fechaInicio = fechaInicio;
		this.fechaFin = fechaFin;
		this.items = [];
	}

	public getItems(): Array<PedidoItem> {
		return [...this.items];
	}

	/**
	 * Agrega un item al pedido.
	 * Si ya existe (mismo cliente y producto), suma cantidades.
	 */
	public agregarItem(item: PedidoItem): void {
		const itemExistente = this.items.find(
			(pedidoItem) =>
				pedidoItem.idCliente === item.idCliente &&
				pedidoItem.idProducto === item.idProducto
		);

		if (itemExistente) {
			itemExistente.cantidad += item.cantidad;
			return;
		}

		this.items.push(item);
	}

	/** Elimina una línea del pedido */
	public quitarItem(idCliente: number, idProducto: number): void {
		this.items = this.items.filter(
			(pedidoItem) =>
				!(
					pedidoItem.idCliente === idCliente &&
					pedidoItem.idProducto === idProducto
				)
		);
	}

	/** Total de botellas/unidades pedidas */
	public totalUnidades(): number {
		return this.items.reduce(
			(total, pedidoItem) => total + pedidoItem.cantidad,
			0
		);
	}

	/**
	 * Total por producto.
	 * Clave = idProducto
	 * Valor = cantidad total pedida
	 */
	public totalPorProducto(): Map<number, number> {
		const totales = new Map<number, number>();

		for (const pedidoItem of this.items) {
			const actual = totales.get(pedidoItem.idProducto) ?? 0;
			totales.set(pedidoItem.idProducto, actual + pedidoItem.cantidad);
		}

		return totales;
	}
}
