interface CloudinaryImageOptions {
	height?: number;
	width?: number;
}

function isCloudinaryUrl(url: string): boolean {
	try {
		return new URL(url).hostname.endsWith("res.cloudinary.com");
	} catch {
		return false;
	}
}

export function getOptimizedImageUrl(
	url: string | null | undefined,
	options: CloudinaryImageOptions = {},
): string | null {
	if (!url) return null;
	if (!isCloudinaryUrl(url)) return url;

	const transforms = [
		"f_auto",
		"q_auto",
		"c_fill",
		"g_auto",
		options.width ? `w_${options.width}` : null,
		options.height ? `h_${options.height}` : null,
	]
		.filter(Boolean)
		.join(",");

	return url.replace("/image/upload/", `/image/upload/${transforms}/`);
}
