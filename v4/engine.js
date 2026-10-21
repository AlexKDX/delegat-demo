// «Счётчик» engine for Восток AI: the original animation, with realistic message cards, depth and a readability scrim.
// A theme page defines window.THEME = {n, name, bg(el) -> optional {tick(state)} } before loading this file.
(() => {
  const T = window.STORY;
  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) { const lenis = new Lenis({lerp: .075}); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  const pad2 = n => String(n).padStart(2, '0');

  // ---------- chrome
  const sun = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="hsea"><polygon points="0,0 100,0 ${Array.from({length:51},(_,i)=>{const x=100-i*2;return x+','+(58-3.75*Math.sin(Math.PI*(x-10)/20)).toFixed(2)}).join(' ')}"/></clipPath></defs><circle cx="50" cy="54" r="25" fill="var(--acc)" clip-path="url(#hsea)"/>${[58,71,84].map((y,i)=>`<path d="M10 ${y}c6.7-5 13.3-5 20 0s13.3 5 20 0 13.3-5 20 0 13.3 5 20 0" fill="none" stroke="${i?'currentColor':'var(--acc)'}" stroke-width="6" stroke-linecap="round" opacity="${[1,.75,.45][i]}"/>`).join('')}</svg>`;
  document.body.insertAdjacentHTML('afterbegin', `<header class="top"><a class="logo" href="./">${sun}<span>vostok<b>.ai</b></span></a><nav>${T.nav.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}<a class="btn" href="#after"><span class="l">${T.cta}</span><span class="s">Бесплатный разбор</span></a></nav></header>`);
  document.body.insertAdjacentHTML('beforeend', `<section class="after" id="after"><p>Здесь начинается обычный сайт: разбор, услуги, кейсы, команда, форма.</p></section>`);

  const stage = document.getElementById('stage');
  const cap = (c, i) => `<div class="cap" id="c${i + 1}"><span class="k">${c.k}</span>${i ? `<h2>${c.h}</h2>` : `<h1>${c.h}</h1>`}${c.p ? `<p>${c.p}</p>` : ''}</div>`;
  stage.insertAdjacentHTML('beforeend', `
    <div id="bg"></div><div class="pile" id="pile"></div><div class="scrim"></div><div class="capscrim"></div><div class="agent" id="agent"></div>
    <div class="center" id="center"><div><div class="week" id="week"></div><div class="clock" id="clock"></div><div class="num" id="num">0</div><div class="unit" id="unit">${T.unit[0]}</div></div></div>
    ${T.caps.map(cap).join('')}
    <div class="result"><div>${T.result.map(r => `<div class="row ${r.c || ''}" data-r>${r.t}</div>`).join('')}
      <ol class="steps" data-r>${T.steps.map((s, i) => `<li><span class="sn">${pad2(i + 1)}</span><b>${s[0]}</b><span>${s[1]}</span></li>`).join('')}</ol>
      <a class="cta" data-r href="#after">${T.cta} →</a><p class="note" data-r>${T.note}</p></div></div>
    <div class="hint" id="hint"><div class="mouse"></div><span class="lbl">Листайте вниз</span><div class="chev"><i></i><i></i></div></div>`);
  const bgApi = window.THEME_BG ? window.THEME_BG(document.getElementById('bg')) || {} : {};

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
    ['call', 'Пропущенный звонок', '+7 (914) 0••-••-61', 'Не дозвонились в сервис. Звонок ушёл конкурентам', 'перезвонить'],
    ['call', 'Входящий · не отвечено', '+7 (423) 2••-••-90', 'Клиент звонил 2 раза в обед, все были заняты', 'пропущен'],
    ['wa', 'WhatsApp · 23:47', 'Ольга · клиент', 'Добрый вечер! Можно записаться на завтра? Пишу, пока не забыла', 'ночь'],
    ['tg', 'Telegram · сб 01:12', 'Артём', 'Нужен расчёт срочно, в понедельник уже поздно', 'выходные'],
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
  const prefList = T.prefer ? MSG.filter(m => T.prefer.includes(m[0])) : [];
  const pick = i => (prefList.length && i % 3 !== 2) ? prefList[i % prefList.length] : MSG[i % MSG.length];
  const mob = innerWidth < 760, N = mob ? 30 : 60, rnd = gsap.utils.random;
  // keep-out zones: the captions (left) and the counter; cards only land where there is no text
  const box = (sel, pad) => { const r = document.querySelector(sel).getBoundingClientRect(); return {l: r.left - pad, t: r.top - pad, r: r.right + pad, b: r.bottom + pad}; };
  document.getElementById('num').textContent = T.num.peak; // measure the counter at its widest
  const caps0 = ['#c2', '#c3'].map(s => box(s, 28)), numBox = box('#num', mob ? 4 : 30), unitBox = box('#unit', 10);
  const keepOut = [...caps0, numBox, unitBox, {l: -1e4, t: -1e4, r: 1e4, b: 72}];
  const hits = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
  const cards = Array.from({length: N}, (_, i) => {
    const [ic, app, nm, msg, tag] = pick(i), el = document.createElement('div');
    el.className = 'card';
    const hh = 9 + (i * 5 % 9), mm = (i * 17) % 60;
    el.innerHTML = `<div class="hd"><div class="ic" style="background:${IC[ic][0]}"><svg viewBox="0 0 24 24">${IC[ic][1]}</svg></div><div class="who"><div class="app">${app}</div><div class="nm">${nm}</div></div><div class="tm">${pad2(hh)}:${pad2(mm)}</div></div><div class="msg">${msg}</div><div class="ft"><span class="tag">${tag}</span><span>${i % 3 === 0 ? 'не прочитано' : 'в работе'}</span></div>` + (i % 3 === 0 ? `<div class="badge">${Math.round(rnd(2, 38))}</div>` : '');
    pile.append(el);
    // depth: far cards are smaller, softer and dimmer; keep the centre clear for the counter
    const z = rnd(0, 1), s = .62 + z * .42, w = el.offsetWidth, h = el.offsetHeight;
    // scale is around the centre, so test the visual (scaled) rect; the drift up of ≤40px is covered by the padding
    let x, y, ok = false;
    for (let k = 0; k < 300 && !ok; k++) {
      x = rnd(-.25 * w, innerWidth - .75 * w); y = rnd(60, innerHeight - .7 * h);
      const cx0 = x + w / 2, cy0 = y + h / 2, vis = {l: cx0 - w * s / 2, r: cx0 + w * s / 2, t: cy0 - h * s / 2 - 40, b: cy0 + h * s / 2};
      ok = !keepOut.some(z => hits(vis, z));
    }
    if (!ok) { el.remove(); return null; }
    Object.assign(el, {_x: x, _y: y, _z: z});
    el.style.zIndex = Math.round(z * 10);
    gsap.set(el, {x: el._x, y: el._y + 60, rotation: rnd(-6, 6), autoAlpha: 0, scale: s, filter: `blur(${((1 - z) * 2.2).toFixed(1)}px) brightness(${(.62 + z * .38).toFixed(2)})`});
    return el;
  }).filter(Boolean);

  // ---------- counter state (unchanged logic from the original «Счётчик»)
  const week = document.getElementById('week'), clock = document.getElementById('clock'), num = document.getElementById('num'), unit = document.getElementById('unit');
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
  const st = {h: 0, n: 0, p: 0}, AFTER = 7.0;
  const fmt = v => { const d = T.num.dec || 0; let s = Math.abs(v).toFixed(d).replace('.', ','); const [a, b] = s.split(','); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') + (b ? ',' + b : ''); const after = typeof tl !== 'undefined' && tl.time() >= AFTER && 'suffixAfter' in T.num; const sfx = after ? T.num.suffixAfter : T.num.suffix; return s + (sfx ? `<small>${sfx}</small>` : ''); };
  const render = () => {
    if (T.top.mode === 'clock') { const total = st.h, wk = Math.min(4, Math.floor(total / 45) + 1), day = days[Math.floor(total / 9) % 5], hh = 9 + Math.floor(total % 9), mm = Math.floor((total * 60) % 60); week.textContent = `${day} · неделя ${wk}`; clock.textContent = `${pad2(hh)}:${pad2(mm)}`; }
    num.innerHTML = fmt(st.n);
  };
  if (T.num.peak >= 10000) num.classList.add('wide');
  render();
  // the agent: grows in the centre while it swallows the cards, then parks next to the counter
  const numC = () => { const r = num.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; };
  const AV = Math.min(5, Math.max(1, +new URLSearchParams(location.search).get('a') || T.agentV || 1));
  const agent = document.getElementById('agent'), logoW = sun.replaceAll('hsea', 'hsea2');
  const TASKS = ['Заявка с сайта → CRM', 'Ответ клиенту в WhatsApp', 'Счёт сверен с оплатой', 'КП отправлено клиенту', 'Запись в календарь', 'Отчёт за неделю собран', 'Трек-номер отправлен', 'Прайс отправлен в Telegram'];
  const BODY = {
    1: `<div class="body">${logoW}</div>`,
    2: `<div class="body"><i class="ring"></i><i class="ring"></i><i class="ring"></i>${sun}</div>`,
    3: `<div class="body"><div class="bar"><span class="dots"><i></i><i></i><i></i></span>${sun}<b>агент · vostok.ai</b><span class="on">работает</span></div><ul class="log" id="log"></ul></div>`,
    4: `<div class="body"><div class="die">${sun}<span>AI AGENT</span></div></div>`,
    5: `<div class="body">${logoW}<div class="orbit">${['tg', 'wa', 'mail', 'erp', 'xls', 'web'].map((k, i) => `<span style="--i:${i}"><em style="background:${IC[k][0]}"><svg viewBox="0 0 24 24">${IC[k][1]}</svg></em></span>`).join('')}</div></div>`,
  };
  agent.className = `agent v${AV}`;
  agent.innerHTML = BODY[AV] + `<div class="lbl"><b>ИИ-агент</b><span>обработано <i id="proc">0</i> задач</span></div>`;
  const proc = {n: 0}, procEl = document.getElementById('proc'), log = document.getElementById('log');
  const renderProc = () => { const n = Math.round(proc.n); procEl.textContent = n; if (log) log.innerHTML = Array.from({length: Math.min(4, n)}, (_, k) => { const j = n - 1 - k; return `<li><s>✓</s>${TASKS[j % TASKS.length]}<time>${pad2(9 + j % 9)}:${pad2(j * 7 % 60)}</time></li>`; }).join(''); };
  renderProc();
  const NAMES = ['', 'Иконка', 'Пульс', 'Окно агента', 'Чип', 'Орбита каналов'];
  document.body.insertAdjacentHTML('beforeend', `<nav class="av"><span>Агент:</span>${[1, 2, 3, 4, 5].map(i => `<a href="?a=${i}"${i === AV ? ' class="on"' : ''} title="${NAMES[i]}">${i}</a>`).join('')}<em>${NAMES[AV]}</em></nav>`);
  gsap.set(agent, {xPercent: -50, yPercent: -50, autoAlpha: 0, scale: .15});
  const caps = ['#c1', '#c2', '#c3'], rows = stage.querySelectorAll('[data-r]');
  gsap.set([...caps, ...rows], {autoAlpha: 0, y: 30});
  // first frame is the headline; the counter scene starts on the first scroll
  gsap.set('#c1', {autoAlpha: 1, y: 0});
  gsap.set('#center', {autoAlpha: 0, y: 30});
  const hot = getComputedStyle(document.documentElement).getPropertyValue('--hot').trim(), acc = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim(), fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim();

  var tl = gsap.timeline({defaults: {ease: 'none'}, scrollTrigger: {trigger: stage, start: 'top top', end: '+=750%', pin: true, scrub: 1, onUpdate: s => { st.p = s.progress; }}});
  tl.to('#hint', {autoAlpha: 0, duration: .3}, .3)
    .to('#c1', {autoAlpha: 0, y: -20, duration: .4}, .7)
    .to('#center', {autoAlpha: 1, y: 0, duration: .4, ease: 'power3.out'}, 1.0)
    .to(st, {h: 180, n: T.num.peak, duration: 3.2, ease: 'power1.in', onUpdate: render}, 1.2)
    .fromTo(num, {color: fg}, {color: hot, duration: .8}, 3.4)
    .to('#c2', {autoAlpha: 1, y: 0, duration: .4, ease: 'power3.out'}, 3.0)
    .to('#c2', {autoAlpha: 0, y: -20, duration: .3}, 4.6);
  cards.forEach((c, i) => {
    const at = 1.3 + (i / cards.length) * 3.0;
    tl.to(c, {autoAlpha: 1, y: c._y, duration: .45, ease: 'power3.out'}, at)
      .to(c, {y: c._y - rnd(10, 40) * (.5 + c._z), rotation: `+=${rnd(-3, 3)}`, duration: 4.5 - (at - 1.3)}, at + .45);
  });
  // cards fly into the agent (screen centre)
  const bodyC = () => { const r = agent.querySelector('.body').getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; };
  const cx = c => bodyC().x - c.offsetWidth / 2, cy = c => bodyC().y - c.offsetHeight / 2;
  tl.to('#center', {autoAlpha: 0, scale: .96, duration: .3}, 4.8)
    .to(agent, {autoAlpha: 1, scale: .35, duration: .3, ease: 'power2.out'}, 4.8);
  cards.forEach((c, i) => tl.call(() => c.classList.add('done'), null, 4.95).to(c, {x: () => cx(c), y: () => cy(c), rotation: 0, scale: .05, autoAlpha: 0, filter: 'blur(0px) brightness(1.4)', duration: .6, ease: 'power3.in'}, 5.0 + (i / cards.length) * .7));
  tl.to(agent, {scale: 1, duration: 1.1, ease: 'power2.out'}, 5.1)
    .to(proc, {n: cards.length, duration: .9, onUpdate: renderProc}, 5.2)
    .fromTo('#agent .lbl', {autoAlpha: 0, y: 12}, {autoAlpha: 1, y: 0, duration: .3}, 5.7)
    // hold the big agent, then park it next to the counter
    .to('#agent .lbl', {autoAlpha: 0, duration: .2}, 6.6)
    .to(agent, {scale: AV === 3 ? .2 : mob ? .3 : .3, x: () => mob ? innerWidth * .36 : Math.min(innerWidth * .3, 420), y: () => numC().y - innerHeight / 2, duration: .6, ease: 'power2.inOut'}, 6.6)
    .to('#center', {autoAlpha: 1, scale: 1, duration: .3}, AFTER)
    .call(() => { const fwd = tl.time() >= AFTER; unit.textContent = T.unit[fwd ? 1 : 0]; render(); }, null, AFTER)
    .to(num, {color: acc, duration: .4}, AFTER)
    .to(st, {n: T.num.after, duration: 1.2, ease: 'power2.out', onUpdate: render}, AFTER)
    .to('#c3', {autoAlpha: 1, y: 0, duration: .4, ease: 'power3.out'}, AFTER + .2)
    .to('#c3', {autoAlpha: 0, y: -20, duration: .3}, AFTER + 1.5)
    .to(['#center', agent], {autoAlpha: 0, y: '-=40', duration: .5}, AFTER + 1.6)
    .to(rows, {autoAlpha: 1, y: 0, duration: .5, stagger: .25, ease: 'power3.out'}, AFTER + 1.9)
    .from('.steps li', {autoAlpha: 0, y: 24, duration: .4, stagger: .18, ease: 'power3.out'}, AFTER + 2.4)
    .to({}, {duration: .7});

  gsap.to('.card .badge', {scale: 1.15, duration: .6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: {each: .12, from: 'random'}});
  if (bgApi.tick) gsap.ticker.add(t => bgApi.tick(t, st.p));
})();
