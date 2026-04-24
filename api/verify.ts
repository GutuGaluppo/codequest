import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { parseAiJson } from "../src/utils/parseAiJson";
import { wrapUserInput } from "../src/services/systemPrompt";
import type { ModelProvider } from "../src/types/tutorial";
import type { Feedback } from "../src/stores/editorStore";
import { validateVerifyBody } from "./_validate";
import { checkRateLimit, MAX_VERIFY } from "./_rateLimit";
import { setCorsHeaders } from "./_cors";
import {
	FirebaseAdminConfigError,
	getAdminAuth,
	getAdminDb,
} from "./_firebaseAdmin";
import { decrypt } from "./_encrypt";

interface VerifyBody {
	prompt: string;
	solution: string;
	userCode: string;
	output: string;
	model: ModelProvider;
}

function buildPrompt(body: VerifyBody): string {
	return `You are a code reviewer. The user received the following challenge:
${wrapUserInput(body.prompt)}

Expected solution:
${wrapUserInput(body.solution)}

User's code:
${wrapUserInput(body.userCode)}

Output when executed:
${wrapUserInput(body.output)}

Evaluate whether the solution correctly solves the challenge.
Respond ONLY with valid JSON, no markdown:
{"status":"correct"|"partial"|"incorrect","message":"Feedback in 1–2 sentences, in the same language as the challenge prompt."}`;
}

async function getUserApiKey(uid: string, provider: "anthropic" | "openai"): Promise<string | null> {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (setCorsHeaders(req, res)) return;

	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { allowed, retryAfter } = checkRateLimit(req, MAX_VERIFY);
	if (!allowed) {
		res.setHeader("Retry-After", retryAfter);
		return res.status(429).json({ error: "Too many requests. Please wait before verifying again." });
	}

	const validation = validateVerifyBody(req.body);
	if (!validation.ok) {
		return res.status(400).json({ error: validation.message });
	}

	const body = req.body as VerifyBody;
	const userPrompt = buildPrompt(body);

	// Verify Firebase ID token to identify the user
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
		let feedback: Feedback;

		if (body.model === "claude") {
			const apiKey = uid ? await getUserApiKey(uid, "anthropic") : null;
			if (!apiKey) return res.status(400).json({ error: "Anthropic API key not configured." });

			const client = new Anthropic({ apiKey });
			const result = await client.messages.create({
				model: "claude-3-5-sonnet-20241022",
				max_tokens: 256,
				messages: [{ role: "user", content: userPrompt }],
			});
			const text = result.content[0].type === "text" ? result.content[0].text : "";
			feedback = parseAiJson(text) as Feedback;
		} else if (body.model === "openai") {
			const apiKey = uid ? await getUserApiKey(uid, "openai") : null;
			if (!apiKey) return res.status(400).json({ error: "OpenAI API key not configured." });

			const client = new OpenAI({ apiKey });
			const result = await client.chat.completions.create({
				model: "gpt-4o",
				messages: [{ role: "user", content: userPrompt }],
				max_tokens: 256,
			});
			feedback = parseAiJson(result.choices[0].message.content ?? "") as Feedback;
		} else {
			const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
			const result = await ai.models.generateContent({
				model: "gemini-2.5-flash-lite",
				contents: userPrompt,
			});
			feedback = parseAiJson(result.text ?? "") as Feedback;
		}

		return res.status(200).json(feedback);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return res.status(500).json({ error: message });
	}
}
