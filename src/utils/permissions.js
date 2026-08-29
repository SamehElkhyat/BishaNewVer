/**
 * Permission helpers — tolerant of the various shapes the backend may return
 * from /Register/My-Permissions and /Register/Get-All-Permissions.
 */

// Pull an array of permissions out of whatever wrapper the API used.
function extractArray(res) {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];
  return (
    res.permissions ||
    res.Permissions ||
    res.data ||
    res.result ||
    res.items ||
    res.Permission ||
    res.roles ||
    []
  );
}

/**
 * Normalize an API response into a list of { key, name } objects.
 * Accepts arrays of strings or of objects with assorted field names.
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
        const name =
          p.name ??
          p.permissionName ??
          p.Name ??
          p.PermissionName ??
          p.title ??
          p.displayName ??
          p.label ??
          "";
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
