// Контент сцены «Счётчик» и фон темы «Claude · ночь». Подключается до engine.js.
window.STORY = {
  nav: [['Как работаем', '#how'], ['Услуги', '#services'], ['Кейсы', '#cases'], ['О нас', '#about']],
  cta: 'Бесплатный разбор процессов',
  top: {mode: 'clock'},
  num: {peak: 84, after: 30},
  unit: ['часов в месяц уходит на ручную работу', 'часов в месяц, когда рутину ведут агенты'],
  caps: [
    {k: 'Восток AI · Владивосток', h: 'Та же команда. <em>Меньше ручной работы.</em>',
     p: 'Находим рутинные процессы в вашем бизнесе и передаём их ИИ-агентам.'},
    {k: 'Как сейчас', h: 'Заявки, отчёты, сверки, переписка — <span class="hot">всё вручную.</span>'},
    {k: 'С ИИ-агентами', h: 'Команда занимается <em>важными задачами.</em>',
     p: 'А мы повышаем эффективность бизнеса и каждого сотрудника.'},
  ],
  result: [{t: 'Та же команда.'}, {t: 'Меньше ручной работы.', c: 'money'}],
  steps: [
    ['Разбор', 'смотрим процессы вместе с вами, бесплатно'],
    ['Внедрение', 'агенты начинают работать через 2 недели'],
    ['Результат', 'показываем, сколько часов ручной работы ушло'],
  ],
  note: 'Цифры на экране — пример для одного сотрудника: до 4 часов в день на рутину (НАФИ и «Яндекс 360», 2025), ИИ может взять до 60–70% такой работы (McKinsey, 2023). Цифры вашего бизнеса покажем на разборе.',
};
window.THEME_BG = el => {
  // ambient motion starts after the page has loaded, so it never competes with first render
  const start = fn => (document.readyState === 'complete' ? setTimeout(fn, 800) : addEventListener('load', () => setTimeout(fn, 800), {once: true}));
  el.style.background = 'repeating-linear-gradient(135deg,#ffffff05 0 1px,transparent 1px 14px),#141413';
  ['#D97757', '#CC785C', '#6A9BCC'].forEach((col, i) => { const g = document.createElement('div'); g.style.cssText = `position:absolute;width:60vmax;height:60vmax;border-radius:50%;left:${[10, 60, 30][i]}%;top:${[60, 10, 80][i]}%;margin:-30vmax 0 0 -30vmax;background:radial-gradient(circle,${col}${i == 2 ? '22' : '38'},transparent 62%);will-change:transform`; el.append(g); start(() => gsap.to(g, {scale: 1.25, x: (i - 1) * 120, duration: 8 + i * 3, yoyo: true, repeat: -1, ease: 'sine.inOut'})); });
  return {};
};
