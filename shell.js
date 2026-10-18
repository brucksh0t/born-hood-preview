import {mountBag} from './bag.js?v=mvdca7wb';
const isHome=location.pathname==='/'||location.pathname.endsWith('/index.html');
const isAstro=location.pathname.endsWith('/astrology.html'),isShop=location.pathname.endsWith('/shop.html');
let shell=document.querySelector('#site-shell');
if(!shell){shell=document.createElement('div');shell.id='site-shell';document.body.prepend(shell);}
shell.innerHTML='<header class="journey-header"><a class="journey-brand" href="index.html" aria-label="Born Hood home"><img src="assets/store-logo.jpg" alt="Born Hood" width="1300" height="1300"><span class="brand-name">BORN HOOD</span></a><nav aria-label="Main navigation"><a href="'+(isHome?'#drop':'index.html#drop')+'">The drop</a><a href="shop.html" '+(isShop?'aria-current="page"':'')+'>Shop</a><a href="astrology.html" '+(isAstro?'aria-current="page"':'')+'>Astrology</a><a href="'+'shop.html'+'">All pieces</a></nav><button id="open-bag" class="journey-bag" aria-haspopup="dialog">Bag <span id="bag-count">0</span></button></header>';
export const bagUI=mountBag();
const collectionMotion=document.querySelector('.astro-header .motion-control');
if(collectionMotion){document.body.append(collectionMotion);collectionMotion.classList.add('collection-motion');}
const oldFooter=document.querySelector('.astro-footer');
if(oldFooter){oldFooter.className='journey-footer';oldFooter.innerHTML='<a href="index.html" aria-label="Born Hood home"><img src="assets/store-logo.jpg" alt="Born Hood" width="1300" height="1300"></a><nav aria-label="Footer navigation"><a href="index.html#drop">The drop</a><a href="shop.html">Shop</a><a href="astrology.html">Astrology</a></nav><span>Born Hood / Independent expression</span><a href="index.html">Back to the streets ↑</a>';}
