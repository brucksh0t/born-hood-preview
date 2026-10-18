import './shell.js?v=mvddm2pw';
import {staticPreview} from './preview-config.js?v=mvddm2pw';
import {buildQuote} from './bag-state.js?v=mvddm2pw';
import {readBag,getSavedBagSummary} from './bag.js?v=mvddm2pw';
import {escapeHTML as e,amountMoney} from './catalog.js?v=mvddm2pw';
let controller,version=0;
async function render(){
 const current=++version;controller?.abort();controller=new AbortController();const requestController=controller;
 const status=document.querySelector('#quote-status'),error=document.querySelector('#quote-error'),items=document.querySelector('#review-items');
 error.textContent='';items.replaceChildren();document.querySelector('#review-subtotal').textContent='—';
 const summary=getSavedBagSummary();
 if(!summary.lines.length){status.textContent='Your bag is empty.';items.innerHTML='<a class="commerce-primary" href="astrology.html#pieces">Explore Astrology ?</a>';return;}
 if(!summary.canReview){status.textContent='Your selection needs a quick update.';items.innerHTML='<p class="commerce-note">Choose any missing options and remove unavailable pieces before continuing.</p><a class="commerce-primary" href="bag.html">Back to your bag ?</a>';return;}
 status.textContent='Checking your selection…';
 const timeout=setTimeout(()=>requestController.abort(),8000);
 try{
  let quote;
  if(staticPreview){
   quote=buildQuote(readBag());

  }else{
   const response=await fetch('/api/checkout/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:readBag()}),signal:requestController.signal});
   quote=await response.json();if(!response.ok)throw new Error(quote.error||'Your order could not be reviewed.');
  }
  if(current!==version)return;
  status.textContent=quote.items.reduce((sum,item)=>sum+item.quantity,0)+' pieces / USD'+(staticPreview?' / demo catalog totals':'');
  items.innerHTML=quote.items.map(line=>'<article class="review-item"><img src="'+e(line.image)+'" alt="'+e(line.name+', '+line.color)+'" width="800" height="800"><div><h3>'+e(line.name)+'</h3><p>'+e(line.color)+' / '+e(line.size)+'</p><p>Quantity '+line.quantity+' × '+amountMoney(line.unitAmount)+'</p></div><strong>'+amountMoney(line.lineAmount)+'</strong></article>').join('');
  document.querySelector('#review-subtotal').textContent=amountMoney(quote.subtotalAmount);
 }catch(failure){
  if(current!==version)return;
  status.textContent='Your bag is still saved.';
  error.textContent=failure.name==='AbortError'?'The preview server didn’t respond. Please try again.':failure.message;
  items.innerHTML='<a class="commerce-secondary" href="bag.html">Return to your bag ?</a><button class="commerce-secondary" id="retry-quote" type="button">Try again</button>';
  document.querySelector('#retry-quote').addEventListener('click',render);
 }finally{clearTimeout(timeout);}
}
window.addEventListener('bagchange',render);window.addEventListener('storage',render);render();
window.addEventListener('pagehide',()=>controller?.abort());




