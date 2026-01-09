export class Cliente {
	public constructor(
		public id: number,
		public nombre: string,
		public direccion: string,
		public contacto: string
	) {
		if (nombre.trim().length === 0) {
			throw new Error("El nombre del cliente no puede estar vacío");
		}
	}
}
