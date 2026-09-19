import * as THREE from 'three';

// A garment-shaped UV fit keeps the photo background off the sleeves and hem.
// Each photo has its own landmarks; the underlying sewn mesh stays continuous.
const outline=[[-.28,1.2],[-.75,1.01],[-1.12,.42],[-.90,.18],[-.70,.40],[-.77,-1.15],[.79,-1.15],[.72,.40],[.94,.15],[1.16,.40],[.73,1.03],[.28,1.2],[0,1.0]];
const triangles=THREE.ShapeUtils.triangulateShape(outline.map(p=>new THREE.Vector2(...p)),[]);
export function photoUV(x,y,landmarks,back=false){
 if(!landmarks)return [(x+1.2)/2.4,(y+1.3)/2.6];
 if(back)x=-x;
 let best,penalty=Infinity;
 for(const tri of triangles){
  const [a,b,c]=tri.map(i=>outline[i]);
  const d=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
  const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/d;
  const v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/d,w=1-u-v;
  const score=Math.max(0,-u)+Math.max(0,-v)+Math.max(0,-w);
  if(score<penalty){penalty=score;best={tri,weights:[u,v,w]};}if(score<1e-7)break;
 }
 // Curved boundary vertices outside the coarse outline use its nearest edge.
 const weights=best.weights.map(w=>Math.max(0,w)),sum=weights.reduce((a,b)=>a+b,0);
 let u=0,v=0;best.tri.forEach((id,i)=>{u+=landmarks[id][0]*weights[i]/sum;v+=landmarks[id][1]*weights[i]/sum;});
 if(back){
  // Keep the central back on a regular fabric panel so names and numbers don't
  // kink where the shoulder-to-sleeve UV triangles meet. Blend into fitted edges.
  const bodyU=THREE.MathUtils.lerp(landmarks[5][0],landmarks[6][0],THREE.MathUtils.clamp((x+.77)/1.56,0,1));
  const bodyV=THREE.MathUtils.lerp((landmarks[5][1]+landmarks[6][1])/2,(landmarks[0][1]+landmarks[11][1])/2,THREE.MathUtils.clamp((y+1.15)/2.35,0,1));
  const edge=Math.max(THREE.MathUtils.smoothstep(Math.abs(x),.50,.73),THREE.MathUtils.smoothstep(y,.90,1.12));
  u=THREE.MathUtils.lerp(bodyU,u,edge);v=THREE.MathUtils.lerp(bodyV,v,edge);
 }
 return [THREE.MathUtils.clamp(u,0,1),1-THREE.MathUtils.clamp(v,0,1)];
}
export function applyPhoto(material,url,channel,onReady,assetBase=import.meta.url){
 if(!url||typeof document==='undefined')return;
 // Texture paths are relative to the asset folder, not to the page showing the rack.
 url=new URL(url,new URL(assetBase,location.href)).href;
 const texture=new THREE.TextureLoader().load(url,()=>{
  material.color.set(0xffffff);material.map=texture;material.needsUpdate=true;onReady?.();
 },undefined,()=>{console.warn(`Kit photo unavailable: ${url}`);});
 texture.colorSpace=THREE.SRGBColorSpace;texture.channel=channel;texture.anisotropy=4;
}
export function matchingBack(material,kit,onReady){
 if(typeof document==='undefined')return;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const ctx=canvas.getContext('2d');ctx.fillStyle=kit.a;ctx.fillRect(0,0,256,256);ctx.fillStyle=kit.b;
 if(kit.pattern==='hstripe')for(let y=0;y<256;y+=48)ctx.fillRect(0,y,256,24);
 if(kit.pattern==='vstripe')for(let x=0;x<256;x+=52)ctx.fillRect(x,0,26,256);
 if(kit.pattern==='band'&&kit.asset==='11')ctx.fillRect(0,82,256,45);
 if(kit.pattern==='twotone')ctx.fillRect(128,0,128,256);
 // This is deliberately only cloth colour/pattern, never a repeated front logo.
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.channel=1;
 material.color.set(0xffffff);material.map=texture;material.needsUpdate=true;
}
