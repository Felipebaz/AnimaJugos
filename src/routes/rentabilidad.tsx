import { createFileRoute } from "@tanstack/react-router";

function RentabilidadPage() {
	return <h1 className="text-2xl font-bold">Rentabilidad</h1>;
}

export const Route = createFileRoute("/rentabilidad")({
	component: RentabilidadPage,
});
