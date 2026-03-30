import { useTranslation } from "react-i18next";

export function ImageInput({
	displayName,
	photoPreview,
	handleFileChange,
}: {
	displayName: string;
	photoPreview: string | null;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-xs font-mono uppercase tracking-widest text-muted">
				{t("profile.photoLabel")}
			</label>
			<div className="flex items-center gap-4">
				<div className="w-16 h-16 overflow-hidden border border-border bg-surface flex items-center justify-center shrink-0">
					{photoPreview ? (
						<img
							src={photoPreview}
							alt="avatar"
							className="w-full h-full object-cover"
						/>
					) : (
						<span className="text-lg font-mono font-medium text-muted">
							{displayName?.charAt(0).toUpperCase() ?? "?"}
						</span>
					)}
				</div>
				<label className="cursor-pointer text-xs font-mono text-muted hover:text-text transition-colors uppercase tracking-widest">
					{t("profile.photoChangeLabel")}
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>
				</label>
			</div>
		</div>
	);
}
