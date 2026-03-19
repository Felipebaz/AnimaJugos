import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import type { JSX } from "react/jsx-runtime";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { DataTable, type Column } from "../components/ui/DataTable";
import {
	usePedidos,
	useRecetas,
	useIngredientes,
	useClientes,
	useProductos,
	usePreciosSemana,
} from "../hooks/queries";

interface FilaPedido {
	key: string;
	clienteNombre: string;
	productoNombre: string;
	cantidad: number;
}

function getSemanaActual(): string {
	const now = new Date();
	const target = new Date(now.valueOf());
	const dayOfWeek = target.getDay() || 7;
	target.setDate(target.getDate() + 4 - dayOfWeek);
	const yearStart = new Date(target.getFullYear(), 0, 1);
	const weekNumber = Math.ceil(
		((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
	);
	return `${target.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

const columnasPedido: Array<Column<FilaPedido>> = [
	{
		header: "Cliente",
		render: (f: FilaPedido): string => f.clienteNombre,
	},
	{
		header: "Producto",
		render: (f: FilaPedido): string => f.productoNombre,
	},
	{
		header: "Cantidad",
		render: (f: FilaPedido): number => f.cantidad,
	},
];

function DashboardPage(): JSX.Element {
	const { data: pedidos, isLoading: loadingPedidos } = usePedidos();
	const { data: recetas } = useRecetas();
	const { data: ingredientes } = useIngredientes();
	const { data: clientes } = useClientes();
	const { data: productos } = useProductos();

	const semanaActual = useMemo(() => getSemanaActual(), []);
	const { data: preciosDb } = usePreciosSemana(semanaActual);

	const preciosMap = useMemo(() => {
		const map = new Map<number, number>();
		if (preciosDb) {
			for (const p of preciosDb) {
				map.set(p.ingrediente_id, Number(p.precio_unitario));
			}
		}
		return map;
	}, [preciosDb]);

	const pedidosSemana = useMemo(
		() => pedidos?.filter((p) => p.semana === semanaActual) ?? [],
		[pedidos, semanaActual]
	);

	const filasPedidos: Array<FilaPedido> = useMemo(() => {
		const resultado: Array<FilaPedido> = [];
		for (const pedido of pedidosSemana) {
			for (const item of pedido.pedido_items) {
				const cliente = clientes?.find((c) => c.id === item.cliente_id);
				const producto = productos?.find((p) => p.id === item.producto_id);
				resultado.push({
					key: `${pedido.id}-${item.cliente_id}-${item.producto_id}`,
					clienteNombre: cliente?.nombre ?? `Cliente #${item.cliente_id}`,
					productoNombre: producto?.nombre ?? `Producto #${item.producto_id}`,
					cantidad: item.cantidad,
				});
			}
		}
		return resultado;
	}, [pedidosSemana, clientes, productos]);

	const totalUnidades = useMemo(() => {
		let total = 0;
		for (const pedido of pedidosSemana) {
			for (const item of pedido.pedido_items) {
				total += item.cantidad;
			}
		}
		return total;
	}, [pedidosSemana]);

	const ingresoEstimado = useMemo(() => {
		let ingreso = 0;
		for (const pedido of pedidosSemana) {
			for (const item of pedido.pedido_items) {
				const producto = productos?.find((p) => p.id === item.producto_id);
				if (producto) {
					ingreso += Number(producto.precio) * item.cantidad;
				}
			}
		}
		return ingreso;
	}, [pedidosSemana, productos]);

	const costoEstimado = useMemo(() => {
		if (!recetas) return 0;
		let costo = 0;
		for (const pedido of pedidosSemana) {
			for (const item of pedido.pedido_items) {
				const receta = recetas.find((r) => r.producto_id === item.producto_id);
				if (!receta) continue;
				let costoUnitario = 0;
				for (const ri of receta.receta_items) {
					costoUnitario +=
						Number(ri.cantidad) * (preciosMap.get(ri.ingrediente_id) ?? 0);
				}
				costo += costoUnitario * item.cantidad;
			}
		}
		return costo;
	}, [pedidosSemana, recetas, preciosMap]);

	const gananciaEstimada = ingresoEstimado - costoEstimado;

	const ingredientesSinPrecio: Array<string> = useMemo(() => {
		if (!recetas || !ingredientes) return [];
		const ids = new Set<number>();
		for (const pedido of pedidosSemana) {
			for (const item of pedido.pedido_items) {
				const receta = recetas.find((r) => r.producto_id === item.producto_id);
				if (!receta) continue;
				for (const ri of receta.receta_items) {
					if (!preciosMap.has(ri.ingrediente_id)) {
						ids.add(ri.ingrediente_id);
					}
				}
			}
		}
		const nombres: Array<string> = [];
		for (const id of ids) {
			const ing = ingredientes.find((index) => index.id === id);
			if (ing) nombres.push(ing.nombre);
		}
		return nombres.sort((a, b) => a.localeCompare(b));
	}, [pedidosSemana, recetas, ingredientes, preciosMap]);

	const tarjetas = [
		{ label: "Total unidades", valor: String(totalUnidades) },
		{ label: "Ingreso estimado", valor: `$${ingresoEstimado.toFixed(2)}` },
		{ label: "Costo estimado", valor: `$${costoEstimado.toFixed(2)}` },
		{ label: "Ganancia estimada", valor: `$${gananciaEstimada.toFixed(2)}` },
	];

	if (loadingPedidos) {
		return <p className="p-4 text-sm text-gray-500">Cargando...</p>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<p className="mt-1 text-sm text-gray-500">
					Semana actual: {semanaActual}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{tarjetas.map((t) => (
					<div
						key={t.label}
						className="rounded-lg border border-gray-200 bg-white p-4"
					>
						<p className="text-xs font-medium uppercase text-gray-500">
							{t.label}
						</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">{t.valor}</p>
					</div>
				))}
			</div>

			{pedidosSemana.length > 0 && ingredientesSinPrecio.length > 0 && (
				<div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
					<ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
					<div>
						<p className="text-sm font-semibold text-yellow-800">
							Ingredientes sin precio cargado para esta semana
						</p>
						<p className="mt-1 text-sm text-yellow-700">
							Carga los precios en{" "}
							<span className="font-medium">Lista de compras</span> o{" "}
							<span className="font-medium">Rentabilidad</span> para calcular
							costos y ganancias.
						</p>
						<ul className="mt-2 list-inside list-disc text-sm text-yellow-700">
							{ingredientesSinPrecio.map((nombre) => (
								<li key={nombre}>{nombre}</li>
							))}
						</ul>
					</div>
				</div>
			)}

			<div className="space-y-3">
				<h2 className="text-lg font-semibold">Pedidos de la semana</h2>
				{filasPedidos.length > 0 ? (
					<DataTable<FilaPedido>
						columns={columnasPedido}
						data={filasPedidos}
						getRowId={(f: FilaPedido): string => f.key}
					/>
				) : (
					<p className="text-sm text-gray-500">
						No hay pedidos para la semana actual.
					</p>
				)}
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: DashboardPage,
});
