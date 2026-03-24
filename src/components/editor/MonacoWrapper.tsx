import Editor from "@monaco-editor/react";

interface MonacoWrapperProps {
	defaultValue: string;
	onChange: (value: string) => void;
	language?: string;
}

export function MonacoWrapper({
	defaultValue,
	onChange,
	language = "javascript",
}: MonacoWrapperProps) {
	return (
		<Editor
			height="100%"
			language={language}
			defaultValue={defaultValue}
			theme="vs-dark"
			onChange={(value) => onChange(value ?? "")}
			options={{
				fontSize: 14,
				fontFamily: "JetBrains Mono, Fira Code, monospace",
				minimap: { enabled: false },
				scrollBeyondLastLine: false,
				padding: { top: 16 },
			}}
		/>
	);
}
