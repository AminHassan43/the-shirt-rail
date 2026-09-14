import { kits, initialIndex, frontSVG } from './kits.mjs';

const STIFF=.062, DAMP=.70, SW_STIFF=.15, SW_DAMP=.70, SW_GAIN=.4, SW_MAX=2.8;
const strip=document.querySelector('.rack-strip');
const buttons=[...strip.querySelectorAll('.kit')];
const slots=[...strip.querySelectorAll('.slot')];
const dialog=document.querySelector('dialog');
const closeButton=dialog.querySelector('.close');
const mobile=matchMedia('(max-width:679px)');
const hover=matchMedia('(hover:hover)');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let selectedIndex=initialIndex, liftedIndex=null, returnTarget=null;
let frame=0, previousTime=0, accumulator=0, observer=null, resizeFrame=0;
const states=buttons.map((button,i)=>({button,swingEl:button.querySelector('.swing'),hemEl:button.querySelector('.hem'),tagEl:button.querySelector('.tag'),x:0,v:0,swing:((i*7%17)-8)/5,sv:0,hem:0,hv:0,tag:0,tv:0,opacity:i===initialIndex?1:0,idle:((i*7%17)-8)/5}));
const targetFor=i=>i===selectedIndex?0:Math.sign(i-selectedIndex)*34*Math.exp(-Math.abs(i-selectedIndex)*.42);

function writeState(s){
  s.button.style.transform=`translate3d(${s.x.toFixed(3)}px,0,0)`;
  s.swingEl.style.transform=`rotate(${s.swing.toFixed(3)}deg)`;
  if(s.hemEl)s.hemEl.style.transform=`rotate(${(s.hem-s.swing*.42).toFixed(3)}deg)`;
  else {const photo=s.button.querySelector('.garment>img');if(photo)photo.style.transform=`skewY(${(s.hem-s.swing*.42).toFixed(3)}deg)`;}
  s.tagEl.style.transform=`rotate(${s.tag.toFixed(3)}deg)`;
  s.tagEl.style.opacity=s.opacity.toFixed(3);
}
function applyReduced(){
  states.forEach((s,i)=>{s.x=targetFor(i);s.v=s.sv=s.hv=s.tv=0;s.swing=s.idle;s.hem=s.swing*.42;s.tag=0;s.opacity=i===selectedIndex?1:0;writeState(s);});
}
function step(){
  let moving=false;
  states.forEach((s,i)=>{
    const oldVelocity=s.v;
    s.v=(s.v+(targetFor(i)-s.x)*STIFF)*DAMP;
    s.x+=s.v;
    const acceleration=s.v-oldVelocity;
    s.sv=(s.sv+(s.idle-s.swing)*SW_STIFF-acceleration*SW_GAIN)*SW_DAMP;
    s.swing+=s.sv;
    if(Math.abs(s.swing)>SW_MAX){s.swing=Math.sign(s.swing)*SW_MAX;s.sv*=.3;}
    s.hv=(s.hv+(s.swing*.5-s.hem)*.085)*.65;s.hem+=s.hv;
    s.tv=(s.tv+(s.swing*.45-s.tag)*.075)*.77;s.tag+=s.tv;
    s.opacity+=((i===selectedIndex?1:0)-s.opacity)*.16;
    if(Math.abs(s.v)+Math.abs(targetFor(i)-s.x)+Math.abs(s.sv)+Math.abs(s.swing-s.idle)+Math.abs(s.hv)+Math.abs(s.hem-s.swing*.5)+Math.abs(s.tv)+Math.abs(s.tag-s.swing*.45)+Math.abs((i===selectedIndex?1:0)-s.opacity)>.008)moving=true;
  });
  return moving;
}
function tick(time){
  if(reduced.matches){frame=0;return;}
  accumulator+=Math.min(time-(previousTime||time-16.667),50);previousTime=time;
  let moving=true;
  while(accumulator>=1000/60){moving=step();accumulator-=1000/60;}
  states.forEach(writeState);
  frame=moving?requestAnimationFrame(tick):0;
  if(!frame){previousTime=0;accumulator=0;}
}
function wake(){if(reduced.matches){applyReduced();return;}if(!frame){previousTime=0;frame=requestAnimationFrame(tick);}}
function select(index,{focus=false,center=false}={}){
  index=Math.max(0,Math.min(kits.length-1,index));
  selectedIndex=index;
  buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;button.style.zIndex=String(i===index?40:i+1);});
  const kit=kits[index];
  document.querySelector('#selected-club').textContent=kit.club;
  document.querySelector('#selected-season').textContent=kit.season;
  document.querySelector('.selection-number').innerHTML=`${String(index+1).padStart(2,'0')} <span>/ ${kits.length}</span>`;
  if(focus)buttons[index].focus({preventScroll:true});
  if(center&&mobile.matches)centerSlot(index);
  wake();
}
function centerSlot(index){const slot=slots[index];strip.scrollTo({left:slot.offsetLeft+slot.offsetWidth/2-strip.clientWidth/2,behavior:'instant'});}
function lift(index){
  if(dialog.open)return;
  select(index);
  liftedIndex=index;returnTarget=buttons[index];returnTarget.classList.add('is-lifted');
  const kit=kits[index];
  dialog.querySelector('.front-display').innerHTML=frontSVG(kit,index);
  dialog.querySelector('#dialog-club').textContent=kit.club;
  dialog.querySelector('#dialog-season').textContent=kit.season;
  dialog.querySelector('#dialog-note').textContent=kit.note;
  dialog.querySelector('.dialog-number').textContent=`Shirt ${String(index+1).padStart(2,'0')} of ${kits.length}`;
  const swatches=dialog.querySelector('.swatches');swatches.replaceChildren();
  [kit.a,kit.b].forEach(colour=>{const label=document.createElement('span');label.className='swatch';const chip=document.createElement('i');chip.style.backgroundColor=colour;chip.setAttribute('aria-hidden','true');label.append(chip,document.createTextNode(colour));swatches.append(label);});
  dialog.showModal();document.body.style.overflow='hidden';closeButton.focus();
}
function close(){if(dialog.open)dialog.close();}
closeButton.addEventListener('click',close);
let backdropDown=false;
dialog.addEventListener('pointerdown',event=>{backdropDown=event.target===dialog;});
dialog.addEventListener('click',event=>{if(event.target===dialog&&backdropDown)close();});
dialog.addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();closeButton.focus();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';if(liftedIndex!==null)buttons[liftedIndex].classList.remove('is-lifted');liftedIndex=null;returnTarget?.focus({preventScroll:true});});
buttons.forEach((button,index)=>{
  button.addEventListener('pointerenter',event=>{if(hover.matches&&!mobile.matches&&event.pointerType!=='touch'&&!dialog.open)select(index);});
  button.addEventListener('focus',()=>{if(!dialog.open&&selectedIndex!==index)select(index);});
  button.addEventListener('click',()=>lift(index));
});
strip.addEventListener('keydown',event=>{
  let next=selectedIndex;
  if(event.key==='ArrowRight')next++;
  else if(event.key==='ArrowLeft')next--;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=kits.length-1;
  else return;
  event.preventDefault();select(next,{focus:true,center:true});
});
function observeCenter(){
  observer?.disconnect();observer=null;
  if(!mobile.matches)return;
  centerSlot(selectedIndex);
  // Observe fixed slots, never the spring-translated buttons. The narrow central
  // band selects the closest shirt without any scroll listener or layout loop.
  const inset=Math.max(0,(strip.clientWidth-2)/2);
  observer=new IntersectionObserver(entries=>{
    if(dialog.open)return;
    const candidates=entries.filter(entry=>entry.isIntersecting);
    if(!candidates.length)return;
    const center=strip.getBoundingClientRect().left+strip.clientWidth/2;
    const nearest=candidates.sort((a,b)=>Math.abs(a.boundingClientRect.left+a.boundingClientRect.width/2-center)-Math.abs(b.boundingClientRect.left+b.boundingClientRect.width/2-center))[0];
    const index=Number(nearest.target.dataset.index);
    if(index!==selectedIndex)select(index);
  },{root:strip,rootMargin:`0px -${inset}px 0px -${inset}px`,threshold:0});
  slots.forEach(slot=>observer.observe(slot));
}
const resizeObserver=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(observeCenter);});
resizeObserver.observe(strip);
mobile.addEventListener('change',()=>{if(!mobile.matches)strip.scrollLeft=0;observeCenter();wake();});
reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;wake();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;previousTime=0;accumulator=0;}else wake();});
// Preserve the server-rendered still pose on load. Motion starts with input.
if(reduced.matches)applyReduced();
observeCenter();
