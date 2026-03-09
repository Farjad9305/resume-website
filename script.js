/* script.js
   - Smooth scrolling
   - Reveal-on-scroll
   - Tiny avatar tilt effect
   - Lightweight particle background on canvas
*/

/* ------------------- Smooth scrolling ------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* ------------------- Reveal on scroll ------------------- */
const revealItems = () => {
  document.querySelectorAll('.section, .project, .timeline-item, .profile-card, .hero-left').forEach(el=>{
    const rect = el.getBoundingClientRect();
    const inView = rect.top < (window.innerHeight - 80);
    if(inView) el.style.transform = 'translateY(0px)', el.style.opacity = 1;
    else el.style.transform = 'translateY(12px)', el.style.opacity = 0;
  });
};
window.addEventListener('scroll', revealItems, {passive:true});
window.addEventListener('resize', revealItems);
document.addEventListener('DOMContentLoaded', ()=>{
  // initial setup: set hidden state & animate bars
  document.querySelectorAll('.section, .project, .timeline-item, .profile-card, .hero-left').forEach(el=>{
    el.style.transition = 'all 600ms cubic-bezier(.2,.9,.2,1)';
    el.style.transform = 'translateY(12px)';
    el.style.opacity = 0;
  });
  revealItems();

  // animate skill bar fills after short delay
  setTimeout(()=> {
    document.querySelectorAll('.bar-fill').forEach(el=>{
      const w = el.style.width || '80%';
      el.style.width = '0%';
      // small stagger
      setTimeout(()=> el.style.width = w, 120);
    });
  }, 600);
});

/* ------------------- Profile card tilt ------------------- */
const card = document.getElementById('profile-card');
if(card){
  card.addEventListener('mousemove', (e)=>{
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / (rect.width/2);
    const dy = (e.clientY - cy) / (rect.height/2);
    const rx = dy * 6;
    const ry = dx * -6;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform = '');
}

/* ------------------- Lightweight particle background ------------------- */
(function initParticles(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const COUNT = Math.floor((w*h) / 70000); // scales with screen size

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function create(){
    for(let i=0;i<COUNT;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: rand(-0.15,0.15),
        vy: rand(-0.05,0.05),
        r: rand(0.6,2.2),
        alpha: rand(0.06,0.18)
      });
    }
  }
  create();

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    // do not refill; keep existing particles
  }
  window.addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,w,h);
    // subtle gradient tint
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(124,58,237,0.02)');
    g.addColorStop(1, 'rgba(6,182,212,0.02)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(let p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -10) p.x = w+10;
      if(p.x > w+10) p.x = -10;
      if(p.y < -10) p.y = h+10;
      if(p.y > h+10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    // lightweight line connections
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<i+4 && j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist<120){
          ctx.strokeStyle = `rgba(255,255,255,${0.02 + (0.08*(1 - dist/120))})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();