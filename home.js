import {readMotionPaused} from './motion-preference.js?v=mvdrpcy7';
import './shell.js?v=mvdrpcy7';
import {HomeScene} from './home-scene.js?v=mvdrpcy7';
import {attachScrollVideo} from './scroll-video.js?v=mvdrpcy7';
const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);
const $=selector=>document.querySelector(selector),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const runway=$('.hero-runway'),cityLayer=$('.city-layer'),overlay=$('.drop-overlay'),hotspots=$('.product-hotspots');
const city=new HomeScene($('#city-canvas'),{mode:'city'}),portalCanvas=$('#portal-canvas'),portal=portalCanvas?new HomeScene(portalCanvas,{mode:'portal'}):null,film=attachScrollVideo($('#signature-film'));
let context,paused=readMotionPaused(),signatureProgress=0,portalProgress=0,dropActive=false;
city.setPaused(paused);portal?.setPaused(paused);
function setDrop(active){if(dropActive===active)return;dropActive=active;overlay.inert=!active;hotspots.inert=!active;overlay.classList.toggle('is-active',active);document.body.dataset.dropActive=String(active);window.dispatchEvent(new CustomEvent('dropvisibility',{detail:active}));}
function openingProgress(progress){const active=reduced.matches||progress>.47;setDrop(active);city.setActive(!active);cityLayer.inert=active;cityLayer.style.pointerEvents=active?'none':'auto';runway.dataset.progress=progress.toFixed(3);}
function setup(){context?.revert();document.body.classList.toggle('is-linear',reduced.matches);city.setReduced(reduced.matches);portal?.setReduced(reduced.matches);
 if(reduced.matches){city.setActive(false);setDrop(true);cityLayer.inert=false;cityLayer.style.pointerEvents='auto';return;}
 context=gsap.context(()=>{
  const opening=gsap.timeline({scrollTrigger:{trigger:runway,start:'top top',end:'bottom bottom',scrub:true,onUpdate:self=>{openingProgress(self.progress);city.setProgress(self.progress);}}});
  opening.to('.opening-copy',{y:-65,opacity:0,duration:.22,ease:'none'},.08).to('.opening-foot',{opacity:0,duration:.12},.08).fromTo('.scene-window',{opacity:0},{opacity:1,duration:.24,ease:'none'},.23).to('.city-layer',{clipPath:'inset(0% 0% 100% 0%)',scale:1.045,duration:.26,ease:'power2.inOut'},.25).fromTo('.drop-overlay',{opacity:0},{opacity:1,duration:.13},.43).to({}, {duration:.3},.7);
  ScrollTrigger.create({trigger:'.signature-runway',start:'top top',end:'bottom bottom',onUpdate:self=>{signatureProgress=self.progress;if(!paused)film.update(self.progress);$('.turn-track i').style.width=self.progress*100+'%';}});
  gsap.fromTo('.signature-copy',{y:45,opacity:0},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.signature-runway',start:'top 75%',end:'top 15%',scrub:true}});
  gsap.fromTo('.signature-note',{y:45,opacity:0},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.signature-runway',start:'top 65%',end:'top top',scrub:true}});
  gsap.fromTo('.collection .product-card',{y:32,opacity:.35},{y:0,opacity:1,stagger:.08,ease:'none',scrollTrigger:{trigger:'.collection-pieces',start:'top 95%',end:'top 55%',scrub:true}});
 });ScrollTrigger.refresh();const trigger=ScrollTrigger.getAll().find(t=>t.trigger===runway);openingProgress(trigger?.progress||0);
}
function showDrop(behavior='smooth'){const top=reduced.matches?$('#drop').offsetTop:runway.offsetTop+(runway.offsetHeight-innerHeight)*.68;scrollTo({top,behavior:reduced.matches?'instant':behavior});}
document.querySelectorAll('a[href="#drop"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showDrop();}));window.addEventListener('showdrop',()=>showDrop());
document.querySelectorAll('[data-product-view]').forEach(button=>button.addEventListener('click',()=>{const front=button.dataset.productView==='front',img=$('.signature-product-image');img.src=front?'assets/products/signature-black-front.jpg':'assets/products/signature-black-back.jpg';img.alt='Signature Hoodie, black, '+(front?'front':'back')+' view';document.querySelectorAll('[data-product-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));
window.addEventListener('bornhood-motion',event=>{paused=event.detail.paused;city.setPaused(paused);portal?.setPaused(paused);if(!paused){film.update(signatureProgress);portal?.setProgress(portalProgress);}});
document.addEventListener('pointermove',event=>{if(event.pointerType==='mouse')city.setPointer((event.clientX/innerWidth-.5)*2,(event.clientY/innerHeight-.5)*2);},{passive:true});
reduced.addEventListener('change',setup);if(reduced.matches)setDrop(true);else setDrop(false);setup();if(location.hash==='#drop')requestAnimationFrame(()=>showDrop('instant'));document.fonts.ready.then(()=>ScrollTrigger.refresh());
window.addEventListener('pagehide',event=>{if(!event.persisted){context?.revert();city.dispose();portal?.dispose();film.destroy();}});window.addEventListener('storefront-content',setup);
