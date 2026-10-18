import './shell.js?v=mvdrpcy7';
import {catalog,escapeHTML as e} from './catalog.js?v=mvdrpcy7';
import {initCollectionWorlds} from './collection-worlds.js?v=mvdrpcy7';
const groups=[...new Map(catalog.map(p=>[p.collectionId,p.collection])).entries()];
for(const grid of document.querySelectorAll('[data-collection-tiles]')){
 const limit=Number(grid.dataset.limit)||groups.length;
 grid.innerHTML=groups.slice(0,limit).map(([id,name],index)=>{
 const product=catalog.find(p=>p.collectionId===id),astro=id==='astrology';
 return `<a class="world-tile ${astro?'world-celestial':''}" href="${astro?'astrology.html':'shop.html?collection='+encodeURIComponent(id)}"><div class="world-media">${astro?'<video muted playsinline loop preload="none" poster="assets/astrology/celestial-poster.jpg" src="assets/astrology/celestial-event-scrub.mp4" aria-hidden="true"></video>':`<img src="${e(product.image)}" alt="${e(product.name)}" loading="lazy" width="800" height="800">`}</div><div class="world-copy"><span>Collection / ${String(index+1).padStart(2,'0')}</span><h3>${e(name)}</h3><b>Explore collection ↗</b></div></a>`;
 }).join('');
}
const worldItems=groups.map(([id,name])=>{const product=catalog.find(p=>p.collectionId===id);return product?{id,name,image:id==='astrology'?'assets/astrology/celestial-poster.jpg':product.image,href:id==='astrology'?'astrology.html':'shop.html?collection='+encodeURIComponent(id)}:null}).filter(Boolean);
document.querySelectorAll('[data-collection-experience]').forEach(root=>initCollectionWorlds(root,worldItems));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const videos=[...document.querySelectorAll('.world-tile video')];
const visible=new Set();
function sync(){for(const video of videos){if(visible.has(video)&&!reduced.matches&&!document.hidden)video.play().catch(()=>{});else video.pause();}}
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);}sync();},{threshold:.15});
videos.forEach(video=>observer.observe(video));reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
