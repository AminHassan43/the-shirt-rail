# The shirt rail

A dependency-free, static-rendered interactive rack. The nineteen example records live at the top of `dist/kits.mjs`. These are illustrative colourways and sample notes, ready to replace with the real collection.

Run `node build.mjs` after editing the collection. This regenerates the full HTML so the shirts remain visible without JavaScript. Run `node server.mjs` to preview at http://127.0.0.1:4173.

`dist/app.js` owns one selection state and four spring channels per shirt. The animation loop writes only transforms and tag opacity; it sleeps after the springs settle. Mobile selection uses IntersectionObserver against stationary snap slots. A native modal dialog handles Escape and makes the rest of the page inert; the explicit focus trap follows the dialog's current single-button content.

To replace the SVG with photography, retain the button and HTML `.swing` wrapper, and replace the SVG inside `.garment` with an `<img>`. The hanger and tag remain separate. When no SVG `.hem` exists, the motion code automatically uses a small skewY on the image for bitmap drape. The front renderer uses the same kit data.

No external fonts, dependencies, tracking, or image downloads. The two renderers deliberately simplify the original shirts: colours and patterns are editable rather than historically verified reproductions.
