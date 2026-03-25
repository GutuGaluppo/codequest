import { create } from "zustand";

interface EditorStore {
	currentStep: number;
	editorCode: string;
	output: string;
	setCurrentStep: (step: number) => void;
	setEditorCode: (code: string) => void;
	setOutput: (output: string) => void;
	reset: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
	currentStep: 0,
	editorCode: "",
	output: "",
	setCurrentStep: (step) => set({ currentStep: step }),
	setEditorCode: (code) => set({ editorCode: code }),
	setOutput: (output) => set({ output }),
	reset: () => set({ currentStep: 0, editorCode: "", output: "" }),
}));
