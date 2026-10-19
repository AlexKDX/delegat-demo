"""10 текстовых вариантов «Счётчика» в теме «Claude · ночь» с логотипом vostok.ai.
Анимация одна (engine.js), у каждого варианта своя боль и своя реальная цифра с источником.
python3 gen.py  (из папки v2/_engine)"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VER = 2

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

STORIES = [
 dict(name='Половина дня', about='рутина съедает до 4 часов в день у каждого офисного сотрудника',
  top={'mode': 'clock'}, num={'peak': 84, 'after': 30},
  unit=['часов рутины в месяц · у одного сотрудника', 'часов рутины в месяц · с агентом'],
  caps=[{'k': 'Обычный рабочий день', 'h': 'До 4 часов в день <span class="hot">уходит на рутину.</span>', 'p': 'Документы, переписка, рассылки, поиск файлов — по данным НАФИ и «Яндекс 360».'},
        {'k': 'Это половина рабочего дня', 'h': 'Вы платите за продажи. <span class="hot">Получаете копирование.</span>'},
        {'k': 'Подключаем агента', 'h': 'Агент забирает <em>до двух третей рутины.</em>'}],
  result=[{'t': '54 часа в месяц'}, {'t': 'на каждого сотрудника', 'c': 'eq'}, {'t': 'возвращаются в работу с клиентами', 'c': 'money sub'}],
  note=f"84 ч = 4 ч в день × 21 рабочий день. Источники: {SRC['nafi']}; {SRC['mck']} — ИИ может высвободить до 60–70% времени.", prefer=['doc', 'mail', 'xls']),

 dict(name='10 минут', about='клиент уходит, если менеджер не отвечает дольше 10 минут',
  top={'week': 'клиент написал в WhatsApp', 'clock': '14:05 · менеджер на встрече'}, num={'peak': 47, 'after': 3},
  unit=['минут клиент ждёт ответа', 'секунды до ответа агента'],
  caps=[{'k': '14:05 · новое сообщение', 'h': 'Клиент написал. <span class="hot">Менеджер на встрече.</span>'},
        {'k': 'Опрос 7 500 компаний, 2025', 'h': 'Через 10 минут <span class="hot">половина клиентов уходит</span> к тем, кто ответил.'},
        {'k': 'Подключаем агента', 'h': 'Агент отвечает <em>за 3 секунды.</em> Днём, ночью, в выходные.'}],
  result=[{'t': '3 секунды'}, {'t': 'вместо 47 минут ожидания', 'c': 'eq'}, {'t': 'клиент не успевает уйти к конкуренту', 'c': 'money sub'}],
  note=f"47 минут — пример одного дня, когда менеджер занят. Порог в 10 минут: {SRC['telfin']}.", prefer=['wa', 'tg', 'vk']),

 dict(name='Без ответа', about='почти четверть компаний вообще не отвечает на заявку',
  top={'week': 'заявки с сайта', 'clock': 'за месяц'}, num={'peak': 23, 'after': 0, 'suffix': '%'},
  unit=['компаний не отвечают на заявку вообще', 'заявок без ответа · с агентом'],
  caps=[{'k': 'Заявка отправлена', 'h': 'Клиент оставил заявку. <span class="hot">Её никто не увидел.</span>'},
        {'k': 'HBR · 2 241 компания', 'h': '<span class="hot">23% компаний</span> не отвечают на заявку вообще.', 'p': 'У застройщиков без ответа остаётся до 40% обращений — данные Callibri по 480 000 заявок.'},
        {'k': 'Подключаем агента', 'h': 'Агент отвечает <em>на каждую.</em> И сразу заносит в CRM.'}],
  result=[{'t': '0 потерянных заявок'}, {'t': 'каждая — в ответ и в CRM', 'c': 'eq'}, {'t': 'менеджер видит только готовых клиентов', 'c': 'money sub'}],
  note=f"Источники: {SRC['hbr']}; {SRC['callibri']}.", prefer=['web', 'mail', 'erp']),

 dict(name='Пропущенный звонок', about='бизнес теряет миллионы на звонках, которые никто не взял',
  top={'week': 'автосервис · год', 'clock': 'входящие звонки'}, num={'peak': 54.1, 'after': 0, 'dec': 1},
  unit=['млн ₽ в год — столько может терять автосервис на пропущенных звонках', 'млн ₽ потерь · с агентом'],
  caps=[{'k': 'Телефон звонит', 'h': 'Все заняты. <span class="hot">Звонок уходит в пустоту.</span>'},
        {'k': 'Оценка Nodul, 2026', 'h': 'Автосервис теряет до <span class="hot">54 млн ₽ в год.</span>', 'p': 'Стоматология — до 96 млн ₽, салон красоты — до 34 млн ₽.'},
        {'k': 'Подключаем агента', 'h': 'Агент перезванивает, пишет клиенту <em>и записывает его сам.</em>'}],
  result=[{'t': 'Каждый пропущенный'}, {'t': '= перезвон за минуту', 'c': 'eq'}, {'t': 'и запись в календарь без участия людей', 'c': 'money sub'}],
  note=f"Источник: {SRC['nodul']}. Цифры — верхняя граница для бизнеса с большим входящим потоком.", prefer=['call']),

 dict(name='«Сколько стоит?»', about='каждый второй сотрудник вручную отвечает на одни и те же вопросы',
  top={'week': 'почта и мессенджеры', 'clock': 'типовые вопросы'}, num={'peak': 52, 'after': 0, 'suffix': '%'},
  unit=['сотрудников вручную переписываются с клиентами', 'сотрудников заняты типовыми ответами · с агентом'],
  caps=[{'k': 'Одно и то же каждый день', 'h': '«Сколько стоит?» «Есть в наличии?» <span class="hot">«Когда доставка?»</span>'},
        {'k': 'НАФИ и «Яндекс 360», 2025', 'h': '<span class="hot">Каждый второй сотрудник</span> отвечает на это вручную — в почте и мессенджерах.'},
        {'k': 'Подключаем агента', 'h': 'Типовые вопросы закрывает агент — <em>по вашим ценам и правилам.</em>'}],
  result=[{'t': 'Менеджер подключается'}, {'t': 'когда клиент готов купить', 'c': 'eq'}, {'t': 'агент передаёт ему сводку разговора', 'c': 'money sub'}],
  note=f"52% тратят время на переписку с клиентами по почте, 51% — в мессенджерах. Источник: {SRC['nafi']}.", prefer=['wa', 'tg', 'vk', 'mail']),

 dict(name='Пять окон', about='сотрудники теряют время, прыгая между почтой, мессенджерами, таблицами и 1С',
  top={'week': 'почта · Telegram · Excel · 1С', 'clock': 'и снова почта'}, num={'peak': 28, 'after': 1, 'suffix': '%', 'suffixAfter': ''},
  unit=['сотрудников теряют время на переключение между сервисами', 'окно — вся история клиента в одном месте'],
  caps=[{'k': 'Обычный час менеджера', 'h': 'Почта. Telegram. Excel. 1С. <span class="hot">Снова почта.</span>'},
        {'k': 'НАФИ и «Яндекс 360», 2025', 'h': '<span class="hot">28%</span> теряют время на переключение, <span class="hot">27%</span> — на поиск файлов.'},
        {'k': 'Подключаем агента', 'h': 'Агент сам собирает всё <em>в одну карточку клиента.</em>'}],
  result=[{'t': 'Одно окно'}, {'t': 'вместо пяти программ', 'c': 'eq'}, {'t': 'агент заносит данные сам — без копирования', 'c': 'money sub'}],
  note=f"Источник: {SRC['nafi']}.", prefer=['mail', 'xls', 'erp', 'tg']),

 dict(name='Деньги', about='половину зарплаты менеджера вы платите за рутину',
  top={'week': 'менеджер по продажам', 'clock': 'Владивосток'}, num={'peak': 50000, 'after': 17000},
  unit=['₽ в месяц вы платите одному менеджеру за рутину', '₽ в месяц — рутина с агентом'],
  caps=[{'k': 'Зарплата менеджера во Владивостоке', 'h': 'Вы платите менеджеру <span class="hot">50–100 тысяч в месяц.</span>'},
        {'k': 'Половина дня — рутина', 'h': 'Это до <span class="hot">50 000 ₽ в месяц</span> — за копирование, а не за продажи.'},
        {'k': 'Подключаем агента', 'h': 'Агент берёт рутину на себя и <em>не уходит в отпуск.</em>'}],
  result=[{'t': '33 000 ₽ в месяц'}, {'t': 'с каждого менеджера', 'c': 'eq'}, {'t': 'возвращаются в продажи', 'c': 'money sub'}],
  note=f"50 000 ₽ = верхняя граница зарплаты 100 000 ₽ × половина дня на рутину; агент забирает две трети. Источники: {SRC['hh']}; {SRC['nafi']}.", prefer=['xls', 'doc', 'mail']),

 dict(name='Ночь', about='клиенты пишут, когда офис закрыт, а утром уже покупают у других',
  top={'week': 'пятница', 'clock': '23:40 · офис закрыт'}, num={'peak': 15, 'after': 24, 'suffix': '%', 'suffixAfter': ''},
  unit=['покупателей предпочитают заказывать ночью в выходные', 'часа в сутки агент на связи'],
  caps=[{'k': 'Пятница, 23:40', 'h': 'Офис закрыт. <span class="hot">Клиент только проснулся.</span>'},
        {'k': 'Сберометр', 'h': '<span class="hot">15% покупателей</span> заказывают ночью в выходные. Утром они уже купили у других.'},
        {'k': 'Подключаем агента', 'h': 'Агент не спит — <em>отвечает, считает, записывает.</em>'}],
  result=[{'t': '24 / 7'}, {'t': 'без смен, переработок и выходных', 'c': 'eq'}, {'t': 'утром менеджер видит готовые заявки', 'c': 'money sub'}],
  note=f"Источник: {SRC['sber']}.", prefer=['wa', 'tg']),

 dict(name='42 часа', about='средняя компания отвечает на заявку почти через двое суток',
  top={'week': 'заявка с сайта', 'clock': 'понедельник · 09:00'}, num={'peak': 42, 'after': 1},
  unit=['часа — среднее время ответа компании на заявку', 'минута — ответ агента'],
  caps=[{'k': 'Понедельник, 09:00', 'h': 'Пришла заявка. <span class="hot">Её откроют в среду.</span>'},
        {'k': 'HBR · 2 241 компания', 'h': 'Среднее время ответа на заявку — <span class="hot">42 часа.</span>'},
        {'k': 'Подключаем агента', 'h': 'Агент отвечает <em>в первую минуту.</em>'}],
  result=[{'t': 'В 7 раз'}, {'t': 'выше шанс довести клиента до разговора', 'c': 'eq'}, {'t': 'если ответить в течение часа', 'c': 'money sub'}],
  note=f"Источник: {SRC['hbr']}: ответ в течение часа — почти в 7 раз выше шанс квалифицировать лид.", prefer=['web', 'mail']),

 dict(name='Вечер', about='люди задерживаются из-за рутины и выгорают',
  top={'week': 'вторник', 'clock': '19:30 · отдел ещё в офисе'}, num={'peak': 34, 'after': 0, 'suffix': '%'},
  unit=['сотрудников: цифровые инструменты сократили бы их переработки', 'переработок из-за рутины · с агентом'],
  caps=[{'k': 'Вторник, 19:30', 'h': 'Отдел ещё в офисе. <span class="hot">Доделывают отчёты.</span>'},
        {'k': 'НАФИ и «Яндекс 360», 2025', 'h': '<span class="hot">34% сотрудников:</span> автоматизация сократила бы переработки.', 'p': '76% сотрудников компаний без цифровых инструментов хотят их внедрить.'},
        {'k': 'Подключаем агента', 'h': 'Мы забираем рутину — <em>люди уходят домой вовремя.</em>'}],
  result=[{'t': '18:00'}, {'t': 'все дома', 'c': 'eq'}, {'t': 'отчёты собрал агент', 'c': 'money sub'}],
  note=f"Источник: {SRC['nafi']}.", prefer=['doc', 'xls', 'erp']),
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
    st = dict(st, n=i)
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
<title>vostok.ai · 10 текстов главного экрана</title>
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
<h1>vostok.ai · 10 текстов главного экрана</h1>
<p class="l">Дизайн один — «Claude · ночь», анимация «Счётчика», логотип «Волна и солнце». Меняется смысл: у каждого варианта своя боль клиента и своя реальная цифра с источником, указанным прямо на странице.</p>
<div class="g">
{cards}
</div></div></body></html>
''', encoding='utf-8')
print('ok', len(STORIES))
