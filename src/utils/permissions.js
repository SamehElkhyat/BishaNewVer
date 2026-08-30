/**
 * Permission helpers — tolerant of the various shapes the backend may return
 * from /Register/My-Permissions and /Register/Get-All-Permissions.
 */

// Pull an array of permissions out of whatever wrapper the API used.
// Tolerant of a plain array, an array nested under a wrapper key, or a
// flags-object (e.g. { "ManageNewsPaper": true, ... }) — some endpoints
// (like My-Permissions / Get-User-Permissions) return that shape instead
// of a list.
function extractArray(res) {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];

  const arrayCandidates = [
    res.permissions,
    res.Permissions,
    res.data,
    res.result,
    res.items,
    res.Permission,
    res.roles,
  ];
  for (const c of arrayCandidates) {
    if (Array.isArray(c)) return c;
  }

  const flagsObject = arrayCandidates.find((c) => c && typeof c === "object") || res;
  if (flagsObject && typeof flagsObject === "object") {
    return Object.entries(flagsObject)
      .filter(([, v]) => v === true || v === 1 || v === "1" || v === "true")
      .map(([k]) => k);
  }

  return [];
}

const ARABIC_RE = /[؀-ۿ]/;

/**
 * Pick the first candidate that contains Arabic script; fall back to the
 * first non-empty candidate (e.g. an English-only permission) if none do.
 */
export function preferArabicValue(candidates = []) {
  const strings = candidates
    .map((c) => (c == null ? "" : String(c).trim()))
    .filter(Boolean);
  return strings.find((s) => ARABIC_RE.test(s)) || strings[0] || "";
}

/**
 * Normalize an API response into a list of { key, name } objects.
 * Accepts arrays of strings or of objects with assorted field names.
 * `name` prefers whichever field actually holds the Arabic label — the
 * backend may return both an English code and an Arabic display name under
 * different keys, and the Arabic one is what's shown (and sent back on save).
 */
export function normalizePermissions(res) {
  const raw = extractArray(res);
  if (!Array.isArray(raw)) return [];

  return raw
    .map((p) => {
      if (typeof p === "string") {
        const v = p.trim();
        return v ? { key: v, name: v } : null;
      }
      if (p && typeof p === "object") {
        const name = preferArabicValue([
          p.name,
          p.permissionName,
          p.Name,
          p.PermissionName,
          p.nameAr,
          p.nameArabic,
          p.arabicName,
          p.displayNameAr,
          p.permissionNameAr,
          p.arName,
          p.titleAr,
          p.title,
          p.displayName,
          p.label,
        ]);
        const key =
          p.key ??
          p.permission ??
          p.Permission ??
          p.code ??
          p.value ??
          p.id ??
          p.Id ??
          name;
        const resolvedName = String(name || key || "").trim();
        const resolvedKey = String(key || name || "").trim();
        return resolvedKey ? { key: resolvedKey, name: resolvedName || resolvedKey } : null;
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Build a case-insensitive lookup set from a normalized permission list
 * (and any extra raw strings, e.g. a cached DecodedToken.Permission array).
 */
export function buildPermissionSet(normalizedList = [], extraRaw = []) {
  const set = new Set();
  for (const p of normalizedList) {
    if (p?.key) set.add(String(p.key).trim().toLowerCase());
    if (p?.name) set.add(String(p.name).trim().toLowerCase());
  }
  for (const r of Array.isArray(extraRaw) ? extraRaw : []) {
    if (r != null) set.add(String(r).trim().toLowerCase());
  }
  return set;
}

/** True if the set contains any of the given aliases (case-insensitive). */
export function hasAnyPermission(set, aliases = []) {
  return aliases.some((a) => set.has(String(a).trim().toLowerCase()));
}

/** Keep only permissions whose display name contains Arabic script. */
export function filterArabicPermissions(normalizedList = []) {
  return normalizedList.filter((p) => /[؀-ۿ]/.test(p?.name || ""));
}
