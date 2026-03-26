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
	setFeedback: (feedback: Feedback | null) => void;
	setCurrentStep: (step: number) => void;
	setEditorCode: (code: string) => void;
	setOutput: (output: string) => void;
	reset: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
	currentStep: 0,
	editorCode: "",
	output: "",
	feedback: null,
	setFeedback: (feedback) => set({ feedback }),
	setCurrentStep: (step) => set({ currentStep: step }),
	setEditorCode: (code) => set({ editorCode: code }),
	setOutput: (output) => set({ output }),
	reset: () =>
		set({ currentStep: 0, editorCode: "", output: "", feedback: null }),
}));
