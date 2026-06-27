/** Parses k6-style duration strings like "30s", "2m", "500ms". Fallback 30s. */
export function parseDurationMs(spec) {
  const s = String(spec || "30s").trim();
  const m = s.match(/^(\d+(?:\.\d+)?)(ms|s|m|h)$/i);
  if (!m) return 30000;
  const n = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  if (u === "ms") return Math.round(n);
  if (u === "s") return Math.round(n * 1000);
  if (u === "m") return Math.round(n * 60 * 1000);
  if (u === "h") return Math.round(n * 3600 * 1000);
  return 30000;
}
