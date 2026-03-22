import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const loginSchema = z.object({
	email: z.email("Email inválido"),
	password: z.string().min(1, "La contraseña es requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPage(): React.ReactNode {
	const { signIn } = useAuth();
	const navigate = useNavigate();
	const [authError, setAuthError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>();

	const onSubmit = async (data: LoginForm): Promise<void> => {
		setAuthError(null);

		const parsed = loginSchema.safeParse(data);
		if (!parsed.success) return;

		const { error } = await signIn(parsed.data.email, parsed.data.password);
		if (error) {
			setAuthError(error);
		} else {
			await navigate({ to: "/" });
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
				<h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Mi Negocio</h1>

				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label className="block text-sm font-medium text-gray-700" htmlFor="email">
							Email
						</label>
						<input
							autoComplete="email"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							id="email"
							type="email"
							{...register("email")}
						/>
						{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700" htmlFor="password">
							Contraseña
						</label>
						<input
							autoComplete="current-password"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							id="password"
							type="password"
							{...register("password")}
						/>
						{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
					</div>

					{authError && (
						<div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{authError}</div>
					)}

					<button
						className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
						disabled={isSubmitting}
						type="submit"
					>
						{isSubmitting ? "Ingresando..." : "Iniciar sesión"}
					</button>
				</form>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/login")({
	component: LoginPage,
});
