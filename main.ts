// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry is the TikTok video named by VIDEO.json: an original vertical ad
// for make.fun, made by an AI agent, posted publicly on TikTok. The house
// reads the video itself, so nothing this program writes about the video is
// scored. All it has to do is copy VIDEO.json from the repository root into
// the output directory, where the gate reads it.
//
// Before copying, it validates VIDEO.json so a broken entry fails loudly
// instead of submitting a dead link: the file must exist and parse, and its
// `url` must be a full TikTok video address
// (https://www.tiktok.com/@<handle>/video/<digits>) — short links
// (vt.tiktok.com) and placeholder/zero video ids are rejected.
//
// Local check:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const source = resolve(repoRoot, "VIDEO.json");
const target = join(outputDir, "VIDEO.json");

if (!existsSync(source)) {
  fail(`VIDEO.json not found at ${source}`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, "utf8"));
} catch (error) {
  fail(`VIDEO.json is not valid JSON: ${(error as Error).message}`);
}

const url =
  typeof parsed === "object" && parsed !== null
    ? (parsed as Record<string, unknown>).url
    : undefined;

if (typeof url !== "string" || url.length === 0) {
  fail(`VIDEO.json must contain a non-empty "url" string`);
}

const match = /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9._]+)\/video\/(\d+)$/.exec(url);
if (!match) {
  fail(
    `VIDEO.json "url" must be a full TikTok video address ` +
      `(https://www.tiktok.com/@<handle>/video/<digits>), got: ${url}. ` +
      `Short links (vt.tiktok.com) are not accepted.`
  );
}

const videoId = match[2];
if (/^0+$/.test(videoId)) {
  fail(`VIDEO.json "url" has a placeholder video id: ${url}`);
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(source, target);
} catch (error) {
  fail(`could not copy ${source} to ${target}: ${(error as Error).message}`);
}

console.log(`copied VIDEO.json to ${target}`);
