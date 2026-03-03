export class PrecioIngrediente {
	public ingredienteId: number;
	public precioUnitario: number;

	public constructor(ingredienteId: number, precioUnitario: number) {
		if (precioUnitario < 0) {
			throw new Error("El precio unitario no puede ser negativo");
		}
		this.ingredienteId = ingredienteId;
		this.precioUnitario = precioUnitario;
	}
}
