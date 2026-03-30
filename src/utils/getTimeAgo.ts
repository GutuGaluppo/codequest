import type { TFunction } from "i18next";

export function getTimeAgo(timestamp: number, t: TFunction): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.floor(diff / 60_000);
	const hours = Math.floor(diff / 3_600_000);
	const days = Math.floor(diff / 86_400_000);

	if (minutes < 1) return t("dashboard.timeAgo.justNow");
	if (minutes < 60) return t("dashboard.timeAgo.minutes", { count: minutes });
	if (hours < 24) return t("dashboard.timeAgo.hours", { count: hours });
	return t("dashboard.timeAgo.days", { count: days });
}
