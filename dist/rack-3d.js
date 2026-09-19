import * as THREE from 'three';
import {kits} from './kits.mjs';
import {makeShirt,makeHanger,makeRailHook,bendMaterial,RAIL_RADIUS,SHIRT_DROP} from './shirt-model.js';

const PX=86;
export class ShirtRack3D {
  constructor(track,slots,assetBase){
    this.track=track;this.slots=slots;this.renderer=this.createRenderer();
    this.renderer.domElement.className='rack-canvas';this.renderer.domElement.setAttribute('aria-hidden','true');track.prepend(this.renderer.domElement);
    this.scene=this.sceneWithLight();this.camera=new THREE.OrthographicCamera(-8,8,2,-2,.1,80);this.camera.position.set(0,0,30);
    this.items=slots.map((_,i)=>{
      const pivot=new THREE.Group(),yaw=new THREE.Group(),shirt=makeShirt(i,kits[i],()=>this.queueRender(),assetBase),hanger=makeHanger(shirt.userData.width),hook=makeRailHook();
      yaw.rotation.y=THREE.MathUtils.degToRad((slots.length>24?-73:-63)+(i%5-2)*1.4);
      yaw.position.y=-SHIRT_DROP;pivot.add(yaw,hook);yaw.add(shirt,hanger);this.scene.add(pivot);
      const direction=new THREE.Vector2(Math.cos(yaw.rotation.y),Math.sin(yaw.rotation.y));
      const drapes=shirt.userData.materials.map(material=>bendMaterial(material,direction));
      // Deform shadow geometry with the same pinned shoulder as the visible cloth.
      shirt.userData.shell.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});
      drapes.push(bendMaterial(shirt.userData.shell.customDepthMaterial,direction));
      return {pivot,yaw,shirt,hook,drapes,direction};
    });
    const steel=new THREE.MeshStandardMaterial({color:0x929b9a,metalness:.7,roughness:.28,transparent:true,depthWrite:false});
    this.railFade={value:.07};
    steel.onBeforeCompile=shader=>{
      shader.uniforms.railFade=this.railFade;
      shader.vertexShader='varying float railPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nrailPosition=position.y;');
      shader.fragmentShader='varying float railPosition;\nuniform float railFade;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a *= smoothstep(0.0,railFade,0.5-abs(railPosition));');
    };
    steel.customProgramCacheKey=()=> 'rail-end-fade';
    this.rail=new THREE.Mesh(new THREE.CylinderGeometry(RAIL_RADIUS,RAIL_RADIUS,1,32),steel);this.rail.rotation.z=Math.PI/2;this.rail.castShadow=true;this.scene.add(this.rail);
    this.floor=new THREE.Mesh(new THREE.PlaneGeometry(60,30),new THREE.ShadowMaterial({opacity:.13}));this.floor.rotation.x=-Math.PI/2;this.floor.position.y=-1.95;this.floor.receiveShadow=true;this.scene.add(this.floor);
    this.width=0;this.height=0;this.resize();this.render();
    track.classList.add('is-3d');
    this.renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();track.classList.remove('is-3d');});
    this.renderer.domElement.addEventListener('webglcontextrestored',()=>{track.classList.add('is-3d');this.render();});
  }
  createRenderer(){const r=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFShadowMap;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=.85;r.outputColorSpace=THREE.SRGBColorSpace;return r;}
  sceneWithLight(detail=false){const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0x89918c,2.6));const key=new THREE.DirectionalLight(0xfffcf7,2.7);key.position.set(-5,8,7);key.castShadow=true;key.shadow.mapSize.set(2048,detail?2048:1024);const spread=detail?2.7:14;Object.assign(key.shadow.camera,{left:-spread,right:spread,top:detail?2.7:8,bottom:detail?-2.7:-8,near:.5,far:35});key.shadow.bias=-.0012;key.shadow.normalBias=.045;key.shadow.radius=4;s.add(key);const fill=new THREE.DirectionalLight(0xe7edff,.8);fill.position.set(7,2,-4);s.add(fill);return s;}
  resize(){
    this.width=this.track.clientWidth;this.height=this.track.clientHeight;
    const pad=matchMedia('(min-width:680px)').matches?42:0;
    this.renderer.domElement.style.left=`-${pad}px`;
    this.renderer.setSize(this.width+pad*2,this.height,false);
    this.renderer.domElement.style.width=`${this.width+pad*2}px`;this.renderer.domElement.style.height=`${this.height}px`;
    this.camera.left=-(this.width+pad*2)/(PX*2);this.camera.right=-this.camera.left;this.camera.top=this.height/(PX*2);this.camera.bottom=-this.camera.top;this.camera.updateProjectionMatrix();
    this.top=this.camera.top-32/PX;
    this.rail.position.y=this.top;this.rail.scale.y=(this.width+pad*2-12)/PX;
    this.railFade.value=Math.min(.2,72/(this.width+pad*2-12));
    this.items.forEach((item,i)=>{item.yaw.scale.z=Math.min(1,Math.max(.4,this.slots[i].offsetWidth/30));item.direction.set(Math.cos(item.yaw.rotation.y),Math.sin(item.yaw.rotation.y)/item.yaw.scale.z);item.baseX=(this.slots[i].offsetLeft+this.slots[i].offsetWidth/2-this.width/2)/PX;item.pivot.position.set(item.baseX,this.top,0);});
    this.floor.position.y=this.top-3.08;
    this.render();
  }
  update(states){states.forEach((s,i)=>{const item=this.items[i];item.pivot.position.x=item.baseX+s.x/PX;item.pivot.rotation.z=-THREE.MathUtils.degToRad(s.swing);item.drapes.forEach(d=>d.value=THREE.MathUtils.clamp((s.hem-s.swing*.42)*.13,-.24,.24));});this.render();}
  lifted(index,on){const item=this.items[index];for(const mat of item.shirt.userData.materials){mat.transparent=on;mat.opacity=on?.18:1;mat.depthWrite=!on;}item.shirt.userData.meshes.forEach(m=>m.castShadow=!on);this.render();}
  queueRender(){if(this.textureFrame)return;this.textureFrame=requestAnimationFrame(()=>{this.textureFrame=null;this.render();});}
  render(){if(!this.disposed)this.renderer.render(this.scene,this.camera);}
  dispose(){
    this.disposed=true;cancelAnimationFrame(this.textureFrame);this.textureFrame=null;
    const textures=new Set();
    this.scene.traverse(object=>{
      object.geometry?.dispose();
      for(const material of [object.material,object.customDepthMaterial].flat().filter(Boolean)){if(material.map)textures.add(material.map);material.dispose();}
    });
    textures.forEach(texture=>texture.dispose());
    this.renderer.dispose();this.renderer.forceContextLoss();
    this.renderer.domElement.remove();this.track.classList.remove('is-3d');
  }
}
