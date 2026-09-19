// Your collection, in its saved shuffled order. Edit colours, notes and photos here.
// Stable asset IDs keep each kit with its textures when the order changes.
import {kitAssets} from './kit-assets.mjs';
export const kits = [
  {"club":"Paris Saint-Germain","season":"2024/25 fourth","player":null,"number":null,"pattern":"solid","a":"#263963","b":"#e6e7df","photo":null,"note":"Deep blue with white wing-like shoulder graphics.","asset":"14"},
  {"club":"Sporting CP","season":"2002/03 home","player":"C. Ronaldo","number":28,"pattern":"hstripe","a":"#ebede7","b":"#1d4436","photo":null,"note":"Green and white hoops with the PT sponsor.","asset":"07"},
  {"club":"Inter Miami","season":"2024 away","player":null,"number":null,"pattern":"solid","a":"#202023","b":"#de9fb4","photo":null,"note":"Black with pink trim and the Royal Caribbean sponsor.","asset":"17"},
  {"club":"Japan","season":"1998 away","player":null,"number":null,"pattern":"solid","a":"#eeefeb","b":"#233e72","photo":null,"note":"The white Asics away shirt with blue collar and cuffs.","asset":"26"},
  {"club":"Santos FC","season":"2012 home","player":"Neymar Jr","number":11,"pattern":"solid","a":"#edece8","b":"#ed7928","photo":null,"note":"White with the orange BMG sponsor.","asset":"20"},
  {"club":"Guatemala","season":"2025 away","player":null,"number":null,"pattern":"band","a":"#152a3b","b":"#edf0ec","photo":null,"note":"Dark blue with a white diagonal sash.","asset":"15"},
  {"club":"Germany","season":"1994 home","player":null,"number":null,"pattern":"band","a":"#eeede8","b":"#202020","photo":null,"note":"The black, red and gold diamond-patterned shoulders.","asset":"25"},
  {"club":"Argentina","season":"2022 away","player":"Messi","number":10,"pattern":"solid","a":"#3b286c","b":"#a59dc7","photo":null,"note":"Purple with a flame pattern rising from the hem.","asset":"16"},
  {"club":"Côte d’Ivoire","season":"2026 away","player":null,"number":null,"pattern":"solid","a":"#eeeee6","b":"#dcb390","photo":null,"note":"White with a pale green and orange graphic.","asset":"28"},
  {"club":"Spain","season":"2026 away","player":null,"number":null,"pattern":"solid","a":"#eae8db","b":"#753337","photo":null,"note":"Off-white with maroon and gold trim.","asset":"22"},
  {"club":"AC Milan","season":"1998/99 home","player":"Shevchenko","number":7,"pattern":"vstripe","a":"#b41928","b":"#151519","photo":null,"note":"Red and black stripes with the Opel sponsor.","asset":"01"},
  {"club":"Chelsea FC","season":"2003/04 away","player":null,"number":null,"pattern":"vstripe","a":"#e7e6df","b":"#1d4480","photo":null,"note":"White with blue central stripes and Fly Emirates.","asset":"23"},
  {"club":"Venezia FC","season":"2024/25 away","player":null,"number":null,"pattern":"solid","a":"#e9ebe6","b":"#1b5848","photo":null,"note":"White with green and orange panels, made by Nocta.","asset":"27"},
  {"club":"Spain","season":"2024 home","player":"Lamine Yamal","number":19,"pattern":"solid","a":"#cf1726","b":"#edcf32","photo":null,"note":"Red with golden yellow detailing.","asset":"03"},
  {"club":"Brazil","season":"Birds yellow concept","player":null,"number":null,"pattern":"solid","a":"#e0c735","b":"#27633d","photo":null,"note":"A concept design with green birds across the yellow fabric.","asset":"05"},
  {"club":"Saudi Arabia","season":"2024 home","player":null,"number":null,"pattern":"solid","a":"#269477","b":"#dce0bd","photo":null,"note":"A green geometric print with pale gold details.","asset":"06"},
  {"club":"Juventus","season":"1997/98 home","player":"Del Piero","number":10,"pattern":"vstripe","a":"#e5e5df","b":"#18191b","photo":null,"note":"Black and white with the Sony MiniDisc sponsor.","asset":"31"},
  {"club":"Ajax","season":"2025/26 third","player":null,"number":null,"pattern":"solid","a":"#e7dfcf","b":"#586d84","photo":null,"note":"Off-white with a blue crest and maroon shoulder stripes.","asset":"30"},
  {"club":"France","season":"2006 away","player":null,"number":null,"pattern":"band","a":"#eeeeea","b":"#284476","photo":null,"note":"White with a blue and red chest band.","asset":"24"},
  {"club":"Brazil","season":"1998 away","player":"Ronaldo","number":9,"pattern":"solid","a":"#174396","b":"#eeeeea","photo":null,"note":"Royal blue with white shoulder piping.","asset":"08"},
  {"club":"Al Hilal SFC","season":"2024/25 home","player":null,"number":null,"pattern":"solid","a":"#125daa","b":"#ebeeee","photo":null,"note":"A blue geometric design with white detailing.","asset":"10"},
  {"club":"FC Barcelona","season":"2025/26 pre-match away","player":null,"number":null,"pattern":"solid","a":"#151719","b":"#53439d","photo":null,"note":"The black Kobe collaboration pre-match shirt.","asset":"19"},
  {"club":"AS Roma","season":"2024/25 home","player":null,"number":null,"pattern":"solid","a":"#7d2034","b":"#c5aa69","photo":null,"note":"Deep red with fine gold pinstripes and the Riyadh Season sponsor.","asset":"02"},
  {"club":"FC Barcelona","season":"2003/04 away","player":"Ronaldinho","number":10,"pattern":"hstripe","a":"#8e8c77","b":"#686c61","photo":null,"note":"A grey-toned shirt with fine horizontal stripes.","asset":"29"},
  {"club":"Manchester City","season":"2015/16 home","player":"Kun Agüero","number":10,"pattern":"solid","a":"#65b8e7","b":"#eeefeb","photo":null,"note":"Sky blue with a white collar and dark blue print.","asset":"32"},
  {"club":"Boca Juniors","season":"2025 home","player":null,"number":null,"pattern":"band","a":"#142747","b":"#e4b831","photo":null,"note":"Navy and gold with the anniversary crest.","asset":"11"},
  {"club":"Ghana","season":"2024/25 away","player":null,"number":null,"pattern":"solid","a":"#e9bd35","b":"#141719","photo":null,"note":"The Black Star on a golden yellow shirt.","asset":"04"},
  {"club":"FC Barcelona","season":"2024/25 away, Cactus Jack edition","player":"Lamine Yamal","number":19,"pattern":"solid","a":"#141517","b":"#b42740","photo":null,"note":"The Cactus Jack special edition, with red and blue side panels.","asset":"18"},
  {"club":"Manchester United","season":"2008/09 third","player":"Ronaldo","number":7,"pattern":"solid","a":"#18379b","b":"#efefed","photo":null,"note":"Blue with the white AIG sponsor and anniversary crest.","asset":"12"},
  {"club":"Japan","season":"2026 home","player":null,"number":null,"pattern":"solid","a":"#102e6a","b":"#e4e9ec","photo":null,"note":"Blue with a radiating pattern and central crest.","asset":"09"},
  {"club":"FC Barcelona","season":"1999/00 home","player":null,"number":null,"pattern":"twotone","a":"#a91b35","b":"#162654","photo":null,"note":"The centenary shirt, split into red and blue halves.","asset":"13"},
  {"club":"Portugal","season":"2025 special black edition","player":null,"number":null,"pattern":"solid","a":"#19191a","b":"#b69c65","photo":null,"note":"Black and gold, with an all-over crest pattern.","asset":"21"}
];
for(const kit of kits)Object.assign(kit,kitAssets[kit.asset]);

export const initialIndex = 8;
export const hemLength = (kit, i) => kit.len ?? 178 + (i * 13 % 25);
export const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function patternDefs(kit, id, front = false) {
  const w = front ? 18 : 9;
  let mark = '';
  if (kit.pattern === 'vstripe') mark = `<rect width="${w / 2}" height="260" fill="${kit.b}"/>`;
  if (kit.pattern === 'hstripe') mark = `<rect width="300" height="${w}" fill="${kit.b}"/>`;
  const ph = kit.pattern === 'hstripe' ? w * 2 : 260;
  const pw = kit.pattern === 'vstripe' ? w : 300;
  return `<defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="${pw}" height="${ph}"><rect width="300" height="260" fill="${kit.a}"/>${mark}</pattern><linearGradient id="${id}-shade"><stop stop-color="#000" stop-opacity=".28"/><stop offset=".26" stop-color="#000" stop-opacity=".02"/><stop offset=".58" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient></defs>`;
}
function specialPattern(k, front) {
  if (k.pattern === 'band') return `<rect x="0" y="${front ? 104 : 91}" width="300" height="${front ? 35 : 25}" fill="${k.b}"/>`;
  if (k.pattern === 'twotone') return `<rect x="${front ? 104 : 53}" y="0" width="${front ? 62 : 13}" height="280" fill="${k.b}"/>`;
  return '';
}
export function rackSVG(k, i) {
  const id = `rack-${i}`, h = hemLength(k, i);
  const body = `M43 51 Q57 47 68 57 L73 ${h-9} Q62 ${h+3} 41 ${h-2} L40 85 Z`;
  const sleeve = 'M43 52 Q31 52 22 66 L9 92 L27 104 L44 80 Z';
  return `<span class="swing" style="transform:rotate(${((i*7%17)-8)/5}deg)"><svg viewBox="0 0 100 250" aria-hidden="true" focusable="false">
  <g fill="none" stroke="#969C9E" stroke-width="1.35" stroke-linejoin="round"><path d="M50 34 L50 26 C34 25 36 6 48 5 C59 4 64 14 58 20"/><path d="M50 33 L21 57 Q19 61 25 61 L75 61 Q80 61 75 57 Z"/><path d="M29 55 L69 55"/></g>
  </svg><span class="garment"><svg viewBox="0 0 100 250" aria-hidden="true" focusable="false">${patternDefs(k,id)}<defs><clipPath id="${id}-body"><path d="${body}"/></clipPath><clipPath id="${id}-top"><rect width="100" height="132"/></clipPath><clipPath id="${id}-bottom"><rect y="130" width="100" height="100"/></clipPath></defs><path d="${sleeve}" transform="translate(4 3)" fill="url(#${id})"/><path d="${sleeve}" transform="translate(4 3)" fill="#000" opacity=".3"/>
  <path d="${sleeve}" fill="url(#${id})"/><path d="M10 91 L28 102" stroke="${k.b}" stroke-width="4"/>
  <g clip-path="url(#${id}-top)"><g clip-path="url(#${id}-body)"><path d="${body}" fill="url(#${id})"/>${specialPattern(k,false)}<path d="${body}" fill="url(#${id}-shade)"/></g></g>
  <g class="hem"><g clip-path="url(#${id}-bottom)"><g clip-path="url(#${id}-body)"><path d="${body}" fill="url(#${id})"/>${specialPattern(k,false)}<path d="${body}" fill="url(#${id}-shade)"/><path d="M44 ${h-6} Q60 ${h-2} 70 ${h-11}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".7"/></g></g></g>
  <path d="M43 52 Q55 58 65 54 L63 61 Q52 62 43 58 Z" fill="${k.b}"/><path d="M46 67 Q49 104 45 123 M64 81 Q61 104 65 127" stroke="#000" stroke-opacity=".1" fill="none" stroke-width=".6"/></svg></span></span>`;
}
export function frontSVG(k, i) {
  const id=`front-${i}`;
  const d='M104 33 L76 41 L30 83 L60 122 L86 103 L81 241 Q135 251 189 241 L184 103 L210 122 L240 83 L194 41 L166 33 Q135 53 104 33 Z';
  return `<svg viewBox="0 0 270 280" aria-label="Front of ${escapeHTML(k.club)} ${escapeHTML(k.season)}" role="img">${patternDefs(k,id,true)}<defs><clipPath id="${id}-clip"><path d="${d}"/></clipPath></defs><g class="front-garment"><g clip-path="url(#${id}-clip)"><path d="${d}" fill="url(#${id})"/>${specialPattern(k,true)}<path d="${d}" fill="url(#${id}-shade)"/><path d="M28 83 L61 122 M210 122 L241 82" stroke="${k.b}" stroke-width="12"/><path d="M87 100 Q99 135 91 222 M184 100 Q170 141 181 225 M114 76 Q121 145 111 231 M157 83 Q148 158 160 231" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/><path d="M84 235 Q135 244 186 235" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1"/></g><path d="M103 33 Q135 51 167 33 L160 49 Q135 67 110 49 Z" fill="${k.b}"/><path d="M111 36 Q135 48 159 36 Q153 50 135 51 Q118 49 111 36" fill="#202321" opacity=".35"/><path d="M77 45 L91 67 M193 45 L179 67" stroke="#fff" stroke-opacity=".2" fill="none"/></g></svg>`;
}
