const progress=document.getElementById('progress'); 
const themeBtn=document.getElementById('themeBtn'); 
const hamb=document.getElementById('hamb'); 
const mobileNav=document.getElementById('mobileNav'); 
const glow=document.getElementById('cursorGlow'); 
 
function updateScrollUI(){ 
  const h=document.documentElement.scrollHeight-window.innerHeight; 
  if(progress) progress.style.width=(h>0 ? (window.scrollY/h*100) : 0)+'%'; 
 
  document.querySelectorAll('.desktop-nav a').forEach(a=>{ 
    const s=document.querySelector(a.getAttribute('href')); 
    if(s){ 
      const r=s.getBoundingClientRect(); 
      a.classList.toggle('active',r.top<140 && r.bottom>140); 
    } 
  }); 
} 
window.addEventListener('scroll',updateScrollUI,{passive:true}); 
updateScrollUI(); 
 
if(themeBtn){
  const syncThemeButton=()=>{
    const dark=document.body.classList.contains('dark');
    themeBtn.textContent=dark?'☀':'◐';
    themeBtn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
  };
  if(localStorage.getItem('aliaa-theme-v3')==='dark') document.body.classList.add('dark');
  syncThemeButton();
  themeBtn.onclick=()=>{
    document.body.classList.toggle('dark');
    localStorage.setItem('aliaa-theme-v3',document.body.classList.contains('dark')?'dark':'light');
    syncThemeButton();
  };
} 
 
if(hamb && mobileNav){ 
  hamb.onclick=()=>mobileNav.classList.toggle('open'); 
  mobileNav.querySelectorAll('a').forEach(a=>a.onclick=()=>mobileNav.classList.remove('open')); 
} 
 
const observer=new IntersectionObserver(entries=>{ 
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}); 
},{threshold:.08}); 
document.querySelectorAll('.reveal').forEach(x=>observer.observe(x)); 
 
if(window.matchMedia('(pointer:fine)').matches && glow){ 
  window.addEventListener('pointermove',e=>{ 
    glow.style.left=e.clientX+'px'; 
    glow.style.top=e.clientY+'px'; 
  },{passive:true}); 
} 
 
const lightbox=document.getElementById('lightbox'); 
const lbImg=document.getElementById('lightboxImg'); 
 
document.querySelectorAll('.image-slot').forEach(slot=>{ 
  const path=slot.dataset.image; 
  if(!path) return; 
 
  const img=new Image(); 
  img.onload=()=>{ 
    slot.style.setProperty('--shot',`url("${path}")`); 
    slot.classList.add('has-image'); 
  }; 
  img.src=path; 
 
  slot.onclick=()=>{ 
    if(slot.classList.contains('has-image') && lightbox && lbImg){ 
      lbImg.src=path; 
      lightbox.classList.add('open'); 
      document.body.style.overflow='hidden'; 
    } 
  }; 
}); 
 
function closeLightbox(){ 
  if(!lightbox) return; 
  lightbox.classList.remove('open'); 
  document.body.style.overflow=''; 
} 
document.getElementById('closeLightbox')?.addEventListener('click',closeLightbox); 
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()}); 
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()}); 
 
const filters=document.querySelectorAll('.filter');
const items=document.querySelectorAll('.project-item');
filters.forEach(btn=>btn.addEventListener('click',()=>{
  filters.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const f=btn.dataset.filter;
  items.forEach(item=>item.classList.toggle('hidden',f!=='all' && item.dataset.category!==f));
  const visible=[...items].filter(item=>!item.classList.contains('hidden'));
  visible.forEach((item,index)=>{
    const number=item.querySelector('.project-number');
    if(number){
      const label=number.textContent.replace(/^\d+\s*[·.]\s*/,'');
      number.textContent=String(index+1).padStart(2,'0')+' · '+label;
    }
  });
}));
