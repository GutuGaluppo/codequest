import { create } from "zustand";

export interface Feedback {
	status: "correct" | "partial" | "incorrect";
	message: string;
}

interface EditorStore {
	currentStep: number;
	editorCode: string;
	output: string;
	feedback: Feedback | null;
	showIntro: boolean;
	showFinalProject: boolean;

	setFeedback: (feedback: Feedback | null) => void;
	setCurrentStep: (step: number) => void;
	setEditorCode: (code: string) => void;
	setOutput: (output: string) => void;
	reset: () => void;
	setShowIntro: (show: boolean) => void;
	setShowFinalProject: (show: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
	currentStep: 0,
	editorCode: "",
	output: "",
	feedback: null,
	showIntro: true,
	showFinalProject: false,

	setFeedback: (feedback) => set({ feedback }),
	setCurrentStep: (step) => set({ currentStep: step }),
	setEditorCode: (code) => set({ editorCode: code }),
	setOutput: (output) => set({ output }),
	reset: () =>
		set({
			currentStep: 0,
			editorCode: "",
			output: "",
			feedback: null,
			showIntro: true,
			showFinalProject: false,
		}),
	setShowIntro: (show) => set({ showIntro: show }),
	setShowFinalProject: (show) => set({ showFinalProject: show }),
}));
