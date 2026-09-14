// Sample collection. Edit these nineteen records, then run `node build.mjs`.
export const kits = [
  { club: 'Arsenal', season: '1995/96 away', pattern: 'solid', a: '#15224A', b: '#2E63B8', note: 'A blue away shirt with a very different kind of Arsenal attitude.' },
  { club: 'AC Milan', season: '1993/94 home', pattern: 'vstripe', a: '#A91D28', b: '#17191B', note: 'Red and black, and memories of European nights.' },
  { club: 'Brazil', season: '1998 home', pattern: 'solid', a: '#F3CC32', b: '#24764D', len: 191, note: 'The yellow shirt that made summer feel like a World Cup.' },
  { club: 'Inter Milan', season: '1997/98 home', pattern: 'vstripe', a: '#2559A4', b: '#181C26', note: 'A reminder of Ronaldo in full flight.' },
  { club: 'Celtic', season: '1997/98 home', pattern: 'hstripe', a: '#EDEEE8', b: '#27865C', note: 'Hoops that need no introduction.' },
  { club: 'Fiorentina', season: '1998/99 home', pattern: 'solid', a: '#6850A3', b: '#E6DED3', len: 183, note: 'Purple, a proper collar, and a little bit of Florence.' },
  { club: 'Netherlands', season: '1988 home', pattern: 'band', a: '#E9792E', b: '#F3BA6D', note: 'An orange shirt for an unforgettable volley.' },
  { club: 'Boca Juniors', season: '1997/98 home', pattern: 'band', a: '#163C79', b: '#EBC736', note: 'The blue and gold belongs on any good rail.' },
  { club: 'Ajax', season: '1994/95 home', pattern: 'twotone', a: '#F0F0EC', b: '#B92B36', note: 'A beautifully simple shirt from a remarkable young team.' },
  { club: 'France', season: '1998 home', pattern: 'band', a: '#23488F', b: '#C54143', len: 194, note: 'The summer when everything came together in Paris.' },
  { club: 'Juventus', season: '1995/96 home', pattern: 'vstripe', a: '#E8E9E3', b: '#252629', note: 'Black and white, with a place in European history.' },
  { club: 'Barcelona', season: '1998/99 home', pattern: 'vstripe', a: '#932E47', b: '#24457A', note: 'A centenary-era colour pairing that always feels right.' },
  { club: 'Germany', season: '1990 home', pattern: 'band', a: '#ECECE6', b: '#292B29', note: 'A clean white shirt with a bold interruption.' },
  { club: 'Liverpool', season: '1989/90 home', pattern: 'solid', a: '#BB3435', b: '#EBEAE1', len: 188, note: 'A familiar red from the end of an extraordinary decade.' },
  { club: 'Argentina', season: '1994 home', pattern: 'vstripe', a: '#E6ECE9', b: '#71B4D4', note: 'Sky blue stripes that bring the whole rack to life.' },
  { club: 'Parma', season: '1998/99 home', pattern: 'hstripe', a: '#EAD45B', b: '#294D91', note: 'Yellow and blue, straight out of a favourite Serie A era.' },
  { club: 'Portugal', season: '2000 home', pattern: 'solid', a: '#83303E', b: '#315C45', note: 'Deep red and green, quietly different from the rest.' },
  { club: 'Marseille', season: '1992/93 home', pattern: 'band', a: '#E9EDE9', b: '#54A5C8', note: 'A little Mediterranean blue on an otherwise white shirt.' },
  { club: 'Mexico', season: '1998 home', pattern: 'twotone', a: '#286C51', b: '#225540', len: 190, note: 'Rich green with a place among the more expressive shirts.' },
];

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
  <path d="M43 52 Q55 58 65 54 L63 61 Q52 62 43 58 Z" fill="${k.b}"/><path d="M46 67 Q49 104 45 123 M64 81 Q61 104 65 127" stroke="#000" stroke-opacity=".1" fill="none" stroke-width=".6"/></svg></span><svg viewBox="0 0 100 250" aria-hidden="true" focusable="false">
  <g class="tag" style="opacity:${i===initialIndex?1:0}"><path d="M66 61 Q88 77 79 104" fill="none" stroke="#646965" stroke-width=".6"/><path d="M75 100 L87 100 L91 106 L91 143 L71 143 L71 106 Z" fill="#fff" stroke="#CECECA" stroke-width=".6"/><circle cx="81" cy="105" r="1.5" fill="#bbb"/><text transform="translate(79 113) rotate(90)" font-size="6.3" font-weight="500" fill="#202321">${escapeHTML(k.club)}</text></g></svg></span>`;
}
export function frontSVG(k, i) {
  const id=`front-${i}`;
  const d='M104 33 L76 41 L30 83 L60 122 L86 103 L81 241 Q135 251 189 241 L184 103 L210 122 L240 83 L194 41 L166 33 Q135 53 104 33 Z';
  return `<svg viewBox="0 0 270 280" aria-label="Front of ${escapeHTML(k.club)} ${escapeHTML(k.season)}" role="img">${patternDefs(k,id,true)}<defs><clipPath id="${id}-clip"><path d="${d}"/></clipPath></defs><g class="front-garment"><g clip-path="url(#${id}-clip)"><path d="${d}" fill="url(#${id})"/>${specialPattern(k,true)}<path d="${d}" fill="url(#${id}-shade)"/><path d="M28 83 L61 122 M210 122 L241 82" stroke="${k.b}" stroke-width="12"/><path d="M87 100 Q99 135 91 222 M184 100 Q170 141 181 225 M114 76 Q121 145 111 231 M157 83 Q148 158 160 231" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/><path d="M84 235 Q135 244 186 235" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1"/></g><path d="M103 33 Q135 51 167 33 L160 49 Q135 67 110 49 Z" fill="${k.b}"/><path d="M111 36 Q135 48 159 36 Q153 50 135 51 Q118 49 111 36" fill="#202321" opacity=".35"/><path d="M77 45 L91 67 M193 45 L179 67" stroke="#fff" stroke-opacity=".2" fill="none"/></g></svg>`;
}
