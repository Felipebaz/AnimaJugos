import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { DataTable, type Column } from "../components/ui/DataTable";
import {
	usePedidos,
	useProductos,
	useRecetas,
	useIngredientes,
	usePreciosSemana,
	useUpsertPrecio,
} from "../hooks/queries";

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
	const { data: pedidos } = usePedidos();
	const { data: productos } = useProductos();
	const { data: recetas } = useRecetas();
	const { data: ingredientes } = useIngredientes();

	const [semana, setSemana] = useState("");
	const { data: preciosDb } = usePreciosSemana(semana);
	const upsertPrecio = useUpsertPrecio();

	const semanasDisponibles = useMemo(() => {
		if (!pedidos) return [];
		const set = new Set<string>();
		for (const p of pedidos) {
			set.add(p.semana);
		}
		return [...set].sort((a, b) => b.localeCompare(a));
	}, [pedidos]);

	const preciosMap = useMemo(() => {
		const map = new Map<number, number>();
		if (preciosDb) {
			for (const p of preciosDb) {
				map.set(p.ingrediente_id, Number(p.precio_unitario));
			}
		}
		return map;
	}, [preciosDb]);

	const ingredientesEnUso: Array<IngredienteEnUso> = useMemo(() => {
		if (!semana || !pedidos || !recetas || !ingredientes) return [];

		const pedidosSemana = pedidos.filter((p) => p.semana === semana);
		const idsIngredientes = new Set<number>();

		for (const pedido of pedidosSemana) {
			for (const item of pedido.pedido_items) {
				const receta = recetas.find((r) => r.producto_id === item.producto_id);
				if (!receta) continue;
				for (const ri of receta.receta_items) {
					idsIngredientes.add(ri.ingrediente_id);
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

	const handlePrecioChange = useCallback(
		(ingredienteId: number, valor: string): void => {
			const numero = Number.parseFloat(valor);
			if (Number.isNaN(numero) || numero < 0 || !semana) return;
			// eslint-disable-next-line camelcase
			upsertPrecio.mutate({ ingrediente_id: ingredienteId, precio_unitario: numero, semana });
		},
		[semana, upsertPrecio]
	);

	const filas: Array<FilaRentabilidad> = useMemo(() => {
		if (!semana || !pedidos || !productos || !recetas) return [];

		const pedidosSemana = pedidos.filter((p) => p.semana === semana);

		const unidadesPorProducto = new Map<number, number>();
		for (const pedido of pedidosSemana) {
			for (const item of pedido.pedido_items) {
				const actual = unidadesPorProducto.get(item.producto_id) ?? 0;
				unidadesPorProducto.set(item.producto_id, actual + item.cantidad);
			}
		}

		const resultado: Array<FilaRentabilidad> = [];
		for (const [productoId, unidades] of unidadesPorProducto) {
			const producto = productos.find((p) => p.id === productoId);
			if (!producto) continue;

			const receta = recetas.find((r) => r.producto_id === productoId);
			let costoUnitario = 0;
			if (receta) {
				for (const ri of receta.receta_items) {
					costoUnitario +=
						Number(ri.cantidad) *
						(preciosMap.get(ri.ingrediente_id) ?? 0);
				}
			}

			const ingreso = Number(producto.precio) * unidades;
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
	}, [semana, pedidos, productos, recetas, preciosMap]);

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
										defaultValue={preciosMap.get(ing.id) ?? ""}
										id={`precio-${ing.id}`}
										min="0"
										placeholder="0.00"
										step="0.01"
										type="number"
										onBlur={(event): void => {
											handlePrecioChange(ing.id, event.target.value);
										}}
									/>
								</div>
							))}
						</div>
					</div>

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
