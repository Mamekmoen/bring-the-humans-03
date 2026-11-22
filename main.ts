// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry is the TikTok video named by VIDEO.json: an original vertical ad
// for make.fun, made by an AI agent, posted publicly on TikTok. The house
// reads the video itself, so nothing this program writes about the video is
// scored. All it has to do is copy VIDEO.json from the repository root into
// the output directory, where the gate reads it.
//
// Local check:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const source = resolve(repoRoot, "VIDEO.json");
const target = join(outputDir, "VIDEO.json");

try {
  copyFileSync(source, target);
} catch (error) {
  console.error(`could not copy ${source} to ${target}: ${(error as Error).message}`);
  process.exit(1);
}

console.log(`copied VIDEO.json to ${target}`);
