import Editor from "@monaco-editor/react";
import { useEditorStore } from "../../stores/editorStore";
import { OutputPanel } from "./OutputPanel";
import type {
	Challenge,
	ModelProvider,
	UserApiKeys,
} from "../../types/tutorial";
import { useState } from "react";
import { verifyService } from "../../services/verifyService";
import { transform } from "sucrase";

interface MonacoWrapperProps {
	defaultValue: string;
	onChange: (value: string) => void;
	language?: string;
	challenge: Challenge;
	model: ModelProvider;
	userKeys: UserApiKeys;
}

export function MonacoWrapper({
	defaultValue,
	onChange,
	language,
	challenge,
	model,
	userKeys,
}: MonacoWrapperProps) {
	const { editorCode, output, setOutput, setFeedback } = useEditorStore();
	const [verifying, setVerifying] = useState(false);

	function transpile(code: string): string {
		return transform(code, { transforms: ["typescript"] }).code;
	}

	function handleRun() {
		const logs: string[] = [];
		const originalLog = console.log;
		console.log = (...args) => logs.push(args.map(String).join(" "));

		try {
			const compiled = transpile(editorCode);
			new Function(compiled)();
			setOutput(logs.join("\n") || "✓ Código executado sem output.");
		} catch (err) {
			setOutput(String(err));
		} finally {
			console.log = originalLog;
		}
	}

	async function handleVerify() {
		if (!output) {
			setOutput("Execute o código primeiro com Run.");
			return;
		}
		setVerifying(true);
		try {
			const feedback = await verifyService.verify({
				prompt: challenge.prompt,
				solution: challenge.solution,
				userCode: editorCode,
				output,
				model,
				userKeys,
			});
			setFeedback(feedback);
		} catch {
			setFeedback({
				status: "incorrect",
				message: "Não foi possível verificar a solução.",
			});
		} finally {
			setVerifying(false);
		}
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
					disabled={verifying}
					className="text-xs px-3 py-1.5 border text-muted rounded hover:text-text transition-colors disabled:opacity-50"
				>
					{verifying ? "Verificando..." : "Verify Solution"}
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
