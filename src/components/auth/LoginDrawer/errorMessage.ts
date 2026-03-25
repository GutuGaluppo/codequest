export function friendlyError(message: string): string {
	if (message.includes("email-already-in-use")) {
		return "Este email já está cadastrado.";
	}
	if (
		message.includes("wrong-password") ||
		message.includes("invalid-credential")
	) {
		return "Email ou senha incorretos.";
	}
	if (message.includes("account-exists-with-different-credential")) {
		return "Você já tem uma conta com este email. Tente entrar com Google.";
	}

	if (message.includes("user-not-found")) {
		return "Nenhuma conta encontrada com este email.";
	}
	if (message.includes("weak-password")) {
		return "A senha deve ter pelo menos 6 caracteres.";
	}
	if (message.includes("popup-closed-by-user")) return "";
	return "Ocorreu um erro. Tente novamente.";
}
