import {mountBag} from './bag.js?v=mvdrpcy7';
import {catalog,escapeHTML as e} from './catalog.js?v=mvdrpcy7';
const isHome=location.pathname==='/'||location.pathname.endsWith('/index.html');
const isAstro=location.pathname.endsWith('/astrology.html');
let shell=document.querySelector('#site-shell');
if(!shell){shell=document.createElement('div');shell.id='site-shell';document.body.prepend(shell);}
const collections=[...new Map(catalog.map(product=>[product.collectionId,product.collection])).entries()];
const categoryLinks=[['All products','shop.html'],['Hoodies','shop.html?category=hoodies'],['T-shirts','shop.html?category=tees'],['Headwear','shop.html?category=headwear'],['Sweatshirts','shop.html?category=sweatshirts'],['Kids','shop.html?category=kids']];
const featured=['crown-227','astro-ringspun-tee'].map(id=>catalog.find(product=>product.id===id)).filter(Boolean);
shell.innerHTML=`<header class="journey-header"><a class="journey-brand" href="index.html" aria-label="Born Hood home"><img src="assets/store-logo.jpg" alt="Born Hood" width="1300" height="1300"><span class="brand-name">BORN HOOD</span></a><nav aria-label="Main navigation"><a href="${isHome?'#drop':'index.html#drop'}">The drop</a><button class="mega-trigger" id="shop-menu-toggle" type="button" aria-expanded="false" aria-controls="shop-mega-menu">Shop <span aria-hidden="true">⌄</span></button><button class="mega-trigger" id="collections-menu-toggle" type="button" aria-expanded="false" aria-controls="collections-mega-menu">Collections <span aria-hidden="true">⌄</span></button></nav><button id="open-bag" class="journey-bag" aria-haspopup="dialog">Bag <span id="bag-count">0</span></button><section class="mega-panel" id="shop-mega-menu" aria-label="Shop Born Hood" hidden><div class="mega-top"><span>Explore Born Hood</span><button id="close-shop-menu" type="button" aria-label="Close shop menu">Close ×</button></div><div class="mega-grid"><div class="mega-link-column"><h2>Shop by category</h2>${categoryLinks.map(([name,url])=>`<a href="${url}">${name}</a>`).join('')}</div><div class="mega-link-column"><h2>Collections</h2>${collections.map(([id,name])=>`<a href="${id==='astrology'?'astrology.html':'shop.html?collection='+encodeURIComponent(id)}">${e(name)}</a>`).join('')}</div><div class="mega-featured">${featured.map(product=>`<a class="mega-product" href="product.html?id=${encodeURIComponent(product.id)}"><img src="${e(product.image)}" alt="${e(product.name)}" width="800" height="800"><span>${e(product.collection)}</span><strong>${e(product.name)} <b aria-hidden="true">↗</b></strong></a>`).join('')}</div></div><a class="mega-all" href="shop.html">View all products <span aria-hidden="true">→</span></a></section><section class="mega-panel" id="collections-mega-menu" aria-label="Explore collections" hidden><div class="mega-top"><span>Find your expression / Collections</span><button id="close-collections-menu" type="button" aria-label="Close collections menu">Close ×</button></div><div class="mega-grid"><div class="mega-link-column"><h2>Explore the collections</h2><a href="collections.html">All collections →</a>${collections.map(([id,name])=>`<a href="${id==='astrology'?'astrology.html':'shop.html?collection='+encodeURIComponent(id)}">${e(name)}</a>`).join('')}</div><div class="mega-link-column"><h2>Behind Born Hood</h2><a href="about.html">Our story</a><a href="contact.html">Contact & support</a><a href="shop.html">Browse every imported piece</a></div><a class="mega-campaign" href="astrology.html"><img src="assets/astrology/celestial-poster.jpg" alt="Celestial sculpture and zodiac artwork"><span>Featured collection</span><strong>ASTROLOGY ↗</strong></a></div><a class="mega-all" href="collections.html">Explore all collections <span aria-hidden="true">→</span></a></section></header>`;
const trigger=document.querySelector('#shop-menu-toggle'),panel=document.querySelector('#shop-mega-menu');
function setMenu(open,{restoreFocus=false}={}){
 if(open)setCollections(false);
 panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));
 document.body.classList.toggle('shop-menu-open',open);
 if(restoreFocus)trigger.focus({preventScroll:true});
}
const collectionsTrigger=document.querySelector('#collections-menu-toggle'),collectionsPanel=document.querySelector('#collections-mega-menu');
function setCollections(open,restore=false){
 if(open)setMenu(false);
 collectionsPanel.hidden=!open;collectionsTrigger.setAttribute('aria-expanded',String(open));
 if(restore)collectionsTrigger.focus({preventScroll:true});
}
collectionsTrigger.addEventListener('click',()=>setCollections(collectionsPanel.hidden));
collectionsTrigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();setCollections(true);collectionsPanel.querySelector('a')?.focus();}});
document.querySelector('#close-collections-menu').addEventListener('click',()=>setCollections(false,true));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!collectionsPanel.hidden){event.preventDefault();setCollections(false,true);}});
document.addEventListener('pointerdown',event=>{if(!event.target.closest('.journey-header'))setCollections(false);});
document.addEventListener('focusin',event=>{if(!event.target.closest('.journey-header'))setCollections(false);});
collectionsPanel.addEventListener('click',event=>{if(event.target.closest('a'))setCollections(false);});
trigger.addEventListener('click',()=>setMenu(panel.hidden));
trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();setMenu(true);panel.querySelector('a')?.focus();}});
document.querySelector('#close-shop-menu').addEventListener('click',()=>setMenu(false,{restoreFocus:true}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){setMenu(false,{restoreFocus:true});event.preventDefault();}});
document.addEventListener('pointerdown',event=>{if(!panel.hidden&&!event.target.closest('.journey-header'))setMenu(false);});
document.addEventListener('focusin',event=>{if(!panel.hidden&&!event.target.closest('.journey-header'))setMenu(false);});
panel.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
export const bagUI=mountBag();
document.querySelector('#open-bag').addEventListener('click',()=>{setMenu(false);setCollections(false);});
const collectionMotion=document.querySelector('.astro-header .motion-control');
if(collectionMotion){document.body.append(collectionMotion);collectionMotion.classList.add('collection-motion');}
const oldFooter=document.querySelector('.astro-footer');
if(oldFooter){oldFooter.className='journey-footer';oldFooter.innerHTML='<a href="index.html" aria-label="Born Hood home"><img src="assets/store-logo.jpg" alt="Born Hood" width="1300" height="1300"></a><nav aria-label="Footer navigation"><a href="index.html#drop">The drop</a><a href="shop.html">Shop</a><a href="astrology.html">Astrology</a></nav><span>Born Hood / Independent expression</span><a href="index.html">Back to the drop ↑</a>';}


import './site-content.js?v=mvdrpcy7';

for(const footer of document.querySelectorAll('.journey-footer')){const nav=footer.querySelector('nav');if(nav)nav.innerHTML='<a href="shop.html">Shop</a><a href="collections.html">Collections</a><a href="about.html">About</a><a href="contact.html">Contact</a>'; }
