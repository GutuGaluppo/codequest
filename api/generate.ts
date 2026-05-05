import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { buildSystemPrompt, wrapUserInput } from "../src/services/systemPrompt";
import { parseAiJson } from "../src/utils/parseAiJson";
import type { Level, ModelProvider, Tutorial } from "../src/types/tutorial";
import { validateGenerateBody } from "./_validate";
import { checkRateLimit, MAX_GENERATE } from "./_rateLimit";
import { setCorsHeaders } from "./_cors";
import {
	FirebaseAdminConfigError,
	getAdminAuth,
	getAdminDb,
} from "./_firebaseAdmin";
import { decrypt } from "./_encrypt";

type Provider = "anthropic" | "openai" | "gemini" | "other";

async function getUserApiKey(uid: string, provider: Provider): Promise<string | null> {
	const snap = await getAdminDb()
		.collection("users")
		.doc(uid)
		.collection("encryptedKeys")
		.doc(provider)
		.get();
	if (!snap.exists) return null;
	const { ciphertext, iv } = snap.data() as { ciphertext: string; iv: string };
	return decrypt(ciphertext, iv);
}

async function getUserOtherModel(uid: string): Promise<{ name: string; baseUrl: string } | null> {
	const snap = await getAdminDb().collection("users").doc(uid).get();
	if (!snap.exists) return null;
	const data = snap.data() as { otherModel?: { name: string; baseUrl: string } };
	return data.otherModel ?? null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (setCorsHeaders(req, res)) return;

	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { allowed, retryAfter } = checkRateLimit(req, MAX_GENERATE);
	if (!allowed) {
		res.setHeader("Retry-After", retryAfter);
		return res.status(429).json({ error: "Too many requests. Please wait before generating again." });
	}

	const validation = validateGenerateBody(req.body);
	if (!validation.ok) {
		return res.status(400).json({ error: validation.message });
	}

	const { topic, model, level, language } = req.body as {
		topic: string;
		model: ModelProvider;
		level: Level;
		language: string;
	};

	const authHeader = req.headers.authorization ?? "";
	const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

	let uid: string | null = null;
	if (idToken) {
		try {
			const decoded = await getAdminAuth().verifyIdToken(idToken);
			uid = decoded.uid;
		} catch (error) {
			if (error instanceof FirebaseAdminConfigError) {
				return res.status(500).json({ error: error.message });
			}
			return res.status(401).json({ error: "Invalid or expired token" });
		}
	}

	try {
		let raw: Tutorial;
		const wrappedTopic = wrapUserInput(topic);

		if (model === "claude") {
			const apiKey = uid ? await getUserApiKey(uid, "anthropic") : null;
			if (!apiKey) return res.status(400).json({ error: "Anthropic API key not configured." });

			const client = new Anthropic({ apiKey });
			const message = await client.messages.create({
				model: "claude-3-5-sonnet-20241022",
				max_tokens: 4096,
				messages: [{ role: "user", content: `${buildSystemPrompt(level, language)} Topic: ${wrappedTopic}` }],
			});
			const text = message.content[0].type === "text" ? message.content[0].text : "";
			raw = { ...(parseAiJson(text) as Tutorial), generatedWith: "claude", createdAt: null };
		} else if (model === "openai") {
			const apiKey = uid ? await getUserApiKey(uid, "openai") : null;
			if (!apiKey) return res.status(400).json({ error: "OpenAI API key not configured." });

			const client = new OpenAI({ apiKey });
			const response = await client.chat.completions.create({
				model: "gpt-4o",
				response_format: { type: "json_object" },
				messages: [
					{ role: "system", content: buildSystemPrompt(level, language) },
					{ role: "user", content: `Topic: ${wrappedTopic}` },
				],
			});
			const text = response.choices[0].message.content ?? "";
			raw = { ...(parseAiJson(text) as Tutorial), generatedWith: "openai", createdAt: null };
		} else if (model === "gemini") {
			const apiKey = uid ? await getUserApiKey(uid, "gemini") : null;
			if (!apiKey) return res.status(400).json({ error: "Gemini API key not configured." });

			const ai = new GoogleGenAI({ apiKey });
			const result = await ai.models.generateContent({
				model: "gemini-2.0-flash",
				contents: `${buildSystemPrompt(level, language)} Topic: ${wrappedTopic}`,
			});
			raw = { ...(parseAiJson(result.text || "") as Tutorial), generatedWith: "gemini", createdAt: null };
		} else {
			const apiKey = uid ? await getUserApiKey(uid, "other") : null;
			if (!apiKey) return res.status(400).json({ error: "API key not configured." });

			const otherModel = uid ? await getUserOtherModel(uid) : null;
			if (!otherModel) return res.status(400).json({ error: "Custom AI model not configured." });

			const client = new OpenAI({ apiKey, baseURL: otherModel.baseUrl });
			const response = await client.chat.completions.create({
				model: otherModel.name,
				messages: [
					{ role: "system", content: buildSystemPrompt(level, language) },
					{ role: "user", content: `Topic: ${wrappedTopic}` },
				],
			});
			const text = response.choices[0].message.content ?? "";
			raw = { ...(parseAiJson(text) as Tutorial), generatedWith: "other", createdAt: null };
		}

		return res.status(200).json(raw);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return res.status(500).json({ error: message });
	}
}
