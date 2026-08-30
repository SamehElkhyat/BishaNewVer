// Shared helpers for the activities (فعاليات الغرفة) pages.
// The `_lib` prefix keeps this file out of the App Router.

export type Activity = Record<string, unknown> & { id?: number | string };

const MONTHS: Record<string, string> = {
  "01": "يناير",
  "02": "فبراير",
  "03": "مارس",
  "04": "أبريل",
  "05": "مايو",
  "06": "يونيو",
  "07": "يوليو",
  "08": "أغسطس",
  "09": "سبتمبر",
  "10": "أكتوبر",
  "11": "نوفمبر",
  "12": "ديسمبر",
};

const pick = (obj: Activity, keys: string[]): string => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return "";
};

export const getTitle = (a: Activity) =>
  pick(a, [
    "title",
    "name",
    "activityTitle",
    "activityName",
    "subject",
    "eventName",
  ]);

export const getDesc = (a: Activity) =>
  pick(a, [
    "description",
    "content",
    "details",
    "body",
    "activityDescription",
    "summary",
    "brief",
    "about",
  ]);

// Activities carry multiple images as `images: [{ id, imageUrl }]`; circulars
// carry a single `imageUrl` string. Handle both shapes before falling back.
const firstFromImagesArray = (a: Activity): string => {
  const arr = a?.["images"];
  if (!Array.isArray(arr) || arr.length === 0) return "";
  const first = arr[0] as Record<string, unknown>;
  if (typeof first === "string") return first;
  return pick(first, ["imageUrl", "url", "image", "path"]);
};

export const getImg = (a: Activity) =>
  firstFromImagesArray(a) ||
  pick(a, [
    "image",
    "imageUrl",
    "imageURL",
    "activityImage",
    "img",
    "photo",
    "coverImage",
    "picture",
  ]) ||
  "/news-placeholder.jpg";

export const getDate = (a: Activity) =>
  pick(a, [
    "date",
    "activityDate",
    "startDate",
    "eventDate",
    "dateFrom",
    "start",
    "createdAt",
  ]);

export const getEndDate = (a: Activity) => pick(a, ["endDate", "dateTo", "end"]);

export const getTime = (a: Activity) =>
  pick(a, ["time", "activityTime", "startTime", "timeFrom", "hours"]);

export const getLocation = (a: Activity) =>
  pick(a, ["location", "place", "activityLocation", "venue", "address", "hall"]);

export const getType = (a: Activity) =>
  pick(a, ["type", "activityType", "category", "activityCategory", "kind"]);

export const toDate = (value: string): Date | null => {
  if (!value) return null;
  try {
    if (value.includes("T")) return new Date(value);
    const sep = value.includes("/") ? "/" : value.includes("-") ? "-" : "";
    if (sep) {
      const parts = value.split(sep).map((p) => p.trim());
      if (parts.length === 3) {
        const [a, b, c] = parts;
        if (a.length === 4) return new Date(Number(a), Number(b) - 1, Number(c));
        return new Date(Number(c), Number(b) - 1, Number(a));
      }
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

export const formatDate = (value: string): string => {
  const d = toDate(value);
  if (!d || isNaN(d.getTime())) return value || "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${day} ${MONTHS[month] || ""} ${d.getFullYear()}`.trim();
};

export const listFrom = (data: unknown): Activity[] => {
  const d = data as Record<string, unknown> | null;
  const list =
    (d?.activities as unknown[]) ||
    (d?.circulars as unknown[]) ||
    (d?.data as unknown[]) ||
    (d?.items as unknown[]) ||
    (d?.result as unknown[]) ||
    (d?.records as unknown[]) ||
    [];
  return Array.isArray(list) ? (list as Activity[]) : [];
};

export const buildPageList = (
  current: number,
  total: number
): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2)
    return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
};
