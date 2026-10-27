// Короткие карточки + подробности по кнопке «+». Тестовая страница: ?d=1..5 — способ раскрытия, ?p=1..5 — вид кнопки.
// ponytail: переключатели только для выбора; после выбора оставить один способ и один вид кнопки, остальное удалить.
(() => {
  const q = new URLSearchParams(location.search);
  const pick = (k, def) => { const n = +q.get(k); return n >= 1 && n <= 5 ? n : def; };
  const D = pick('d', 2), P = pick('p', 1);
  const root = document.documentElement;
  root.dataset.d = D; root.dataset.p = P;
  const narrow = () => innerWidth <= 600;

  // что прятать в каждой карточке и как подписать кнопку
  const GROUPS = [
    {sel: '.how>li', box: c => c, det: 'p,ul', label: 'Что входит'},
    {sel: '.svc>article:not(.more)', box: c => c, det: '.ch,p', label: 'Подробнее и КП'},
    {sel: '.case', box: c => c.querySelector('.case-txt'), det: 'dl', label: 'Задача и решение'},
    {sel: '.cases>article', box: c => c, det: 'dl', label: 'Задача и решение'},
    {sel: '.team>article:not(.join)', box: c => c.querySelector(':scope>div:last-child'), det: 'p,.award,.quote', label: 'О человеке'},
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
      const esc = t => t.replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
      inner.insertAdjacentHTML('beforeend', `<ul class="det-list">${kp.does.slice(0, 4).map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="det-term">Срок: <b>${esc(kp.term)}</b></p>`);
      // кнопки — под ценой, в отдельном раскрывающемся блоке
      const acts = document.createElement('div');
      acts.className = 'det';
      acts.innerHTML = `<div class="det-in"><div class="det-acts"><a class="svc-cta" href="#form" data-service="${esc(kp.title)}">Оставить заявку</a><a class="kp-btn" href="kp.html?s=${card.dataset.kp}" target="_blank" rel="noopener">Открыть КП <span aria-hidden="true">↗</span></a></div></div>`;
      (card.querySelector('.price') || inner).after(acts);
    }
    card.classList.add('xc');
    box.insertAdjacentHTML('beforeend', `<button class="more-btn" type="button" aria-expanded="false"><span class="mb-ic">${ICON}</span><span class="mb-t" data-open="${g.label}">${P === 5 ? g.label : 'Подробнее'}</span></button>`);
  }));

  // окно (2) и боковая панель (3): один <dialog> на всю страницу
  const dlg = document.createElement('dialog');
  dlg.className = 'xd';
  dlg.innerHTML = '<button class="xd-close" type="button" aria-label="Закрыть">×</button><div class="xd-body"></div>';
  document.body.append(dlg);
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.xd-close') || e.target.closest('.svc-cta')) dlg.close(); });
  const showIn = (holder, card) => {
    const c = card.cloneNode(true);
    c.classList.add('open'); c.classList.remove('rv');
    c.querySelector('.more-btn')?.remove();
    // обёртка с классом родителя (.svc, .how, .team…), чтобы копия выглядела как на странице
    const wrap = document.createElement(card.parentElement.tagName === 'OL' ? 'ol' : 'div');
    wrap.className = card.parentElement.className + ' xd-wrap';
    wrap.append(c);
    holder.replaceChildren(wrap);
  };

  // «список + панель» для услуг (5, только на широком экране)
  let panel = null;
  const svc = document.querySelector('.svc');
  if (D === 5 && svc) {
    panel = document.createElement('aside');
    panel.className = 'svc-panel';
    svc.append(panel);
    const first = svc.querySelector('.xc');
    if (first) { first.classList.add('sel'); showIn(panel, first); }
  }

  const setBtn = (card, open) => {
    const b = card.querySelector('.more-btn'); if (!b) return;
    b.setAttribute('aria-expanded', open);
    const t = b.querySelector('.mb-t');
    t.textContent = open ? 'Свернуть' : (P === 5 ? t.dataset.open : 'Подробнее');
  };
  const toggleInline = card => {
    const open = !card.classList.contains('open');
    card.classList.toggle('open', open);
    if (D === 4) card.classList.toggle('wide', open && !narrow());
    setBtn(card, open);
  };
  const reveal = card => {
    if (narrow() || D === 1 || D === 4) return toggleInline(card);
    if (D === 5) {
      if (panel && card.closest('.svc')) {
        svc.querySelectorAll('.xc.sel').forEach(c => c.classList.remove('sel'));
        card.classList.add('sel'); showIn(panel, card); return;
      }
      return toggleInline(card);
    }
    dlg.classList.toggle('drawer', D === 3);
    showIn(dlg.querySelector('.xd-body'), card);
    dlg.showModal();
  };

  document.addEventListener('click', e => {
    const card = e.target.closest('.xc');
    if (!card || e.target.closest('dialog,.svc-panel')) return;
    if (e.target.closest('.more-btn') || !e.target.closest('a,button,input,textarea,label')) reveal(card);
  });

  // переключатель вариантов (только на тестовой странице)
  const NAMES_D = ['', 'На месте', 'Окно по центру', 'Панель сбоку', 'Карточка на всю ширину', 'Список + панель'];
  const NAMES_P = ['', 'Кнопка «Подробнее»', 'Пульсирующий круг', 'Плюс + подсказка', 'Полоса снизу', 'Ссылка со стрелкой'];
  const link = (d, p) => `?d=${d}&p=${p}`;
  document.body.insertAdjacentHTML('beforeend', `<nav class="vsw" aria-label="Варианты">
    <div><b>Раскрытие</b>${[1, 2, 3, 4, 5].map(i => `<a href="${link(i, P)}"${i === D ? ' class="on"' : ''} title="${NAMES_D[i]}">${i}</a>`).join('')}<em>${NAMES_D[D]}</em></div>
    <div><b>Кнопка</b>${[1, 2, 3, 4, 5].map(i => `<a href="${link(D, i)}"${i === P ? ' class="on"' : ''} title="${NAMES_P[i]}">${i}</a>`).join('')}<em>${NAMES_P[P]}</em></div></nav>`);
})();
