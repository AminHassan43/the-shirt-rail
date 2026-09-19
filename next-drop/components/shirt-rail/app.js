import { kits, initialIndex } from './kits.mjs';
import { Polaroid } from './polaroid.js';

// Mounts the rack inside `root` (an element holding shirtRailMarkup()).
// Every lookup and class stays inside root, so it can live in any page.
// Returns destroy(), which removes all listeners, frames and the WebGL scene.
export function mountShirtRail(root, {assetBase=import.meta.url}={}){
  const STIFF=.062, DAMP=.70, SW_STIFF=.15, SW_DAMP=.70, SW_GAIN=.4, SW_MAX=2.8;
  const strip=root.querySelector('.rack-strip');
  const buttons=[...strip.querySelectorAll('.kit')];
  const slots=[...strip.querySelectorAll('.slot')];
  const dialog=root.querySelector('dialog');
  const closeButton=dialog.querySelector('.close');
  const polaroid=new Polaroid(dialog);
  const mobile=matchMedia('(max-width:679px)');
  const hover=matchMedia('(hover:hover)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let selectedIndex=initialIndex, liftedIndex=null, returnTarget=null;
  let rack3d=null, destroyed=false;
  let frame=0, previousTime=0, accumulator=0, observer=null, resizeFrame=0;
  const cleanups=[];
  const listen=(target,type,fn)=>{target.addEventListener(type,fn);cleanups.push(()=>target.removeEventListener(type,fn));};
  const states=buttons.map((button,i)=>({button,swingEl:button.querySelector('.swing'),hemEl:button.querySelector('.hem'),x:0,v:0,swing:((i*7%17)-8)/5,sv:0,hem:0,hv:0,idle:((i*7%17)-8)/5}));
  const targetFor=i=>i===selectedIndex?0:Math.sign(i-selectedIndex)*34*Math.exp(-Math.abs(i-selectedIndex)*.42);

  function writeState(s){
    s.button.style.transform=`translate3d(${s.x.toFixed(3)}px,0,0)`;
    s.swingEl.style.transform=`rotate(${s.swing.toFixed(3)}deg)`;
    if(s.hemEl)s.hemEl.style.transform=`rotate(${(s.hem-s.swing*.42).toFixed(3)}deg)`;
    else {const photo=s.button.querySelector('.garment>img');if(photo)photo.style.transform=`skewY(${(s.hem-s.swing*.42).toFixed(3)}deg)`;}
  }
  function applyReduced(){
    states.forEach((s,i)=>{s.x=targetFor(i);s.v=s.sv=s.hv=0;s.swing=s.idle;s.hem=s.swing*.42;writeState(s);});
    rack3d?.update(states);
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
      // Slower fabric inertia: shoulders stay supported while the lower shell
      // follows the movement, passes through once, and gently comes to rest.
      s.hv=(s.hv+(s.swing*.5-s.hem)*.028-acceleration*.055)*.90;s.hem+=s.hv;
      if(Math.abs(s.hem)>3.2){s.hem=Math.sign(s.hem)*3.2;s.hv*=.3;}
      if(Math.abs(s.v)+Math.abs(targetFor(i)-s.x)+Math.abs(s.sv)+Math.abs(s.swing-s.idle)+Math.abs(s.hv)+Math.abs(s.hem-s.swing*.5)>.008)moving=true;
    });
    return moving;
  }
  function tick(time){
    if(reduced.matches){frame=0;return;}
    accumulator+=Math.min(time-(previousTime||time-16.667),50);previousTime=time;
    let moving=true;
    while(accumulator>=1000/60){moving=step();accumulator-=1000/60;}
    states.forEach(writeState);
    rack3d?.update(states);
    frame=moving?requestAnimationFrame(tick):0;
    if(!frame){previousTime=0;accumulator=0;}
  }
  function wake(){if(destroyed)return;if(reduced.matches){applyReduced();return;}if(!frame){previousTime=0;frame=requestAnimationFrame(tick);}}
  function select(index,{focus=false,center=false}={}){
    index=Math.max(0,Math.min(kits.length-1,index));
    selectedIndex=index;
    buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;button.style.zIndex=String(i===index?kits.length+1:i+1);});
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
    polaroid.show(kit,index);
    dialog.querySelector('.dialog-club').textContent=kit.club;
    dialog.querySelector('.dialog-season').textContent=kit.season+(kit.player?` — ${kit.player} #${kit.number}`:'');
    dialog.querySelector('.dialog-note').textContent=kit.note;
    dialog.querySelector('.dialog-number').textContent=`Shirt ${String(index+1).padStart(2,'0')} of ${kits.length}`;
    dialog.showModal();document.body.style.overflow='hidden';closeButton.focus();
    rack3d?.lifted(index,true);
  }
  function close(){if(dialog.open)dialog.close();}
  listen(closeButton,'click',close);
  let backdropDown=false;
  listen(dialog,'pointerdown',event=>{backdropDown=event.target===dialog;});
  listen(dialog,'click',event=>{if(event.target===dialog&&backdropDown)close();});
  // Escape is handled here too: some embedded browsers skip the native cancel.
  listen(dialog,'keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();return;}if(event.key==='Tab'){const list=[...dialog.querySelectorAll('button:not([disabled])')];const first=list[0],last=list.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
  listen(dialog,'close',()=>{document.body.style.overflow='';if(liftedIndex!==null){buttons[liftedIndex].classList.remove('is-lifted');rack3d?.lifted(liftedIndex,false);}polaroid.close();liftedIndex=null;if(!destroyed)returnTarget?.focus({preventScroll:true});});
  buttons.forEach((button,index)=>{
    // Moving garments can enter a stationary pointer. Only actual pointer motion
    // changes hover selection, so it cannot steal selection from the keyboard.
    listen(button,'pointermove',event=>{if((event.movementX||event.movementY)&&hover.matches&&!mobile.matches&&event.pointerType!=='touch'&&!dialog.open&&selectedIndex!==index)select(index);});
    listen(button,'focus',()=>{if(!dialog.open&&selectedIndex!==index)select(index);});
    listen(button,'click',()=>lift(index));
  });
  listen(strip,'keydown',event=>{
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
  const resizeObserver=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{observeCenter();rack3d?.resize();rack3d?.update(states);});});
  resizeObserver.observe(strip);
  listen(mobile,'change',()=>{if(!mobile.matches)strip.scrollLeft=0;observeCenter();wake();});
  listen(reduced,'change',()=>{cancelAnimationFrame(frame);frame=0;wake();});
  listen(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;previousTime=0;accumulator=0;}else wake();});
  // Preserve the server-rendered still pose on load. Motion starts with input.
  if(reduced.matches)applyReduced();
  observeCenter();
  import('./rack-3d.js').then(({ShirtRack3D})=>{
    if(destroyed)return;
    rack3d=new ShirtRack3D(root.querySelector('.rack-track'),slots,assetBase);
    rack3d.update(states);root.classList.add('webgl-ready');
    if(dialog.open&&liftedIndex!==null)rack3d.lifted(liftedIndex,true);
  }).catch(error=>{console.warn('3D unavailable; showing static shirts.',error);root.classList.add('webgl-unavailable');});

  return function destroy(){
    if(destroyed)return;
    destroyed=true;
    close();
    cancelAnimationFrame(frame);cancelAnimationFrame(resizeFrame);frame=0;
    observer?.disconnect();resizeObserver.disconnect();
    cleanups.forEach(fn=>fn());
    polaroid.destroy();
    document.body.style.overflow='';
    rack3d?.dispose();rack3d=null;
    root.classList.remove('webgl-ready','webgl-unavailable');
  };
}
