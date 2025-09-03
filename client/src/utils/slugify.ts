export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")           // spaces → hyphens
    .replace(/[^a-z0-9\-_.]/g, "")  // remove invalid chars
    .replace(/-+/g, "-")            // collapse multiple hyphens
    .replace(/^-|-$/g, "");         // trim leading/trailing hyphens
}
