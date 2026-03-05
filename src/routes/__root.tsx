import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import {
	HomeIcon,
	ClipboardDocumentListIcon,
	ShoppingCartIcon,
	ChartBarIcon,
	CubeIcon,
	TagIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";

const navItems = [
	{ to: "/", label: "Dashboard", icon: HomeIcon },
	{ to: "/pedidos", label: "Pedidos", icon: ClipboardDocumentListIcon },
	{ to: "/lista-compras", label: "Lista de compras", icon: ShoppingCartIcon },
	{ to: "/rentabilidad", label: "Rentabilidad", icon: ChartBarIcon },
] as const;

const catalogItems = [
	{ to: "/productos", label: "Productos", icon: CubeIcon },
	{ to: "/ingredientes", label: "Ingredientes", icon: TagIcon },
	{ to: "/clientes", label: "Clientes", icon: UserGroupIcon },
] as const;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function RootLayout() {
	return (
		<div className="flex h-screen">
			<aside className="flex w-60 flex-col bg-gray-900 text-gray-300">
				<div className="px-5 py-6">
					<h1 className="text-lg font-bold text-white">Mi Negocio</h1>
				</div>

				<nav className="flex-1 space-y-1 px-3">
					{navItems.map((item) => (
						<Link
							key={item.to}
							className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white [&.active]:bg-gray-800 [&.active]:text-white"
							to={item.to}
						>
							<item.icon className="h-5 w-5" />
							{item.label}
						</Link>
					))}

					<div className="my-4 border-t border-gray-700" />

					{catalogItems.map((item) => (
						<Link
							key={item.to}
							className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white [&.active]:bg-gray-800 [&.active]:text-white"
							to={item.to}
						>
							<item.icon className="h-5 w-5" />
							{item.label}
						</Link>
					))}
				</nav>
			</aside>

			<main className="flex-1 overflow-auto bg-gray-50 p-6">
				<Outlet />
			</main>
		</div>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
