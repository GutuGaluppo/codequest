import { create } from "zustand";

interface AuthStore {
	drawerOpen: boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	drawerOpen: false,
	openDrawer: () => set({ drawerOpen: true }),
	closeDrawer: () => set({ drawerOpen: false }),
}));
