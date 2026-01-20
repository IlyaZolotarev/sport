
/* Smart Fitness Quiz Landing — no frameworks, mobile-first, smooth UX */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

const STEPS = [
  { theme:"good", hero:"illu-dumbbell.svg", kicker:"Персонализация", q:"Какая у тебя главная цель?", sub:"Выберем стратегию: жиросжигание, сила или выносливость.", type:"cards",
    a:[["Похудеть","Минус вес без жести","🔥"],["Набрать мышцу","Рост силы и объёма","💪"],["Поддерживать форму","Стабильный тонус","✨"],["Выносливость","Больше энергии","🏃"],["Восстановление","Мягкий режим","🧘"]] },

  { theme:"blue", hero:"illu-run.svg", kicker:"Темп", q:"Сколько дней в неделю реально готов тренироваться?", sub:"Не «как надо», а как ты потянешь на дистанции.", type:"tiles",
    a:[["1–2","Минимум, но стабильно","🗓️"],["3","Оптимум","🎯"],["4","Уже серьёзно","⚡"],["5","Пушка","🚀"],["6–7","Спорт-режим","🏆"]] },

  { theme:"pink", hero:"illu-heart.svg", kicker:"Безопасность", q:"Есть ли ограничения по здоровью?", sub:"Мы просто подберём нагрузку аккуратно.", type:"chips_thinking",
    a:[["Нет","Тренируемся смело","✅"],["Спина","Берём бережно","🦴"],["Колени","Без ударных нагрузок","🦵"],["Сердце/давление","Контроль интенсивности","❤️"],["Другое","Уточним позже","🩺"]] },

  { theme:"good", hero:"illu-dumbbell.svg", kicker:"Оборудование", q:"Что у тебя есть под рукой?", sub:"Подстроим упражнения под реальность.", type:"grid2_button",
    a:[["Только вес тела","Без инвентаря","🤸"],["Гантели","Классика","🏋️"],["Резинки","Тихо и эффективно","🧷"],["Зал","Полный арсенал","🏟️"],["Смешанное","Чередую","🔀"]] },

  { theme:"blue", hero:"illu-run.svg", kicker:"Время", q:"Сколько времени на одну тренировку?", sub:"Короткие сессии тоже работают, если грамотно.", type:"cards_auto",
    a:[["10–15 мин","Микро‑привычка","⏱️"],["20–30 мин","Золотая середина","🥇"],["35–45 мин","Полноценно","🧩"],["60+ мин","Глубокая работа","🧱"],["По-разному","Адаптивно","🌗"]] },

  // 20 more — with real sporty questions
];

// Fill to 25 steps with varied, meaningful fitness questions
const extra = [
  ["Где ты чаще тренируешься?","Место влияет на программу и мотивацию.","layout_cards", [["Дома","Комфорт","🏠"],["В зале","Оборудование","🏟️"],["На улице","Свежий воздух","🌲"],["Комбо","Гибкость","🔁"],["Пока не знаю","Подскажите","🧭"]]],
  ["Что больше всего мешает заниматься?","Уберём главную «занозу».","thinking", [["Нет времени","Соберём короткие тренировки","⏳"],["Нет мотивации","Сделаем лёгкий старт","🧠"],["Устаю","Учтём восстановление","😴"],["Скучно","Добавим разнообразие","🎲"],["Боюсь травм","Мягкая прогрессия","🛡️"]]],
  ["Как ты относишься к силовым?","Чтобы понять фокус нагрузки.","grid2", [["Люблю","Будет база","🏋️"],["Норм","Добавим дозировано","👌"],["Не люблю","Сделаем мягче","🧸"],["Боюсь","Начнём с простого","🧩"],["Не пробовал","Покажем вход","🚪"]]],
  ["Кардио: что выбираешь?","Сердце скажет спасибо.","tiles", [["Ходьба","Низкий порог","🚶"],["Бег","Интенсивно","🏃"],["Велосипед","Мягко для суставов","🚴"],["Интервалы","Эффектно","⚡"],["Не люблю","Подберём замену","🫥"]]],
  ["Тебе важнее…","Выберем стиль плана.","chips_button", [["Быстро увидеть результат","Драйв","🚀"],["Комфорт и привычка","Дистанция","🧘"],["Чёткий режим","Структура","📌"],["Разнообразие","Не скучно","🎭"],["Минимум нагрузки","Супер-лайт","🌙"]]],
  ["Какой стиль тренировки тебе ближе?","Подстроим формат упражнений.","cards", [["Круговая","Поток","🔄"],["Подходы/повторы","Сила","🧱"],["Йога/мобилити","Гибкость","🧘‍♂️"],["HIIT","Жарко","🔥"],["Смешанный","Баланс","⚖️"]]],
  ["Твои любимые зоны работы?","Чтобы не делать то, что бесит.","grid2", [["Ноги","База","🦵"],["Спина","Осанка","🧍"],["Руки","Тонус","💪"],["Пресс","Кор","🧱"],["Всё равно","Ок","🟣"]]],
  ["Сколько ты обычно спишь?","Сон = прогресс.","thinking", [["<6 часов","Оптимизируем нагрузку","🌑"],["6–7","Норм","🌗"],["7–8","Идеально","🌕"],["8+","Восстановление топ","😴"],["По-разному","Адаптируем","🔁"]]],
  ["Питание сейчас…","Не диета, а контекст.","tiles", [["Хаос","Сделаем простые правила","🧾"],["Более-менее","Поддержим","✅"],["Считаю калории","Точно","🧮"],["Интуитивно","Мягко","🍃"],["Планирую начать","Поможем стартом","🚦"]]],
  ["Тебе нужен план под…","Ритм жизни решает.","grid2", [["Работа/офис","Сидячий режим","💻"],["Удалёнка","Дома","🏠"],["Смена/ночь","Сложный график","🌙"],["Учёба","Нерегулярно","📚"],["Другое","Ок","🧩"]]],
  ["Тренироваться предпочитаешь…","Социальный фактор важен.","chips", [["Один","Свой темп","🧍"],["С другом","Поддержка","🤝"],["С тренером","Контроль","🧑‍🏫"],["С группой","Комьюнити","👥"],["Не важно","Ок","🟣"]]],
  ["Какой уровень стресса сейчас?","Чтобы не перегрузить.","thinking", [["Низкий","Можно жать","🟢"],["Средний","Сбалансируем","🟡"],["Высокий","Больше восстанов.","🟠"],["Очень высокий","Мягкий план","🔴"],["Не знаю","Определим по самочувствию","🧠"]]],
  ["Сколько ты сейчас двигаешься в день?","NEAT влияет на результат.","cards_auto", [["Мало","Добавим шаги","🐾"],["Норм","Поддержим","✅"],["Много","Учтём нагрузку","🏃‍♂️"],["Очень много","Беречь восстановление","🛠️"],["Не знаю","Оценим","📏"]]],
  ["Планируем прогресс по…","Выбор метрики.","grid2_button", [["Весам","Числа","⚖️"],["Фото/зеркало","Визуально","📸"],["Силе","Повторы/вес","🏋️"],["Самочувствию","Энергия","✨"],["Окружности","Талия и т.д.","📏"]]],
  ["Насколько ты хочешь «жёстко»?","Уровень дискомфорта.","tiles", [["Очень мягко","Лайтово","🧸"],["Умеренно","Здорово","🌿"],["Нормально","Работаем","🛠️"],["Жёстко","Топлю","🔥"],["Как получится","Адаптивно","🔁"]]],
  ["Частота растяжки/мобилити?","Чтобы не ломало тело.","cards", [["Никогда","Сделаем минимум","🧩"],["Иногда","Добавим","🧘"],["Регулярно","Отлично","✅"],["После каждой тренировки","Топ","🌟"],["Не знаю","Покажем как","🎥"]]],
  ["Какой формат подсказок нравится?","UX под тебя.","chips_button", [["Коротко","Без воды","⚡"],["С пояснениями","Понимать","🧠"],["С видео","Наглядно","🎬"],["С таймером","Ритм","⏲️"],["Комбо","Лучшее","🧩"]]],
  ["Что важнее в приложении?","Приоритизация фич.","grid2", [["Планы","Программа","🗺️"],["Трекер","Прогресс","📈"],["Таймер","Темп","⏱️"],["Напоминания","Дисциплина","🔔"],["Музыка/вайб","Настроение","🎧"]]],
  ["Тебя мотивирует…","Психология мотивации.","thinking", [["Серия дней (streak)","Не срываться","🔥"],["Награды","Геймификация","🏆"],["Чек-лист","Закрывать задачи","✅"],["Цифры/графики","Метрики","📊"],["Сообщество","Поддержка","👥"]]],
  ["Когда удобнее тренироваться?","Чтобы план жил.","tiles", [["Утром","Свежее начало","🌅"],["Днём","Пауза","☀️"],["Вечером","После дел","🌆"],["Ночью","Если так живёшь","🌙"],["Плаваю","Адаптируем","🔁"]]],
];

// Add extra steps until 25 total
for (const item of extra){
  if (STEPS.length >= 25) break;
  const [q, sub, mode, ans] = item;
  const typeMap = {
    "layout_cards":"cards",
    "thinking":"cards_thinking",
    "grid2":"grid2",
    "tiles":"tiles",
    "chips":"chips",
    "chips_button":"chips_button",
    "cards_auto":"cards_auto",
    "grid2_button":"grid2_button"
  };
  STEPS.push({
    theme: ["good","blue","pink"][STEPS.length % 3],
    hero: ["illu-dumbbell.svg","illu-run.svg","illu-heart.svg"][STEPS.length % 3],
    kicker: "Шаг "+(STEPS.length+1),
    q, sub,
    type: typeMap[mode] || "cards",
    a: ans
  });
}

// Ensure exactly 25 steps
STEPS.length = 25;

const state = {
  i: 0,
  answers: Array(STEPS.length).fill(null),
  autoNext: true,
  awaiting: false
};

const dom = {
  heroImg: $("#heroImg"),
  badgeTitle: $("#badgeTitle"),
  badgeSub: $("#badgeSub"),
  prog: $("#progFill"),
  dots: $("#dots"),
  kicker: $("#kicker"),
  title: $("#title"),
  sub: $("#sub"),
  opts: $("#opts"),
  back: $("#backBtn"),
  next: $("#nextBtn"),
  hint: $("#hint"),
  tag: $("#tag"),
  sideTitle: $("#sideTitle"),
  sideText: $("#sideText"),
  stat1: $("#stat1"),
  stat2: $("#stat2"),
  stat3: $("#stat3"),
  confetti: $("#confetti")
};

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function pct(){ return (state.i / (STEPS.length)) * 100; }

function themeToAccent(theme){
  if(theme==="pink") return ["var(--pink)","var(--blue)"];
  if(theme==="blue") return ["var(--blue)","var(--good)"];
  return ["var(--good)","var(--blue)"];
}

function renderDots(){
  dom.dots.innerHTML = "";
  const total = 8; // show compact indicator
  const progress = state.i / (STEPS.length-1);
  const onIdx = Math.round(progress * (total-1));
  for(let k=0;k<total;k++){
    const d = document.createElement("div");
    d.className = "dot" + (k<=onIdx ? " on" : "");
    dom.dots.appendChild(d);
  }
}

function sideCopy(){
  const blocks = [
    ["План под тебя", "Мы не продаём волшебство — мы настраиваем реалистичный режим, чтобы ты не слился на 5‑й день."],
    ["Микро‑привычки", "Даже 10–15 минут дают результат, если делать это регулярно. Мы соберём «порог входа» низким."],
    ["Безопасная нагрузка", "Учтём суставы, сон и стресс. Сначала стабильность — потом ускорение."],
    ["Прогресс видно", "Трекер привычки, сила/кардио, и понятные метрики. Без бесконечной теории."],
  ];
  return blocks[state.i % blocks.length];
}

function fakeStats(){
  // purely visual micro-interaction
  const base = 42 + (state.i*3)%40;
  const s1 = clamp(base + (state.answers[state.i] ?? 0)*2, 35, 92);
  const s2 = clamp(55 + (state.i*5)%35, 40, 95);
  const s3 = clamp(48 + ((state.answers[state.i] ?? 0)*7)%40, 35, 96);
  dom.stat1.textContent = s1 + "%";
  dom.stat2.textContent = s2 + "%";
  dom.stat3.textContent = s3 + "%";
}

function setHero(step){
  dom.heroImg.src = "./assets/" + step.hero;
  dom.badgeTitle.textContent = "Smart Fitness";
  dom.badgeSub.textContent = "Квиз • " + (state.i+1) + "/25";
}

function renderOptions(step){
  const selected = state.answers[state.i];
  const type = step.type;

  dom.opts.className = "options" + ((type.includes("grid2") || type==="tiles") ? " grid2" : "");
  dom.opts.innerHTML = "";

  const makeOpt = (idx, label, desc, emoji) => {
    const el = document.createElement("div");
    el.className = "opt" + (selected===idx ? " selected" : "");
    el.tabIndex = 0;
    el.setAttribute("role","button");
    el.setAttribute("aria-label", label);
    el.addEventListener("click", ()=>choose(idx));
    el.addEventListener("keydown", (e)=>{
      if(e.key==="Enter" || e.key===" "){ e.preventDefault(); choose(idx); }
    });

    // visual variants
    const ico = document.createElement("div");
    ico.className = "ico";
    const s = document.createElement("span");
    s.textContent = emoji || "•";
    ico.appendChild(s);

    const txt = document.createElement("div");
    txt.className = "txt";
    const b = document.createElement("b");
    b.textContent = label;
    const sm = document.createElement("small");
    sm.textContent = desc || " ";
    txt.appendChild(b);
    txt.appendChild(sm);

    el.appendChild(ico);
    el.appendChild(txt);

    // chips style
    if(type.startsWith("chips")){
      el.style.padding = "10px 12px";
      el.style.borderRadius = "999px";
      el.style.display = "inline-flex";
      el.style.width = "fit-content";
      el.style.maxWidth = "100%";
      el.style.whiteSpace = "nowrap";
      el.style.overflow = "hidden";
      el.style.textOverflow = "ellipsis";
      el.style.gap = "10px";
    }

    // tiles style
    if(type==="tiles"){
      el.style.flexDirection = "column";
      el.style.alignItems = "flex-start";
      el.querySelector(".ico").style.width = "100%";
      el.querySelector(".ico").style.height = "46px";
      el.querySelector(".ico").style.borderRadius = "14px";
      el.querySelector(".ico").style.justifyItems = "start";
      el.querySelector(".ico").style.placeItems = "center";
      el.querySelector(".ico").style.paddingLeft = "12px";
      el.querySelector(".txt b").style.fontSize = "14px";
    }

    return el;
  };

  if(type.startsWith("chips")){
    dom.opts.classList.remove("grid2");
    dom.opts.style.display = "flex";
    dom.opts.style.flexWrap = "wrap";
    dom.opts.style.gap = "10px";
  } else {
    dom.opts.style.display = "";
    dom.opts.style.flexWrap = "";
  }

  step.a.forEach((item, idx)=>{
    const [label, desc, emoji] = item;
    dom.opts.appendChild(makeOpt(idx, label, desc, emoji));
  });
}

function setButtons(step){
  dom.back.disabled = state.i === 0 || state.awaiting;
  const needsButton = step.type.includes("_button") || step.type === "grid2_button" || step.type === "chips_button";
  const hasSelected = state.answers[state.i] !== null;
  dom.next.style.display = needsButton ? "inline-flex" : "none";
  dom.next.disabled = state.awaiting || !hasSelected;

  dom.hint.textContent = needsButton
    ? (hasSelected ? "Готово. Жми «Далее»." : "Выбери вариант, чтобы разблокировать «Далее».")
    : "Выбор сохранён автоматически.";
}

function tagLine(step){
  const tags = ["План без воды","Под твой график","Фокус на привычке","Учитываем восстановление","Реалистичный темп","Делаем красиво"];
  dom.tag.textContent = tags[state.i % tags.length];
}

function render(){
  const step = STEPS[state.i];

  // progress
  dom.prog.style.width = pct() + "%";
  renderDots();

  // copy
  dom.kicker.textContent = step.kicker;
  dom.title.textContent = step.q;
  dom.sub.textContent = step.sub;

  setHero(step);
  renderOptions(step);
  setButtons(step);
  tagLine(step);

  // side
  const [st, tx] = sideCopy();
  dom.sideTitle.textContent = st;
  dom.sideText.textContent = tx;
  fakeStats();

  dom.confetti.innerHTML = "";
}

function choose(idx){
  if(state.awaiting) return;
  state.answers[state.i] = idx;
  $$(".opt", dom.opts).forEach((o, i)=>{
    o.classList.toggle("selected", i===idx);
  });

  const step = STEPS[state.i];
  setButtons(step);

  // behaviors by type
  if(step.type.includes("thinking")){
    doThinkingThen(()=>{
      if(step.type.includes("_button")){
        // stays, needs next
      } else {
        goNext();
      }
    });
    return;
  }

  if(step.type.includes("_button")){
    // do nothing, wait for user to press next
    return;
  }

  // auto next, small delay for premium feel
  window.setTimeout(()=>goNext(), 260);
}

function doThinkingThen(cb){
  state.awaiting = true;
  setButtons(STEPS[state.i]);
  dom.opts.classList.add("fadeIn");
  dom.opts.innerHTML = `
    <div class="loader"><i></i><i></i><i></i></div>
    <div class="skeleton">
      <div class="sk" style="width:78%"></div>
      <div class="sk" style="width:92%"></div>
      <div class="sk" style="width:66%"></div>
      <div class="sk" style="width:84%"></div>
    </div>
    <div class="hintRow" style="margin-top:12px">
      <div class="hint">Система подбирает нагрузку на основе твоего выбора…</div>
      <div class="tag">~1 сек</div>
    </div>
  `;
  dom.hint.textContent = "Подбираем оптимальный следующий вопрос…";

  window.setTimeout(()=>{
    state.awaiting = false;
    cb?.();
    render();
  }, 1150);
}

function goNext(){
  if(state.i >= STEPS.length-1){
    showResult();
    return;
  }
  state.i++;
  render();
}

function goBack(){
  if(state.awaiting) return;
  if(state.i === 0) return;
  state.i--;
  render();
}

function showResult(){
  // Confetti
  const colors = ["var(--good)","var(--blue)","var(--pink)","#fff"];
  for(let i=0;i<44;i++){
    const s = document.createElement("span");
    s.style.left = (Math.random()*100) + "%";
    s.style.top = (-20 - Math.random()*160) + "px";
    s.style.background = colors[i%colors.length];
    s.style.animationDelay = (Math.random()*0.35) + "s";
    s.style.transform = `translateY(-30px) rotate(${Math.random()*180}deg)`;
    dom.confetti.appendChild(s);
  }

  dom.kicker.textContent = "Готово";
  dom.title.textContent = "План собран. Осталось начать.";
  dom.sub.textContent = "Мы скомпоновали программу под цель, график и ограничения. Никакой магии — только умная структура.";

  dom.opts.className = "options";
  dom.opts.style.display = "grid";
  dom.opts.innerHTML = `
    <div class="miniCard fadeIn">
      <h3>Твой стартовый режим</h3>
      <p>Первые 7 дней — лёгкий вход. Затем повышаем нагрузку постепенно.</p>
      <div class="statRow">
        <div class="stat"><b>${55 + (state.answers[0]||0)*6}%</b><small>интенсивность</small></div>
        <div class="stat"><b>${2 + (state.answers[1]||0)}–${3 + (state.answers[1]||0)}x</b><small>в неделю</small></div>
        <div class="stat"><b>${15 + (state.answers[4]||0)*10} мин</b><small>сессия</small></div>
      </div>
    </div>

    <div class="miniCard fadeIn">
      <h3>Что дальше</h3>
      <p>Открой приложение, получи первую тренировку и включи напоминания. Это реально помогает держать темп.</p>
      <div class="actions" style="margin-top:12px">
        <button class="btn secondary" id="restartBtn">Пройти снова</button>
        <button class="btn primary" id="ctaBtn">Открыть приложение</button>
      </div>
      <div class="hintRow" style="margin-top:10px">
        <div class="hint">CTA можно привязать к ссылке на стор.</div>
        <div class="tag">Smart</div>
      </div>
    </div>
  `;

  dom.prog.style.width = "100%";
  dom.back.disabled = true;
  dom.next.style.display = "none";
  dom.hint.textContent = "Если хочешь — пройди квиз заново и сравни ответы.";

  $("#restartBtn")?.addEventListener("click", ()=>{
    state.i = 0;
    state.answers = Array(STEPS.length).fill(null);
    dom.confetti.innerHTML = "";
    render();
  });
  $("#ctaBtn")?.addEventListener("click", ()=>{
    // TODO: replace with real store link
    alert("Подставь сюда ссылку на App Store / Google Play 🙂");
  });
}

dom.back.addEventListener("click", goBack);
dom.next.addEventListener("click", goNext);

render();
