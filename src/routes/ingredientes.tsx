import { createFileRoute } from "@tanstack/react-router";

function IngredientesPage() {
	return <h1 className="text-2xl font-bold">Ingredientes</h1>;
}

export const Route = createFileRoute("/ingredientes")({
	component: IngredientesPage,
});
