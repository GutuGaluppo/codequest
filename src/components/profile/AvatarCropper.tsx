import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { X } from "lucide-react";

interface AvatarCropperProps {
	open: boolean;
	canUpload: boolean;
	disabled?: boolean;
	displayName: string;
	currentPreview: string | null;
	onClose: () => void;
	onSave: (avatar: { blob: Blob; previewUrl: string }) => Promise<void> | void;
}

const cropSize = 280;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

function getDisplaySizeForCrop(
	naturalWidth: number,
	naturalHeight: number,
): { width: number; height: number } {
	const coverScale = Math.max(
		cropSize / naturalWidth,
		cropSize / naturalHeight,
	);

	return {
		width: naturalWidth * coverScale,
		height: naturalHeight * coverScale,
	};
}

export function AvatarCropper({
	open,
	canUpload,
	disabled = false,
	displayName,
	currentPreview,
	onClose,
	onSave,
}: AvatarCropperProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const loadRequestIdRef = useRef(0);

	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [scale, setScale] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [saving, setSaving] = useState(false);
	const [displaySize, setDisplaySize] = useState({
		width: cropSize,
		height: cropSize,
	});

	const { t } = useTranslation();

	function resetEditor() {
		setImageSrc(null);
		setScale(1);
		setPosition({ x: 0, y: 0 });
		setDragging(false);
		setSaving(false);
		setDisplaySize({ width: cropSize, height: cropSize });
	}

	function loadImageSource(source: string, options?: { silent?: boolean }) {
		const requestId = ++loadRequestIdRef.current;
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			if (requestId !== loadRequestIdRef.current) return;

			setImageSrc(source);
			setDisplaySize(
				getDisplaySizeForCrop(img.naturalWidth, img.naturalHeight),
			);
			setScale(1);
			setPosition({ x: 0, y: 0 });
		};
		img.onerror = () => {
			if (requestId !== loadRequestIdRef.current || options?.silent) return;
			toast.error(t("profile.photoReadFailed"));
		};
		img.src = source;
	}

	useEffect(() => {
		if (!open) {
			loadRequestIdRef.current += 1;
			setDragging(false);
			setSaving(false);
			return;
		}

		resetEditor();
		if (currentPreview) {
			loadImageSource(currentPreview, { silent: true });
		}
	}, [currentPreview, open]);

	async function generateAvatar(): Promise<{ blob: Blob; previewUrl: string } | null> {
		if (!imageSrc || !imageRef.current || !containerRef.current) return null;

		const image = imageRef.current;
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");

		if (!context) return null;

		canvas.width = cropSize;
		canvas.height = cropSize;

		const containerRect = containerRef.current.getBoundingClientRect();
		const imageRect = image.getBoundingClientRect();

		const naturalToDisplayedRatioX = image.naturalWidth / imageRect.width;
		const naturalToDisplayedRatioY = image.naturalHeight / imageRect.height;

		const sourceX = (containerRect.left - imageRect.left) * naturalToDisplayedRatioX;
		const sourceY = (containerRect.top - imageRect.top) * naturalToDisplayedRatioY;
		const sourceWidth = cropSize * naturalToDisplayedRatioX;
		const sourceHeight = cropSize * naturalToDisplayedRatioY;

		context.save();
		context.beginPath();
		context.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
		context.closePath();
		context.clip();
		context.drawImage(
			image,
			sourceX,
			sourceY,
			sourceWidth,
			sourceHeight,
			0,
			0,
			cropSize,
			cropSize,
		);
		context.restore();

		const blob = await new Promise<Blob | null>((resolve) => {
			canvas.toBlob(resolve, "image/png");
		});
		if (!blob) return null;

		return {
			blob,
			previewUrl: URL.createObjectURL(blob),
		};
	}

	function openFilePicker() {
		if (disabled || saving) return;
		if (!canUpload) {
			toast.error(t("profile.photoUploadNotConfigured"));
			return;
		}

		fileInputRef.current?.click();
	}

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_TYPES.includes(file.type)) {
			toast.error(t("profile.photoInvalidType"));
			event.target.value = "";
			return;
		}
		if (file.size > MAX_SIZE_MB * 1024 * 1024) {
			toast.error(t("profile.photoTooLarge", { max: MAX_SIZE_MB }));
			event.target.value = "";
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === "string" ? reader.result : null;
			if (!result) {
				toast.error(t("profile.photoReadFailed"));
				return;
			}

			loadImageSource(result);
		};
		reader.onerror = () => {
			toast.error(t("profile.photoReadFailed"));
		};

		reader.readAsDataURL(file);
		event.target.value = "";
	}

	function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
		if (!imageSrc || disabled || saving) return;

		setDragging(true);
		setDragStart({
			x: event.clientX - position.x,
			y: event.clientY - position.y,
		});
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
		if (!dragging || disabled || saving) return;

		setPosition({
			x: event.clientX - dragStart.x,
			y: event.clientY - dragStart.y,
		});
	}

	function handlePointerUp(event?: ReactPointerEvent<HTMLDivElement>) {
		if (event?.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		setDragging(false);
	}

	function handleZoomChange(event: ChangeEvent<HTMLInputElement>) {
		setScale(Number(event.target.value));
	}

	function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
		if (!imageSrc || disabled || saving) return;

		event.preventDefault();

		const zoomSpeed = 0.08;
		const nextScale = event.deltaY < 0 ? scale + zoomSpeed : scale - zoomSpeed;
		setScale(Math.min(Math.max(nextScale, 0.5), 4));
	}

	async function handleSave() {
		if (!imageSrc) {
			toast.error(t("profile.photoUploadFirst"));
			return;
		}

		setSaving(true);
		try {
			const avatar = await generateAvatar();
			if (!avatar) {
				toast.error(t("profile.photoCropFailed"));
				return;
			}

			await onSave(avatar);
			onClose();
		} catch {
			// Parent handles the user-facing error message.
		} finally {
			setSaving(false);
		}
	}

	return (
		<AnimatePresence>
			{open ? (
				<>
					<motion.div
						key="avatar-cropper-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-40 bg-black/65"
					/>
					<motion.div
						key="avatar-cropper-modal"
						initial={{ opacity: 0, scale: 0.97, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.97, y: 10 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
					>
						<div className="w-full max-w-md border border-border bg-background">
							<div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
								<div>
									<p className="text-xs font-mono uppercase tracking-widest text-muted">
										{t("profile.photoLabel")}
									</p>
									<h2 className="mt-2 text-2xl font-black uppercase text-text">
										{t("profile.photoModalTitle")}
									</h2>
								</div>
								<button
									type="button"
									onClick={onClose}
									className="text-muted transition-colors hover:text-text"
									aria-label={t("profile.photoModalClose")}
								>
									<X size={18} />
								</button>
							</div>

							<div className="px-6 py-6">
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>

								<div className="flex flex-col items-center gap-5">
									<div
										ref={containerRef}
										className={`relative h-[280px] w-[280px] overflow-hidden rounded-full border border-border bg-surface shadow-inner ${
											imageSrc ? "select-none touch-none" : ""
										}`}
										onPointerDown={handlePointerDown}
										onPointerMove={handlePointerMove}
										onPointerUp={handlePointerUp}
										onPointerLeave={handlePointerUp}
										onPointerCancel={handlePointerUp}
										onWheel={handleWheel}
									>
										{imageSrc ? (
											<img
												ref={imageRef}
												src={imageSrc}
												crossOrigin="anonymous"
												alt={t("profile.photoCropImageAlt")}
												draggable="false"
												className="absolute left-1/2 top-1/2 max-w-none select-none"
												style={{
													transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
													transformOrigin: "center",
													width: `${displaySize.width}px`,
													height: `${displaySize.height}px`,
													cursor: dragging ? "grabbing" : "grab",
												}}
											/>
										) : currentPreview ? (
											<button
												type="button"
												onClick={openFilePicker}
												className="group relative h-full w-full"
											>
												<img
													src={currentPreview}
													alt={t("profile.photoCropImageAlt")}
													className="h-full w-full object-cover"
												/>
												<div className="absolute inset-0 flex items-center justify-center bg-background/55 opacity-0 transition-opacity group-hover:opacity-100">
													<span className="px-2 text-center text-[10px] font-mono uppercase tracking-widest text-text">
														{t("profile.photoEditButton")}
													</span>
												</div>
											</button>
										) : (
											<button
												type="button"
												onClick={openFilePicker}
												className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-muted transition-colors hover:text-text"
											>
												<span className="text-4xl font-mono leading-none">
													{displayName?.charAt(0).toUpperCase() ?? "+"}
												</span>
												<span className="max-w-32 text-xs font-mono uppercase tracking-widest">
													{t("profile.photoUploadButton")}
												</span>
											</button>
										)}

										<div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-background" />
										<div className="pointer-events-none absolute inset-[-60px] rounded-full bg-background/45 [mask:radial-gradient(circle_140px_at_center,transparent_99%,black_100%)]" />
									</div>

									<div className="w-full border border-border bg-surface/30 p-4">
										<div className="text-sm">
											<label
												htmlFor="profile-avatar-zoom"
												className="text-xs font-mono uppercase tracking-widest text-muted"
											>
												{t("profile.photoZoomLabel")}
											</label>
										</div>

										<input
											id="profile-avatar-zoom"
											type="range"
											min="0.5"
											max="4"
											step="0.01"
											value={scale}
											disabled={!imageSrc || disabled || saving}
											onChange={handleZoomChange}
											className="mt-3 w-full accent-amber disabled:opacity-30"
										/>

										<div className="mt-3 flex items-center justify-between gap-3">
											<span className="text-xs font-mono text-muted">
												{scale.toFixed(2)}x
											</span>
											<button
												type="button"
												onClick={openFilePicker}
												disabled={disabled || saving}
												className="text-xs font-black uppercase tracking-wide text-amber transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
											>
												{t("profile.photoChangeLabel")}
											</button>
										</div>
									</div>

									<div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
										<button
											type="button"
											onClick={onClose}
											disabled={saving}
											className="border border-border px-4 py-3 text-xs font-mono uppercase tracking-widest text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
										>
											{t("profile.photoModalCancel")}
										</button>
										<button
											type="button"
											onClick={handleSave}
											disabled={disabled || saving}
											className="bg-amber px-4 py-3 text-xs font-black uppercase tracking-wide text-background transition disabled:cursor-not-allowed disabled:opacity-40"
										>
											{saving ? t("profile.buttonSaving") : t("profile.photoModalSave")}
										</button>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</>
			) : null}
		</AnimatePresence>
	);
}
