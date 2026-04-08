import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_ORIGINS = [
	"https://codequest.vercel.app",
	...(process.env.NODE_ENV !== "production" ? ["http://localhost:5173", "http://localhost:3000"] : []),
];

export function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
	const origin = req.headers.origin ?? "";

	if (ALLOWED_ORIGINS.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
	res.setHeader("Vary", "Origin");

	if (req.method === "OPTIONS") {
		res.status(204).end();
		return true;
	}
	return false;
}
