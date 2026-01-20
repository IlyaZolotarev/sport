(() => {
  // --- Mobile viewport fix (avoid "100vh" jump on mobile browsers) ---
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };
  window.addEventListener("resize", setVh, { passive: true });
  setVh();

  // --- Helpers ---
  const $ = (id) => document.getElementById(id);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const STORAGE_KEY = "sportplan_quiz_v1";

  const icons = {
    goal: "🎯",
    level: "📈",
    place: "📍",
    time: "⏱️",
    freq: "🗓️",
    focus: "🧩",
    cardio: "🏃",
    pain: "🛡️",
    equip: "🎒",
    style: "🧠",
    music: "🎧",
    schedule: "🕒",
    sleep: "😴",
    food: "🥗",
    stress: "🧘",
    water: "💧",
    steps: "👣",
    warmup: "🔥",
    mobility: "🧎",
    intensity: "⚡",
    tracking: "📊",
    coach: "🤝",
    notif: "🔔",
    vibe: "✨",
    finish: "✅",
    compute: "🧪",
  };

  // --- Step definition ---
  // interaction modes:
  // - "auto": next immediately after selection
  // - "next": selection enables Next button
  // - "confirm": selection shows micro-confirm, then auto next
  // - "think": after selection, show overlay for 3-7s, then next
  // - "thinkNext": selection enables Next; on Next show overlay then next
  // - "doubleTap": selection requires tap the same option again to confirm (variety)
  const steps = [
    {
      key: "goal",
      icon: icons.goal,
      theme: "theme-a",
      mood: "⚡ Быстро",
      title: "Какая главная цель на ближайшие 8 недель?",
      sub: "Мы подстроим нагрузку и прогрессию, чтобы это было реально.",
      interaction: "auto",
      hint: "Цель помогает выбрать формат: сила / жиросжигание / выносливость.",
      options: [
        { id: "lose", label: "Похудение", icon: "🔥", meta: "дефицит + шаги" },
        { id: "muscle", label: "Набор мышц", icon: "🏋️", meta: "объём" },
        { id: "strength", label: "Сила", icon: "🧱", meta: "база" },
        { id: "endurance", label: "Выносливость", icon: "🏃‍♂️", meta: "кардио" },
        { id: "fit", label: "Держать форму", icon: "✅", meta: "баланс" },
      ],
    },
    {
      key: "level",
      icon: icons.level,
      theme: "theme-a",
      mood: "🧠 Умно",
      title: "Твой текущий уровень тренировок?",
      sub: "Нужно, чтобы старт был комфортным, без выгорания.",
      interaction: "confirm",
      hint: "Уровень влияет на стартовую сложность и темп повышения нагрузки.",
      options: [
        { id: "zero", label: "С нуля", icon: "🌱", meta: "легкий старт" },
        { id: "sometimes", label: "Иногда", icon: "🙂", meta: "1–2/нед" },
        { id: "steady", label: "Стабильно", icon: "💪", meta: "3/нед" },
        { id: "advanced", label: "Продвинутый", icon: "🔥", meta: "4–5/нед" },
        { id: "return", label: "После паузы", icon: "🔄", meta: "вернуться" },
      ],
    },
    {
      key: "place",
      icon: icons.place,
      theme: "theme-b",
      mood: "📍 Где угодно",
      title: "Где чаще будешь тренироваться?",
      sub: "Под это подберём упражнения и инвентарь.",
      interaction: "next",
      hint: "Дом/зал меняют доступные упражнения и прогрессию.",
      options: [
        { id: "home", label: "Дома", icon: "🏠", meta: "минимум" },
        { id: "gym", label: "В зале", icon: "🏋️‍♀️", meta: "максимум" },
        { id: "out", label: "На улице", icon: "🌳", meta: "парк" },
        { id: "mix", label: "Комбо", icon: "🧩", meta: "гибко" },
        { id: "any", label: "Где получится", icon: "🧭", meta: "без привязки" },
      ],
    },
    {
      key: "session_duration",
      icon: icons.time,
      theme: "theme-b",
      mood: "⏱️ Реально",
      title: "Сколько времени на одну тренировку?",
      sub: "Лучший план — тот, который выполняется.",
      interaction: "auto",
      hint: "Время определяет объём: сколько упражнений и подходов мы дадим.",
      options: [
        { id: "15", label: "10–15 минут", icon: "⚡", meta: "микро" },
        { id: "30", label: "20–30 минут", icon: "⏱️", meta: "база" },
        { id: "45", label: "35–45 минут", icon: "📌", meta: "серьёзно" },
        { id: "60", label: "60 минут", icon: "🏁", meta: "полный" },
        { id: "var", label: "По-разному", icon: "🎲", meta: "гибко" },
      ],
    },
    {
      key: "freq",
      icon: icons.freq,
      theme: "theme-c",
      mood: "🗓️ Ритм",
      title: "Сколько тренировок в неделю потянешь стабильно?",
      sub: "Стабильность важнее героизма.",
      interaction: "think",
      hint: "Частота влияет на восстановление и прогрессию.",
      overlay: {
        title: "Подбираем оптимальную частоту…",
        hint: "Сверяем нагрузку и восстановление",
        variant: "bar",
      },
      options: [
        { id: "1", label: "1", icon: "①", meta: "мягко" },
        { id: "2", label: "2", icon: "②", meta: "норм" },
        { id: "3", label: "3", icon: "③", meta: "оптимум" },
        { id: "4", label: "4", icon: "④", meta: "серьёзно" },
        { id: "5", label: "5+", icon: "⑤", meta: "высоко" },
      ],
    },
    {
      key: "focus_area",
      icon: icons.focus,
      theme: "theme-c",
      mood: "🧩 Акцент",
      title: "На что хочешь сделать акцент?",
      sub: "Мы всё равно держим баланс, но акцент добавим.",
      interaction: "next",
      hint: "Акцент поможет сделать план «твоим», не ломая здоровье.",
      options: [
        { id: "full", label: "Всё тело", icon: "🧍", meta: "равномерно" },
        { id: "legs", label: "Ноги/ягодицы", icon: "🦵", meta: "низ" },
        { id: "back", label: "Спина/осанка", icon: "🧘‍♂️", meta: "ровно" },
        { id: "core", label: "Пресс/кор", icon: "🧱", meta: "центр" },
        { id: "arms", label: "Руки/плечи", icon: "💪", meta: "верх" },
      ],
    },
    {
      key: "cardio_attitude",
      icon: icons.cardio,
      theme: "theme-d",
      mood: "🏃 Кардио",
      title: "Кардио — это…",
      sub: "Мы не будем заставлять, но можем добавить по уму.",
      interaction: "doubleTap",
      hint: "Отношение к кардио влияет на формат и мотивацию.",
      options: [
        { id: "love", label: "Люблю, хочу чаще", icon: "😍", meta: "ок" },
        { id: "ok", label: "Норм, умеренно", icon: "🙂", meta: "баланс" },
        { id: "onlyWarm", label: "Только разминка", icon: "🔥", meta: "минимум" },
        { id: "hate", label: "Не люблю", icon: "🙃", meta: "без боли" },
        { id: "noTime", label: "Нет времени", icon: "⏳", meta: "коротко" },
      ],
    },
    {
      key: "pain",
      icon: icons.pain,
      theme: "theme-d",
      mood: "🛡️ Безопасно",
      title: "Есть ли проблемные зоны/ограничения?",
      sub: "Мы подберём безопасные альтернативы.",
      interaction: "thinkNext",
      hint: "Это нужно, чтобы не давать упражнения, которые усиливают боль.",
      overlay: { title: "Настраиваем безопасные варианты…", hint: "Это важно", variant: "skeleton" },
      options: [
        { id: "none", label: "Нет", icon: "✅", meta: "супер" },
        { id: "knee", label: "Колени", icon: "🦵", meta: "бережно" },
        { id: "back", label: "Спина", icon: "🧘", meta: "аккуратно" },
        { id: "shoulder", label: "Плечи", icon: "🫱", meta: "контроль" },
        { id: "other", label: "Другое/несколько", icon: "🧩", meta: "учтём" },
      ],
    },
    {
      key: "equipment",
      icon: icons.equip,
      theme: "theme-a",
      mood: "🎒 Инвентарь",
      title: "Что у тебя есть под рукой?",
      sub: "План будет работать и без железа.",
      interaction: "auto",
      hint: "Инвентарь расширяет упражнения, но не обязателен.",
      options: [
        { id: "none", label: "Ничего", icon: "🧍", meta: "своим весом" },
        { id: "bands", label: "Резинки", icon: "🪢", meta: "удобно" },
        { id: "dumbbells", label: "Гантели", icon: "🏋️", meta: "силовые" },
        { id: "pullup", label: "Турник", icon: "➖", meta: "спина" },
        { id: "full", label: "Полный набор", icon: "🧰", meta: "топ" },
      ],
    },
    {
      key: "style",
      icon: icons.style,
      theme: "theme-b",
      mood: "🧠 Стиль",
      title: "Какой формат тебе ближе?",
      sub: "Сделаем так, чтобы не было скучно.",
      interaction: "think",
      overlay: { title: "Собираем стиль тренировок…", hint: "Смешиваем лучшее", variant: "cards" },
      hint: "Стиль — это упражнения, темп и настроение тренировки.",
      options: [
        { id: "strength", label: "Силовые (подходы)", icon: "🧱", meta: "классика" },
        { id: "hiit", label: "Интервалы (HIIT)", icon: "⚡", meta: "быстро" },
        { id: "circuit", label: "Круговые", icon: "🔁", meta: "динамика" },
        { id: "mobility", label: "Мобилити + кор", icon: "🧎", meta: "плавно" },
        { id: "mix", label: "Смешанный", icon: "🧩", meta: "лучшее" },
      ],
    },
    {
      key: "music",
      icon: icons.music,
      theme: "theme-c",
      mood: "🎧 Вайб",
      title: "Что больше мотивирует во время тренировки?",
      sub: "Мы подстроим подсказки и темп.",
      interaction: "confirm",
      hint: "Мотивация влияет на подачу: темп, триггеры, уведомления.",
      options: [
        { id: "music", label: "Музыка", icon: "🎶", meta: "ритм" },
        { id: "coach", label: "Голос/подсказки", icon: "🗣️", meta: "ведёт" },
        { id: "silence", label: "Тишина", icon: "🤫", meta: "фокус" },
        { id: "timer", label: "Таймеры", icon: "⏱️", meta: "структура" },
        { id: "stats", label: "Статистика", icon: "📊", meta: "прогресс" },
      ],
    },
    {
      key: "schedule",
      icon: icons.schedule,
      theme: "theme-d",
      mood: "🕒 План",
      title: "Когда удобнее тренироваться?",
      sub: "Поставим ритм, который реально держать.",
      interaction: "next",
      hint: "Время суток влияет на советы по разминке и восстановлению.",
      options: [
        { id: "morning", label: "Утро", icon: "🌅", meta: "заряд" },
        { id: "day", label: "Днём", icon: "☀️", meta: "ок" },
        { id: "evening", label: "Вечер", icon: "🌇", meta: "после работы" },
        { id: "night", label: "Поздно", icon: "🌙", meta: "тихо" },
        { id: "random", label: "Как получится", icon: "🎲", meta: "гибко" },
      ],
    },
    {
      key: "sleep",
      icon: icons.sleep,
      theme: "theme-a",
      mood: "😴 Восстановление",
      title: "Сколько часов сна обычно выходит?",
      sub: "Мы не будем умничать — просто учтём реальность.",
      interaction: "thinkNext",
      overlay: { title: "Считаем восстановление…", hint: "Сон влияет на нагрузку", variant: "ring" },
      hint: "Если сна мало — план должен быть мягче и короче.",
      options: [
        { id: "lt6", label: "Меньше 6", icon: "😵", meta: "мало" },
        { id: "6", label: "6", icon: "😐", meta: "норма?" },
        { id: "7", label: "7", icon: "🙂", meta: "хорошо" },
        { id: "8", label: "8+", icon: "😌", meta: "топ" },
        { id: "vary", label: "Прыгает", icon: "🎢", meta: "разное" },
      ],
    },
    {
      key: "food",
      icon: icons.food,
      theme: "theme-b",
      mood: "🥗 Питание",
      title: "Какой подход к питанию тебе ближе?",
      sub: "Без фанатизма. Мы дадим простые правила.",
      interaction: "auto",
      hint: "Питание — часть результата, но без крайностей.",
      options: [
        { id: "count", label: "Считаю калории", icon: "🧮", meta: "точно" },
        { id: "rough", label: "Примерно", icon: "📏", meta: "по ощущениям" },
        { id: "healthy", label: "Просто ем полезнее", icon: "🥦", meta: "чисто" },
        { id: "chaos", label: "Как получится", icon: "🍕", meta: "хаос" },
        { id: "want", label: "Хочу наладить", icon: "🛠️", meta: "план" },
      ],
    },
    {
      key: "stress",
      icon: icons.stress,
      theme: "theme-c",
      mood: "🧘 Баланс",
      title: "Уровень стресса в обычную неделю?",
      sub: "Это влияет на восстановление и мотивацию.",
      interaction: "think",
      overlay: { title: "Подбираем режим без выгорания…", hint: "Стресс учитываем", variant: "dots" },
      hint: "Если стресс высокий — лучше меньше, но стабильно.",
      options: [
        { id: "low", label: "Низкий", icon: "😌", meta: "ровно" },
        { id: "mid", label: "Средний", icon: "🙂", meta: "норм" },
        { id: "high", label: "Высокий", icon: "😵‍💫", meta: "держусь" },
        { id: "peak", label: "Очень высокий", icon: "🚨", meta: "жёстко" },
        { id: "var", label: "Прыгает", icon: "🎢", meta: "волнами" },
      ],
    },
    {
      key: "water",
      icon: icons.water,
      theme: "theme-d",
      mood: "💧 База",
      title: "Вода в день — примерно?",
      sub: "Нам нужна отправная точка, не идеал.",
      interaction: "doubleTap",
      hint: "Гидратация влияет на самочувствие и тренировки.",
      options: [
        { id: "lt1", label: "< 1 литра", icon: "🥤", meta: "мало" },
        { id: "1_15", label: "1–1.5 л", icon: "💧", meta: "ок" },
        { id: "15_2", label: "1.5–2 л", icon: "🚰", meta: "хорошо" },
        { id: "2_3", label: "2–3 л", icon: "🌊", meta: "топ" },
        { id: "dontKnow", label: "Не знаю", icon: "🤷", meta: "пофиг" },
      ],
    },
    {
      key: "daily_steps",
      icon: icons.steps,
      theme: "theme-a",
      mood: "👣 Активность",
      title: "Средняя активность по шагам в день?",
      sub: "Если не знаешь — выбирай по ощущениям.",
      interaction: "next",
      hint: "Шаги помогают с жиросжиганием и восстановлением.",
      options: [
        { id: "lt3k", label: "До 3k", icon: "🪑", meta: "сидячая" },
        { id: "3_6k", label: "3–6k", icon: "🚶", meta: "умеренно" },
        { id: "6_9k", label: "6–9k", icon: "🚶‍♂️", meta: "норм" },
        { id: "9_12k", label: "9–12k", icon: "🏃", meta: "активно" },
        { id: "gt12k", label: "12k+", icon: "🏔️", meta: "очень" },
      ],
    },
    {
      key: "warmup",
      icon: icons.warmup,
      theme: "theme-b",
      mood: "🔥 Разминка",
      title: "Разминка перед тренировкой — ты обычно…",
      sub: "Это про качество движений и безопасность.",
      interaction: "confirm",
      hint: "Если разминки нет — мы добавим 2–4 минуты простых движений.",
      options: [
        { id: "always", label: "Делаю всегда", icon: "✅", meta: "красавчик" },
        { id: "sometimes", label: "Иногда", icon: "🙂", meta: "бывает" },
        { id: "rare", label: "Редко", icon: "🙃", meta: "окей" },
        { id: "never", label: "Почти никогда", icon: "⛔", meta: "добавим" },
        { id: "dontKnow", label: "Не знаю как", icon: "🧭", meta: "покажем" },
      ],
    },
    {
      key: "mobility",
      icon: icons.mobility,
      theme: "theme-c",
      mood: "🧎 Плавно",
      title: "Хочешь добавить гибкость/мобилити?",
      sub: "Это 3–8 минут, без растяжки через боль.",
      interaction: "auto",
      hint: "Мобилити улучшает технику и уменьшает дискомфорт.",
      options: [
        { id: "yes", label: "Да, хочу", icon: "✅", meta: "добавим" },
        { id: "light", label: "Немного", icon: "👌", meta: "минимум" },
        { id: "no", label: "Не надо", icon: "⛔", meta: "ок" },
        { id: "onlyAfter", label: "Только после", icon: "🧘", meta: "заминка" },
        { id: "dontCare", label: "Мне всё равно", icon: "🤷", meta: "решим" },
      ],
    },
    {
      key: "intensity",
      icon: icons.intensity,
      theme: "theme-d",
      mood: "⚡ Нагрузка",
      title: "Какую интенсивность ты любишь?",
      sub: "Не «убиться», а «выполнить и повторить».",
      interaction: "think",
      overlay: { title: "Настраиваем интенсивность…", hint: "Чтобы было в кайф", variant: "ring" },
      hint: "Интенсивность — это темп, паузы и сложность упражнений.",
      options: [
        { id: "easy", label: "Легко", icon: "🙂", meta: "комфорт" },
        { id: "moderate", label: "Умеренно", icon: "😌", meta: "баланс" },
        { id: "hard", label: "Тяжело", icon: "😤", meta: "жару" },
        { id: "very", label: "Очень тяжело", icon: "🔥", meta: "макс" },
        { id: "mix", label: "По настроению", icon: "🎛️", meta: "микс" },
      ],
    },
    {
      key: "tracking",
      icon: icons.tracking,
      theme: "theme-a",
      mood: "📊 Прогресс",
      title: "Как ты хочешь отслеживать прогресс?",
      sub: "Чтобы было видно, что ты не зря стараешься.",
      interaction: "doubleTap",
      hint: "Трекинг помогает держать мотивацию и корректировать план.",
      options: [
        { id: "weights", label: "Вес/повторы", icon: "🏋️", meta: "силовые" },
        { id: "photos", label: "Фото", icon: "📸", meta: "наглядно" },
        { id: "feel", label: "Самочувствие", icon: "🧠", meta: "ощущения" },
        { id: "steps", label: "Шаги/кардио", icon: "👣", meta: "активность" },
        { id: "none", label: "Не хочу трекать", icon: "🤫", meta: "просто делать" },
      ],
    },
    {
      key: "coach",
      icon: icons.coach,
      theme: "theme-b",
      mood: "🤝 Поддержка",
      title: "Тебе нужны напоминания/поддержка?",
      sub: "Можно сделать мягко, без спама.",
      interaction: "next",
      hint: "Напоминания помогают держать ритм, если ты занят.",
      options: [
        { id: "yes", label: "Да, напоминать", icon: "🔔", meta: "мягко" },
        { id: "onlyMorning", label: "Только утром", icon: "🌅", meta: "раз" },
        { id: "onlyEvening", label: "Только вечером", icon: "🌇", meta: "раз" },
        { id: "smart", label: "Умно по привычкам", icon: "🧠", meta: "адаптивно" },
        { id: "no", label: "Не надо", icon: "⛔", meta: "без" },
      ],
    },
    {
      key: "notifications_style",
      icon: icons.notif,
      theme: "theme-c",
      mood: "🔔 Тон",
      title: "Каким должен быть тон напоминаний?",
      sub: "Выбирай, как тебе приятнее.",
      interaction: "thinkNext",
      overlay: { title: "Настраиваем стиль уведомлений…", hint: "Без кринжа", variant: "dots" },
      hint: "Тон важен: кому-то нужен «пинок», кому-то — поддержка.",
      options: [
        { id: "soft", label: "Мягко", icon: "🙂", meta: "поддержка" },
        { id: "strict", label: "Строго", icon: "🫵", meta: "дисциплина" },
        { id: "fun", label: "С юмором", icon: "😄", meta: "легко" },
        { id: "minimal", label: "Минимально", icon: "—", meta: "без слов" },
        { id: "random", label: "Разнообразно", icon: "🎲", meta: "микс" },
      ],
    },
    {
      key: "vibe",
      icon: icons.vibe,
      theme: "theme-d",
      mood: "✨ Атмосфера",
      title: "Какую атмосферу ты хочешь в приложении?",
      sub: "Это влияет на темы и интерфейс (да, это важно).",
      interaction: "confirm",
      hint: "Вайб помогает не бросить через неделю.",
      options: [
        { id: "minimal", label: "Минимализм", icon: "⬚", meta: "чисто" },
        { id: "futuristic", label: "Футуризм", icon: "🛸", meta: "техно" },
        { id: "sporty", label: "Жёсткий спорт", icon: "🥊", meta: "мотив" },
        { id: "calm", label: "Спокойно", icon: "🧘", meta: "дзен" },
        { id: "bright", label: "Ярко", icon: "🌈", meta: "энергия" },
      ],
    },

    // 5 more to reach 25:
    {
      key: "weekend",
      icon: "📆",
      theme: "theme-a",
      mood: "📆 Режим",
      title: "Тренировки в выходные — как?",
      sub: "Чтобы план не ломался из-за жизни.",
      interaction: "auto",
      hint: "У многих выходные — лучший шанс потренироваться.",
      options: [
        { id: "yes", label: "Да, удобно", icon: "✅", meta: "супер" },
        { id: "one", label: "Иногда одну", icon: "🙂", meta: "гибко" },
        { id: "no", label: "Нет, отдыхаю", icon: "🛋️", meta: "ок" },
        { id: "onlySun", label: "Только один день", icon: "☀️", meta: "раз" },
        { id: "dontKnow", label: "Не знаю", icon: "🤷", meta: "посмотрим" },
      ],
    },
    {
      key: "injury_history",
      icon: "🧷",
      theme: "theme-b",
      mood: "🧷 История",
      title: "Были травмы/обострения в прошлом?",
      sub: "Мы не лечим, но можем избежать провокаций.",
      interaction: "think",
      overlay: { title: "Перепроверяем риск-нагрузку…", hint: "Делаем безопасно", variant: "skeleton" },
      hint: "Если были травмы — исключим некоторые движения и добавим замену.",
      options: [
        { id: "no", label: "Нет", icon: "✅", meta: "отлично" },
        { id: "yesMinor", label: "Было, но давно", icon: "🕰️", meta: "ок" },
        { id: "yesOften", label: "Иногда возвращается", icon: "⚠️", meta: "учтём" },
        { id: "now", label: "Сейчас беспокоит", icon: "🚨", meta: "осторожно" },
        { id: "unsure", label: "Не уверен", icon: "❓", meta: "мягко" },
      ],
    },
    {
      key: "nutrition_goal",
      icon: "🍽️",
      theme: "theme-c",
      mood: "🍽️ Простота",
      title: "Насколько ты готов(а) менять питание?",
      sub: "План без фанатизма: 1–2 правила.",
      interaction: "next",
      hint: "Чем проще правила, тем выше шанс, что ты их удержишь.",
      options: [
        { id: "none", label: "Не готов(а)", icon: "⛔", meta: "0" },
        { id: "small", label: "Немного", icon: "👌", meta: "1 правило" },
        { id: "medium", label: "Умеренно", icon: "🙂", meta: "2 правила" },
        { id: "high", label: "Готов(а) серьёзно", icon: "🔥", meta: "структура" },
        { id: "dontCare", label: "Главное тренировки", icon: "🏋️", meta: "ок" },
      ],
    },
    {
      key: "app_style",
      icon: "📱",
      theme: "theme-d",
      mood: "📱 Формат",
      title: "Какой формат плана тебе удобнее?",
      sub: "Чтобы ты реально открывал(а) и делал(а).",
      interaction: "doubleTap",
      hint: "Формат влияет на подачу: чек-лист, таймеры, подсказки.",
      options: [
        { id: "checklist", label: "Чек-лист", icon: "☑️", meta: "прост" },
        { id: "timer", label: "Таймеры", icon: "⏱️", meta: "темп" },
        { id: "video", label: "Короткие видео", icon: "🎬", meta: "наглядно" },
        { id: "coach", label: "Подсказки как тренер", icon: "🗣️", meta: "ведёт" },
        { id: "mix", label: "Смешанный", icon: "🧩", meta: "лучшее" },
      ],
    },
    {
      key: "finalize",
      icon: icons.compute,
      theme: "theme-a",
      mood: "🧪 Сборка",
      title: "Готов собрать твой план?",
      sub: "После этого покажем краткий результат и кнопку в приложение.",
      interaction: "think",
      overlay: { title: "Собираем персональный план…", hint: "Проверяем ответы", variant: "cards" },
      hint: "На финале ты увидишь короткий план и CTA.",
      options: [
        { id: "go", label: "Да, поехали", icon: "🚀", meta: "собрать" },
        { id: "go2", label: "Да", icon: "✅", meta: "собрать" },
        { id: "go3", label: "Погнали", icon: "⚡", meta: "собрать" },
        { id: "go4", label: "Собирай", icon: "🧠", meta: "собрать" },
        { id: "go5", label: "Ок", icon: "👌", meta: "собрать" },
      ],
    },
  ];

  // Ensure 25 steps
  if (steps.length !== 25) {
    console.warn("Steps length is", steps.length, "expected 25");
  }

  // --- UI elements ---
  const backBtn = $("backBtn");
  const nextBtn = $("nextBtn");
  const restartBtn = $("restartBtn");
  const hintBtn = $("hintBtn");
  const qTitle = $("qTitle");
  const qSub = $("qSub");
  const optionsEl = $("options");
  const progressBar = $("progressBar");
  const stepLabel = $("stepLabel");
  const qIcon = $("qIcon");
  const toast = $("toast");
  const moodPill = $("moodPill");
  const footText = $("footText");

  const overlay = $("overlay");
  const overlayTitle = $("overlayTitle");
  const overlayHint = $("overlayHint");
  const overlayIcon = $("overlayIcon");
  const overlayVisual = $("overlayVisual");

  const modal = $("modal");
  const modalBackdrop = $("modalBackdrop");
  const modalClose = $("modalClose");
  const modalTitle = $("modalTitle");
  const modalText = $("modalText");

  // --- State ---
  let state = {
    idx: 0,
    answers: {}, // key -> option.id
    lastTap: null, // for doubleTap
  };

  const loadState = () => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return;
      const parsed = JSON.parse(raw);
      if(typeof parsed?.idx === "number" && parsed?.answers && typeof parsed.answers === "object"){
        state.idx = clamp(parsed.idx, 0, steps.length-1);
        state.answers = parsed.answers;
      }
    }catch(e){}
  };

  const saveState = () => {
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ idx: state.idx, answers: state.answers }));
    }catch(e){}
  };

  const clearState = () => {
    state = { idx: 0, answers: {}, lastTap: null };
    try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
  };

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toast.classList.remove("show"), 1400);
  };

  const openModal = (title, text) => {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.classList.add("isOpen");
    modal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => {
    modal.classList.remove("isOpen");
    modal.setAttribute("aria-hidden", "true");
  };

  modalBackdrop.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);

  // --- Overlay visuals ---
  const makeOverlayVisual = (variant) => {
    overlayVisual.innerHTML = "";
    const v = variant || ["dots","bar","ring","cards","skeleton"][Math.floor(Math.random()*5)];
    if (v === "dots") {
      overlayVisual.innerHTML = `<div class="loaderDots"><span></span><span></span><span></span></div>`;
    } else if (v === "bar") {
      overlayVisual.innerHTML = `<div class="loaderBar"><i></i></div>`;
    } else if (v === "ring") {
      overlayVisual.innerHTML = `<div class="loaderRing"><div class="ring"></div></div>`;
    } else if (v === "cards") {
      overlayVisual.innerHTML = `<div class="loaderCards"><div class="c"></div><div class="c"></div><div class="c"></div></div>`;
    } else if (v === "skeleton") {
      overlayVisual.innerHTML = `<div class="loaderSkeleton">
        <div class="skLine s1"></div>
        <div class="skLine s2"></div>
        <div class="skLine s3"></div>
      </div>`;
    }
  };

  const openOverlay = (cfg = {}) => {
    overlayTitle.textContent = cfg.title || "Собираем план…";
    overlayHint.textContent = cfg.hint || "Это займёт несколько секунд";
    overlayIcon.textContent = cfg.icon || "🧠";
    makeOverlayVisual(cfg.variant);
    overlay.classList.add("isOpen");
    overlay.setAttribute("aria-hidden", "false");
  };

  const closeOverlay = () => {
    overlay.classList.remove("isOpen");
    overlay.setAttribute("aria-hidden", "true");
  };

  // --- Render step ---
  const render = () => {
    const step = steps[state.idx];

    // theme
    document.body.classList.remove("theme-a","theme-b","theme-c","theme-d");
    document.body.classList.add(step.theme || "theme-a");

    // header/progress
    stepLabel.textContent = `Шаг ${state.idx + 1} / ${steps.length}`;
    progressBar.style.width = `${((state.idx) / (steps.length)) * 100}%`;
    moodPill.textContent = step.mood || "⚡";
    qIcon.textContent = step.icon || "❓";

    // title/sub
    qTitle.textContent = step.title;
    qSub.textContent = step.sub || "";

    // back
    backBtn.disabled = state.idx === 0;

    // options
    optionsEl.innerHTML = "";
    const selected = state.answers[step.key] || null;

    step.options.forEach((opt, i) => {
      const btn = document.createElement("div");
      btn.className = "opt";
      btn.setAttribute("role", "listitem");
      btn.dataset.opt = opt.id;

      btn.innerHTML = `
        <div class="opt__icon" aria-hidden="true">${opt.icon || "•"}</div>
        <div class="opt__text">${opt.label}</div>
        <div class="opt__meta">${opt.meta || ""}</div>
      `;

      if (selected === opt.id) btn.classList.add("isSelected");

      btn.addEventListener("click", () => onSelect(step, opt, btn), { passive: true });
      optionsEl.appendChild(btn);
    });

    // next button logic
    nextBtn.disabled = true;
    nextBtn.textContent = state.idx === steps.length - 1 ? "Показать план" : "Дальше";

    if (step.interaction === "next" || step.interaction === "thinkNext") {
      nextBtn.disabled = !selected;
    } else if (step.interaction === "doubleTap") {
      nextBtn.disabled = true; // not used
    } else {
      // auto/confirm/think -> next not required
      nextBtn.disabled = true;
    }

    // footer hint
    footText.textContent = state.idx < steps.length - 1
      ? "Данные сохраняются локально (можно обновить страницу)."
      : "Финал: покажем краткий план и кнопку перехода.";

    saveState();
  };

  // --- Final screen ---
  const renderFinal = () => {
    // set progress to 100
    progressBar.style.width = `100%`;
    stepLabel.textContent = `Готово`;
    moodPill.textContent = "✅ План готов";

    qIcon.textContent = "✅";
    qTitle.textContent = "Твой быстрый план готов";
    qSub.textContent = "Короткая выжимка на основе ответов. Полная версия — в приложении.";

    optionsEl.innerHTML = "";

    const summary = buildSummary(state.answers);
    const card = document.createElement("div");
    card.className = "opt";
    card.style.cursor = "default";
    card.innerHTML = `
      <div class="opt__icon" aria-hidden="true">📌</div>
      <div class="opt__text">
        <div style="font-weight:750; margin-bottom:6px;">Коротко:</div>
        <div style="color: rgba(234,240,255,.92); font-size: 13px; line-height: 1.3;">
          ${summary.map(x => `• ${escapeHtml(x)}`).join("<br/>")}
        </div>
      </div>
      <div class="opt__meta"></div>
    `;
    optionsEl.appendChild(card);

    // CTA buttons
    nextBtn.disabled = false;
    nextBtn.textContent = "Открыть приложение";
    nextBtn.onclick = () => {
      celebrate();
      openModal("CTA (заглушка)", "Тут обычно: App Store / Google Play ссылки. Сейчас это демо-лендинг. Вставь свои ссылки в app.js → ctaLinks.");
    };

    hintBtn.textContent = "Что дальше?";
    hintBtn.onclick = () => openModal("Что дальше?", "1) Вставь ссылки на сторы. 2) Подключи аналитику. 3) Поставь A/B тесты на первые шаги и CTA.");

    backBtn.disabled = false;
    backBtn.onclick = () => {
      state.idx = steps.length - 1;
      render();
    };
  };

  const escapeHtml = (s) => String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const buildSummary = (answers) => {
    const goal = answers.goal || "fit";
    const freq = answers.freq || "3";
    const place = answers.place || "home";
    const style = answers.style || "mix";
    const intensity = answers.intensity || "moderate";

    const goalMap = {
      lose: "Фокус: жиросжигание + шаги + умеренный темп.",
      muscle: "Фокус: рост мышц + прогрессия нагрузки.",
      strength: "Фокус: базовые силовые + отдых между подходами.",
      endurance: "Фокус: выносливость + интервалы/кардио.",
      fit: "Фокус: общий тонус + баланс силы и кардио."
    };

    const placeMap = {
      home: "Локация: дом → упражнения с собственным весом/резинками.",
      gym: "Локация: зал → силовая база + прогрессия по весам.",
      out: "Локация: улица → бег/ходьба + функционалка.",
      mix: "Локация: комбо → лучшие упражнения из двух миров.",
      any: "Локация: гибко → быстрые тренировки без привязки."
    };

    const styleMap = {
      strength: "Формат: силовые (подходы/паузы).",
      hiit: "Формат: интервалы (коротко и интенсивно).",
      circuit: "Формат: круговые (динамика, меньше пауз).",
      mobility: "Формат: мобилити + кор (плавно).",
      mix: "Формат: смешанный (разнообразие)."
    };

    const intensityMap = {
      easy: "Интенсивность: комфортная (чтобы держать ритм).",
      moderate: "Интенсивность: умеренная (лучший баланс).",
      hard: "Интенсивность: тяжёлая (но выполнимая).",
      very: "Интенсивность: высокая (требует восстановления).",
      mix: "Интенсивность: адаптивная (по самочувствию)."
    };

    return [
      goalMap[goal] || goalMap.fit,
      `Частота: ${freq} тренировок/нед (стабильность важнее максимума).`,
      placeMap[place] || placeMap.home,
      styleMap[style] || styleMap.mix,
      intensityMap[intensity] || intensityMap.moderate,
    ];
  };

  // --- Confetti ---
  const celebrate = () => {
    const card = document.querySelector(".card");
    if (!card) return;
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.innerHTML = "<i></i><i></i><i></i><i></i><i></i>";
    card.appendChild(conf);
    setTimeout(() => conf.remove(), 1400);
  };

  // --- Selection handler ---
  let isTransitioning = false;

  const setSelectedUI = (optId) => {
    [...optionsEl.querySelectorAll(".opt")].forEach((el) => {
      el.classList.toggle("isSelected", el.dataset.opt === optId);
    });
  };

  const lockOptions = () => {
    [...optionsEl.querySelectorAll(".opt")].forEach((el) => el.classList.add("isLocked"));
  };

  const onSelect = async (step, opt, el) => {
    if (isTransitioning) return;

    // double-tap confirm variety
    if (step.interaction === "doubleTap") {
      const key = `${step.key}:${opt.id}`;
      if (state.lastTap === key) {
        state.answers[step.key] = opt.id;
        state.lastTap = null;
        setSelectedUI(opt.id);
        showToast("Ок, подтверждено ✅");
        celebrate();
        await sleep(220);
        await goNextAuto(step);
        return;
      } else {
        state.lastTap = key;
        setSelectedUI(opt.id);
        showToast("Нажми ещё раз, чтобы подтвердить");
        return;
      }
    }

    state.answers[step.key] = opt.id;
    setSelectedUI(opt.id);

    if (step.interaction === "next") {
      nextBtn.disabled = false;
      showToast("Выбрано. Нажми «Дальше».");
      return;
    }

    if (step.interaction === "thinkNext") {
      nextBtn.disabled = false;
      showToast("Выбрано. Дальше → обработка.");
      return;
    }

    if (step.interaction === "confirm") {
      isTransitioning = true;
      lockOptions();
      showToast("Ок, учёл ✅");
      celebrate();
      await sleep(350);
      await goNextAuto(step);
      isTransitioning = false;
      return;
    }

    if (step.interaction === "think") {
      isTransitioning = true;
      lockOptions();
      await doThink(step);
      await goNextAuto(step);
      isTransitioning = false;
      return;
    }

    // auto default
    if (step.interaction === "auto") {
      isTransitioning = true;
      lockOptions();
      await sleep(120);
      await goNextAuto(step);
      isTransitioning = false;
      return;
    }
  };

  const doThink = async (step) => {
    const delay = randInt(3000, 7000);
    const cfg = step.overlay || {};
    openOverlay({
      title: cfg.title || "Обрабатываем…",
      hint: cfg.hint || `Осталось ~${Math.ceil(delay/1000)} сек`,
      icon: cfg.icon || "🧠",
      variant: cfg.variant || null,
    });

    // small dynamic hint updates
    const hints = [
      "Подбираем упражнения под твой формат",
      "Сверяем нагрузку и восстановление",
      "Собираем план по твоим ответам",
      "Оптимизируем частоту и длительность",
      "Проверяем безопасные альтернативы",
    ];
    const t0 = Date.now();
    while (Date.now() - t0 < delay) {
      await sleep(900);
      overlayHint.textContent = hints[Math.floor(Math.random()*hints.length)];
    }

    closeOverlay();
  };

  const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  const goNextAuto = async (step) => {
    if (state.idx >= steps.length - 1) {
      // final: show plan screen
      renderFinal();
      saveState();
      return;
    }
    state.idx += 1;
    render();
    saveState();
  };

  // --- Buttons ---
  backBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    if (state.idx === 0) return;
    state.idx -= 1;
    state.lastTap = null;
    render();
    showToast("Назад");
  });

  nextBtn.addEventListener("click", async () => {
    if (isTransitioning) return;

    const step = steps[state.idx];
    const selected = state.answers[step.key] || null;
    if (!selected) return;

    if (step.interaction === "thinkNext") {
      isTransitioning = true;
      lockOptions();
      await doThink(step);
      await goNextAuto(step);
      isTransitioning = false;
      return;
    }

    // in "next" we just proceed
    isTransitioning = true;
    lockOptions();
    await sleep(120);
    await goNextAuto(step);
    isTransitioning = false;
  });

  restartBtn.addEventListener("click", () => {
    openModal("Начать заново?", "Сбросить прогресс и ответы? Это действие нельзя отменить.");
    // override close button to confirm
    const prevHandler = modalClose.onclick;
    modalClose.onclick = () => {
      closeModal();
      clearState();
      render();
      showToast("Сброшено");
      modalClose.onclick = prevHandler; // restore
    };
  });

  hintBtn.addEventListener("click", () => {
    const step = steps[state.idx];
    openModal("Зачем этот вопрос?", step.hint || "Это нужно для персонализации плана.");
  });

  // --- Init ---
  loadState();
  render();
})();
