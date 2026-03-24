import Editor from "@monaco-editor/react";
import { useEditorStore } from "../../stores/editorStore";
import { OutputPanel } from "./OutputPanel";
import type { Challenge } from "../../types/tutorial";

interface MonacoWrapperProps {
	defaultValue: string;
	onChange: (value: string) => void;
	language?: string;
	challenge: Challenge;
}

export function MonacoWrapper({
	defaultValue,
	onChange,
	language = "javascript",
	challenge,
}: MonacoWrapperProps) {
	const { editorCode, setOutput } = useEditorStore();

	function handleRun() {
		const logs: string[] = [];
		const originalLog = console.log;
		console.log = (...args) => logs.push(args.map(String).join(" "));

		try {
			new Function(editorCode)();
			setOutput(logs.join("\n") || "✓ Código executado sem output.");
		} catch (err) {
			setOutput(String(err));
		} finally {
			console.log = originalLog;
		}
	}

	function handleVerify() {
		setOutput(`// Solução:\n${challenge.solution}`);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-end gap-2 px-3 py-2 bg-surface border-b">
				<button
					onClick={handleRun}
					className="text-xs px-3 py-1.5 bg-amber text-background rounded font-medium hover:opacity-90 transition-opacity"
				>
					Run
				</button>
				<button
					onClick={handleVerify}
					className="text-xs px-3 py-1.5 border text-muted rounded hover:text-text transition-colors"
				>
					Verify Solution
				</button>
			</div>

			<div className="flex-1 min-h-0">
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
			</div>

			<OutputPanel />
		</div>
	);
}
