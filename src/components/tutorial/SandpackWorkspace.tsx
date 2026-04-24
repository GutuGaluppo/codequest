import {
	SandpackCodeEditor,
	SandpackPreview,
	SandpackProvider,
} from "@codesandbox/sandpack-react";
import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

interface SandpackWorkspaceProps {
	starterCode: string;
	template: SandpackPredefinedTemplate;
}

export function SandpackWorkspace({
	starterCode,
	template,
}: SandpackWorkspaceProps) {
	return (
		<SandpackProvider
			template={template}
			files={{ "/App.js": starterCode }}
			theme="dark"
			options={{ recompileDelay: 500 }}
		>
			<div className="flex flex-col h-full">
				<SandpackCodeEditor
					style={{ flex: 1, overflow: "auto" }}
					showLineNumbers
					showInlineErrors
				/>
				<SandpackPreview style={{ flex: 1, overflowY: "scroll" }} />
			</div>
		</SandpackProvider>
	);
}
