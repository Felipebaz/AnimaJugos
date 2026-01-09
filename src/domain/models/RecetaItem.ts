export type Unidad = "g" | "ml" | "u";

export class RecetaItem {
    public ingredienteId: number;
    public cantidad: number;
    public unidad: Unidad;
  
    public constructor(ingredienteId: number, cantidad: number, unidad: Unidad) {
        this.ingredienteId = ingredienteId;
        this.cantidad = cantidad;
        this.unidad = unidad;
    if (cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");
  }
}
