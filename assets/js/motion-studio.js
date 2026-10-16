/* RandA motion studio — uses existing site content; does not change markup or text. */
(()=>{
  'use strict';
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches || !('IntersectionObserver' in window)) return;
  // Avoid animating layout-critical elements such as navigation, search fields and controls.
  const selector = [
    '.ref-section-title','.ref-why-title','.section-head','.stories-header',
    '.exp-sec-head','.exp-library-header','.exp-intro',
    '.ref-trust','.features .feature','.tour-card','.service-card',
    '.destination-card','.ref-dest-card','.ref-why-card',
    '.exp-photo-card','.exp-review-grid .story-card',
    '.vehicle-card','.mission > *','.split-2 > *','.detail-grid > *',
    '.contact-grid > *','.banner-split > *','.exp-end',
    '.detail-header','.detail-photo',
    '.safari-gallery > *', '.highlights-grid > *'
  ].join(',');
  const seen = new WeakSet();
  const observer = new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      const el=entry.target;
      el.classList.remove('randa-motion-wait');
      el.classList.add('randa-motion-show');
      observer.unobserve(el);
    }
  },{rootMargin:'0px 0px -7% 0px',threshold:.035});
  const indexFor = el => {
    const parent=el.parentElement;
    if(!parent)return 0;
    let i=0;
    for(const sib of parent.children){if(sib===el)break;if(sib.matches(selector))i++;}
    return i;
  };
  function activate(root=document){
    const nodes=[];
    if(root.nodeType===1 && root.matches(selector))nodes.push(root);
    if(root.querySelectorAll)nodes.push(...root.querySelectorAll(selector));
    for (const el of nodes) {
      if(seen.has(el))continue;
      seen.add(el);
      // Elements already in view should not flash or be hidden at page startup.
      const box=el.getBoundingClientRect();
      const isNear=box.top < innerHeight*.87 && box.bottom>0;
      el.classList.add('randa-motion-pop');
      if(isNear){el.classList.add('randa-motion-show');continue;}
      el.style.setProperty('--randa-motion-delay',`${(indexFor(el)%4)*75}ms`);
      el.classList.add('randa-motion-wait');
      observer.observe(el);
    }
  }
  // Run after app.js has constructed the dynamic page.
  activate(document);
  let scheduled=false;
  // Experience filters/load-more replace their cards. Give those newly created
  // nodes the same reveal without needing to modify the filtering implementation.
  const main=document.getElementById('main');
  if (main && 'MutationObserver' in window) {
    const mutations=new MutationObserver(records=>{
      if(!records.some(r=>r.addedNodes.length))return;
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{scheduled=false;activate(main);});
    });
    mutations.observe(main,{childList:true,subtree:true});
  }
  const onPreferenceChange=()=>{
    if(media.matches){
      observer.disconnect();
      document.querySelectorAll('.randa-motion-wait').forEach(el=>{
        el.classList.remove('randa-motion-wait');
        el.classList.add('randa-motion-show');
      });
    }
  };
  media.addEventListener?.('change',onPreferenceChange);
})();
