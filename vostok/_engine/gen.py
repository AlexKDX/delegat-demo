"""Генерирует 10 тем «Восток AI · Счётчик»: одна анимация (engine.js), разные палитры и живые фоны.
python3 gen.py  (из папки vostok/_engine)"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEAD = '''<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Восток AI · {name}</title>
<meta name="description" content="Восток AI — забираем рутину у ваших сотрудников. Владивосток и Дальний Восток.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="../_engine/engine.css">
<style>
/* Theme {n:02d} · {name}: {about} */
:root{{{vars}}}
{css}
</style></head>
<body>
<section class="stage" id="stage"></section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script>
const canvasIn = (el) => {{ const c = document.createElement('canvas'); el.append(c); const x = c.getContext('2d'), d = Math.min(devicePixelRatio, 2); const o = {{c, x, W: 0, H: 0}}; const fit = () => {{ o.W = el.clientWidth; o.H = el.clientHeight; c.width = o.W * d; c.height = o.H * d; x.setTransform(d, 0, 0, d, 0, 0); o.onfit && o.onfit(); }}; fit(); addEventListener('resize', fit); return o; }};
window.THEME = {{n: {n}, name: '{name}', bg(el) {{ {bg} }}}};
</script>
<script src="../_engine/engine.js"></script>
</body></html>
'''

def v(ink, fg, muted, acc, acc_ink, hot, card, card2, line, cfg, cmut, scrim):
    return (f'--ink:{ink};--fg:{fg};--muted:{muted};--acc:{acc};--acc-ink:{acc_ink};--hot:{hot};'
            f'--card:{card};--card-2:{card2};--card-line:{line};--card-fg:{cfg};--card-muted:{cmut};--scrim:{scrim}')

THEMES = [
 dict(name='Claude · день', about='фирменная палитра Claude: тёплая слоновая кость, чернила и оранжевый; фон — точечная сетка и мягкое тёплое свечение',
  vars=v('#F4F3EE', '#141413', '#6b6a63', '#D97757', '#ffffff', '#6A9BCC', '#fbfaf6', '#ffffff', '#1414131a', '#141413', '#7d7c75', '244,243,238'),
  css='.card{box-shadow:0 18px 40px -22px #14141355,0 1px 0 #fff inset}.card .badge{box-shadow:0 0 0 3px var(--ink)}',
  bg='''el.style.background='radial-gradient(#14141322 1.2px, transparent 1.3px) 0 0/22px 22px, #F4F3EE';
  const g=document.createElement('div'); g.style.cssText='position:absolute;width:70vmax;height:70vmax;border-radius:50%;left:50%;top:50%;margin:-35vmax 0 0 -35vmax;background:radial-gradient(circle,#D9775733,#D9775700 65%);filter:blur(10px)'; el.append(g);
  gsap.to(g,{x:'18vw',y:'-10vh',duration:14,yoyo:true,repeat:-1,ease:'sine.inOut'}); return {};'''),
 dict(name='Claude · ночь', about='тёмная палитра Claude: графит #141413, тёплая кость, оранжевый акцент; фон — дышащее оранжевое свечение и тонкая диагональная штриховка',
  vars=v('#141413', '#F0EFEA', '#91918D', '#D97757', '#141413', '#6A9BCC', '#1c1c1a', '#232320', '#ffffff12', '#F0EFEA', '#91918D', '20,20,19'),
  css='',
  bg='''el.style.background='repeating-linear-gradient(135deg,#ffffff05 0 1px,transparent 1px 14px),#141413';
  ['#D97757','#CC785C','#6A9BCC'].forEach((col,i)=>{const g=document.createElement('div');g.style.cssText=`position:absolute;width:60vmax;height:60vmax;border-radius:50%;left:${[10,60,30][i]}%;top:${[60,10,80][i]}%;margin:-30vmax 0 0 -30vmax;background:radial-gradient(circle,${col}${i==2?'22':'38'},transparent 62%);filter:blur(20px)`;el.append(g);gsap.to(g,{scale:1.25,opacity:.6,x:(i-1)*120,duration:8+i*3,yoyo:true,repeat:-1,ease:'sine.inOut'});}); return {};'''),
 dict(name='Японское море', about='глубокий ночной синий и мята; фон — живые линии волн в нижней половине экрана',
  vars=v('#06131f', '#eaf4f8', '#86a3b5', '#5ef2c0', '#04120d', '#ff7a59', '#0b1d2c', '#0f2537', '#ffffff14', '#e6f1f6', '#7f9cae', '6,19,31'),
  css='',
  bg='''el.style.background='linear-gradient(#06131f 0%,#08243a 60%,#0a2c45 100%)'; const o=canvasIn(el); let t=0;
  return {tick(){t+=.012;const{x,W,H}=o;x.clearRect(0,0,W,H);for(let k=0;k<26;k++){const y0=H*.48+k*k*.62,a=.05+k*.012;x.strokeStyle=`rgba(120,210,230,${a})`;x.lineWidth=1;x.beginPath();for(let px=0;px<=W;px+=8){const y=y0+Math.sin(px*.006+t*(1+k*.04)+k)*(6+k*.9)+Math.sin(px*.017-t*1.3+k*2)*3;px?x.lineTo(px,y):x.moveTo(px,y);}x.stroke();}}};'''),
 dict(name='Северное сияние', about='почти чёрное небо и переливающиеся ленты сияния — зелёная, бирюзовая, фиолетовая',
  vars=v('#04060c', '#eef6ff', '#8b97b0', '#7CFFCB', '#03140d', '#ff6b8b', '#0b1020', '#0f1529', '#ffffff14', '#e8eef9', '#8792ad', '4,6,12'),
  css='@keyframes au1{0%,100%{transform:translate(-10%,0) rotate(-8deg) scaleY(1)}50%{transform:translate(12%,-6%) rotate(6deg) scaleY(1.3)}}@keyframes au2{0%,100%{transform:translate(8%,4%) rotate(10deg)}50%{transform:translate(-14%,-4%) rotate(-6deg) scaleY(1.4)}}',
  bg='''el.style.background='radial-gradient(ellipse at 50% 120%,#0b1430,#04060c 60%)';
  [['#29ffb0',.55,'au1',22,'8%'],['#00c2ff',.4,'au2',28,'22%'],['#9b5cff',.35,'au1',34,'2%']].forEach(([c,o,a,d,t])=>{const b=document.createElement('div');b.style.cssText=`position:absolute;left:-20%;right:-20%;top:${t};height:38vh;background:linear-gradient(90deg,transparent,${c},transparent);opacity:${o};filter:blur(60px);border-radius:50%;animation:${a} ${d}s ease-in-out infinite`;el.append(b);});
  const s=document.createElement('div');s.style.cssText='position:absolute;inset:0;background-image:radial-gradient(1px 1px at 20% 30%,#fff9,transparent),radial-gradient(1px 1px at 70% 20%,#fff8,transparent),radial-gradient(1px 1px at 40% 70%,#fff6,transparent),radial-gradient(1px 1px at 85% 60%,#fff7,transparent),radial-gradient(1px 1px at 10% 80%,#fff5,transparent);background-size:300px 300px';el.append(s); return {};'''),
 dict(name='Топография Приморья', about='оливково-чёрный, песочный текст и лаймовый акцент; фон — горизонтали рельефа, медленно плывущие, как на топокарте',
  vars=v('#0e110b', '#ece7d8', '#9a9886', '#d4ff5a', '#151a05', '#ff8a3d', '#151a12', '#1a2016', '#ece7d814', '#ece7d8', '#9a9886', '14,17,11'),
  css='',
  bg='''el.style.background='#0e110b'; const o=canvasIn(el); const peaks=Array.from({length:6},(_,i)=>({x:Math.random(),y:Math.random(),r:.18+Math.random()*.22,s:Math.random()*6})); let t=0;
  return {tick(){t+=.0025;const{x,W,H}=o;x.clearRect(0,0,W,H);peaks.forEach((p,pi)=>{for(let k=1;k<12;k++){const R=k/12*p.r*Math.max(W,H);x.strokeStyle=k%4==0?'rgba(236,231,216,.16)':'rgba(236,231,216,.07)';x.lineWidth=k%4==0?1.2:.8;x.beginPath();for(let a=0;a<=6.3;a+=.08){const n=Math.sin(a*3+p.s+t*2)*.12+Math.sin(a*5-p.s+k*.4)*.06;const rr=R*(1+n);const px=p.x*W+Math.cos(a)*rr+Math.sin(t+pi)*20,py=p.y*H+Math.sin(a)*rr*.8;a?x.lineTo(px,py):x.moveTo(px,py);}x.closePath();x.stroke();}});}};'''),
 dict(name='Перспективная сетка', about='графитовый, электрический синий и малиновый; фон — бесконечный пол-сетка, уходящий к горизонту, со светящейся линией горизонта',
  vars=v('#06060b', '#eef1ff', '#8b90aa', '#4da3ff', '#020814', '#ff4d6d', '#0d0f1a', '#121526', '#ffffff14', '#e9ecfb', '#8a8fab', '6,6,11'),
  css='',
  bg='''el.style.background='linear-gradient(#06060b 0%,#06060b 52%,#0a0c1c 100%)'; const o=canvasIn(el); let t=0;
  return {tick(){t+=.006;const{x,W,H}=o;x.clearRect(0,0,W,H);const hz=H*.56,cx=W/2;const g=x.createLinearGradient(0,hz-60,0,hz+10);g.addColorStop(0,'rgba(77,163,255,0)');g.addColorStop(1,'rgba(77,163,255,.35)');x.fillStyle=g;x.fillRect(0,hz-60,W,70);x.strokeStyle='rgba(77,163,255,.7)';x.lineWidth=1.2;x.beginPath();x.moveTo(0,hz);x.lineTo(W,hz);x.stroke();
  for(let i=-24;i<=24;i++){x.strokeStyle=`rgba(77,163,255,${.18-Math.abs(i)*.005})`;x.lineWidth=1;x.beginPath();x.moveTo(cx+i*8,hz);x.lineTo(cx+i*W*.16,H);x.stroke();}
  for(let k=0;k<22;k++){const z=((k+t*6)%22)/22,y=hz+(H-hz)*z*z;x.strokeStyle=`rgba(77,163,255,${.06+z*.28})`;x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke();}}};'''),
 dict(name='Созвездия', about='глубокий фиолетовый, тёплое золото; фон — звёздное небо с параллаксом и линиями созвездий между ближними звёздами',
  vars=v('#0b0816', '#f4efff', '#a49bc0', '#ffd36b', '#1a1206', '#ff6b9a', '#140f24', '#19132d', '#ffffff14', '#efe9fb', '#9d94b8', '11,8,22'),
  css='',
  bg='''el.style.background='radial-gradient(ellipse at 70% 20%,#1d1236,#0b0816 60%)'; const o=canvasIn(el); const S=Array.from({length:260},()=>({x:Math.random(),y:Math.random(),z:Math.random(),tw:Math.random()*6})); let t=0;
  return {tick(_,p){t+=.01;const{x,W,H}=o;x.clearRect(0,0,W,H);const pts=S.map(s=>({X:((s.x+p*.2*s.z)%1)*W,Y:s.y*H,s}));pts.forEach(({X,Y,s})=>{x.fillStyle=`rgba(255,240,210,${.25+s.z*.6*(.6+.4*Math.sin(t*2+s.tw))})`;x.beginPath();x.arc(X,Y,.5+s.z*1.6,0,7);x.fill();});
  x.strokeStyle='rgba(255,211,107,.12)';x.lineWidth=.8;for(let i=0;i<pts.length;i++){if(pts[i].s.z<.75)continue;for(let j=i+1;j<pts.length;j++){if(pts[j].s.z<.75)continue;const d=Math.hypot(pts[i].X-pts[j].X,pts[i].Y-pts[j].Y);if(d<130){x.beginPath();x.moveTo(pts[i].X,pts[i].Y);x.lineTo(pts[j].X,pts[j].Y);x.stroke();}}}}};'''),
 dict(name='Рассвет', about='тёплый градиент рассвета — коралл, персик, фиолет — медленно перетекает; тёмная вуаль держит текст читаемым',
  vars=v('#170d1c', '#fff7ef', '#d8bfc4', '#ffe08a', '#2a1a04', '#ff5a6a', '#21142a', '#291934', '#ffffff1c', '#fff4ec', '#cdb3bb', '23,13,28'),
  css='@keyframes m1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(18%,12%) scale(1.25)}}@keyframes m2{0%,100%{transform:translate(0,0) scale(1.1)}50%{transform:translate(-16%,-10%) scale(.9)}}',
  bg='''el.style.background='#170d1c'; [['#ff7a59','8%','10%','m1',18],['#7b5cff','55%','40%','m2',22],['#ffb38a','30%','70%','m2',26],['#ff3d77','75%','5%','m1',30]].forEach(([c,l,t,a,d])=>{const b=document.createElement('div');b.style.cssText=`position:absolute;left:${l};top:${t};width:55vmax;height:55vmax;margin:-20vmax;border-radius:50%;background:radial-gradient(circle,${c},transparent 65%);opacity:.75;filter:blur(30px);animation:${a} ${d}s ease-in-out infinite`;el.append(b);});
  const veil=document.createElement('div');veil.style.cssText='position:absolute;inset:0;background:rgba(23,13,28,.42)';el.append(veil); return {};'''),
 dict(name='Газета', about='печатная бумага, чернила, кобальт и сигнальный красный; фон — колонки газетного текста и растровая точка',
  vars=v('#ece9e1', '#111111', '#55534d', '#0b3bff', '#ffffff', '#e4002b', '#f7f5ef', '#ffffff', '#11111122', '#111111', '#66645d', '236,233,225'),
  css='.card{box-shadow:0 14px 30px -18px #11111166;border-radius:6px}.card .ic{border-radius:4px}.num{letter-spacing:-.07em}.agent{border-radius:8px}',
  bg='''el.style.background='radial-gradient(#11111118 1px,transparent 1.2px) 0 0/6px 6px,#ece9e1'; const cols=document.createElement('div');cols.style.cssText='position:absolute;inset:4vh 3vw;display:grid;grid-template-columns:repeat(6,1fr);gap:2vw;opacity:.22';
  for(let i=0;i<6;i++){const c=document.createElement('div');c.style.cssText='background:repeating-linear-gradient(#111 0 2px,transparent 2px 11px);-webkit-mask:linear-gradient(90deg,#000 0 '+(70+Math.random()*30)+'%,transparent 0);border-top:6px solid #111;padding-top:8px';cols.append(c);} el.append(cols);
  const head=document.createElement('div');head.textContent='ВЕДОМОСТИ РУТИНЫ';head.style.cssText='position:absolute;top:9vh;left:0;right:0;text-align:center;font:900 9vw/1 Onest,sans-serif;letter-spacing:-.04em;color:#111;opacity:.06';el.append(head); return {};'''),
 dict(name='Поток', about='тёмно-изумрудный и мята с янтарём; фон — тысячи частиц, текущих по невидимому полю, оставляя тонкие следы',
  vars=v('#03100d', '#e9f8f2', '#80a89b', '#5ef2c0', '#03140d', '#ff9d4d', '#0a1a16', '#0e221d', '#ffffff14', '#e3f4ee', '#7aa093', '3,16,13'),
  css='',
  bg='''el.style.background='#03100d'; const o=canvasIn(el); const P=Array.from({length:innerWidth<760?500:1100},()=>({x:Math.random(),y:Math.random()})); let t=0;
  o.onfit=()=>{o.x.fillStyle='#03100d';o.x.fillRect(0,0,o.W,o.H);};o.onfit();
  return {tick(_,p){t+=.004;const{x,W,H}=o;x.fillStyle='rgba(3,16,13,.09)';x.fillRect(0,0,W,H);x.fillStyle=p>.55?'rgba(94,242,192,.55)':'rgba(255,157,77,.45)';
  P.forEach(q=>{const a=Math.sin(q.x*6+t)*Math.cos(q.y*5-t*1.3)*3.2+t;q.x+=Math.cos(a)*.0009;q.y+=Math.sin(a)*.0009;if(q.x<0||q.x>1||q.y<0||q.y>1){q.x=Math.random();q.y=Math.random();}x.fillRect(q.x*W,q.y*H,1.2,1.2);});}};'''),
]

for i, th in enumerate(THEMES, 1):
    d = ROOT / f'{i:02d}'
    d.mkdir(exist_ok=True)
    (d / 'index.html').write_text(HEAD.format(n=i, **th), encoding='utf-8')

cards = '\n'.join(
    f'<a class="c" href="{i:02d}/"><span class="sw">' + ''.join(f'<i style="background:{c}"></i>' for c in [th["vars"].split("--ink:")[1].split(";")[0], th["vars"].split("--fg:")[1].split(";")[0], th["vars"].split("--acc:")[1].split(";")[0], th["vars"].split("--hot:")[1].split(";")[0]]) +
    f'</span><span class="n">{i:02d}</span><span class="t">{th["name"]}</span><span class="d">{th["about"][0].upper() + th["about"][1:]}.</span></a>'
    for i, th in enumerate(THEMES, 1))
(ROOT / 'index.html').write_text(f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Восток AI · 10 тем «Счётчика»</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;800&family=JetBrains+Mono:wght@500&display=swap">
<style>
:root{{--ink:#07090c;--card:#0d1217;--line:#1c252e;--fg:#eef3f6;--muted:#7f8e99;--acc:#5ef2c0}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--ink);color:var(--fg);font:16px/1.5 Onest,system-ui,sans-serif}}
.w{{max-width:1180px;margin:0 auto;padding:52px max(20px,env(safe-area-inset-left,0px)) 80px}}
a.b{{font:500 12px "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);text-decoration:none}}
h1{{font-weight:800;font-size:clamp(30px,4.6vw,56px);letter-spacing:-.035em;line-height:1;margin:16px 0 10px}}
p.l{{color:var(--muted);max-width:66ch;margin:0 0 34px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));gap:14px}}
a.c{{display:flex;flex-direction:column;gap:6px;padding:22px;border:1px solid var(--line);border-radius:16px;background:var(--card);color:inherit;text-decoration:none;transition:border-color .2s,transform .2s}}
a.c:hover,a.c:focus-visible{{border-color:var(--acc);transform:translateY(-2px);outline:none}}
.sw{{display:flex;gap:6px;margin-bottom:6px}}.sw i{{width:26px;height:26px;border-radius:7px;border:1px solid #ffffff22}}
.n{{font:500 12px "JetBrains Mono",monospace;letter-spacing:.16em;color:var(--acc)}}
.t{{font-weight:800;font-size:23px;letter-spacing:-.02em}}.d{{color:var(--muted);font-size:14px}}
</style></head><body><div class="w"><a class="b" href="../">← все сюжеты</a>
<h1>Восток AI · «Счётчик» в 10 темах</h1>
<p class="l">Анимация одна и та же — как в первом «Счётчике». Меняются только задний фон и палитра. Карточки сообщений доработаны: настоящие уведомления мессенджеров, почты, 1С и звонков, с глубиной и размытием дальних. Темы 01 и 02 — в фирменной палитре Claude.</p>
<div class="g">
{cards}
</div></div></body></html>
''', encoding='utf-8')
print('ok', len(THEMES))
