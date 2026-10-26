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

  // Phones (≤600px, CSS in mobile.css): cards collapse to accordions, tap to open
  document.querySelectorAll('.how>li, .svc>article:not(.more), .case, .cases>article, .team>article').forEach(el => el.setAttribute('data-acc', ''));
  document.querySelectorAll('.team>article h3').forEach(h => h.classList.add('acc-h'));
  // a service card opened on a phone offers a request with the service already filled in
  document.querySelectorAll('.svc>article:not(.more)').forEach(el => el.insertAdjacentHTML('beforeend', '<a class="svc-cta" href="#form">Оставить заявку</a>'));
  document.addEventListener('click', e => {
    const cta = e.target.closest('.svc-cta');
    if (cta) { const pain = document.querySelector('#leadForm [name=pain]'); if (pain && !pain.value) pain.value = 'Интересует: ' + cta.closest('article').querySelector('h3').textContent; return; }
    const el = e.target.closest('[data-acc]');
    if (el && innerWidth <= 600 && !e.target.closest('a,button,input,textarea')) el.classList.toggle('open');
  });

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
