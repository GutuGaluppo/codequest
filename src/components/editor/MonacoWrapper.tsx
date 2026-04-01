import Editor from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { transform } from "sucrase";
import { verifyService } from "../../services/verifyService";
import { useEditorStore } from "../../stores/editorStore";
import type {
	Challenge,
	ModelProvider,
	UserApiKeys,
} from "../../types/tutorial";
import EditorToolbar from "./EditorToolbar";
import { OutputPanel } from "./OutputPanel";

interface MonacoWrapperProps {
	defaultValue: string;
	monacoLanguage?: string;
	challenge?: Challenge | null;
	model: ModelProvider;
	userKeys: UserApiKeys;
	onChange: (value: string) => void;
}

export function MonacoWrapper({
	defaultValue,
	monacoLanguage,
	challenge,
	model,
	userKeys,
	onChange,
}: MonacoWrapperProps) {
	const { editorCode, output, setOutput, setFeedback } = useEditorStore();
	const [verifying, setVerifying] = useState(false);
	const { t } = useTranslation();

	function transpile(code: string): string {
		return transform(code, { transforms: ["typescript"] }).code;
	}

	function handleRun() {
		const nonExecutableLanguages = ["css", "html", "sql", "json"];
		if (monacoLanguage && nonExecutableLanguages.includes(monacoLanguage)) {
			setOutput(
				t("editor.run.notExecutable", {
					language: monacoLanguage.toUpperCase(),
				}),
			);
			return;
		}

		const logs: string[] = [];
		const originalLog = console.log;
		console.log = (...args) => logs.push(args.map(String).join(" "));

		try {
			const compiled = transpile(editorCode);
			new Function(compiled)();
			setOutput(logs.join("\n") || t("editor.output.noOutput"));
		} catch (err) {
			setOutput(String(err));
		} finally {
			console.log = originalLog;
		}
	}

	async function handleVerify() {
		if (!challenge) return;
		if (!output) {
			setOutput(t("editor.verify.requireRun"));
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
		} catch (err) {
			setFeedback({
				status: "incorrect",
				message:
					err instanceof Error
						? err.message
						: "Não foi possível verificar a solução.",
			});
		} finally {
			setVerifying(false);
		}
	}

	const editorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | null>(
		null,
	);

	function handleMount(editor: MonacoEditor.editor.IStandaloneCodeEditor) {
		editorRef.current = editor;
	}

	function handleFormat() {
		if (!editorRef.current) return;

		editorRef.current.getAction("editor.action.formatDocument")?.run();
	}

	return (
		<div className="flex flex-col h-full">
			<EditorToolbar
				monacoLanguage={monacoLanguage ?? "code"}
				handleFormat={handleFormat}
				handleRun={handleRun}
				handleVerify={handleVerify}
				verifying={verifying}
			/>

			<div className="flex-1 min-h-0">
				<Editor
					height="100%"
					language={monacoLanguage}
					defaultValue={defaultValue}
					theme="vs-dark"
					onChange={(value) => onChange(value ?? "")}
					onMount={handleMount}
					options={{
						fontSize: 14,
						fontFamily: "JetBrains Mono, Fira Code, monospace",
						minimap: { enabled: false },
						scrollBeyondLastLine: true,
						padding: { top: 16 },
					}}
				/>
			</div>

			<OutputPanel />
		</div>
	);
}
