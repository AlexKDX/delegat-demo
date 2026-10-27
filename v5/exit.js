// Окно «Не уходите с пустыми руками»: чек-лист через Telegram-бота (бот сам пишет ник в админку).
// ПК — мышь ушла за верхний край окна; телефон — резкий скролл вверх или 45 с после блока услуг.
// Показываем один раз в 14 дней и не показываем тем, кто начал заполнять форму.
(() => {
  const KEY = 'vostokai-exit', DAYS = 14, BOT = 'https://t.me/VostokAI_VL_BOT?start=checklist';
  let last = 0; try { last = +localStorage.getItem(KEY) || 0; } catch (e) {}
  if (Date.now() - last < DAYS * 864e5) return;

  let armed = false, done = false;
  setTimeout(() => { armed = true; }, 8000);
  document.getElementById('leadForm')?.addEventListener('focusin', () => { done = true; });

  const dlg = document.createElement('dialog');
  dlg.className = 'xd ex';
  dlg.setAttribute('aria-labelledby', 'exT');
  dlg.innerHTML = `<button class="xd-close" type="button" aria-label="Закрыть">×</button>
<div class="ex-in">
  <img src="img/checklist-cover.webp" alt="Обложка чек-листа «10 рутинных задач, которые можно передать ИИ»" width="400" height="566" loading="lazy">
  <div>
    <span class="ex-k">Подождите!</span>
    <h3 id="exT">Не уходите с пустыми руками</h3>
    <p>Заберите бесплатный чек-лист <b>«10 рутинных задач, которые можно передать ИИ уже сейчас»</b>. Отметьте свои пункты — за 5 минут увидишь, где команда тратит часы на ручную работу.</p>
    <a class="ex-go" href="${BOT}" target="_blank" rel="noopener">Получить в Telegram <span aria-hidden="true">↗</span></a><button class="ex-no" type="button">Нет, спасибо</button>
    <small>PDF пришлёт наш бот @VostokAI_VL_BOT. Он сохранит ваш ник в Telegram, чтобы мы могли ответить на вопросы (<a href="policy.html">политика</a>). Удалить данные — команда /stop в боте.</small>
  </div>
</div>`;
  document.body.append(dlg);
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.xd-close,.ex-no,.ex-go')) dlg.close(); });

  const show = () => {
    if (!armed || done || document.querySelector('dialog[open]')) return;
    done = true;
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    dlg.showModal();
  };

  document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY <= 0) show(); });

  if (matchMedia('(pointer: coarse)').matches) {
    let y = scrollY, t = performance.now();
    addEventListener('scroll', () => {
      const now = performance.now();
      if (y > 1200 && y - scrollY > 250 && now - t < 350) show();  // резкий скролл вверх — похоже на «ухожу»
      if (now - t > 120) { y = scrollY; t = now; }
    }, {passive: true});
    const svc = document.getElementById('services');
    if (svc) new IntersectionObserver((es, io) => {
      if (es[0].isIntersecting) { io.disconnect(); setTimeout(show, 45000); }
    }).observe(svc);
  }
})();
