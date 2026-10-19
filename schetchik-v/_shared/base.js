// Shared runtime for all «Счётчик» variations: smooth scroll, chrome, captions, money finale.
// Each page calls Base.init({n, title}) and gets a pinned, scrubbed GSAP timeline back.
window.Base = (() => {
  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) { const lenis = new Lenis({lerp: .075}); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }

  const TOTAL = 240, TAKEN = 165, LEFT = TOTAL - TAKEN;

  function chrome(n) {
    const prev = n > 1 ? `../${String(n - 1).padStart(2, '0')}/` : '../', next = n < 10 ? `../${String(n + 1).padStart(2, '0')}/` : '../';
    document.body.insertAdjacentHTML('afterbegin', `<header class="top"><div class="brand">Делегат<b>.</b></div><nav class="nav"><a href="${prev}">←</a><a href="../">${String(n).padStart(2, '0')} / 10</a><a href="${next}">→</a></nav></header>`);
    document.body.insertAdjacentHTML('beforeend', `<section class="after" id="after"><p>Здесь начинается обычный сайт: аудит, услуги, кейсы, команда, форма.</p></section>`);
  }

  function result(stage) {
    stage.insertAdjacentHTML('beforeend', `<div class="result"><div>
      <div class="row" data-r>${TAKEN} ч/мес</div>
      <div class="row eq" data-r>= 1 полная ставка</div>
      <div class="row money" data-r>≈ 165 000 ₽ в месяц</div>
      <p class="note" data-r>Пример для отдела из 4 человек при стоимости часа 1 000 ₽ с налогами. Точные цифры по вашей компании — после аудита.</p>
      <a class="cta" data-r href="#after">Посчитаем для вас. Бесплатно →</a></div></div>`);
    const r = stage.querySelectorAll('[data-r]'); gsap.set(r, {autoAlpha: 0, y: 30}); return r;
  }

  function init({n, end = 650}) {
    chrome(n);
    const stage = document.getElementById('stage');
    stage.insertAdjacentHTML('beforeend', '<div class="hint" id="hint">листайте</div>');
    const rows = result(stage);
    gsap.set(stage.querySelectorAll('.cap'), {autoAlpha: 0, y: 26});
    const tl = gsap.timeline({defaults: {ease: 'none'}, scrollTrigger: {trigger: stage, start: 'top top', end: `+=${end}%`, pin: true, scrub: 1}});
    tl.to('#hint', {autoAlpha: 0, duration: .3}, .2);
    const cap = (sel, a, b) => { tl.to(sel, {autoAlpha: 1, y: 0, duration: .4, ease: 'power3.out'}, a); if (b != null) tl.to(sel, {autoAlpha: 0, y: -20, duration: .3}, b); };
    const money = (at, hide = []) => {
      if (hide.length) tl.to(hide, {autoAlpha: 0, duration: .5}, at - .3);
      tl.to(rows, {autoAlpha: 1, y: 0, duration: .5, stagger: .35, ease: 'power3.out'}, at).to({}, {duration: .8});
    };
    return {tl, stage, cap, money, TOTAL, TAKEN, LEFT};
  }
  return {init};
})();
