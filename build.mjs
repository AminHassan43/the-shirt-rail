import { writeFile } from 'node:fs/promises';
import { kits } from './dist/kits.mjs';
import { shirtRailMarkup } from './dist/markup.mjs';
await writeFile(new URL('./dist/index.html',import.meta.url), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>The shirt rail — A personal collection</title><meta name="description" content="${kits.length} football shirts. A little history, hung up at home. Explore an interactive football jersey rack."><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./style.css"><link rel="stylesheet" href="./page.css">
<script type="importmap">{"imports":{"three":"./vendor/three.module.js"}}</script></head>
<body><main>${shirtRailMarkup()}</main>
<script type="module">import {mountShirtRail} from './app.js';mountShirtRail(document.querySelector('.shirt-rail'));</script></body></html>`);
console.log(`Built ${kits.length} static shirts and the interactive rack.`);
