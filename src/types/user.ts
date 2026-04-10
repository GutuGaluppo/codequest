import type { FieldValue, Timestamp } from "firebase/firestore";
import type { ModelProvider } from "./tutorial";

export interface UserProfile {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
	preferredModel: ModelProvider;
	configuredKeys?: { anthropic?: boolean; openai?: boolean };
	createdAt: FieldValue | Timestamp;
}

export type { ModelProvider };
