// Блоки главной под сценой: появление при прокрутке, логотип в подвале, форма заявки.
(() => {
  // same logo as the header
  const hdr = document.querySelector('.top .logo svg');
  if (hdr) document.querySelector('.foot .logo').prepend(hdr.cloneNode(true));

  // cookie notice (152-ФЗ): shown until accepted; remembered for 180 days
  const COOKIE_KEY = 'vostokai-cookie-ok';
  let seen = 0; try { seen = +localStorage.getItem(COOKIE_KEY) || 0; } catch (e) {}
  if (Date.now() - seen > 180 * 864e5) {
    document.body.insertAdjacentHTML('beforeend', '<div class="cookie" role="region" aria-label="Уведомление о cookie"><span>Продолжая пользоваться сайтом, вы соглашаетесь с <a href="policy.html">политикой обработки персональных данных</a> и использованием cookie-файлов.</span><button type="button">Хорошо</button></div>');
    const bar = document.body.lastElementChild;
    bar.querySelector('button').addEventListener('click', () => { try { localStorage.setItem(COOKIE_KEY, String(Date.now())); } catch (e) {} bar.remove(); });
  }

  // reveal on scroll: one IntersectionObserver + CSS transition (cheaper than a ScrollTrigger per block)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -12% 0px'});
    document.querySelectorAll('[data-rv]').forEach(el => { el.classList.add('rv'); io.observe(el); });
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
    // phones: every card is an accordion; wider screens: only service cards open (to reveal the request button)
    if (el && (innerWidth <= 600 || el.closest('.svc')) && !e.target.closest('a,button,input,textarea')) el.classList.toggle('open');
  });

  // Forms → mini-backend on our VPS (Telegram bot). Until it exists, say so honestly.
  // On vostokai.ru the form talks to our API (server/form_api.py); on the GitHub demo it stays off.
  const LIVE = /(^|\.)vostokai\.ru$/.test(location.hostname), FORM_URL = LIVE ? '/api/lead' : '';
  // signed time-trap token: fetched on page load, so its age = time on page (autofill + fast submit still passes the 3 s check)
  let tokenP = null;
  const getToken = () => tokenP || (tokenP = fetch('/api/token', {cache: 'no-store'}).then(r => r.json()).then(j => j.t).catch(() => { tokenP = null; return ''; }));
  if (LIVE) getToken();
  document.querySelectorAll('form.lead-form').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = form.querySelector('.ok'), d = Object.fromEntries(new FormData(form));
    const done = () => { form.querySelector('.consent').classList.remove('err'); msg.className = 'ok good'; msg.textContent = form.dataset.kind === 'join' ? 'Спасибо! Посмотрим и напишем тебе.' : 'Спасибо! Свяжемся с вами в течение рабочего дня.'; form.reset(); };
    msg.className = 'ok';
    if (!d.name.trim() || !d.contact.trim()) { msg.textContent = 'Заполните имя и телефон или Telegram.'; (d.name.trim() ? form.contact : form.name).focus(); return; }
    // 152-ФЗ: без согласия заявку не принимаем (галочка не отмечена по умолчанию)
    const box = form.querySelector('.consent');
    box.classList.toggle('err', !form.consent.checked);
    if (!form.consent.checked) { msg.textContent = 'Отметьте согласие на обработку персональных данных.'; form.consent.focus(); return; }
    // bots: hidden field filled or sent faster than a human types → pretend success, send nothing.
    // The field is named hp_note on purpose: a field called «company» gets filled by browser autofill → real leads were lost.
    if (d.hp_note) return done();  // слишком быструю отправку отсекает сервер (подписанный токен)
    if (!FORM_URL) { msg.textContent = 'Форма заработает после запуска сайта. Совсем скоро.'; return; }
    const btn = form.querySelector('button[type=submit]');
    if (btn.disabled) return;
    btn.disabled = true; msg.textContent = 'Отправляем…';
    try {
      const r = await fetch(FORM_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...d, consent: true, ads: !!(form.ads && form.ads.checked), kind: form.dataset.kind || 'audit', t: await getToken()})});
      const j = await r.json().catch(() => ({}));
      if (r.status === 422) { msg.textContent = j.error || 'Проверьте поля формы.'; return; }  // ошибка в полях — человек исправит
      if (!r.ok) throw 0;
      done();
    } catch { msg.textContent = 'Не получилось отправить. Напишите нам в Telegram — ссылка рядом с формой.'; }
    finally { btn.disabled = false; }
  }));
})();
