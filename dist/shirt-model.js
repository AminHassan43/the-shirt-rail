import * as THREE from 'three';
import {photoUV,applyPhoto,matchingBack} from './kit-textures.js';

// Front and back are cut from one continuous shirt outline and welded along
// the sewn edges. Only the neckline, cuffs and hem are left open.
let topology;
function shirtTopology(){
  if(topology)return topology;
  const points=[[-.28,1.20]],edges=[];
  function curve(control,end,opening=null,count=5){
    const start=points.at(-1);
    for(let i=1;i<=count;i++){
      const t=i/count,q=1-t,p=[q*q*start[0]+2*q*t*control[0]+t*t*end[0],q*q*start[1]+2*q*t*control[1]+t*t*end[1]];
      edges.push({a:points.at(-1),b:p,opening});points.push(p);
    }
  }
  curve([-.50,1.18],[-.75,1.01]);
  curve([-.98,.77],[-1.12,.42]);
  curve([-1.07,.26],[-.90,.18],'left cuff');
  curve([-.80,.34],[-.73,.52],null,4);
  curve([-.69,.58],[-.70,.31],null,3);
  curve([-.69,-.50],[-.77,-1.15],null,7);
  curve([0,-1.153],[.79,-1.15],'hem',12);
  curve([.68,-.42],[.72,.34],null,7);
  curve([.70,.53],[.75,.49],null,3);
  curve([.83,.25],[.94,.15],null,4);
  curve([1.10,.23],[1.16,.40],'right cuff');
  curve([.98,.84],[.73,1.03]);
  curve([.47,1.18],[.28,1.20]);
  curve([0,.80],[-.28,1.20],'neck',12);
  points.pop();
  let faces=THREE.ShapeUtils.triangulateShape(points.map(p=>new THREE.Vector2(...p)),[]);
  // Conforming edge refinement gives folds enough geometry without detached
  // T-junctions or duplicating the body beneath an independently made sleeve.
  for(let pass=0;pass<9;pass++){
    const mids=new Map(),next=[];
    function midpoint(a,b){
      const key=a<b?`${a}:${b}`:`${b}:${a}`;
      if(mids.has(key))return mids.get(key);
      const A=points[a],B=points[b];
      if((A[0]-B[0])**2+(A[1]-B[1])**2<=.0100)return null;
      const id=points.length;points.push([(A[0]+B[0])/2,(A[1]+B[1])/2]);mids.set(key,id);return id;
    }
    for(const [a,b,c] of faces){
      const ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a),count=Number(ab!==null)+Number(bc!==null)+Number(ca!==null);
      if(count===0)next.push([a,b,c]);
      else if(count===3)next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);
      else if(count===1){
        if(ab!==null)next.push([a,ab,c],[ab,b,c]);
        else if(bc!==null)next.push([b,bc,a],[bc,c,a]);
        else next.push([c,ca,b],[ca,a,b]);
      }else{
        const two=(a,b,c,ab,bc)=>next.push([b,bc,ab],[a,ab,c],[ab,bc,c]);
        if(ab!==null&&bc!==null)two(a,b,c,ab,bc);
        else if(bc!==null&&ca!==null)two(b,c,a,bc,ca);
        else two(c,a,b,ca,ab);
      }
    }
    faces=next;if(mids.size===0)break;
  }
  function distance(p,edge){const x=edge.b[0]-edge.a[0],y=edge.b[1]-edge.a[1],t=THREE.MathUtils.clamp(((p[0]-edge.a[0])*x+(p[1]-edge.a[1])*y)/(x*x+y*y),0,1);return Math.hypot(p[0]-edge.a[0]-t*x,p[1]-edge.a[1]-t*y);}
  const sewn=edges.filter(e=>!e.opening);
  const seamDistances=points.map(p=>Math.min(...sewn.map(e=>distance(p,e))));
  topology={points,faces,edges,seamDistances};return topology;
}

export function makeShirt(index=0,kit=null,onTextureReady=null,assetBase){
  const group=new THREE.Group();
  const cloth=new THREE.MeshPhysicalMaterial({color:0xcbd0cd,roughness:.97,metalness:0,sheen:.24,sheenColor:0xe3e6e3,side:THREE.DoubleSide});
  cloth.shadowSide=THREE.FrontSide;
  if(kit)cloth.color.set(kit.a);
  const back=kit?cloth.clone():cloth;
  const trim=new THREE.MeshPhysicalMaterial({color:0xc3c9c5,roughness:1,sheen:.18,side:THREE.DoubleSide});
  if(kit)trim.color.set(kit.a);
  const length=1+((index*13)%19-9)*.006,width=1+((index*7)%9-4)*.008,phase=index*.83;
  const {points,faces,edges,seamDistances}=shirtTopology();
  function drape(x,y,side,seamDistance){
    const lower=THREE.MathUtils.clamp((1.10-y)/2.35,0,1);
    const sleeve=THREE.MathUtils.smoothstep(Math.abs(x),.72,1.12);
    const round=1-Math.exp(-seamDistance/.055);
    const broad=.040*Math.sin(x*7.1+y*1.5+phase)+.021*Math.sin(x*13.4+Math.sin(y*3.2)*.65-phase);
    const gathered=.021*Math.sin(y*14+Math.abs(x)*9+phase)*Math.exp(-((Math.abs(x)-.62)**2/.055+(y-.35)**2/.30));
    const depth=.098+.020*Math.sin(lower*Math.PI)-.035*sleeve;
    const fold=(broad*(.22+.78*lower)+gathered)*(1-.55*sleeve)+sleeve*.018*Math.sin(y*16+x*4+phase);
    const z=side*Math.max(.014,depth+fold)*round;
    // Shared asymmetric displacement crosses the sleeve seams continuously.
    const px=x*width+.028*Math.sin(y*2.5+phase)*lower*lower;
    const py=y*(y<0?length:1)+lower*lower*(.008*Math.sin(x*7+phase)+.003*Math.sin(x*13-phase))-.035*sleeve;
    const backNeck=side<0?.145*Math.exp(-Math.pow(x/.27,4))*THREE.MathUtils.smoothstep(y,.62,1.17)*round:0;
    return [px,py+backNeck,z];
  }
  const positions=[],uvs=[],indices=[],weld=new Map(),maps=[];
  for(const side of [1,-1]){
    const map=[];
    points.forEach(([x,y],i)=>{
      const p=drape(x,y,side,seamDistances[i]);
      const key=p.map(n=>Math.round(n*1e7)).join(':');let id=weld.get(key);
      if(id===undefined){id=positions.length/3;positions.push(...p);uvs.push((x+1.2)/2.4,(y+1.3)/2.6);weld.set(key,id);}
      map.push(id);
    });
    maps.push(map);
    for(const [a,b,c] of faces){const A=points[a],B=points[b],C=points[c],positive=(B[0]-A[0])*(C[1]-A[1])-(B[1]-A[1])*(C[0]-A[0])>0;indices.push(...((positive===(side===1))?[map[a],map[b],map[c]]:[map[c],map[b],map[a]]));}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
  if(kit?.texture){
    const frontUV=[],backUV=[];
    for(let i=0;i<uvs.length;i+=2){const x=uvs[i]*2.4-1.2,y=uvs[i+1]*2.6-1.3;frontUV.push(...photoUV(x,y,kit.texture.fitFront));backUV.push(...photoUV(x,y,kit.texture.fitBack,true));}
    geometry.setAttribute('uv',new THREE.Float32BufferAttribute(frontUV,2));geometry.setAttribute('uv1',new THREE.Float32BufferAttribute(backUV,2));
    geometry.addGroup(0,faces.length*3,0);geometry.addGroup(faces.length*3,faces.length*3,1);
    applyPhoto(cloth,kit.texture.front,0,onTextureReady,assetBase);
    if(kit.texture.back)applyPhoto(back,kit.texture.back,1,onTextureReady,assetBase);else matchingBack(back,kit,onTextureReady);
  }
  const shell=new THREE.Mesh(geometry,kit?[cloth,back]:cloth);shell.name='Continuous shirt shell';shell.castShadow=true;shell.receiveShadow=true;group.add(shell);
  // Thin turned edges follow the actual openings, without adding sleeve caps.
  const sewnEdges=edges.filter(e=>!e.opening);
  function seamDistance(x,y){return Math.min(...sewnEdges.map(e=>{const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=THREE.MathUtils.clamp(((x-e.a[0])*dx+(y-e.a[1])*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(x-e.a[0]-t*dx,y-e.a[1]-t*dy);}));}
  const meshes=[shell];
  for(const opening of ['neck','left cuff','right cuff','hem']){
    const rimEdges=edges.filter(e=>e.opening===opening),rimPoints=[rimEdges[0].a,...rimEdges.map(e=>e.b)];
    const loop=[];
    for(const side of [1,-1])for(const [x,y] of side===1?rimPoints:[...rimPoints].reverse())loop.push(new THREE.Vector3(...drape(x,y,side,seamDistance(x,y))));
    // Remove repeated welded seam endpoints before constructing the curve.
    const clean=loop.filter((p,i)=>i===0||p.distanceTo(loop[i-1])>1e-5);
    if(clean.at(-1).distanceTo(clean[0])<1e-5)clean.pop();
    const curve=new THREE.CatmullRomCurve3(clean,true,'centripetal');
    const rim=new THREE.Mesh(new THREE.TubeGeometry(curve,opening==='hem'?110:70,opening==='neck'?.010:.005,5,true),trim);rim.name=`Turned ${opening}`;rim.castShadow=false;rim.receiveShadow=false;group.add(rim);meshes.push(rim);
  }
  group.userData={cloth,back,trim,materials:[...new Set([cloth,back,trim])],meshes,length,width,shell};return group;
}

export function makeHanger(width=1){
  const group=new THREE.Group();
  const steel=new THREE.MeshStandardMaterial({color:0x949d9c,metalness:.78,roughness:.34});
  function wire(points,radius=.013){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');const m=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*6),radius,6,false),steel);m.castShadow=true;group.add(m);}
  // The stem emerges through the neckline. Shoulder bars sit just inside the
  // sewn shoulder, with the shell resting over the wire rather than below it.
  wire([[0,1.19,0],[0,1.40,0]]);
  wire([[0,1.19,0],[-.28,1.174,0],[-.51,1.115,0],[-.70,.985,0],[-.72,.94,0],[-.60,.915,0],[0,.915,0],[.61,.915,0],[.71,.955,0],[.68,1.00,0],[.50,1.125,0],[.28,1.174,0],[0,1.19,0]],.014);
  group.scale.x=width;
  return group;
}

export const RAIL_RADIUS=.043;
export const SHIRT_DROP=1.68;
export function makeRailHook(){
  // The hook lives in the rail's cross-section, independent of shirt yaw.
  // Its inner crown is tangent to the rail's top surface, not floating above.
  const radius=.012,clearance=RAIL_RADIUS+radius;
  const points=[new THREE.Vector3(0,-.28,0),new THREE.Vector3(-.050,-.17,-.075)];
  for(let i=0;i<=24;i++){
    const angle=Math.PI-i/24*Math.PI*1.22;
    points.push(new THREE.Vector3(.060*Math.cos(angle),clearance-.11+.11*Math.sin(angle),.095*Math.cos(angle)));
  }
  const curve=new THREE.CatmullRomCurve3(points,false,'centripetal');
  const hook=new THREE.Mesh(new THREE.TubeGeometry(curve,96,radius,8,false),new THREE.MeshStandardMaterial({color:0x949d9c,metalness:.78,roughness:.34}));
  hook.name='Hook seated on rail';hook.castShadow=true;return hook;
}

export function bendMaterial(material,direction=new THREE.Vector2(1,0)){
  const amount={value:0};
  material.onBeforeCompile=shader=>{
    shader.uniforms.drape=amount;shader.uniforms.drapeDirection={value:direction};
    shader.vertexShader='uniform float drape;\nuniform vec2 drapeDirection;\n'+shader.vertexShader
      .replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
        float fabricT=clamp((.94-position.y)/2.16,0.0,1.0);
        float fabricSlope=position.y<.94 && position.y> -1.22 ? -1.8*pow(fabricT,.8)/2.16 : 0.0;
        objectNormal.y -= drape * fabricSlope * dot(drapeDirection,objectNormal.xz);`)
      .replace('#include <begin_vertex>',`#include <begin_vertex>
        float hemWeight=pow(clamp((.94-position.y)/2.16,0.0,1.0),1.8);
        transformed.xz += drapeDirection * drape * hemWeight;`);
  };
  material.customProgramCacheKey=()=> 'shirt-drape-v3';return amount;
}
