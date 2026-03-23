import { create } from "zustand";

interface EditorStore {
	currentStep: number;
	editorCode: string;
	setCurrentStep: (step: number) => void;
	setEditorCode: (code: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
	currentStep: 0,
	editorCode: "",
	setCurrentStep: (step) => set({ currentStep: step }),
	setEditorCode: (code) => set({ editorCode: code }),
}));
