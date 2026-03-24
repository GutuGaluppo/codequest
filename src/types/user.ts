import type { FieldValue, Timestamp } from "firebase/firestore";
import type { ModelProvider, UserApiKeys } from "./tutorial";

export interface UserProfile {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
	preferredModel: ModelProvider;
	apiKeys: UserApiKeys;
	createdAt: FieldValue | Timestamp;
}

export type { ModelProvider, UserApiKeys };
