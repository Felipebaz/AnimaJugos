import { createFileRoute } from "@tanstack/react-router";

function PedidosPage() {
	return <h1 className="text-2xl font-bold">Pedidos</h1>;
}

export const Route = createFileRoute("/pedidos")({
	component: PedidosPage,
});
