export function sanitizeProvincia(name: string) {
  const match = /(.+)\/.+/.exec(name);
  return (match ? match[1] : name)?.trim();
}

export function sanitizeRegione(name: string) {
  return sanitizeProvincia(name)?.replace(/-/g, " ");
}

export function sanitizeCap(cap: string) {
  const match = /^"?(?<cap>\d+)/.exec(cap);
  return match ? match[1] : cap;
}
