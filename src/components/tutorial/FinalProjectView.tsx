import { Suspense, lazy, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FinalProject } from "../../types/tutorial";
import { getSandpackTemplate } from "../../utils/getSandpackTemplate";
import { EditorPanelFallback } from "./EditorPanelFallback";

const MonacoWrapper = lazy(() =>
	import("../editor/MonacoWrapper").then((module) => ({
		default: module.MonacoWrapper,
	})),
);

const SandpackWorkspace = lazy(() =>
	import("./SandpackWorkspace").then((module) => ({
		default: module.SandpackWorkspace,
	})),
);

export function FinalProjectView({
	project,
	monacoLanguage,
	topic,
}: {
	project: FinalProject;
	monacoLanguage?: string;
	topic: string;
}) {
	const { t } = useTranslation();
	const [showSolution, setShowSolution] = useState(false);
	const sandpackTemplate = useMemo(() => getSandpackTemplate(topic), [topic]);

	return (
		<div className="flex flex-col h-[calc(100vh-60px)] px-6 pb-4">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0 border overflow-hidden">
				{/* Left — project brief */}
				<div className="flex flex-col gap-5 p-6 overflow-y-auto border-r bg-amber-50">
					<div className="flex flex-col gap-1">
						<span className="text-xs font-mono uppercase tracking-widest text-stone-400">
							{t("tutorial.finalProject.label")}
						</span>
						<h2 className="text-xl font-mono font-medium text-background">
							{project.title}
						</h2>
					</div>

					<p className="text-sm text-background/80 leading-relaxed">
						{project.description}
					</p>

					<button
						onClick={() => setShowSolution((v) => !v)}
						className="self-start text-xs font-black uppercase tracking-wide border border-stone-300 text-stone-500 px-4 py-2 hover:border-stone-500 transition-colors mt-auto"
					>
						{showSolution
							? t("tutorial.finalProject.hideSolution")
							: t("tutorial.finalProject.showSolution")}
					</button>

					{showSolution && (
						<pre className="bg-white/80 border p-4 text-sm font-mono text-background overflow-x-auto">
							{project.solution}
						</pre>
					)}
				</div>

				{/* Right — editor */}
				<div className="flex flex-col min-h-0">
					{sandpackTemplate ? (
						<Suspense fallback={<EditorPanelFallback label="preview" />}>
							<SandpackWorkspace
								template={sandpackTemplate}
								starterCode={project.starterCode}
							/>
						</Suspense>
					) : (
						<Suspense
							fallback={<EditorPanelFallback label={monacoLanguage ?? "code"} />}
						>
							<MonacoWrapper
								defaultValue={project.starterCode}
								onChange={() => {}}
								challenge={null}
								model="gemini"
								monacoLanguage={monacoLanguage}
							/>
						</Suspense>
					)}
				</div>
			</div>
		</div>
	);
}
