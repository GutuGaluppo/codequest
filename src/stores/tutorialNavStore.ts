import { create } from "zustand";
import type { TutorialStep } from "../types/tutorial";

interface TutorialNavStore {
	steps: TutorialStep[];
	completedSteps: string[];
	setSteps: (steps: TutorialStep[]) => void;
	setCompletedSteps: (steps: string[]) => void;
	clear: () => void;
}

export const useTutorialNavStore = create<TutorialNavStore>((set) => ({
	steps: [],
	completedSteps: [],
	setSteps: (steps) => set({ steps }),
	setCompletedSteps: (completedSteps) => set({ completedSteps }),
	clear: () => set({ steps: [], completedSteps: [] }),
}));
