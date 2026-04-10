import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminAuth, adminDb } from "./_firebaseAdmin";
import { encrypt } from "./_encrypt";
import { setCorsHeaders } from "./_cors";

const VALID_PROVIDERS = ["anthropic", "openai"] as const;
type Provider = (typeof VALID_PROVIDERS)[number];

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (setCorsHeaders(req, res)) return;

	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	// Verify Firebase ID token
	const authHeader = req.headers.authorization ?? "";
	const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
	if (!idToken) {
		return res.status(401).json({ error: "Missing authorization token" });
	}

	let uid: string;
	try {
		const decoded = await adminAuth.verifyIdToken(idToken);
		uid = decoded.uid;
	} catch {
		return res.status(401).json({ error: "Invalid or expired token" });
	}

	// Validate body
	const { provider, key } = (req.body ?? {}) as { provider: unknown; key: unknown };

	if (!VALID_PROVIDERS.includes(provider as Provider)) {
		return res.status(400).json({ error: `provider must be one of: ${VALID_PROVIDERS.join(", ")}` });
	}
	if (typeof key !== "string" || key.trim().length === 0) {
		return res.status(400).json({ error: "key must be a non-empty string" });
	}
	if (key.length > 512) {
		return res.status(400).json({ error: "key exceeds maximum allowed length" });
	}

	// Encrypt and persist — only ciphertext + IV stored, never the plaintext
	const { ciphertext, iv } = encrypt(key.trim());

	const batch = adminDb.batch();

	batch.set(
		adminDb.collection("users").doc(uid).collection("encryptedKeys").doc(provider as Provider),
		{ ciphertext, iv, updatedAt: new Date().toISOString() },
	);

	batch.set(
		adminDb.collection("users").doc(uid),
		{ configuredKeys: { [provider as string]: true } },
		{ merge: true },
	);

	await batch.commit();

	return res.status(200).json({ ok: true });
}
