/** Prefixes a public-folder path with the site's base path (e.g. "/personal"). */
export function asset(path: string): string {
  if (!path.startsWith("/")) throw new Error("asset path must start with /");
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
