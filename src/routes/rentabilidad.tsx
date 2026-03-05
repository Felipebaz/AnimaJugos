import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { DataTable } from "../components/ui/DataTable";
// eslint-disable-next-line no-duplicate-imports
import type { Column } from "../components/ui/DataTable";
import { PrecioIngrediente } from "../domain/models/PrecioIngrediente";
import { useAppStore } from "../store/appStore";

interface FilaRentabilidad {
	productoId: number;
	nombre: string;
	unidades: number;
	ingreso: number;
	costo: number;
	ganancia: number;
	margen: number;
}

interface IngredienteEnUso {
	id: number;
	nombre: string;
	unidad: string;
}

function RentabilidadPage(): JSX.Element {
	const pedidos = useAppStore((s) => s.pedidos);
	const productos = useAppStore((s) => s.productos);
	const recetas = useAppStore((s) => s.recetas);
	const ingredientes = useAppStore((s) => s.ingredientes);

	const [semana, setSemana] = useState("");
	const [precios, setPrecios] = useState<Map<number, PrecioIngrediente>>(
		new Map()
	);

	const semanasDisponibles = useMemo(() => {
		const set = new Set<string>();
		for (const p of pedidos) {
			set.add(p.semana);
		}
		return [...set].sort((a, b) => b.localeCompare(a));
	}, [pedidos]);

	// Ingredientes que aparecen en las recetas de los productos pedidos esa semana
	const ingredientesEnUso: Array<IngredienteEnUso> = useMemo(() => {
		if (!semana) return [];

		const pedidosSemana = pedidos.filter((p) => p.semana === semana);
		const idsIngredientes = new Set<number>();

		for (const pedido of pedidosSemana) {
			for (const item of pedido.getItems()) {
				const receta = recetas.find((r) => r.productoId === item.idProducto);
				if (!receta) continue;
				for (const ri of receta.getItems()) {
					idsIngredientes.add(ri.ingredienteId);
				}
			}
		}

		const resultado: Array<IngredienteEnUso> = [];
		for (const id of idsIngredientes) {
			const ing = ingredientes.find((index) => index.id === id);
			if (ing) {
				resultado.push({ id: ing.id, nombre: ing.nombre, unidad: ing.unidad });
			}
		}
		return resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
	}, [semana, pedidos, recetas, ingredientes]);

	/*
	function getPrecioUnitario(ingredienteId: number): number {
		return precios.get(ingredienteId)?.precioUnitario ?? 0;
	}
	*/

	function handlePrecioChange(ingredienteId: number, valor: string): void {
		const numero = Number.parseFloat(valor);
		setPrecios((previous) => {
			const next = new Map(previous);
			if (Number.isNaN(numero) || numero < 0) {
				next.delete(ingredienteId);
			} else {
				next.set(
					ingredienteId,
					new PrecioIngrediente(ingredienteId, numero)
				);
			}
			return next;
		});
	}

	// Calcular costo de un producto a partir de su receta y los precios cargados
	/*function costoProducto(productoId: number): number {
		const receta = recetas.find((r) => r.productoId === productoId);
		if (!receta) return 0;

		let costo = 0;
		for (const ri of receta.getItems()) {
			costo += ri.cantidad * getPrecioUnitario(ri.ingredienteId);
		}
		return costo;
	}*/

	const filas: Array<FilaRentabilidad> = useMemo(() => {
		if (!semana) return [];

		const pedidosSemana = pedidos.filter((p) => p.semana === semana);

		// Agrupar unidades vendidas por producto
		const unidadesPorProducto = new Map<number, number>();
		for (const pedido of pedidosSemana) {
			for (const item of pedido.getItems()) {
				const actual = unidadesPorProducto.get(item.idProducto) ?? 0;
				unidadesPorProducto.set(item.idProducto, actual + item.cantidad);
			}
		}

		const resultado: Array<FilaRentabilidad> = [];
		for (const [productoId, unidades] of unidadesPorProducto) {
			const producto = productos.find((p) => p.id === productoId);
			if (!producto) continue;

			const receta = recetas.find((r) => r.productoId === productoId);
			let costoUnitario = 0;
			if (receta) {
				for (const ri of receta.getItems()) {
					costoUnitario += ri.cantidad * (precios.get(ri.ingredienteId)?.precioUnitario ?? 0);
				}
			}

			const ingreso = producto.precio * unidades;
			const costo = costoUnitario * unidades;
			const ganancia = ingreso - costo;
			const margen = ingreso > 0 ? (ganancia / ingreso) * 100 : 0;

			resultado.push({
				productoId,
				nombre: producto.nombre,
				unidades,
				ingreso,
				costo,
				ganancia,
				margen,
			});
		}

		return resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
	}, [semana, pedidos, productos, recetas, precios]);

	const totales = useMemo(() => {
		let ingreso = 0;
		let costo = 0;
		for (const f of filas) {
			ingreso += f.ingreso;
			costo += f.costo;
		}
		return { ingreso, costo, ganancia: ingreso - costo };
	}, [filas]);

	const columns: Array<Column<FilaRentabilidad>> = [
		{
			header: "Producto",
			render: (f: FilaRentabilidad): string => f.nombre,
		},
		{
			header: "Unidades",
			render: (f: FilaRentabilidad): number => f.unidades,
		},
		{
			header: "Ingreso",
			render: (f: FilaRentabilidad): string => `$${f.ingreso.toFixed(2)}`,
		},
		{
			header: "Costo",
			render: (f: FilaRentabilidad): string => `$${f.costo.toFixed(2)}`,
		},
		{
			header: "Ganancia",
			render: (f: FilaRentabilidad): JSX.Element => (
				<span className={f.ganancia >= 0 ? "text-green-700" : "text-red-600"}>
					${f.ganancia.toFixed(2)}
				</span>
			),
		},
		{
			header: "Margen %",
			render: (f: FilaRentabilidad): JSX.Element => (
				<span className={f.margen >= 0 ? "text-green-700" : "text-red-600"}>
					{f.margen.toFixed(1)}%
				</span>
			),
		},
	];

	const inputClasses =
		"rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Rentabilidad</h1>

			{/* Selector de semana */}
			<div className="flex items-end gap-4">
				<div className="flex flex-col gap-1">
					<label
						className="text-xs font-medium text-gray-600"
						htmlFor="semana-rentabilidad"
					>
						Semana
					</label>
					<select
						className={inputClasses}
						id="semana-rentabilidad"
						value={semana}
						onChange={(event): void => { setSemana(event.target.value); }}
					>
						<option value="">Seleccionar semana...</option>
						{semanasDisponibles.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>
			</div>

			{semana && ingredientesEnUso.length > 0 && (
				<>
					{/* Precios de ingredientes */}
					<div className="rounded-lg border border-gray-200 bg-white p-4">
						<h2 className="mb-3 text-sm font-semibold text-gray-700">
							Precios de ingredientes (por unidad)
						</h2>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{ingredientesEnUso.map((ing) => (
								<div key={ing.id} className="flex flex-col gap-1">
									<label
										className="text-xs text-gray-500"
										htmlFor={`precio-${ing.id}`}
									>
										{ing.nombre} ({ing.unidad})
									</label>
									<input
										className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										id={`precio-${ing.id}`}
										min="0"
										placeholder="0.00"
										step="0.01"
										type="number"
										value={precios.get(ing.id)?.precioUnitario ?? ""}
										onChange={(event): void =>
											{ handlePrecioChange(ing.id, event.target.value); }
										}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Tarjetas resumen */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="rounded-lg border border-gray-200 bg-white p-4">
							<p className="text-xs font-medium uppercase text-gray-500">
								Ingreso total
							</p>
							<p className="mt-1 text-2xl font-bold text-gray-900">
								${totales.ingreso.toFixed(2)}
							</p>
						</div>
						<div className="rounded-lg border border-gray-200 bg-white p-4">
							<p className="text-xs font-medium uppercase text-gray-500">
								Costo total
							</p>
							<p className="mt-1 text-2xl font-bold text-gray-900">
								${totales.costo.toFixed(2)}
							</p>
						</div>
						<div className="rounded-lg border border-gray-200 bg-white p-4">
							<p className="text-xs font-medium uppercase text-gray-500">
								Ganancia
							</p>
							<p
								className={`mt-1 text-2xl font-bold ${
									totales.ganancia >= 0 ? "text-green-700" : "text-red-600"
								}`}
							>
								${totales.ganancia.toFixed(2)}
							</p>
						</div>
					</div>

					{/* Tabla de desglose */}
					<DataTable<FilaRentabilidad>
						columns={columns}
						data={filas}
						getRowId={(f: FilaRentabilidad): number => f.productoId}
					/>
				</>
			)}

			{semana && ingredientesEnUso.length === 0 && (
				<p className="text-sm text-gray-500">
					No hay pedidos para la semana seleccionada.
				</p>
			)}
		</div>
	);
}

export const Route = createFileRoute("/rentabilidad")({
	component: RentabilidadPage,
});
