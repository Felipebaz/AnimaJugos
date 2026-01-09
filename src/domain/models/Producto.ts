export type TipoProducto = "JUGO" | "SHOT";

export class Producto {
    public id: number;
    public nombre: string;
    public tipo: TipoProducto;
    public precio: number;
    public activo: boolean = true;

  public constructor( id: number, nombre: string, tipo: TipoProducto, precio: number, activo: boolean){
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.precio = precio;
    this.activo = activo; 
  }
}
