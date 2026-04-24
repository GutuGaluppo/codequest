import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export class FirebaseAdminConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "FirebaseAdminConfigError";
	}
}

function getNormalizedPrivateKey(): string | undefined {
	const privateKey = process.env.FIREBASE_PRIVATE_KEY;
	if (!privateKey) return undefined;
	return privateKey.replace(/\\n/g, "\n").trim();
}

function ensureAdminApp() {
	if (getApps().length) return getApp();

	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = getNormalizedPrivateKey();

	if (!projectId || !clientEmail || !privateKey) {
		throw new FirebaseAdminConfigError(
			"Firebase Admin is not fully configured. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
		);
	}

	try {
		return initializeApp({
			credential: cert({
				projectId,
				clientEmail,
				privateKey,
			}),
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown Firebase Admin error";
		throw new FirebaseAdminConfigError(
			`Firebase Admin configuration is invalid: ${message}`,
		);
	}
}

export function getAdminAuth() {
	return getAuth(ensureAdminApp());
}

export function getAdminDb() {
	return getFirestore(
		ensureAdminApp(),
		process.env.FIRESTORE_DATABASE_ID ?? "(default)",
	);
}
