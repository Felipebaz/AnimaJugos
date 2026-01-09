export class Ingrediente {
	public id: number;
	public nombre: string;
	public unidad: string;

	public constructor(id: number, nombre: string, unidad: string) {
		this.id = id;
		this.nombre = nombre;
		this.unidad = unidad;
	}
}
