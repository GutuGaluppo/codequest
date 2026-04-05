import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react";

export function TutorialLoading() {
	const { t } = useTranslation();
	const steps = t("tutorial.loading.steps", { returnObjects: true }) as string[];
	const [visibleCount, setVisibleCount] = useState(1);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		if (activeIndex >= steps.length - 1) return;
		const delay = 1200 + Math.random() * 800;
		const timer = setTimeout(() => {
			setActiveIndex((i) => i + 1);
			setVisibleCount((c) => Math.min(c + 1, steps.length));
		}, delay);
		return () => clearTimeout(timer);
	}, [activeIndex, steps.length]);

	return (
		<div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] gap-8">
			<div className="flex flex-col gap-1 w-64">
				<AnimatePresence>
					{steps.slice(0, visibleCount).map((step, i) => {
						const isDone = i < activeIndex;
						const isActive = i === activeIndex;
						return (
							<motion.div
								key={step}
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className={`flex items-center gap-3 py-1.5 text-sm font-mono ${
									isDone
										? "text-muted/50"
										: isActive
											? "text-text"
											: "text-muted/30"
								}`}
							>
								{isDone ? (
									<CheckCircle size={14} className="text-green shrink-0" />
								) : isActive ? (
									<motion.span
										className="w-3.5 h-3.5 rounded-full border-2 border-amber border-t-transparent shrink-0"
										animate={{ rotate: 360 }}
										transition={{
											duration: 0.8,
											repeat: Infinity,
											ease: "linear",
										}}
									/>
								) : (
									<span className="w-3.5 h-3.5 rounded-full border border-border shrink-0" />
								)}
								{step}
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
}
