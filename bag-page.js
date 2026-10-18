import './shell.js?v=mvdca7wb';
import {getSavedBagSummary,lineMarkup,handleBagAction} from './bag.js?v=mvdca7wb';
import {amountMoney} from './catalog.js?v=mvdca7wb';
const root=document.querySelector('.commerce-main');
function render(){
 const focused=document.activeElement,action=focused?.dataset?.bagAction,key=focused?.dataset?.lineKey;
 const summary=getSavedBagSummary();document.querySelector('#bag-page-count').textContent=summary.count+' '+(summary.count===1?'piece':'pieces')+' in your bag';
 document.querySelector('#bag-page-items').innerHTML=summary.lines.length?summary.lines.map(line=>lineMarkup(line)).join(''):'<div class="empty-order"><h2>Your next expression<br>is waiting.</h2><p>Explore the collection and find your piece.</p><a class="commerce-primary" href="astrology.html#pieces">Explore Astrology →</a></div>';
 document.querySelector('#page-subtotal').textContent=amountMoney(summary.subtotalAmount);
 document.querySelector('#review-order').hidden=!summary.canReview;
 const unavailable=document.querySelector('#review-unavailable');unavailable.hidden=summary.canReview||!summary.lines.length;
 unavailable.textContent=summary.lines.some(line=>line.needsOptions)?'Choose options to continue':'Remove unavailable pieces';
 document.querySelector('#bag-review-note').textContent=summary.lines.some(line=>line.needsOptions)?'Choose a size for each saved piece before reviewing your order.':summary.lines.some(line=>!line.available)?'A piece is currently unavailable. Edit or remove it to continue.':'Your selected sizes and colors are saved in this browser.';
 if(action){const next=[...root.querySelectorAll('[data-bag-action]')].find(button=>button.dataset.bagAction===action&&button.dataset.lineKey===key);(next||document.querySelector('.commerce-heading h1')).focus?.({preventScroll:true});}
}
root.addEventListener('click',event=>handleBagAction(event,root));
window.addEventListener('bagchange',render);window.addEventListener('storage',render);render();
