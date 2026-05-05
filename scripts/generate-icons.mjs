import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const root = resolve(process.cwd());
const svgPath = resolve(root, "public/icon.svg");
const svg = readFileSync(svgPath);

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  const out = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(resolve(root, "public", name), out);
  console.log(`generated ${name} (${size}x${size})`);
}
