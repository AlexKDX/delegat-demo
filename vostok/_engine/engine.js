// «Счётчик» engine for Восток AI: the original animation, with realistic message cards, depth and a readability scrim.
// A theme page defines window.THEME = {n, name, bg(el) -> optional {tick(state)} } before loading this file.
(() => {
  const T = window.THEME || {n: 1, name: ''};
  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) { const lenis = new Lenis({lerp: .075}); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  const pad2 = n => String(n).padStart(2, '0');

  // ---------- chrome
  const sun = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M14 66H86" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M26 66a24 24 0 0 1 48 0" fill="var(--acc)"/>${[-60, -30, 0, 30, 60].map(g => { const r = (g - 90) * Math.PI / 180; return `<line x1="${50 + 34 * Math.cos(r)}" y1="${66 + 34 * Math.sin(r)}" x2="${50 + 44 * Math.cos(r)}" y2="${66 + 44 * Math.sin(r)}" stroke="var(--acc)" stroke-width="6" stroke-linecap="round"/>`; }).join('')}</svg>`;
  const prev = T.n > 1 ? `../${pad2(T.n - 1)}/` : '../', next = T.n < 10 ? `../${pad2(T.n + 1)}/` : '../';
  document.body.insertAdjacentHTML('afterbegin', `<header class="top"><div class="logo">${sun}<span>Восток <b>AI</b></span></div><nav><a href="${prev}">←</a><a class="th" href="../">${pad2(T.n)} · ${T.name}</a><a href="${next}">→</a></nav></header>`);
  document.body.insertAdjacentHTML('beforeend', `<section class="after" id="after"><p>Здесь начинается обычный сайт: аудит, услуги, кейсы, команда, форма.</p></section>`);

  const stage = document.getElementById('stage');
  stage.insertAdjacentHTML('beforeend', `
    <div id="bg"></div><div class="pile" id="pile"></div><div class="scrim"></div><div class="capscrim"></div><div class="agent" id="agent"></div>
    <div class="center" id="center"><div><div class="week" id="week">Понедельник · неделя 1</div><div class="clock" id="clock">09:00</div><div class="num" id="num">0</div><div class="unit" id="unit">часов рутины в месяц · отдел из 4 человек</div></div></div>
    <div class="cap" id="c1"><span class="k">Понедельник, начало месяца</span><h2>Понедельник. <em>09:00.</em></h2></div>
    <div class="cap" id="c2"><span class="k">Ответы · таблицы · письма · сверки</span><h2>Всё это — руками. <span class="hot">240 часов в месяц.</span></h2></div>
    <div class="cap" id="c3"><span class="k">Подключаем агента</span><h2>Забираем <em>165 из них.</em></h2></div>
    <div class="result"><div>
      <div class="row" data-r>165 ч/мес</div><div class="row eq" data-r>= 1 полная ставка</div><div class="row money" data-r>≈ 165 000 ₽ в месяц</div>
      <p class="note" data-r>Пример для отдела из 4 человек при стоимости часа 1 000 ₽ с налогами. Точные цифры по вашей компании — после аудита.</p>
      <a class="cta" data-r href="#after">Посчитаем для вас. Бесплатно →</a></div></div>
    <div class="hint" id="hint">листайте</div>`);
  const bgApi = T.bg ? T.bg(document.getElementById('bg')) || {} : {};

  // ---------- realistic notifications
  const IC = {
    tg: ['#2AABEE', '<path d="M3 11.5l17-6.5-3 15-5.5-4-3 3 .5-5L17 7 7.5 12.5z" fill="#fff"/>'],
    wa: ['#25D366', '<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="#fff"/><path d="M9 8.5c.3 2.6 3.1 5.6 6 6l1-1.4-2-1-.8.8c-1-.5-1.9-1.4-2.4-2.4l.8-.8-1-2z" fill="#25D366"/>'],
    mail: ['#EA4335', '<rect x="3" y="6" width="18" height="12" rx="2" fill="#fff"/><path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="#EA4335" stroke-width="1.8"/>'],
    xls: ['#1F7A4C', '<rect x="4" y="4" width="16" height="16" rx="2" fill="#fff"/><path d="M4 9.3h16M4 14.6h16M9.3 4v16" stroke="#1F7A4C" stroke-width="1.6"/>'],
    erp: ['#F5C518', '<rect x="5" y="4" width="14" height="16" rx="2" fill="#1b1b1b"/><path d="M8 9h8M8 12.5h8M8 16h5" stroke="#F5C518" stroke-width="1.7" stroke-linecap="round"/>'],
    call: ['#FF3B30', '<path d="M7 4h3l1.5 4-2 1.5c1 2.2 2.8 4 5 5l1.5-2 4 1.5v3c0 1.2-1 2-2.2 2C11 19 5 13 5 6.2 5 5 5.8 4 7 4z" fill="#fff"/>'],
    web: ['#6C5CE7', '<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16" fill="none" stroke="#fff" stroke-width="1.6"/>'],
    vk: ['#0077FF', '<path d="M4 8h3c.5 3 2 4.5 3 4.8V8h2.8v2.8c1-.2 2.2-1.6 2.6-2.8H18c-.4 1.8-1.9 3.4-3 4 1.1.5 2.7 1.8 3.4 4h-2.9c-.5-1.4-1.6-2.5-2.7-2.7V16h-.4C7.6 16 4.3 13 4 8z" fill="#fff"/>'],
    doc: ['#3D7BFF', '<path d="M7 3h7l4 4v14H7z" fill="#fff"/><path d="M9.5 11h6M9.5 14h6M9.5 17h4" stroke="#3D7BFF" stroke-width="1.6" stroke-linecap="round"/>'],
  };
  const MSG = [
    ['tg', 'Telegram', 'Анна · ВЭД-отдел', 'Добрый день! Сколько будет стоить доставка 2 тонн из Гуанчжоу во Владивосток?', 'нужен ответ'],
    ['wa', 'WhatsApp', '+7 914 •••-••-27', 'Вы работаете в субботу? Хочу записаться на 11:00', 'ждёт 2 ч'],
    ['mail', 'Почта', 'ООО «Приморье-Трейд»', 'Счёт №1187: просим сверить оплату за сентябрь и выслать акт', 'сверка'],
    ['xls', 'Excel · сверка_октябрь.xlsx', 'Бухгалтерия', 'Изменено 14 строк. Расхождение по 3 оплатам — нужна проверка', 'вручную'],
    ['erp', '1С · заявка #2214', 'Отдел продаж', 'Заявка с сайта не перенесена в CRM. Клиент ждёт КП', 'перенос'],
    ['call', 'Пропущенный звонок', '+7 (423) 2••-••-14', 'Пропущенный · 3 раза за утро', 'перезвонить'],
    ['web', 'Заявка с сайта', 'Игорь, автосервис', '«Нужен расчёт на 5 позиций, срочно». Телефон оставил', 'новая'],
    ['vk', 'ВКонтакте · сообщество', 'Мария К.', 'Есть в наличии? Сколько ждать доставку в Хабаровск?', 'ответить'],
    ['doc', 'Отчёт за неделю', 'Руководитель', 'Нужен к понедельнику 09:00: заявки, оплаты, конверсия', 'собрать'],
    ['tg', 'Telegram', 'Дмитрий · логистика', 'Скиньте, пожалуйста, трек-номер и счёт на доплату', 'нужен ответ'],
    ['mail', 'Почта', 'tender@dvfu.ru', 'Запрос коммерческого предложения до пятницы', 'КП'],
    ['wa', 'WhatsApp', 'Сергей · опт', 'Пришлите прайс на ноябрь, нужен объём 300 шт', 'ждёт 40 мин'],
  ];
  const pile = document.getElementById('pile');
  const mob = innerWidth < 760, N = mob ? 18 : 32, rnd = gsap.utils.random;
  const cards = Array.from({length: N}, (_, i) => {
    const [ic, app, nm, msg, tag] = MSG[i % MSG.length], el = document.createElement('div');
    el.className = 'card';
    const hh = 9 + (i * 5 % 9), mm = (i * 17) % 60;
    el.innerHTML = `<div class="hd"><div class="ic" style="background:${IC[ic][0]}"><svg viewBox="0 0 24 24">${IC[ic][1]}</svg></div><div class="who"><div class="app">${app}</div><div class="nm">${nm}</div></div><div class="tm">${pad2(hh)}:${pad2(mm)}</div></div><div class="msg">${msg}</div><div class="ft"><span class="tag">${tag}</span><span>${i % 3 === 0 ? 'не прочитано' : 'в работе'}</span></div>` + (i % 3 === 0 ? `<div class="badge">${Math.round(rnd(2, 38))}</div>` : '');
    pile.append(el);
    // depth: far cards are smaller, softer and dimmer; keep the centre clear for the counter
    const z = rnd(0, 1);
    let x, y; do { x = rnd(-.06, .9); y = rnd(-.04, .86); } while ((Math.abs(x - .4) < .24 && Math.abs(y - .42) < .26) || (x < .46 && y > .58));
    Object.assign(el, {_x: x * innerWidth, _y: y * innerHeight, _z: z});
    el.style.zIndex = Math.round(z * 10);
    gsap.set(el, {x: el._x, y: el._y + 60, rotation: rnd(-6, 6), autoAlpha: 0, scale: .62 + z * .42, filter: `blur(${((1 - z) * 2.2).toFixed(1)}px) brightness(${(.62 + z * .38).toFixed(2)})`});
    return el;
  });

  // ---------- counter state (unchanged logic from the original «Счётчик»)
  const week = document.getElementById('week'), clock = document.getElementById('clock'), num = document.getElementById('num'), unit = document.getElementById('unit');
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
  const st = {h: 0, n: 0, p: 0};
  const render = () => {
    const total = st.h, wk = Math.min(4, Math.floor(total / 45) + 1), day = days[Math.floor(total / 9) % 5], hh = 9 + Math.floor(total % 9), mm = Math.floor((total * 60) % 60);
    week.textContent = `${day} · неделя ${wk}`; clock.textContent = `${pad2(hh)}:${pad2(mm)}`; num.textContent = Math.round(st.n);
  };
  render();
  const caps = ['#c1', '#c2', '#c3'], rows = stage.querySelectorAll('[data-r]');
  gsap.set([...caps, ...rows], {autoAlpha: 0, y: 30});
  gsap.set('#c1', {autoAlpha: 1, y: 0});
  const hot = getComputedStyle(document.documentElement).getPropertyValue('--hot').trim(), acc = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim(), fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim();

  const tl = gsap.timeline({defaults: {ease: 'none'}, scrollTrigger: {trigger: stage, start: 'top top', end: '+=650%', pin: true, scrub: 1, onUpdate: s => { st.p = s.progress; }}});
  tl.to('#hint', {autoAlpha: 0, duration: .3}, .3)
    .to('#c1', {autoAlpha: 0, y: -20, duration: .3}, 1.1)
    .to(st, {h: 180, n: 240, duration: 3.2, ease: 'power1.in', onUpdate: render}, 1.2)
    .fromTo(num, {color: fg}, {color: hot, duration: .8}, 3.4)
    .to('#c2', {autoAlpha: 1, y: 0, duration: .4, ease: 'power3.out'}, 3.0)
    .to('#c2', {autoAlpha: 0, y: -20, duration: .3}, 4.6);
  cards.forEach((c, i) => {
    const at = 1.3 + (i / N) * 3.0;
    tl.to(c, {autoAlpha: 1, y: c._y, duration: .45, ease: 'power3.out'}, at)
      .to(c, {y: c._y - rnd(10, 40) * (.5 + c._z), rotation: `+=${rnd(-3, 3)}`, duration: 4.5 - (at - 1.3)}, at + .45);
  });
  const cx = innerWidth / 2 - 140, cy = innerHeight / 2 - 60;
  tl.to('#center', {autoAlpha: 0, scale: .96, duration: .3}, 4.9);
  cards.forEach((c, i) => tl.call(() => c.classList.add('done'), null, 4.95).to(c, {x: cx, y: cy, rotation: 0, scale: .05, autoAlpha: 0, filter: 'blur(0px) brightness(1.4)', duration: .7, ease: 'power3.in'}, 5.0 + (i % 12) * .03));
  tl.fromTo('#agent', {opacity: 0, scale: .2, rotation: -20}, {opacity: 1, scale: 1, rotation: 0, duration: .6, ease: 'back.out(1.8)'}, 5.6)
    .to('#center', {autoAlpha: 1, scale: 1, duration: .3}, 6.1)
    .call(() => { unit.textContent = 'часов рутины в месяц · с агентом'; }, null, 6.1)
    .to('#agent', {scale: .42, y: () => -Math.min(innerHeight * .34, 270), duration: .5, ease: 'power2.inOut'}, 5.95)
    .to(num, {color: acc, duration: .4}, 6.1)
    .to(st, {n: 75, duration: 1.2, ease: 'power2.out', onUpdate: render}, 6.1)
    .to('#c3', {autoAlpha: 1, y: 0, duration: .4, ease: 'power3.out'}, 6.3)
    .to('#c3', {autoAlpha: 0, y: -20, duration: .3}, 7.6)
    .to(['#center', '#agent'], {autoAlpha: 0, y: '-=40', duration: .5}, 7.7)
    .to(rows, {autoAlpha: 1, y: 0, duration: .5, stagger: .35, ease: 'power3.out'}, 8.0)
    .to({}, {duration: .7});

  gsap.to('.card .badge', {scale: 1.15, duration: .6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: {each: .12, from: 'random'}});
  if (bgApi.tick) gsap.ticker.add(t => bgApi.tick(t, st.p));
})();
