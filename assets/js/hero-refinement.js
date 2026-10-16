/* RandA slideshow: background-only cinematic cross-fade. No arrow controls. */
(()=>{
  'use strict';
  const hero=document.querySelector('body[data-page="home"] .ref-hero');
  if(!hero)return;
  const layers=Array.from(hero.querySelectorAll('.randa-slide'));
  if(layers.length!==2)return;
  const photos=['hero-reference.webp','beach.webp','safari.webp'];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible=true,active=0,index=0,loading=false,timer;
  const photoURL=name=>`assets/images/${name}`;
  const preload=(url)=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(true);im.onerror=()=>resolve(false);im.src=url;});
  // Warm up likely next scene as soon as the browser is ready.
  if(!reduced.matches)preload(photoURL(photos[1]));
  async function rotate(){
    if(!visible||document.hidden||reduced.matches||loading)return;
    loading=true;
    const next=(index+1)%photos.length;
    const url=photoURL(photos[next]);
    const ready=await preload(url);
    if(ready&&!document.hidden&&!reduced.matches){
      const incoming=1-active;
      layers[incoming].style.backgroundImage=`url("${url}")`;
      layers[incoming].classList.add('randa-slide-active');
      layers[active].classList.remove('randa-slide-active');
      active=incoming;index=next;
    }
    loading=false;
  }
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false},{threshold:.05});io.observe(hero);
  }
  const start=()=>{clearInterval(timer);if(!reduced.matches)timer=setInterval(rotate,6500)};
  start();
  reduced.addEventListener?.('change',start);
  // Hide the floating contact button only while it would overlap search action on mobile.
  const submit=document.querySelector('#hero-search .ref-search-submit');
  if(submit&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      document.body.classList.toggle('randa-search-button-visible',Boolean(entries[0]?.isIntersecting));
    },{threshold:.25});io.observe(submit);
  }
})();
