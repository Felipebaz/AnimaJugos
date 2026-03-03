import { createFileRoute } from "@tanstack/react-router";

function DashboardPage() {
	return <h1 className="text-2xl font-bold">Dashboard</h1>;
}

export const Route = createFileRoute("/")({
	component: DashboardPage,
});
