import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/devlog")({
	component: DevlogPage,
});

interface Entry {
	date: string;
	commit?: string;
	phase: string;
	title: string;
	description: string;
	tags?: string[];
	bugs?: string[];
	decisions?: string[];
}

const entries: Entry[] = [
	{
		date: "2026-03-23",
		commit: "1a19314",
		phase: "Fundação",
		title: "Setup inicial do projeto",
		description:
			"Inicialização do projeto com Vite + React + TypeScript. Configuração do TailwindCSS com tema customizado (background, surface, amber), Firebase, TanStack Router com file-based routing e TanStack Query.",
		tags: ["setup", "config"],
	},
	{
		date: "2026-03-23",
		commit: "aad3b2f",
		phase: "Fundação",
		title: "Camada de dados — types, hooks, stores e serviços de AI",
		description:
			"Criação da fundação: tipos TypeScript para Tutorial e Step, hook useAuth com Firebase Google Login, store Zustand para o editor, e primeiro serviço de AI (Gemini) para geração de tutoriais com JSON estruturado.",
		tags: ["architecture", "ai", "auth"],
		decisions: [
			"Zustand escolhido para estado de UI local — mais simples que Context para estado sincronizado",
			"Gemini como modelo padrão por ser gratuito, com suporte a Claude e OpenAI via chave do usuário",
		],
	},
	{
		date: "2026-03-24",
		commit: "2267355",
		phase: "Fundação",
		title: "Camada de rotas — root, index, tutorial e profile",
		description:
			"Estrutura de rotas com TanStack Router: __root.tsx com QueryClientProvider e AuthProvider, rota de tutorial dinâmica (/tutorial/$id), e rota de perfil.",
		tags: ["routing"],
	},
	{
		date: "2026-03-24",
		commit: "37b6b95",
		phase: "Fundação",
		title: "Camada de queries — TanStack Query + Firestore",
		description:
			"Implementação das queries com TanStack Query: geração de tutorial via AI, busca de perfil do usuário no Firestore, e progresso por tutorial. Padrão de query options para reuso.",
		tags: ["data", "firestore"],
	},
	{
		date: "2026-03-24",
		commit: "fdc3c8b",
		phase: "Fundação",
		title: "Configuração de ESLint, fontes e tema Tailwind",
		description:
			"JetBrains Mono como fonte monospace, Inter como sans-serif. Tokens de cor definidos via CSS custom properties no @theme do Tailwind v4: background #0d0f14, surface #13161e, amber #f5a623.",
		tags: ["design", "config"],
		decisions: [
			"CSS custom properties no @theme (Tailwind v4) em vez de tailwind.config.js — sem arquivo de config separado",
			"JetBrains Mono escolhida por ser a fonte do logo e dos blocos de código",
		],
	},
	{
		date: "2026-03-24",
		commit: "ffac146",
		phase: "Interface",
		title: "Componentes de layout, tutorial e editor",
		description:
			"Criação da camada de componentes: Header com navegação, TutorialStep com ConceptBlock e ChallengeBlock, MonacoWrapper para edição de código e OutputPanel para exibição do resultado.",
		tags: ["components", "editor"],
	},
	{
		date: "2026-03-24",
		commit: "f80d8ce",
		phase: "Interface",
		title: "Refatoração UI — layout full-viewport e editor Run/Verify",
		description:
			"Redesign para layout full-viewport: painel esquerdo de conteúdo + painel direito do editor side-by-side. Botões Run e Verify separados. StepNav colapsável.",
		tags: ["layout", "refactor"],
	},
	{
		date: "2026-03-24",
		commit: "ffac146",
		phase: "Interface",
		title: "Animações com Motion",
		description:
			"Transições animadas nas etapas do tutorial usando Motion (AnimatePresence). Botão de conclusão com feedback visual.",
		tags: ["animation"],
	},
	{
		date: "2026-03-25",
		commit: "e8e0661",
		phase: "Features",
		title: "Dashboard e persistência de tutoriais no Firestore",
		description:
			"Rota /dashboard com grid de tutoriais gerados pelo usuário. Persistência no Firestore com subcoleção /users/{uid}/tutorials. Progresso por step com markStepComplete.",
		tags: ["feature", "firestore"],
		bugs: [
			"Permissão negada no saveTutorial: regra match /tutorials/{id} estava aninhada no bloco errado (fora do /users/{userId})",
			"Permissão negada no markStepComplete: bloco match /progress/{id} removido acidentalmente das rules",
			"isValidUserProgress falhando: serverTimestamp() não é validável como 'is timestamp' nas rules — validator removido",
		],
	},
	{
		date: "2026-03-25",
		commit: "e95c6dd",
		phase: "Features",
		title: "Painel esquerdo claro com seções Exemplo e Desafio",
		description:
			"Painel de conteúdo do tutorial com fundo claro (amber-50) para o bloco de exemplo e fundo escuro mantido no bloco de desafio — diferenciando visualmente os dois tipos de conteúdo. Labels 'Exemplo' e 'Desafio' adicionados. Divider entre os blocos.",
		tags: ["design", "ux"],
		decisions: [
			"ChallengeBlock mantém fundo escuro para diferenciar do exemplo — sugestão do usuário",
		],
	},
	{
		date: "2026-03-25",
		commit: "655d3ad",
		phase: "Auth",
		title: "Multi-provider auth: GitHub + email, drawer animado e avatar",
		description:
			"LoginDrawer com slide-in animado (Motion). Suporte a Google, GitHub e email/senha. Avatar no Header com fallback para inicial do nome. Ao sair: editorStore é resetado e usuário vai para /.",
		tags: ["auth", "feature"],
		bugs: [
			"GitHubIcon não existe no lucide-react — substituído por SVG inline",
			"Mismatch de nomes: hook exporta signInWithGitHub, componente chamava signInWithGithub",
			"React.FormEvent deprecated — substituído por React.SyntheticEvent<HTMLFormElement>",
			"Estado duplicado no LoginDrawer: tinha estados individuais name/email/password E formData — removidos os individuais",
			"onChange={() => handleChange} no Form.tsx — correto é onChange={handleChange}",
			"Avatar quebrava quando photoURL existe mas a imagem falha — adicionado handler onError + estado imgError",
			"auth/operation-not-allowed para email — Email/Password não estava habilitado no Firebase Console",
			"auth/account-exists-with-different-credential — adicionado tratamento em friendlyError()",
		],
		decisions: [
			"authStore (Zustand) criado para controlar abertura/fechamento do drawer de qualquer componente",
		],
	},
	{
		date: "2026-03-25",
		commit: "222d523",
		phase: "Profile",
		title: "Upload de foto via Cloudinary e edição de perfil",
		description:
			"Formulário de perfil com upload de foto, edição de nome e configuração de chaves de API (Anthropic, OpenAI) e modelo preferido. Foto enviada ao Cloudinary via unsigned upload preset.",
		tags: ["feature", "cloudinary"],
		decisions: [
			"Cloudinary escolhido sobre Firebase Storage — Firebase Storage exige plano Blaze (pago), Cloudinary tem tier gratuito generoso",
		],
	},
	{
		date: "2026-03-25",
		commit: "708d5e8",
		phase: "Landing",
		title: "Redesign da landing page com arquitetura de componentes",
		description:
			"Landing page refatorada de um arquivo de 183 linhas para 5 componentes independentes: HeroBadge, HeroHeadline, TopicSearch, ApiKeysCard e FeatureCards. Tipografia maior e mais impactante.",
		tags: ["refactor", "design"],
	},
	{
		date: "2026-03-26",
		commit: "4254631",
		phase: "Editor",
		title: "Verificação de solução com AI e auto-detecção de linguagem",
		description:
			"Botão 'Verificar Solução' envia código + desafio para o modelo configurado do usuário (Gemini/Claude/OpenAI). Feedback exibido no OutputPanel com status: correct (verde), partial (âmbar) ou incorrect (vermelho). Linguagem do Monaco auto-detectada pelo tópico do tutorial.",
		tags: ["ai", "feature", "editor"],
		bugs: [
			"Monaco não suportava TypeScript nativamente (new Function()) — adicionado sucrase para transpilar antes de executar",
		],
		decisions: [
			"Run permanece manual — usuário executa o código e depois clica em Verificar",
			"verifyService desacoplado do componente — recebe model, keys e código como parâmetros puros",
		],
	},
	{
		date: "2026-03-26",
		commit: "5fa8bf7",
		phase: "i18n",
		title: "Internacionalização com 6 idiomas",
		description:
			"Suporte a PT-BR, EN, ES, DE, EL (grego) e PL (polonês) via react-i18next + i18next-browser-languagedetector. 122 strings extraídas de 22 arquivos. LanguageSwitcher dropdown no Header. Detecção automática do idioma do browser.",
		tags: ["i18n", "feature"],
	},
	{
		date: "2026-03-26",
		commit: "e81d90e",
		phase: "UX",
		title: "Tela de erro e página 404",
		description:
			"ErrorScreen inspirado no design Colorlib-404-3: título gigante 'Ops!' com text-shadow para efeito 3D, animações de entrada, mensagem técnica opcional e botões Voltar/Tentar novamente. Integrado como errorComponent no root route e no tutorial route. NotFound com mesmo visual para 404.",
		tags: ["ux", "error-handling"],
	},
	{
		date: "2026-03-26",
		commit: "6e895e0",
		phase: "Polish",
		title: "Cursor pointer, hover mais acentuado e tratamento de erro 429",
		description:
			"cursor:pointer e brightness(1.12) no hover global para todos os botões e links. active:scale(0.97) para feedback de pressão. Erros 429 (rate limit) capturados nos serviços de AI e exibidos com mensagem amigável.",
		tags: ["polish", "ux", "fix"],
	},
	{
		date: "2026-03-27",
		commit: "e9ee9a4",
		phase: "Testes",
		title: "Setup de Vitest com testes unitários",
		description:
			"Configuração do Vitest com jsdom e @testing-library/jest-dom. vitest.config.ts separado do vite.config.ts (incompatibilidade de tipos entre Vite 6/rolldown e Vitest). Testes para serviceErrors, NotFound, ErrorScreen e friendlyError.",
		tags: ["tests"],
		bugs: [
			"defineConfig do vitest/config conflita com plugins do Vite 6 (rolldown) — necessário as any nos plugins",
			"getByText('404') falha porque cada dígito é um <span> separado — solução: matcher por textContent",
			"vi.mock('react-i18next') incompleto: i18n/index.ts chama initReactI18next que não estava no mock",
		],
		decisions: [
			"vitest.config.ts separado do vite.config.ts para evitar conflito de tipos do Vite 6",
			"Apenas o plugin react() no vitest.config — tanstackRouter e tailwindcss são plugins de build, desnecessários nos testes",
		],
	},
	{
		date: "2026-03-28",
		phase: "Design System",
		title: "Página de design system",
		description:
			"Rota /design com documentação dos tokens visuais: paleta de cores com swatches, escala tipográfica (sans e mono), pesos de fonte, variantes de botão, badges, inputs, cards, espaçamento e border radius.",
		tags: ["design", "docs"],
	},
	{
		date: "2026-03-28",
		phase: "UX",
		title: "HeroBadge reposicionado para o Header",
		description:
			"Badge 'AI-Powered Interactive Learning' movido para ficar ao lado do logo no Header. Comportamento: exibe apenas o ícone com borda; hover expande o texto com animação de max-width. Antes estava no centro da landing page ocupando espaço desnecessário.",
		tags: ["ux", "design"],
	},
];

const tagColors: Record<string, string> = {
	setup: "border-border text-muted",
	config: "border-border text-muted",
	architecture: "border-amber/40 text-amber",
	ai: "border-amber/40 text-amber",
	auth: "border-blue-500/40 text-blue-400",
	routing: "border-border text-muted",
	data: "border-border text-muted",
	firestore: "border-orange-500/40 text-orange-400",
	design: "border-purple-500/40 text-purple-400",
	layout: "border-purple-500/40 text-purple-400",
	components: "border-border text-muted",
	editor: "border-green/40 text-green",
	animation: "border-purple-500/40 text-purple-400",
	feature: "border-amber/40 text-amber",
	cloudinary: "border-border text-muted",
	refactor: "border-border text-muted",
	"error-handling": "border-red-500/40 text-red-400",
	ux: "border-purple-500/40 text-purple-400",
	polish: "border-green/40 text-green",
	fix: "border-red-500/40 text-red-400",
	tests: "border-blue-500/40 text-blue-400",
	i18n: "border-amber/40 text-amber",
	docs: "border-border text-muted",
};

const phaseColors: Record<string, string> = {
	Fundação: "text-muted",
	Interface: "text-purple-400",
	Features: "text-amber",
	Auth: "text-blue-400",
	Profile: "text-amber",
	Landing: "text-purple-400",
	Editor: "text-green",
	"i18n": "text-amber",
	UX: "text-purple-400",
	Polish: "text-green",
	Testes: "text-blue-400",
	"Design System": "text-purple-400",
};

function DevlogPage() {
	const { t } = useTranslation();
	const totalBugs = entries
		.filter((e) => e.bugs?.length)
		.reduce((acc, e) => acc + (e.bugs?.length ?? 0), 0);

	return (
		<div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-4">
			<div className="mb-8">
				<h1 className="text-2xl font-mono font-bold text-text">{t("devlog.title")}</h1>
				<p className="text-sm text-muted mt-1">{t("devlog.subtitle")}</p>
				<p className="text-xs font-mono text-muted/50 mt-2">
					{t("devlog.counter", { entries: entries.length, bugs: totalBugs })}
				</p>
			</div>

			<div className="relative flex flex-col gap-0">
				{/* linha vertical da timeline */}
				<div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

				{entries.map((entry, i) => (
					<div key={i} className="relative pl-8 pb-10">
						{/* dot */}
						<div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-border bg-background" />

						<div className="flex flex-col gap-3">
							{/* header da entrada */}
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-xs font-mono text-muted/60">{entry.date}</span>
								{entry.commit && (
									<span className="text-xs font-mono text-muted/40 border border-border px-1.5 py-0.5 rounded">
										{entry.commit}
									</span>
								)}
								<span className={`text-xs font-mono font-medium ${phaseColors[entry.phase] ?? "text-muted"}`}>
									{entry.phase}
								</span>
							</div>

							<h3 className="text-base font-medium text-text">{entry.title}</h3>
							<p className="text-sm text-muted leading-relaxed">{entry.description}</p>

							{/* tags */}
							{entry.tags && (
								<div className="flex flex-wrap gap-1.5">
									{entry.tags.map((tag) => (
										<span
											key={tag}
											className={`text-xs font-mono border px-2 py-0.5 rounded-full ${tagColors[tag] ?? "border-border text-muted"}`}
										>
											{tag}
										</span>
									))}
								</div>
							)}

							{/* bugs */}
							{entry.bugs && (
								<div className="flex flex-col gap-1.5 mt-1">
									<p className="text-xs font-mono text-red-400/70 uppercase tracking-wider">
										{t("devlog.bugsLabel")}
									</p>
									<ul className="flex flex-col gap-1">
										{entry.bugs.map((bug, j) => (
											<li key={j} className="flex gap-2 text-sm text-muted">
												<span className="text-red-400/60 shrink-0 mt-0.5">✕</span>
												<span>{bug}</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* decisions */}
							{entry.decisions && (
								<div className="flex flex-col gap-1.5 mt-1">
									<p className="text-xs font-mono text-amber/70 uppercase tracking-wider">
										{t("devlog.decisionsLabel")}
									</p>
									<ul className="flex flex-col gap-1">
										{entry.decisions.map((d, j) => (
											<li key={j} className="flex gap-2 text-sm text-muted">
												<span className="text-amber/60 shrink-0 mt-0.5">→</span>
												<span>{d}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
