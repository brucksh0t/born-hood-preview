import {readMotionPaused} from './motion-preference.js';
import './shell.js';
import {HomeScene} from './home-scene.js';
import {attachScrollVideo} from './scroll-video.js';
const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);
const $=selector=>document.querySelector(selector);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const city=new HomeScene($('#city-canvas'),{mode:'city'});
const portal=new HomeScene($('#portal-canvas'),{mode:'portal'});
const signature=attachScrollVideo($('#signature-film'));
let context,paused=readMotionPaused(),signatureProgress=0,portalProgress=0; city.setPaused(paused);portal.setPaused(paused);
const runway=$('.hero-runway'),overlay=$('.drop-overlay'),hotspots=$('.product-hotspots');
let dropActive=null;
function setDrop(active){
 if(dropActive===active)return;dropActive=active;
 overlay.inert=!active;hotspots.inert=!active;overlay.classList.toggle('is-active',active);
 document.body.dataset.dropActive=String(active);
 window.dispatchEvent(new CustomEvent('dropvisibility',{detail:active}));
}
function openingProgress(progress){
 const active=reduced.matches||progress>.47;setDrop(active);city.setActive(!active);
 $('.city-layer').inert=active;$('.city-layer').style.pointerEvents=active?'none':'auto';
 runway.dataset.progress=progress.toFixed(3);
}
function setup(){
 context?.revert();document.body.classList.toggle('is-linear',reduced.matches);
 city.setReduced(reduced.matches);portal.setReduced(reduced.matches);
 if(reduced.matches){city.setActive(false);setDrop(true);$('.city-layer').inert=false;$('.city-layer').style.pointerEvents='auto';return;}
 context=gsap.context(()=>{
  const opening=gsap.timeline({scrollTrigger:{trigger:runway,start:'top top',end:'bottom bottom',scrub:true,onUpdate:self=>{openingProgress(self.progress);city.setProgress(self.progress);}}});
  opening.to('.opening-copy',{y:-65,opacity:0,duration:.22,ease:'none'},.08)
   .to('.opening-foot',{opacity:0,duration:.12},.08)
   .fromTo('.scene-window',{opacity:0},{opacity:1,duration:.24,ease:'none'},.23)
   .to('.city-layer',{clipPath:'inset(0% 0% 100% 0%)',scale:1.045,duration:.26,ease:'power2.inOut'},.25)
   .fromTo('.drop-overlay',{opacity:0},{opacity:1,duration:.13},.43)
   .to({}, {duration:.3},.7);
  ScrollTrigger.create({trigger:'.signature-runway',start:'top top',end:'bottom bottom',onUpdate:self=>{
   signatureProgress=self.progress;
   if(!paused)signature.update(self.progress);
   $('.turn-track i').style.width=self.progress*100+'%';
   $('[data-turn="front"]').setAttribute('aria-pressed',String(self.progress<.22||self.progress>.64));
   $('[data-turn="back"]').setAttribute('aria-pressed',String(self.progress>=.22&&self.progress<=.64));
   $('.signature-stage').dataset.progress=self.progress.toFixed(3);
  }});
  gsap.fromTo('.signature-copy',{y:45,opacity:0},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.signature-runway',start:'top 75%',end:'top 15%',scrub:true}});
  gsap.fromTo('.signature-note',{y:45,opacity:0},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.signature-runway',start:'top 65%',end:'top top',scrub:true}});
  gsap.fromTo('.portal-backdrop',{scale:1.16,opacity:.35},{scale:1,opacity:.85,ease:'none',scrollTrigger:{trigger:'.portal-runway',start:'top bottom',end:'bottom bottom',scrub:true,onUpdate:self=>{portalProgress=self.progress;if(!paused)portal.setProgress(self.progress);}}});
  gsap.fromTo('.portal-copy',{y:50,opacity:0},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.portal-runway',start:'top 70%',end:'top 10%',scrub:true}});
  gsap.fromTo('.piece',{y:60,opacity:0},{y:0,opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:'.collection-pieces',start:'top 95%',end:'top 45%',scrub:.5}});
  gsap.fromTo('.world-content',{y:40,opacity:0},{y:0,opacity:1,scrollTrigger:{trigger:'.our-world',start:'top 85%',end:'top 35%',scrub:true}});
 });
 ScrollTrigger.refresh();const trigger=ScrollTrigger.getAll().find(t=>t.trigger===runway);openingProgress(trigger?.progress||0);
}
function showDrop(behavior='smooth'){
 const top=reduced.matches?$('#drop').offsetTop:runway.offsetTop+(runway.offsetHeight-innerHeight)*.68;
 scrollTo({top,behavior:reduced.matches?'instant':behavior});
}
document.querySelectorAll('a[href="#drop"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showDrop();}));
window.addEventListener('showdrop',()=>showDrop());
document.querySelectorAll('[data-turn]').forEach(button=>button.addEventListener('click',()=>{
 const progress=button.dataset.turn==='back'?.35:0;
 if(reduced.matches||paused){
  signature.update(progress);document.querySelectorAll('[data-turn]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }else scrollTo({top:$('.signature-runway').offsetTop+($('.signature-runway').offsetHeight-innerHeight)*progress,behavior:'smooth'});
}));
window.addEventListener('bornhood-motion',event=>{
 paused=event.detail.paused;city.setPaused(paused);portal.setPaused(paused);if(!paused){signature.update(signatureProgress);portal.setProgress(portalProgress);}
 // Pause continuous animation; keep scroll navigation and text readable.
});
document.addEventListener('pointermove',event=>{if(event.pointerType==='mouse')city.setPointer((event.clientX/innerWidth-.5)*2,(event.clientY/innerHeight-.5)*2);},{passive:true});
reduced.addEventListener('change',setup);
setup();
if(location.hash==='#drop')requestAnimationFrame(()=>showDrop('instant'));
document.fonts.ready.then(()=>ScrollTrigger.refresh());
window.addEventListener('pagehide',event=>{if(!event.persisted){context?.revert();city.dispose();portal.dispose();signature.destroy();}});



