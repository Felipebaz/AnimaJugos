import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import {
	usePedidos,
	useRecetas,
	useIngredientes,
	usePreciosSemana,
	useUpsertPrecio,
} from "../hooks/queries";

interface FilaCompra {
	ingredienteId: number;
	nombre: string;
	cantidadTotal: number;
	unidad: string;
}

function ListaComprasPage(): JSX.Element {
	const { data: pedidos } = usePedidos();
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

	const filas: Array<FilaCompra> = useMemo(() => {
		if (!semana || !pedidos || !recetas || !ingredientes) return [];

		const pedidosSemana = pedidos.filter((p) => p.semana === semana);
		const necesidades = new Map<number, { cantidad: number; unidad: string }>();

		for (const pedido of pedidosSemana) {
			for (const item of pedido.pedido_items) {
				const receta = recetas.find((r) => r.producto_id === item.producto_id);
				if (!receta) continue;

				for (const ri of receta.receta_items) {
					const actual = necesidades.get(ri.ingrediente_id);
					const cantidadNecesaria = Number(ri.cantidad) * item.cantidad;
					if (actual) {
						actual.cantidad += cantidadNecesaria;
					} else {
						necesidades.set(ri.ingrediente_id, {
							cantidad: cantidadNecesaria,
							unidad: ri.unidad,
						});
					}
				}
			}
		}

		const resultado: Array<FilaCompra> = [];
		for (const [ingredienteId, { cantidad, unidad }] of necesidades) {
			const ingrediente = ingredientes.find((ing) => ing.id === ingredienteId);
			resultado.push({
				ingredienteId,
				nombre: ingrediente?.nombre ?? `Ingrediente #${ingredienteId}`,
				cantidadTotal: Math.round(cantidad * 100) / 100,
				unidad,
			});
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

	const costoTotal = useMemo(() => {
		let total = 0;
		for (const fila of filas) {
			total += fila.cantidadTotal * (preciosMap.get(fila.ingredienteId) ?? 0);
		}
		return total;
	}, [filas, preciosMap]);

	const inputClasses =
		"rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Lista de compras</h1>

			<div className="flex items-end gap-4">
				<div className="flex flex-col gap-1">
					<label
						className="text-xs font-medium text-gray-600"
						htmlFor="semana-compras"
					>
						Semana
					</label>
					<select
						className={inputClasses}
						id="semana-compras"
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

			{semana && filas.length > 0 && (
				<div className="overflow-x-auto rounded-lg border border-gray-200">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
									Ingrediente
								</th>
								<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
									Cantidad
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
									Unidad
								</th>
								<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
									Precio unitario
								</th>
								<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
									Costo total
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white">
							{filas.map((fila) => {
								const precioUnit =
									preciosMap.get(fila.ingredienteId) ?? 0;
								const costoFila = fila.cantidadTotal * precioUnit;
								return (
									<tr
										key={fila.ingredienteId}
										className="transition-colors hover:bg-gray-50"
									>
										<td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
											{fila.nombre}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
											{fila.cantidadTotal}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
											{fila.unidad}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-right">
											<input
												className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
												defaultValue={precioUnit || ""}
												min="0"
												placeholder="0.00"
												step="0.01"
												type="number"
												onBlur={(event): void => {
													handlePrecioChange(
														fila.ingredienteId,
														event.target.value
													);
												}}
											/>
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-700">
											${costoFila.toFixed(2)}
										</td>
									</tr>
								);
							})}
						</tbody>
						<tfoot className="bg-gray-50">
							<tr>
								<td
									className="px-4 py-3 text-right text-sm font-bold text-gray-800"
									colSpan={4}
								>
									Total
								</td>
								<td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-gray-800">
									${costoTotal.toFixed(2)}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			)}

			{semana && filas.length === 0 && (
				<p className="text-sm text-gray-500">
					No hay pedidos para la semana seleccionada.
				</p>
			)}
		</div>
	);
}

export const Route = createFileRoute("/lista-compras")({
	component: ListaComprasPage,
});
