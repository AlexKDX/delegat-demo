// Блоки главной под сценой: появление при прокрутке, логотип в подвале, форма заявки.
(() => {
  // same logo as the header
  const hdr = document.querySelector('.top .logo svg');
  if (hdr) document.querySelector('.foot .logo').prepend(hdr.cloneNode(true));

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.utils.toArray('[data-rv]').forEach(el => gsap.from(el, {
      y: 40, autoAlpha: 0, duration: .8, ease: 'power3.out',
      scrollTrigger: {trigger: el, start: 'top 88%', once: true},
    }));
  }

  // Mobile layout variants (phones only, CSS in mobile.css): ?m=1..5
  // ponytail: query switch is for choosing; after the pick, hardcode the winner and delete the rest.
  const M = new URLSearchParams(location.search).get('m');
  if (/^[1-5]$/.test(M || '')) {
    document.documentElement.dataset.m = M;
    if (M === '2') ['.how', '.svc', '.cases', '.team'].forEach(sel => { const el = document.querySelector(sel); el && el.insertAdjacentHTML('afterend', '<div class="swipe">Листайте</div>'); });
    if (M === '3') {
      document.querySelectorAll('.how>li, .svc>article:not(.more), .case, .cases>article, .team>article').forEach(el => el.setAttribute('data-acc', ''));
      document.querySelectorAll('.team>article h3').forEach(h => h.classList.add('acc-h'));
      document.addEventListener('click', e => { const el = e.target.closest('[data-acc]'); if (el && innerWidth <= 600 && !e.target.closest('a,button,input,textarea')) el.classList.toggle('open'); });
    }
    if (M === '5') {
      const I = {how: '<path d="M4 6h16M4 12h10M4 18h6"/>', services: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>', cases: '<path d="M4 8h16v11H4zM9 8V5h6v3"/>', about: '<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.7-3 2.9-4.5 5.5-4.5s4.8 1.5 5.5 4.5M15 15c2.6 0 4.6 1.2 5.3 4"/>', form: '<path d="M5 12l5 5L20 7"/>'};
      const T = [['how', 'Процесс'], ['services', 'Услуги'], ['cases', 'Кейсы'], ['about', 'Команда'], ['form', 'Разбор']];
      document.body.insertAdjacentHTML('beforeend', `<nav class="tabbar" aria-label="Разделы">${T.map(([id, t]) => `<a href="#${id}"${id === 'form' ? ' class="cta"' : ''}><svg viewBox="0 0 24 24">${I[id]}</svg>${t}</a>`).join('')}</nav>`);
      const links = [...document.querySelectorAll('.tabbar a:not(.cta)')];
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id)); }), {rootMargin: '-45% 0px -50% 0px'});
      ['how', 'services', 'cases', 'about'].forEach(id => io.observe(document.getElementById(id)));
    }
  }

  // Forms → mini-backend on our VPS (Telegram bot). Until it exists, say so honestly.
  // ponytail: endpoint empty until the VPS is up; then set FORM_URL and the server re-checks honeypot + timing.
  const FORM_URL = '', t0 = Date.now();
  document.querySelectorAll('form.lead-form').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = form.querySelector('.ok'), d = Object.fromEntries(new FormData(form));
    const done = () => { msg.className = 'ok good'; msg.textContent = form.dataset.kind === 'join' ? 'Спасибо! Посмотрим и напишем тебе.' : 'Спасибо! Свяжемся с вами в течение рабочего дня.'; form.reset(); };
    msg.className = 'ok';
    if (!d.name.trim() || !d.contact.trim()) { msg.textContent = 'Заполните имя и телефон или Telegram.'; (d.name.trim() ? form.contact : form.name).focus(); return; }
    // bots: hidden field filled or sent faster than a human types → pretend success, send nothing
    if (d.company || Date.now() - t0 < 3000) return done();
    if (!FORM_URL) { msg.textContent = 'Форма заработает после запуска сайта. Совсем скоро.'; return; }
    try {
      const r = await fetch(FORM_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...d, kind: form.dataset.kind || 'audit', ms: Date.now() - t0})});
      if (!r.ok) throw 0;
      done();
    } catch { msg.textContent = 'Не получилось отправить. Попробуйте ещё раз через минуту.'; }
  }));
})();
