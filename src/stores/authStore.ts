import { create } from "zustand";

export type AuthRedirectTo =
	| "/dashboard"
	| "/profile"
	| "/progress"
	| "/api-keys";

interface AuthStore {
	drawerOpen: boolean;
	redirectTo: AuthRedirectTo | null;
	openDrawer: (redirectTo?: AuthRedirectTo) => void;
	closeDrawer: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	drawerOpen: false,
	redirectTo: null,
	openDrawer: (redirectTo = "/dashboard") =>
		set({ drawerOpen: true, redirectTo }),
	closeDrawer: () => set({ drawerOpen: false, redirectTo: null }),
}));
