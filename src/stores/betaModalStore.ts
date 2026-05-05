import { create } from "zustand";
import type { Level } from "../types/tutorial";

interface PendingNav {
	topic: string;
	level: Level;
}

interface BetaModalStore {
	open: boolean;
	pendingNav: PendingNav | null;
	openModal: (pending?: PendingNav) => void;
	closeModal: () => void;
}

export const useBetaModalStore = create<BetaModalStore>((set) => ({
	open: false,
	pendingNav: null,
	openModal: (pending) => set({ open: true, pendingNav: pending ?? null }),
	closeModal: () => set({ open: false, pendingNav: null }),
}));
