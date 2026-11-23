
const DUMMY=document.createElement('div');DUMMY.style.setProperty=()=>{};const $=id=>document.getElementById(id)||DUMMY;
const f0=n=>Math.round(n).toLocaleString('uk-UA');
const pct=v=>String(v).replace('.',',');
const yr=y=>y+' '+(y===1?'рік':(y>=2&&y<=4?'роки':'років'));
/* як у графіку «Республіки» від 19.11.2026: після ключів залишок ділиться на рівні частини, і платіж щомісяця росте; 6% річних = +0,48% на місяць */
const grow=r=>r?Math.floor((Math.pow(1+r/100,1/12)-1)*1e4)/1e4:0;
const LBL={area:v=>pct(v)+' м²',price:v=>f0(v)+' ₴',fp:v=>v+'%',n1:v=>String(v),n2:v=>String(v),rate:v=>pct(v)+'%'};
const ids=Object.keys(LBL);
function fill(el){el.style.setProperty('--p',((el.value-el.min)/(el.max-el.min)*100)+'%')}
function place(){if(!document.getElementById('kd'))return;const s3=$('s3'),bar=s3.parentNode,x=s3.offsetLeft-bar.offsetLeft-2,W=bar.offsetWidth,w=$('kl').offsetWidth/2;
  $('kd').style.left=x+'px';$('kl').style.left=Math.min(Math.max(x,w+72),W-w-72)+'px'}
function calc(){
  const v={};ids.forEach(k=>{const el=$(k);v[k]=+el.value;fill(el);const t=LBL[k](v[k]);$(k+'-v').textContent=t;el.setAttribute('aria-valuetext',t)});
  const P=v.area*v.price,F=P*v.fp/100,K=P/2,pre=K-F,R=P-K,n2=v.n2*12,g=grow(v.rate);
  const m1=pre/v.n1,m2=R/n2,last=m2*Math.pow(1+g,n2-1),after=g?m2*(Math.pow(1+g,n2)-1)/g:R,mk=after-R;
  $('o-m1').innerHTML=f0(m1)+'<small>₴</small>';
  $('o-m1s').textContent=v.n1+' міс, рівно';
  $('o-m2').innerHTML=f0(m2)+'<small>₴</small>';
  $('o-m2s').textContent=g?'росте до '+f0(last)+' ₴':yr(v.n2)+', рівно';
  $('o-p').textContent=f0(P)+' ₴';
  $('o-f').textContent=F?f0(F)+' ₴':'немає';
  $('o-mk').textContent=mk>0.5?f0(mk)+' ₴':'немає';
  $('o-mks').textContent=mk>0.5?pct((mk/P*100).toFixed(1))+'% від ціни':'';
  $('o-t').textContent=f0(P+mk)+' ₴';
  $('sm1').textContent=f0(m1)+' ₴';$('sm2').textContent=f0(m2)+' ₴';
  /* схема */
  $('s1').hidden=!v.fp;$('s1b').textContent=v.fp+'%';$('s2b').textContent=(50-v.fp)+'%';
  $('s1').style.flexGrow=v.fp;$('s2').style.flexGrow=50-v.fp;$('s3').style.flexGrow=50;
  $('s2').hidden=v.fp>=50;
  $('s3s').textContent=v.rate?'після ключів, +'+pct(v.rate)+'%':'після ключів';
  $('s3').classList.toggle('free',!v.rate);
  $('leg2').hidden=!v.rate;
  $('kls').textContent='через '+v.n1+' міс';
  $('kcs').textContent='ще '+yr(v.n2);
  requestAnimationFrame(place);
}
document.querySelectorAll('.seg').forEach(s=>{s.style.flexBasis='0';s.style.flexShrink='1'});
ids.forEach(k=>$(k).addEventListener('input',calc));
addEventListener('resize',place);$('s3').addEventListener('transitionend',place);
const segs=document.querySelectorAll('.seg');segs.forEach(x=>x.style.transition='none');
calc();
requestAnimationFrame(()=>requestAnimationFrame(()=>segs.forEach(x=>x.style.transition='')));
