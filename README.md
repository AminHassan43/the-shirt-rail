# The shirt rail

A Three.js rack containing the 32 kits in the supplied collection. Each garment is one continuous shell with integrated sleeves, gently varied proportions, a nearly straight hem, and folds that follow the hanger with a delayed, bounded fabric spring. The steel hooks touch the rail, and the rail fades at both ends.

Run node build.mjs after editing the collection. Run node server.mjs to preview at http://127.0.0.1:4173. The vendored Three.js modules are included; dependency installation is only necessary when updating Three.js.

## Using it as a Next.js hero

Run node export-next.mjs. It writes next-drop/, which mirrors a Next.js project root: copy its components/ and public/ folders into the site, run npm install three@0.186.0, and render <ShirtRailHero /> inside a section with the hero's height. next-drop/README-NEXT.md has the details. The wrapper source is in next/.

The rack is a mountable module: dist/markup.mjs returns the HTML, and mountShirtRail(root, {assetBase}) in dist/app.js wires it up and returns destroy(). All CSS is scoped under .shirt-rail; dist/page.css holds the standalone page's own layout. Modules import three by name, and the standalone page maps it to dist/vendor/ with an import map.

## Editing the collection

All 32 records are at the top of dist/kits.mjs, in their saved shuffled order. Edit club, season, player, number, colours, personal notes, and photo paths there. There are 32 entries because the supplied list numbered 1 through 32. PSG uses the confirmed 2024/25 fourth kit.

dist/kit-assets.mjs contains separate photo references and garment landmarks. The 32 front images and 18 back images are optimized local WebP files in dist/textures/, totaling about 2.8 MB. Every named player's shirt has a sourced back with the requested print. The remaining 14 backs use simplified matching fabric; their unseen graphics are not verified. References and interpretation notes are recorded in KIT-SOURCES.md.

These are photo-based approximations on a shared shirt shape, not scans of the actual garments. The source photographs contain their own lighting, folds and perspective. Collar shapes, seams, sleeve graphics and colour accuracy are limited by those references and the shared model. The Milan listing covers the 1998-2000 template. Portugal's black edition is interpreted as the black/gold Eusebio special. The Brazil Birds shirt is a concept design. Compare these references with the physical collection before treating them as definitive matches.

## Personal Polaroids

Clicking a jersey opens its personal Polaroid and details. Product reference photos are never substituted for photos of the owner. Put a wearing photo in dist/photos/, then change that record's photo: null to photo: './photos/filename.jpg'. Until supplied, it says "Photo to come".

Optional fields: photoCaption, photoAlt, photoPosition: '50% 35%', and photoFit: 'contain'. The default is a square crop. The paper starts slightly tilted and follows the pointer with bounded X/Y/Z rotation. Touch retains the still angle, while reduced motion disables the follow animation.

## Rendering and interaction

dist/shirt-model.js creates the welded garment and hangers. Front and back share positions and smooth normals, with independent materials and UV channels. dist/kit-textures.js maps garment landmarks onto the source photos, keeping backgrounds out of the sleeve outline and preserving a regular central back panel for names and numbers. dist/rack-3d.js applies the textures and fabric deformation to both visible cloth and shadows.

dist/app.js owns a single selection state and four spring channels. Animation sleeps after the fabric settles. Reduced motion skips the physics loop. Mobile uses a scroll-snap strip and IntersectionObserver. Keyboard arrows select, Enter opens, and Escape closes with focus restoration. The native dialog and focus trap keep focus inside while open.

The static HTML includes all 32 colour-and-pattern SVG fallbacks so the hero remains visible before JavaScript or if WebGL fails. The fallback deliberately simplifies the photographic detail. The rack and selection line have reserved dimensions, and texture loading does not resize them.

Three.js is pinned and vendored with its MIT license in dist/vendor/. No external fonts, tracking, CDN modules, or remote image requests are needed at runtime. This project has not been published.
