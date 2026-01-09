export class PedidoItem {
	public idCliente: number;
	public idProducto: number;
	public cantidad: number;

	public constructor(idCliente: number, idProducto: number, cantidad: number) {
		this.idCliente = idCliente;
		this.idProducto = idProducto;
		this.cantidad = cantidad;
		if (cantidad <= 0) {
			throw new Error("La cantidad del pedido debe ser mayor a 0");
		}
	}
}
