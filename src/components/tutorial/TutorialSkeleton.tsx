import { motion } from "motion/react";

function SkeletonBlock({ className }: { className: string }) {
	return (
		<motion.div
			className={`bg-surface rounded ${className}`}
			animate={{ opacity: [0.4, 0.8, 0.4] }}
			transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
		/>
	);
}

export function TutorialSkeleton() {
	return (
		<div className="flex flex-col gap-3 h-[calc(100vh-5rem)] px-6 pb-4">
			{/* StepNav skeleton */}
			<div className="flex gap-1">
				{Array.from({ length: 5 }).map((_, i) => (
					<SkeletonBlock key={i} className="h-8 w-28" />
				))}
			</div>

			{/* Content skeleton */}
			<div className="flex-1 grid grid-cols-2 gap-0 border rounded overflow-hidden">
				<div className="flex flex-col gap-4 p-6 border-r">
					<SkeletonBlock className="h-6 w-48" />
					<SkeletonBlock className="h-4 w-full" />
					<SkeletonBlock className="h-4 w-5/6" />
					<SkeletonBlock className="h-4 w-4/6" />
					<SkeletonBlock className="h-24 w-full mt-2" />
					<SkeletonBlock className="h-20 w-full" />
				</div>
				<div className="bg-surface" />
			</div>
		</div>
	);
}
