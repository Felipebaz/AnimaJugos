import { createFileRoute } from "@tanstack/react-router";

function ListaComprasPage() {
	return <h1 className="text-2xl font-bold">Lista de compras</h1>;
}

export const Route = createFileRoute("/lista-compras")({
	component: ListaComprasPage,
});
