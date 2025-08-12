// Minimal JS for interactions: burger, mobile menu, counters, card details, smooth scroll
document.addEventListener('DOMContentLoaded', function() {
 // year in footer
 document.getElementById('year').textContent = new Date().getFullYear();
 // BURGER
 const burger = document.getElementById('burger');
 const mobileMenu = document.getElementById('mobileMenu');
 burger.addEventListener('click', () => {
   const open = mobileMenu.classList.toggle('open');
   mobileMenu.setAttribute('aria-hidden', !open);
   burger.classList.toggle('open');
 });
 // Close mobile when click link
 mobileMenu.querySelectorAll('a').forEach(a => {
   a.addEventListener('click', () => {
     mobileMenu.classList.remove('open');
     mobileMenu.setAttribute('aria-hidden', 'true');
     burger.classList.remove('open');
   });
 });
 // Smooth scroll for internal links
 document.querySelectorAll('a[href^="#"]').forEach(a => {
   a.addEventListener('click', function(e) {
     const target = document.querySelector(this.getAttribute('href'));
     if(target){
       e.preventDefault();
       target.scrollIntoView({behavior:'smooth', block:'start'});
     }
   });
 });
 // STATS counter animation when visible
 const counters = document.querySelectorAll('.stat-number');
 const runCounter = el => {
   const target = +el.getAttribute('data-target');
   const duration = 1500;
   const start = 0;
   const stepTime = Math.max(10, Math.floor(duration / (target || 100)));
   let current = start;
   const step = () => {
     // easing
     current += Math.max(1, Math.floor((target - current) * 0.12));
     if(current >= target) current = target;
     // display with thousands separator for big numbers
     el.textContent = current.toLocaleString('ru-RU');
     if(current < target) requestAnimationFrame(step);
   };
   requestAnimationFrame(step);
 };
 const obs = new IntersectionObserver(entries => {
   entries.forEach(entry => {
     if(entry.isIntersecting){
       const el = entry.target;
       if(!el.dataset.animated){
         runCounter(el);
         el.dataset.animated = 'true';
       }
     }
   });
 }, {threshold:0.6});
 counters.forEach(c => obs.observe(c));
 // Service cards details toggle
 document.querySelectorAll('.details-btn').forEach(btn => {
   btn.addEventListener('click', function(){
     const details = this.nextElementSibling;
     const expanded = this.getAttribute('aria-expanded') === 'true';
     if(expanded){
       details.hidden = true;
       this.setAttribute('aria-expanded', 'false');
     } else {
       details.hidden = false;
       this.setAttribute('aria-expanded', 'true');
       // scroll into view smoothly on small screens
       setTimeout(()=> details.scrollIntoView({behavior:'smooth', block:'nearest'}), 200);
     }
   });
 });
 // Accessibility: close mobile menu on Escape
 document.addEventListener('keydown', (e) => {
   if(e.key === 'Escape'){
     mobileMenu.classList.remove('open');
     mobileMenu.setAttribute('aria-hidden', 'true');
     burger.classList.remove('open');
   }
 });
 // Add simple animation for hero elements (CSS light fallback)
 setTimeout(() => {
   document.querySelectorAll('.hero .display, .hero .lead, .hero .hero-actions').forEach((el,i) => {
     el.style.transform = 'translateY(0)';
     el.style.opacity = '1';
   });
 }, 200);
});