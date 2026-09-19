// Builds next-drop/, a folder that mirrors a Next.js project root:
//   components/shirt-rail/  rack code, CSS and the <ShirtRailHero /> wrapper
//   public/shirt-rail/      shirt photos served at /shirt-rail/textures/...
import { cp, copyFile, mkdir, rm } from 'node:fs/promises';

const here = new URL('./', import.meta.url);
const out = new URL('./next-drop/', here);
const components = new URL('components/shirt-rail/', out);
const pub = new URL('public/shirt-rail/', out);

await rm(out, { recursive: true, force: true });
await mkdir(components, { recursive: true });
await mkdir(pub, { recursive: true });

for (const file of ['app.js', 'rack-3d.js', 'shirt-model.js', 'kit-textures.js', 'polaroid.js', 'kits.mjs', 'kit-assets.mjs', 'markup.mjs'])
  await copyFile(new URL(`dist/${file}`, here), new URL(file, components));
await copyFile(new URL('dist/style.css', here), new URL('shirt-rail.css', components));
for (const file of ['ShirtRailHero.tsx', 'app.d.ts', 'markup.d.mts'])
  await copyFile(new URL(`next/${file}`, here), new URL(file, components));
await copyFile(new URL('next/README-NEXT.md', here), new URL('README-NEXT.md', out));
await cp(new URL('dist/textures/', here), new URL('textures/', pub), { recursive: true });

console.log('Exported next-drop/: copy its components/ and public/ folders into the Next.js project.');
