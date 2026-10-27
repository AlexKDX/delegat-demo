// Короткие карточки + подробности по кнопке «+» (пульсирующий круг).
// Услуги открываются в окне по центру (на телефоне — на месте), кейсы и команда — на месте. «Как работаем» не сворачивается.
(() => {
  const narrow = () => innerWidth <= 600;
  const esc = t => String(t).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const GROUPS = [
    {sel: '.svc>article:not(.more)', box: c => c, det: '.ch,p', modal: true},
    {sel: '.case', box: c => c.querySelector('.case-txt'), det: 'dl'},
    {sel: '.cases>article', box: c => c, det: 'dl'},
    {sel: '.team>article:not(.join)', box: c => c.querySelector(':scope>div:last-child'), det: 'p:not(.teaser),.award,.quote'},
  ];
  const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  GROUPS.forEach(g => document.querySelectorAll(g.sel).forEach(card => {
    const box = g.box(card);
    const parts = [...box.children].filter(el => el.matches(g.det));
    if (!parts.length) return;
    const det = document.createElement('div'), inner = document.createElement('div');
    det.className = 'det'; inner.className = 'det-in'; det.append(inner);
    parts[0].before(det); parts.forEach(el => inner.append(el));
    const kp = card.dataset.kp && (window.KP || {})[card.dataset.kp];
    if (kp) {
      // подробности услуги берём из КП: что делает и срок — одно место правды
      inner.insertAdjacentHTML('beforeend', `<ul class="det-list">${kp.does.slice(0, 4).map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="det-term">Срок: <b>${esc(kp.term)}</b></p>`);
      const acts = document.createElement('div');
      acts.className = 'det';
      acts.innerHTML = `<div class="det-in"><div class="det-acts"><a class="svc-cta" href="#form" data-service="${esc(kp.title)}">Оставить заявку</a><a class="kp-btn" href="kp.html?s=${card.dataset.kp}" target="_blank" rel="noopener">Открыть КП <span aria-hidden="true">↗</span></a></div></div>`;
      (card.querySelector('.price') || inner).after(acts);
    }
    card.classList.add('xc');
    if (g.modal) card.dataset.modal = '';
    box.insertAdjacentHTML('beforeend', `<button class="more-btn" type="button" aria-expanded="false"><span class="mb-ic">${ICON}</span><span class="mb-t">Подробнее</span></button>`);
  }));

  // окно для услуг: один <dialog> на страницу
  const dlg = document.createElement('dialog');
  dlg.className = 'xd';
  dlg.innerHTML = '<button class="xd-close" type="button" aria-label="Закрыть">×</button><div class="xd-body"></div>';
  document.body.append(dlg);
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.xd-close') || e.target.closest('.svc-cta')) dlg.close(); });
  const openModal = card => {
    const c = card.cloneNode(true);
    c.classList.add('open'); c.classList.remove('rv');
    c.querySelector('.more-btn')?.remove();
    // обёртка с классом родителя (.svc), чтобы копия выглядела как на странице
    const wrap = document.createElement('div');
    wrap.className = card.parentElement.className + ' xd-wrap';
    wrap.append(c);
    dlg.querySelector('.xd-body').replaceChildren(wrap);
    dlg.showModal();
  };

  const toggle = card => {
    const open = !card.classList.contains('open');
    card.classList.toggle('open', open);
    const b = card.querySelector('.more-btn');
    b.setAttribute('aria-expanded', open);
    b.querySelector('.mb-t').textContent = open ? 'Свернуть' : 'Подробнее';
  };

  document.addEventListener('click', e => {
    const card = e.target.closest('.xc');
    if (!card || e.target.closest('dialog')) return;
    if (!e.target.closest('.more-btn') && e.target.closest('a,button,input,textarea,label')) return;
    'modal' in card.dataset && !narrow() ? openModal(card) : toggle(card);
  });
})();
