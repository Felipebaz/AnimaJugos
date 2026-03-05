import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import type { JSX } from "react/jsx-runtime";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { DataTable } from "../components/ui/DataTable";
// eslint-disable-next-line no-duplicate-imports
import type { Column } from "../components/ui/DataTable";
import { useAppStore } from "../store/appStore";

interface FilaPedido {
	key: string;
	clienteNombre: string;
	productoNombre: string;
	cantidad: number;
}

function getSemanaActual(): string {
	const now = new Date();
	const target = new Date(now.valueOf());
	// ISO week: lunes es día 1
	const dayOfWeek = target.getDay() || 7;
	target.setDate(target.getDate() + 4 - dayOfWeek);
	const yearStart = new Date(target.getFullYear(), 0, 1);
	const weekNumber = Math.ceil(
		((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
	);
	return `${target.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

const columns: Array<Column<FilaPedido>> = [
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
	const pedidos = useAppStore((s) => s.pedidos);
	const recetas = useAppStore((s) => s.recetas);
	const ingredientes = useAppStore((s) => s.ingredientes);
	const getClienteById = useAppStore((s) => s.getClienteById);
	const getProductoById = useAppStore((s) => s.getProductoById);

	const semanaActual = useMemo(() => getSemanaActual(), []);

	const pedidosSemana = useMemo(
		() => pedidos.filter((p) => p.semana === semanaActual),
		[pedidos, semanaActual]
	);

	// Filas para la tabla de pedidos
	const filasPedidos: Array<FilaPedido> = useMemo(() => {
		const resultado: Array<FilaPedido> = [];
		for (const pedido of pedidosSemana) {
			for (const item of pedido.getItems()) {
				const cliente = getClienteById(item.idCliente);
				const producto = getProductoById(item.idProducto);
				resultado.push({
					key: `${pedido.id}-${item.idCliente}-${item.idProducto}`,
					clienteNombre: cliente?.nombre ?? `Cliente #${item.idCliente}`,
					productoNombre: producto?.nombre ?? `Producto #${item.idProducto}`,
					cantidad: item.cantidad,
				});
			}
		}
		return resultado;
	}, [pedidosSemana, getClienteById, getProductoById]);

	// Totales
	const totalUnidades = useMemo(() => {
		let total = 0;
		for (const pedido of pedidosSemana) {
			total += pedido.totalUnidades();
		}
		return total;
	}, [pedidosSemana]);

	const ingresoEstimado = useMemo(() => {
		let ingreso = 0;
		for (const pedido of pedidosSemana) {
			for (const item of pedido.getItems()) {
				const producto = getProductoById(item.idProducto);
				if (producto) {
					ingreso += producto.precio * item.cantidad;
				}
			}
		}
		return ingreso;
	}, [pedidosSemana, getProductoById]);

	// Ingredientes necesarios para la semana
	const ingredientesNecesarios = useMemo(() => {
		const ids = new Set<number>();
		for (const pedido of pedidosSemana) {
			for (const item of pedido.getItems()) {
				const receta = recetas.find((r) => r.productoId === item.idProducto);
				if (!receta) continue;
				for (const ri of receta.getItems()) {
					ids.add(ri.ingredienteId);
				}
			}
		}
		return ids;
	}, [pedidosSemana, recetas]);

	// Ingredientes sin precio (todos, ya que los precios son locales en otras pantallas)
	const ingredientesSinPrecio: Array<string> = useMemo(() => {
		const nombres: Array<string> = [];
		for (const id of ingredientesNecesarios) {
			const ing = ingredientes.find((index) => index.id === id);
			if (ing) {
				nombres.push(ing.nombre);
			}
		}
		return nombres.sort((a, b) => a.localeCompare(b));
	}, [ingredientesNecesarios, ingredientes]);

	// Costo estimado = 0 (los precios se cargan en Lista de compras / Rentabilidad)
	const costoEstimado = 0;
	const gananciaEstimada = ingresoEstimado - costoEstimado;

	const tarjetas = [
		{ label: "Total unidades", valor: String(totalUnidades) },
		{ label: "Ingreso estimado", valor: `$${ingresoEstimado.toFixed(2)}` },
		{ label: "Costo estimado", valor: `$${costoEstimado.toFixed(2)}` },
		{ label: "Ganancia estimada", valor: `$${gananciaEstimada.toFixed(2)}` },
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<p className="mt-1 text-sm text-gray-500">
					Semana actual: {semanaActual}
				</p>
			</div>

			{/* Tarjetas resumen */}
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

			{/* Alertas */}
			{pedidosSemana.length > 0 && ingredientesSinPrecio.length > 0 && (
				<div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
					<ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
					<div>
						<p className="text-sm font-semibold text-yellow-800">
							Ingredientes sin precio cargado para esta semana
						</p>
						<p className="mt-1 text-sm text-yellow-700">
							Cargá los precios en{" "}
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

			{/* Pedidos de la semana */}
			<div className="space-y-3">
				<h2 className="text-lg font-semibold">Pedidos de la semana</h2>
				{filasPedidos.length > 0 ? (
					<DataTable<FilaPedido>
						columns={columns}
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
