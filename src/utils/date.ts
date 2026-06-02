import { addDays, format, isSameDay, isThisMonth, isThisWeek, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export const todayISO = () => format(new Date(), "yyyy-MM-dd");
export const tomorrowISO = () => format(addDays(new Date(), 1), "yyyy-MM-dd");
export const nowISO = () => new Date().toISOString();
export const displayDate = (date = new Date()) => format(date, "yyyy年M月d日 EEEE", { locale: zhCN });

export function isTodayISO(date?: string | null) {
  return Boolean(date && isSameDay(parseISO(date), new Date()));
}

export function shouldRunFrequency(date: string | undefined, frequency: "每天" | "每周" | "每月") {
  const base = date ? parseISO(date) : new Date();
  if (frequency === "每天") return true;
  if (frequency === "每周") return isThisWeek(base, { weekStartsOn: 1 });
  return isThisMonth(base);
}

export function isReviewTime(reminderTime = "17:00") {
  const [hour, minute] = reminderTime.split(":").map(Number);
  const now = new Date();
  return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute);
}
