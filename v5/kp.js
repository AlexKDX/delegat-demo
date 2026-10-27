// Рендер КП из kp-data.js по ?s=<slug>. Три листа A4: обложка, предложение, как работаем + контакты.
(() => {
  const slug = new URLSearchParams(location.search).get('s');
  const k = (window.KP || {})[slug];
  const main = document.getElementById('kp');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  if (!k) {
    main.innerHTML = `<section class="sheet light"><h2>КП не найдено</h2><p>Выберите услугу на <a href="./#services">сайте</a>.</p></section>`;
    return;
  }
  document.title = `КП: ${k.title} · Восток AI`;
  document.getElementById('barTitle').textContent = k.title;
  document.getElementById('pdf').addEventListener('click', () => print());
  document.getElementById('req').addEventListener('click', () => { try { sessionStorage.setItem('vostokai-interest', k.title); } catch (e) {} });

  const sun = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="kpsea"><rect width="100" height="58"/></clipPath></defs><circle cx="50" cy="54" r="25" fill="#D97757" clip-path="url(#kpsea)"/><g fill="none" stroke-width="6" stroke-linecap="round"><path d="M10 58c6.7-5 13.3-5 20 0s13.3 5 20 0 13.3-5 20 0 13.3 5 20 0" stroke="#D97757"/><path d="M10 71c6.7-5 13.3-5 20 0s13.3 5 20 0 13.3-5 20 0 13.3 5 20 0" stroke="currentColor" opacity=".75"/><path d="M10 84c6.7-5 13.3-5 20 0s13.3 5 20 0 13.3-5 20 0 13.3 5 20 0" stroke="currentColor" opacity=".45"/></g></svg>`;
  const logo = `<div class="logo">${sun}<span>vostok<b>.ai</b></span></div>`;
  const li = a => a.map(x => `<li>${esc(x)}</li>`).join('');
  const date = new Date().toLocaleDateString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'});
  const contacts = `<div class="contacts"><a href="https://t.me/VostokAI_VL">Telegram: @VostokAI_VL</a><a href="mailto:vostokai@yandex.ru">vostokai@yandex.ru</a><a href="https://vostokai.ru">vostokai.ru</a></div>`;
  const steps = [
    ['Разбор', 'бесплатно, 1–2 часа', 'Говорим с вами и сотрудниками, смотрим, как устроен процесс сейчас.'],
    ['Предложение', '1–2 дня', 'Карта рутины, точная смета и сроки. Решаете — делаем или нет.'],
    ['Внедрение', k.term, 'Настраиваем, подключаем к вашим сервисам, проверяем на реальных данных.'],
    ['Запуск и сопровождение', 'дальше', 'Учим команду, следим за работой, дорабатываем по мере роста задач.'],
  ];

  main.innerHTML = `
  <section class="sheet cover">
    ${logo}
    <div class="cv-mid">
      <span class="kick">Коммерческое предложение</span>
      <h1>${esc(k.title)}</h1>
      <p class="tag">${esc(k.tagline)}</p>
    </div>
    <div class="cv-foot"><span>Владивосток · ${date}</span>${contacts}</div>
    <div class="glow"></div>
  </section>

  <section class="sheet light">
    <div class="sh-head">${logo}<span>${esc(k.title)}</span></div>
    <div class="pain"><span class="kick">Задача</span><p>${esc(k.pain)}</p></div>
    <div class="cols">
      <div><h2>Что делает решение</h2><ul class="checks">${li(k.does)}</ul></div>
      <div><h2>Что входит в работу</h2><ul class="dots">${li(k.includes)}</ul></div>
    </div>
    <div class="facts">
      <div class="fact acc"><span>Стоимость</span><b>${esc(k.price)}</b><small>${esc(k.priceNote)}</small></div>
      <div class="fact"><span>Срок</span><b>${esc(k.term)}</b><small>после согласования задачи</small></div>
    </div>
    <div class="cols">
      <div><h2>От чего зависит цена</h2><ul class="dots">${li(k.factors)}</ul></div>
      <div><h2>Что нужно от вас</h2><ul class="dots">${li(k.need)}</ul></div>
    </div>
  </section>

  <section class="sheet light">
    <div class="sh-head">${logo}<span>${esc(k.title)}</span></div>
    <h2>Как работаем</h2>
    <ol class="steps">${steps.map((s, i) => `<li><span class="n">0${i + 1}</span><b>${esc(s[0])}</b><em>${esc(s[1])}</em><p>${esc(s[2])}</p></li>`).join('')}</ol>
    <div class="why">
      <div><b>Делаем сами</b><span>Пишем код и настраиваем без подрядчиков — вы знаете, кто отвечает за результат.</span></div>
      <div><b>Данные в России</b><span>Серверы в РФ, соблюдаем 152-ФЗ. Код и доступы остаются у вас.</span></div>
      <div><b>Сначала разбор</b><span>Бесплатно смотрим процесс и только потом предлагаем решение и смету.</span></div>
    </div>
    ${k.caseTxt ? `<div class="case"><span class="kick">Уже сделали</span><p>${esc(k.caseTxt)}</p></div>` : ''}
    <div class="cta">
      <div><h2>Начнём с бесплатного разбора</h2><p>Покажем, что можно передать агентам, сколько это занимает сейчас и сколько стоит внедрение. Ни к чему не обязывает.</p></div>
      ${contacts}
    </div>
    <p class="legal">Черчик Ярослав Олегович, ИНН 253501718300, плательщик налога на профессиональный доход. Предложение носит информационный характер и не является публичной офертой (ст. 437 ГК РФ); точная стоимость и сроки — после бесплатного разбора.</p>
  </section>`;
})();
