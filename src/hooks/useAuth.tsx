import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
	session: Session | null;
	user: User | null;
	isLoading: boolean;
	signIn: (email: string, password: string) => Promise<{ error: string | null }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactNode {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		void supabase.auth.getSession().then(({ data: { session: s } }) => {
			setSession(s);
			setIsLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
		});

		return (): void => {
			subscription.unsubscribe();
		};
	}, []);

	const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) return { error: error.message };
		return { error: null };
	};

	const signOut = async (): Promise<void> => {
		await supabase.auth.signOut();
	};

	return (
		<AuthContext.Provider value={{ session, user: session?.user ?? null, isLoading, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
