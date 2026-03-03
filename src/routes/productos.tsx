import { createFileRoute } from "@tanstack/react-router";

function ProductosPage() {
	return <h1 className="text-2xl font-bold">Productos</h1>;
}

export const Route = createFileRoute("/productos")({
	component: ProductosPage,
});
