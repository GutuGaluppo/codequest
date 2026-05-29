import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthStore, type AuthRedirectTo } from "../../../stores/authStore";
import { footerInteractiveClass, getFooterColumns } from "./utils";

export function useLandingFooter() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { openDrawer } = useAuthStore();
	const navigate = useNavigate();

	function handleAuthLink(to: AuthRedirectTo) {
		if (user) {
			navigate({ to });
			return;
		}

		openDrawer(to);
	}

	return {
		columns: getFooterColumns(t),
		handleAuthLink,
		interactiveClass: footerInteractiveClass,
		t,
	};
}
