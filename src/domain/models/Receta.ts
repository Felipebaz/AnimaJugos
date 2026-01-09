import { RecetaItem } from "./RecetaItem";

export class Receta {
  private items: Array<RecetaItem> = [];

  public constructor(
    public id: number,
    public productoId: number,
    public volumenBaseMl: number = 910
  ) {
    if (volumenBaseMl <= 0) {
      throw new Error("El volumen base debe ser mayor a 0");
    }
  }

  /** Devuelve los ingredientes de la receta (copia defensiva) */
  public getItems(): Array<RecetaItem>{
    return [...this.items];
  }

  /** Agrega o suma un ingrediente a la receta */
  public agregarItem(item: RecetaItem): void {
    const existente = this.items.find(
      recetaItem => recetaItem.ingredienteId === item.ingredienteId
    );

    if (existente) {
      if (existente.unidad !== item.unidad) {
        throw new Error("Unidad distinta para el mismo ingrediente");
      }
      existente.cantidad += item.cantidad;
      return;
    }

    this.items.push(item);
  }

  /** Quita un ingrediente de la receta */
  public quitarIngrediente(ingredienteId: number): void {
    this.items = this.items.filter(
      recetaItem => recetaItem.ingredienteId !== ingredienteId
    );
  }

  /** Devuelve la receta escalada a otro volumen (ej: 500 ml) */
  public itemsParaVolumen(volumenMl: number): Array<RecetaItem> {
    if (volumenMl <= 0) {
      throw new Error("El volumen debe ser mayor a 0");
    }

    const factor = volumenMl / this.volumenBaseMl;

    return this.items.map(
      recetaItem =>
        new RecetaItem(
          recetaItem.ingredienteId,
          Number((recetaItem.cantidad * factor).toFixed(3)),
          recetaItem.unidad
        )
    );
  }

  /** Indica si la receta usa un ingrediente */
  public tieneIngrediente(ingredienteId: number): boolean {
    return this.items.some(recetaItem => recetaItem.ingredienteId === ingredienteId);
  }
}
