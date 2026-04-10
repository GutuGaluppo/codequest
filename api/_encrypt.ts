import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getKey(): Buffer {
	const key = process.env.ENCRYPTION_KEY;
	if (!key || key.length !== 64) {
		throw new Error("ENCRYPTION_KEY must be a 64-char hex string (32 bytes)");
	}
	return Buffer.from(key, "hex");
}

export function encrypt(plaintext: string): { ciphertext: string; iv: string } {
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, getKey(), iv);

	const encrypted = Buffer.concat([
		cipher.update(plaintext, "utf8"),
		cipher.final(),
	]);
	const tag = cipher.getAuthTag();

	// Store tag appended to ciphertext so decrypt can verify integrity
	return {
		ciphertext: Buffer.concat([encrypted, tag]).toString("hex"),
		iv: iv.toString("hex"),
	};
}

export function decrypt(ciphertext: string, iv: string): string {
	const data = Buffer.from(ciphertext, "hex");
	const tag = data.subarray(data.length - TAG_LENGTH);
	const encrypted = data.subarray(0, data.length - TAG_LENGTH);

	const decipher = createDecipheriv(
		ALGORITHM,
		getKey(),
		Buffer.from(iv, "hex"),
	);
	decipher.setAuthTag(tag);

	return Buffer.concat([
		decipher.update(encrypted),
		decipher.final(),
	]).toString("utf8");
}
