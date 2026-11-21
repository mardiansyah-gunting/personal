// Serves the static export in out/ under /personal/, like GitHub Pages does.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../out/", import.meta.url).pathname;
const BASE = "/personal";
const PORT = Number(process.env.PORT ?? 4321);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".woff": "font/woff", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json",
  ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml",
};

async function fileFor(urlPath) {
  const rel = normalize(decodeURIComponent(urlPath.slice(BASE.length))).replace(/^(\.\.[/\\])+/, "");
  let p = join(ROOT, rel);
  try {
    if ((await stat(p)).isDirectory()) p = join(p, "index.html");
    await stat(p);
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  if (path === "/" || path === BASE) {
    res.writeHead(302, { Location: `${BASE}/` }).end();
    return;
  }
  const file = path.startsWith(`${BASE}/`) ? await fileFor(path) : null;
  if (!file) {
    const body = await readFile(join(ROOT, "404.html")).catch(() => "Not found");
    res.writeHead(404, { "Content-Type": TYPES[".html"] }).end(body);
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`serving out/ at http://localhost:${PORT}${BASE}/`));
