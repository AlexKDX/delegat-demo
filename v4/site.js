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

  // Form → mini-backend on our VPS (Telegram bot). Until it exists, say so honestly.
  // ponytail: endpoint empty until the VPS is up; then set FORM_URL and the server re-checks honeypot + timing.
  const FORM_URL = '';
  const form = document.getElementById('leadForm'), msg = document.getElementById('formMsg'), t0 = Date.now();
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    msg.className = 'ok';
    if (!d.name.trim() || !d.contact.trim()) { msg.textContent = 'Заполните имя и телефон или Telegram.'; (d.name.trim() ? form.contact : form.name).focus(); return; }
    // bots: hidden field filled or sent faster than a human types → pretend success, send nothing
    if (d.company || Date.now() - t0 < 3000) { msg.className = 'ok good'; msg.textContent = 'Спасибо! Свяжемся с вами в течение рабочего дня.'; form.reset(); return; }
    if (!FORM_URL) { msg.textContent = 'Форма заработает после запуска сайта. Совсем скоро.'; return; }
    try {
      const r = await fetch(FORM_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...d, ms: Date.now() - t0})});
      if (!r.ok) throw 0;
      msg.className = 'ok good'; msg.textContent = 'Спасибо! Свяжемся с вами в течение рабочего дня.'; form.reset();
    } catch { msg.textContent = 'Не получилось отправить. Попробуйте ещё раз через минуту.'; }
  });
})();
