import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
	FirebaseAdminConfigError,
	getAdminAuth,
	getAdminDb,
} from "./_firebaseAdmin";
import { encrypt } from "./_encrypt";
import { setCorsHeaders } from "./_cors";

const VALID_PROVIDERS = ["anthropic", "openai", "gemini", "other"] as const;
type Provider = (typeof VALID_PROVIDERS)[number];

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (setCorsHeaders(req, res)) return;

	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const authHeader = req.headers.authorization ?? "";
	const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
	if (!idToken) {
		return res.status(401).json({ error: "Missing authorization token" });
	}

	let uid: string;
	try {
		const decoded = await getAdminAuth().verifyIdToken(idToken);
		uid = decoded.uid;
	} catch (error) {
		if (error instanceof FirebaseAdminConfigError) {
			return res.status(500).json({ error: error.message });
		}
		return res.status(401).json({ error: "Invalid or expired token" });
	}

	const { provider, key, modelName, baseUrl } = (req.body ?? {}) as {
		provider: unknown;
		key: unknown;
		modelName?: unknown;
		baseUrl?: unknown;
	};

	if (!VALID_PROVIDERS.includes(provider as Provider)) {
		return res.status(400).json({ error: `provider must be one of: ${VALID_PROVIDERS.join(", ")}` });
	}
	if (typeof key !== "string" || key.trim().length === 0) {
		return res.status(400).json({ error: "key must be a non-empty string" });
	}
	if (key.length > 512) {
		return res.status(400).json({ error: "key exceeds maximum allowed length" });
	}
	if (provider === "other") {
		if (typeof modelName !== "string" || modelName.trim().length === 0) {
			return res.status(400).json({ error: "modelName is required for provider 'other'" });
		}
		if (typeof baseUrl !== "string" || baseUrl.trim().length === 0) {
			return res.status(400).json({ error: "baseUrl is required for provider 'other'" });
		}
	}

	try {
		const { ciphertext, iv } = encrypt(key.trim());
		const adminDb = getAdminDb();
		const batch = adminDb.batch();

		batch.set(
			adminDb.collection("users").doc(uid).collection("encryptedKeys").doc(provider as Provider),
			{ ciphertext, iv, updatedAt: new Date().toISOString() },
		);

		const profileUpdate: Record<string, unknown> = {
			configuredKeys: { [provider as string]: true },
		};
		if (provider === "other") {
			profileUpdate.otherModel = {
				name: (modelName as string).trim(),
				baseUrl: (baseUrl as string).trim(),
			};
		}

		batch.set(adminDb.collection("users").doc(uid), profileUpdate, { merge: true });

		await batch.commit();

		return res.status(200).json({ ok: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return res.status(500).json({ error: message });
	}
}
