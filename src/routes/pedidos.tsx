import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useMemo, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Pedido } from "../domain/models/Pedido";
import { PedidoItem } from "../domain/models/PedidoItem";
import { useAppStore } from "../store/appStore";

function weekToDateRange(semana: string): { start: Date; end: Date } {
	const [yearStr, weekStr] = semana.split("-W");
	const year = Number(yearStr);
	const week = Number(weekStr);
	const jan4 = new Date(year, 0, 4);
	const dayOfWeek = jan4.getDay() || 7;
	const monday = new Date(jan4);
	monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
	const friday = new Date(monday);
	friday.setDate(monday.getDate() + 4);
	return { start: monday, end: friday };
}

function PedidosPage(): JSX.Element {
	const pedidos = useAppStore((s) => s.pedidos);
	const clientes = useAppStore((s) => s.clientes);
	const productos = useAppStore((s) => s.productos);
	const agregarPedido = useAppStore((s) => s.agregarPedido);
	const agregarItemAPedido = useAppStore((s) => s.agregarItemAPedido);
	const getClienteById = useAppStore((s) => s.getClienteById);
	const getProductoById = useAppStore((s) => s.getProductoById);

	const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
	const [semana, setSemana] = useState("");
	const [clienteId, setClienteId] = useState("");
	const [productoId, setProductoId] = useState("");
	const [cantidad, setCantidad] = useState("");

	const pedidosPorSemana = useMemo(() => {
		const map = new Map<string, Array<Pedido>>();
		for (const p of pedidos) {
			const arr = map.get(p.semana) ?? [];
			arr.push(p);
			map.set(p.semana, arr);
		}
		return [...map.entries()].sort(([a], [b]) => b.localeCompare(a));
	}, [pedidos]);

	function toggleExpand(id: number): void {
		setExpandedIds((previous) => {
			const next = new Set(previous);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (!semana || !clienteId || !productoId || !cantidad) return;

		const item = new PedidoItem(
			Number(clienteId),
			Number(productoId),
			Number(cantidad)
		);

		const existente = pedidos.find((p) => p.semana === semana);

		if (existente) {
			agregarItemAPedido(existente.id, item);
		} else {
			const nextId = Math.max(...pedidos.map((p) => p.id), 0) + 1;
			const { start, end } = weekToDateRange(semana);
			const pedido = new Pedido(nextId, semana, start, end);
			pedido.agregarItem(item);
			agregarPedido(pedido);
		}

		setCantidad("");
	}

	const inputClasses =
		"rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Pedidos</h1>

			{/* Formulario */}
			<form
				className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="semana">
						Semana
					</label>
					<input
						className={inputClasses}
						id="semana"
						onChange={(event): void => setSemana(event.target.value)}
						required
						type="week"
						value={semana}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="cliente">
						Cliente
					</label>
					<select
						className={inputClasses}
						id="cliente"
						onChange={(event): void => setClienteId(event.target.value)}
						required
						value={clienteId}
					>
						<option value="">Seleccionar...</option>
						{clientes.map((c) => (
							<option key={c.id} value={c.id}>
								{c.nombre}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="producto">
						Producto
					</label>
					<select
						className={inputClasses}
						id="producto"
						onChange={(event): void => setProductoId(event.target.value)}
						required
						value={productoId}
					>
						<option value="">Seleccionar...</option>
						{productos
							.filter((p) => p.activo)
							.map((p) => (
								<option key={p.id} value={p.id}>
									{p.nombre}
								</option>
							))}
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="cantidad">
						Cantidad
					</label>
					<input
						className={inputClasses}
						id="cantidad"
						min="1"
						onChange={(event): void => setCantidad(event.target.value)}
						required
						type="number"
						value={cantidad}
					/>
				</div>

				<button
					className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					type="submit"
				>
					Agregar
				</button>
			</form>

			{/* Lista de pedidos agrupados por semana */}
			{pedidosPorSemana.map(([semanaKey, pedidosSemana]) => (
				<div key={semanaKey} className="space-y-2">
					<h2 className="text-lg font-semibold text-gray-800">
						Semana {semanaKey}
					</h2>

					{pedidosSemana.map((pedido) => {
						const isExpanded = expandedIds.has(pedido.id);
						const items = pedido.getItems();

						return (
							<div
								key={pedido.id}
								className="overflow-hidden rounded-lg border border-gray-200 bg-white"
							>
								<button
									className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
									onClick={(): void => toggleExpand(pedido.id)}
									type="button"
								>
									<div className="flex items-center gap-3">
										{isExpanded ? (
											<ChevronDownIcon className="h-4 w-4 text-gray-500" />
										) : (
											<ChevronRightIcon className="h-4 w-4 text-gray-500" />
										)}
										<span className="text-sm font-medium">
											Pedido #{pedido.id}
										</span>
										<span className="text-sm text-gray-500">
											{pedido.fechaInicio.toLocaleDateString()} –{" "}
											{pedido.fechaFin.toLocaleDateString()}
										</span>
									</div>
									<span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
										{pedido.totalUnidades()} unidades
									</span>
								</button>

								{isExpanded && (
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
													Cliente
												</th>
												<th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
													Producto
												</th>
												<th className="px-4 py-2 text-right text-xs font-semibold uppercase text-gray-600">
													Cantidad
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{items.map((item) => {
												const cliente = getClienteById(item.idCliente);
												const producto = getProductoById(item.idProducto);
												return (
													<tr
														key={`${item.idCliente}-${item.idProducto}`}
														className="transition-colors hover:bg-gray-50"
													>
														<td className="px-4 py-2 text-sm text-gray-700">
															{cliente?.nombre ?? `Cliente #${item.idCliente}`}
														</td>
														<td className="px-4 py-2 text-sm text-gray-700">
															{producto?.nombre ?? `Producto #${item.idProducto}`}
														</td>
														<td className="px-4 py-2 text-right text-sm text-gray-700">
															{item.cantidad}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								)}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}

export const Route = createFileRoute("/pedidos")({
	component: PedidosPage,
});
