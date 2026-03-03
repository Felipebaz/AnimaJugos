import { createFileRoute } from "@tanstack/react-router";

function ClientesPage() {
	return <h1 className="text-2xl font-bold">Clientes</h1>;
}

export const Route = createFileRoute("/clientes")({
	component: ClientesPage,
});
