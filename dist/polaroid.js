// The photo frame is a DOM element; only its transform changes during motion.
export class Polaroid {
  constructor(dialog){
    this.dialog=dialog;this.stage=dialog.querySelector('.photo-stage');this.paper=dialog.querySelector('.polaroid');this.window=dialog.querySelector('.photo-window');
    this.reduced=matchMedia('(prefers-reduced-motion:reduce)');this.hover=matchMedia('(hover:hover)');
    this.frame=0;this.lastTime=0;this.current={x:0,y:0,z:-4};this.target={...this.current};
    this.bounds=null;this.generation=0;
    this.move=e=>{if(!dialog.open||!this.hover.matches||this.reduced.matches||e.pointerType==='touch')return;this.bounds??=this.stage.getBoundingClientRect();const b=this.bounds;const x=Math.max(-1,Math.min(1,(e.clientX-b.left-b.width/2)/(b.width/2)));const y=Math.max(-1,Math.min(1,(e.clientY-b.top-b.height/2)/(b.height/2)));this.target={x:-y*4,y:x*6,z:-4+x*2.4+y*.6};this.wake();};
    this.reset=()=>{this.target={x:0,y:0,z:-4};this.wake();};
    this.preference=()=>{this.stop();this.current={x:0,y:0,z:-4};this.target={...this.current};this.write();};
    dialog.addEventListener('pointermove',this.move);dialog.addEventListener('pointerleave',this.reset);
    this.clearBounds=()=>this.bounds=null;
    dialog.addEventListener('scroll',this.clearBounds);
    this.reduced.addEventListener('change',this.preference);this.hover.addEventListener('change',this.preference);
    this.resizeObserver=new ResizeObserver(()=>this.bounds=null);this.resizeObserver.observe(this.stage);
    this.write();
  }
  show(kit,index){
    this.generation++;const generation=this.generation;
    this.preference();this.bounds=null;
    this.dialog.querySelector('.polaroid-caption').textContent=kit.photoCaption||kit.club;
    this.dialog.querySelector('.polaroid-number').textContent=String(index+1).padStart(2,'0');
    this.window.classList.remove('has-photo');
    const placeholder=document.createElement('span');placeholder.className='photo-placeholder';placeholder.textContent='Photo to come';
    this.window.replaceChildren(placeholder);
    if(!kit.photo)return;
    let source;
    try{source=new URL(kit.photo,location.href);if(!['http:','https:'].includes(source.protocol))throw new Error('Unsupported photo URL');}
    catch{placeholder.textContent='Photo unavailable';return;}
    const img=new Image();img.className='jersey-photo';img.width=1000;img.height=1000;img.decoding='async';
    img.alt=kit.photoAlt||`The collection owner wearing the ${kit.club} ${kit.season} jersey.`;
    img.style.objectPosition=kit.photoPosition||'50% 35%';img.style.objectFit=kit.photoFit==='contain'?'contain':'cover';
    img.onload=()=>{if(generation!==this.generation)return;this.window.classList.add('has-photo');placeholder.hidden=true;};
    img.onerror=()=>{if(generation!==this.generation)return;img.remove();placeholder.hidden=false;placeholder.textContent='Photo unavailable';};
    this.window.append(img);img.src=source.href;
  }
  write(){const {x,y,z}=this.current;this.paper.style.transform=`rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg) rotateZ(${z.toFixed(3)}deg)`;}
  wake(){if(!this.dialog.open||this.reduced.matches||!this.hover.matches)return;if(!this.frame){this.lastTime=0;this.frame=requestAnimationFrame(t=>this.tick(t));}}
  tick(time){
    const dt=Math.min(40,time-(this.lastTime||time-16.67));this.lastTime=time;const ease=1-Math.exp(-dt/85);
    let distance=0;for(const axis of ['x','y','z']){this.current[axis]+=(this.target[axis]-this.current[axis])*ease;distance+=Math.abs(this.target[axis]-this.current[axis]);}
    this.write();if(distance>.003)this.frame=requestAnimationFrame(t=>this.tick(t));else{this.frame=0;this.current={...this.target};this.write();}
  }
  stop(){cancelAnimationFrame(this.frame);this.frame=0;this.lastTime=0;}
  close(){this.stop();this.bounds=null;}
  destroy(){
    this.close();this.resizeObserver.disconnect();
    this.dialog.removeEventListener('pointermove',this.move);this.dialog.removeEventListener('pointerleave',this.reset);this.dialog.removeEventListener('scroll',this.clearBounds);
    this.reduced.removeEventListener('change',this.preference);this.hover.removeEventListener('change',this.preference);
  }
}
