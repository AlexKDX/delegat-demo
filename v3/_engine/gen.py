"""10 текстовых вариантов «Счётчика» в теме «Claude · ночь» с логотипом vostok.ai.
Анимация одна (engine.js), у каждого варианта своя боль и своя реальная цифра с источником.
python3 gen.py  (из папки v2/_engine)"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VER = 1

SRC = {
 'nafi': 'НАФИ и «Яндекс 360», опрос 1 400 сотрудников, апрель 2025',
 'mck': 'McKinsey, «The economic potential of generative AI», 2023',
 'telfin': 'Телфин и OkoCRM, опрос 7 500+ компаний, сентябрь 2025',
 'hbr': 'Harvard Business Review, «The Short Life of Online Sales Leads», 2 241 компания',
 'callibri': 'Callibri, 480 000 обращений к застройщикам, 2024',
 'nodul': 'оценка Nodul по 8 сферам бизнеса, май 2026',
 'hh': 'вакансии hh.ru, менеджер по продажам, Владивосток, 2026',
 'sber': 'Сберометр, покупательские привычки россиян',
}

NOTE = "По данным НАФИ и «Яндекс 360» (опрос 1 400 сотрудников, 2025), на рутину уходит до 4 часов в день. По оценке McKinsey (2023), ИИ может взять на себя до 60–70% такой работы."
STORIES = [
 dict(name='Каждый день одно и то же', about='вы снова делаете то, что делали вчера',
  top={'mode': 'clock'}, num={'peak': 84, 'after': 30},
  unit=['часов в месяц — на одно и то же', 'часов в месяц — с агентом'],
  caps=[{'k': 'Знакомо?', 'h': 'Вы снова делаете <span class="hot">то же, что вчера.</span>'},
        {'k': 'И позавчера. И неделю назад', 'h': 'Копировать. Ответить. Переслать. <span class="hot">Повторить.</span>'},
        {'k': 'Можно иначе', 'h': 'Это делает <em>агент.</em> Вы — то, что важно.'}],
  result=[{'t': '54 часа в месяц'}, {'t': 'возвращаются вам', 'c': 'eq'}, {'t': 'на дело, ради которого вы работаете', 'c': 'money sub'}],
  note=NOTE),
 dict(name='Вы не робот', about='вы делаете работу, которую должна делать машина',
  top={}, num={'peak': 240, 'after': 80},
  unit=['минут в день — работа для машины', 'минут в день — с агентом'],
  caps=[{'k': 'Честно', 'h': 'Половина ваших дел — <span class="hot">работа для машины.</span>'},
        {'k': 'Каждый день', 'h': 'До 4 часов — <span class="hot">на то, что не требует головы.</span>'},
        {'k': 'Отдайте её машине', 'h': 'Агент делает <em>скучное.</em> Вы — умное.'}],
  result=[{'t': '2 часа 40 минут'}, {'t': 'каждый день — на то, что умеете только вы', 'c': 'eq'}, {'t': 'а не на копирование', 'c': 'money sub'}],
  note=NOTE),
 dict(name='Не успеваю', about='дел больше, чем часов в дне',
  top={}, num={'peak': 50, 'after': 17, 'suffix': '%'},
  unit=['рабочего дня уходит на рутину', 'дня — рутина с агентом'],
  caps=[{'k': 'Опять не успели?', 'h': 'Дел больше, <span class="hot">чем часов в дне.</span>'},
        {'k': 'Почему так', 'h': 'Половина дня <span class="hot">уходит на мелочи.</span>'},
        {'k': 'Решение', 'h': 'Мелочи — агенту. <em>Вы успеваете главное.</em>'}],
  result=[{'t': 'Треть дня'}, {'t': 'вместо половины', 'c': 'eq'}, {'t': 'остальное — ваше время', 'c': 'money sub'}],
  note=NOTE),
 dict(name='Всё на мне', about='без вас ничего не происходит, и это выматывает',
  top={}, num={'peak': 20, 'after': 7},
  unit=['часов в неделю — проверить, напомнить, переслать', 'часов в неделю — с агентом'],
  caps=[{'k': 'Узнаёте себя?', 'h': 'Не напомните — <span class="hot">никто не сделает.</span>'},
        {'k': 'Каждую неделю', 'h': 'Проверить. Напомнить. Переслать. <span class="hot">Опять вы.</span>'},
        {'k': 'Можно выдохнуть', 'h': 'Агент напоминает, проверяет и пересылает <em>сам.</em>'}],
  result=[{'t': '13 часов в неделю'}, {'t': 'без вашего контроля', 'c': 'eq'}, {'t': 'и всё сделано вовремя', 'c': 'money sub'}],
  note=NOTE),
 dict(name='Год жизни', about='рутина забирает месяцы вашей жизни',
  top={}, num={'peak': 123, 'after': 41},
  unit=['рабочих дня в году — на рутину', 'рабочих дня — с агентом'],
  caps=[{'k': 'Посчитаем', 'h': '4 часа в день <span class="hot">не кажутся много.</span>'},
        {'k': 'А за год', 'h': 'Это <span class="hot">123 рабочих дня.</span> Полгода работы.'},
        {'k': 'Верните их', 'h': 'Агент забирает <em>две трети.</em>'}],
  result=[{'t': '82 рабочих дня'}, {'t': 'в году — снова ваши', 'c': 'eq'}, {'t': 'почти четыре месяца', 'c': 'money sub'}],
  note="123 дня = 4 ч × 247 рабочих дней ÷ 8 ч. " + NOTE),
]

BG = '''window.THEME_BG = el => {
  el.style.background = 'repeating-linear-gradient(135deg,#ffffff05 0 1px,transparent 1px 14px),#141413';
  ['#D97757', '#CC785C', '#6A9BCC'].forEach((col, i) => { const g = document.createElement('div'); g.style.cssText = `position:absolute;width:60vmax;height:60vmax;border-radius:50%;left:${[10, 60, 30][i]}%;top:${[60, 10, 80][i]}%;margin:-30vmax 0 0 -30vmax;background:radial-gradient(circle,${col}${i == 2 ? '22' : '38'},transparent 62%);filter:blur(20px)`; el.append(g); gsap.to(g, {scale: 1.25, opacity: .6, x: (i - 1) * 120, duration: 8 + i * 3, yoyo: true, repeat: -1, ease: 'sine.inOut'}); });
  return {};
};'''

PAGE = '''<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>vostok.ai · {name}</title>
<meta name="description" content="Восток AI — {about}. Забираем рутину у ваших сотрудников. Владивосток и Дальний Восток.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=Manrope:wght@800&family=JetBrains+Mono:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="../_engine/engine.css?v={ver}">
<style>
/* Вариант {n:02d} · {name}: {about}. Тема «Claude · ночь». */
:root{{--ink:#141413;--fg:#F0EFEA;--muted:#a3a29c;--acc:#D97757;--acc-ink:#141413;--hot:#6A9BCC;--card:#1c1c1a;--card-2:#232320;--card-line:#ffffff12;--card-fg:#F0EFEA;--card-muted:#91918D;--scrim:20,20,19}}
</style></head>
<body>
<section class="stage" id="stage"></section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script>
window.STORY = {story};
{bg}
</script>
<script src="../_engine/engine.js?v={ver}"></script>
</body></html>
'''

for i, st in enumerate(STORIES, 1):
    st = dict(st, n=i, total=len(STORIES))
    d = ROOT / f'{i:02d}'
    d.mkdir(exist_ok=True)
    (d / 'index.html').write_text(PAGE.format(n=i, name=st['name'], about=st['about'], ver=VER, bg=BG,
                                              story=json.dumps(st, ensure_ascii=False)), encoding='utf-8')

import re
strip = lambda h: re.sub(r'<[^>]+>', '', h)
cards = '\n'.join(
    f'<a class="c" href="{i:02d}/"><span class="n">{i:02d}</span><span class="t">{st["name"]}</span>'
    f'<span class="d">{st["about"][0].upper() + st["about"][1:]}.</span>'
    f'<span class="q">«{strip(st["caps"][1]["h"])}»</span></a>'
    for i, st in enumerate(STORIES, 1))
(ROOT / 'index.html').write_text(f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>vostok.ai · 5 универсальных текстов</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;800&family=JetBrains+Mono:wght@500&display=swap">
<style>
:root{{--ink:#141413;--card:#1c1c1a;--line:#2a2a27;--fg:#F0EFEA;--muted:#a3a29c;--acc:#D97757;--hot:#6A9BCC}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--ink);color:var(--fg);font:16px/1.5 Onest,system-ui,sans-serif}}
.w{{max-width:1180px;margin:0 auto;padding:52px max(20px,env(safe-area-inset-left,0px)) 80px}}
a.b{{font:500 12px "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);text-decoration:none}}
h1{{font-weight:800;font-size:clamp(30px,4.6vw,56px);letter-spacing:-.035em;line-height:1;margin:16px 0 10px}}
p.l{{color:var(--muted);max-width:68ch;margin:0 0 34px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:14px}}
a.c{{display:flex;flex-direction:column;gap:6px;padding:22px;border:1px solid var(--line);border-radius:16px;background:var(--card);color:inherit;text-decoration:none;transition:border-color .2s,transform .2s}}
a.c:hover,a.c:focus-visible{{border-color:var(--acc);transform:translateY(-2px);outline:none}}
.n{{font:500 12px "JetBrains Mono",monospace;letter-spacing:.16em;color:var(--acc)}}
.t{{font-weight:800;font-size:24px;letter-spacing:-.02em}}.d{{color:var(--muted);font-size:14px}}
.q{{margin-top:6px;padding-top:10px;border-top:1px solid var(--line);font-size:15px;color:var(--fg)}}
</style></head><body><div class="w"><a class="b" href="../">← все сюжеты</a>
<h1>vostok.ai · 5 универсальных текстов</h1>
<p class="l">Дизайн один — «Claude · ночь», анимация «Счётчика», логотип «Волна и солнце». Боль общая, понятная любому: рутина надоела. Короткие фразы, читаются за пару секунд. Цифры реальные — источник внизу каждой страницы.</p>
<div class="g">
{cards}
</div></div></body></html>
''', encoding='utf-8')
print('ok', len(STORIES))
