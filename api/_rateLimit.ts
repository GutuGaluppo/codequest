const WINDOW_MS = 60_000; // 1 minute
const MAX_GENERATE = 5;
const MAX_VERIFY = 20;

const store = new Map<string, { count: number; resetAt: number }>();

function getIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
	const forwarded = req.headers["x-forwarded-for"];
	if (forwarded) {
		return (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(",")[0].trim();
	}
	return req.socket?.remoteAddress ?? "unknown";
}

export function checkRateLimit(
	req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } },
	limit: number,
): { allowed: boolean; retryAfter: number } {
	const ip = getIp(req);
	const now = Date.now();
	const entry = store.get(ip);

	if (!entry || now > entry.resetAt) {
		store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
		return { allowed: true, retryAfter: 0 };
	}

	if (entry.count >= limit) {
		return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
	}

	entry.count++;
	return { allowed: true, retryAfter: 0 };
}

export { MAX_GENERATE, MAX_VERIFY };
