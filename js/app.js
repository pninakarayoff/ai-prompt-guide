/* ============================================================
   AI Prompt Guide — App Logic v2
   ============================================================ */

/* --- State ------------------------------------------------ */
const state = {
  current: 0,
  ex1: { task: '', audience: '', goal: '', style: '', format: '' },
  ex2: { type: '', topic: '', audience: '', goal: '', style: '', format: '' },
  selfcheck: new Set(),
  quiz: { current: 0, answers: {}, phase: 'q' }, // phase: 'q' | 'answered' | 'results'
};

const TOTAL = 12;

/* --- Screen definitions ----------------------------------- */
const screens = [
  { id: 'intro',     label: '',            render: renderIntro },
  { id: 'ch1',       label: 'פרק 1',       render: renderCh1 },
  { id: 'ch2',       label: 'פרק 2',       render: renderCh2 },
  { id: 'ch3',       label: 'פרק 3',       render: renderCh3 },
  { id: 'ex1',       label: 'תרגול 1',     render: renderEx1 },
  { id: 'ch4',       label: 'פרק 4',       render: renderCh4 },
  { id: 'ch5',       label: 'פרק 5',       render: renderCh5 },
  { id: 'ex2',       label: 'תרגול 2',     render: renderEx2 },
  { id: 'quiz',      label: 'בוחן',        render: renderQuiz },
  { id: 'templates', label: 'בנק תבניות', render: renderTemplates },
  { id: 'selfcheck', label: 'בדיקה עצמית', render: renderSelfCheck },
  { id: 'ending',    label: 'סיום',        render: renderEnding },
];

/* --- Navigation ------------------------------------------- */
function navigate(index) {
  state.current = Math.max(0, Math.min(index, TOTAL - 1));
  renderApp();
  const c = document.getElementById('screen-container');
  if (c) c.scrollTop = 0;
  window.scrollTo(0, 0);
}
function goNext() { navigate(state.current + 1); }
function goBack() { navigate(state.current - 1); }

/* --- Main render ------------------------------------------ */
function renderApp() {
  const screen  = screens[state.current];
  const isIntro  = screen.id === 'intro';
  const isEnding = screen.id === 'ending';

  // Progress
  const pct = ((state.current + 1) / TOTAL) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  // Step info
  const stepEl  = document.getElementById('screen-step');
  const labelEl = document.getElementById('screen-label-text');
  if (isIntro) {
    stepEl.textContent = ''; labelEl.textContent = '';
  } else if (isEnding) {
    stepEl.textContent = ''; labelEl.textContent = screen.label;
  } else {
    stepEl.textContent  = `שלב ${state.current} מתוך ${TOTAL - 2}`;
    labelEl.textContent = screen.label;
  }

  // Render screen
  const container = document.getElementById('screen-container');
  container.innerHTML = '';
  const el = screen.render();
  if (el) container.appendChild(el);
  container.classList.remove('screen-enter');
  void container.offsetWidth;
  container.classList.add('screen-enter');

  // Footer
  const footer  = document.getElementById('app-footer');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');

  if (isIntro || isEnding) {
    footer.style.display = 'none';
  } else if (screen.id === 'quiz') {
    footer.style.display  = 'flex';
    btnBack.classList.toggle('hidden', state.current <= 1);
    if (state.quiz.phase !== 'results') {
      btnNext.style.display = 'none';
    } else {
      btnNext.style.display = '';
      btnNext.textContent   = 'המשך לתבניות';
    }
  } else {
    footer.style.display  = 'flex';
    btnNext.style.display = '';
    btnNext.textContent   = 'הבא';
    btnBack.classList.toggle('hidden', state.current <= 1);
  }
}

/* ============================================================
   SCREEN RENDERERS
   ============================================================ */

/* --- Screen 0: Intro -------------------------------------- */
function renderIntro() {
  const div = make('div', { className: 'intro-wrap' });
  div.innerHTML = `
    <div class="intro-hero">
      <span class="intro-emoji" role="img" aria-label="ניצוץ">✨</span>
      <h1 class="intro-title">
        איך לדבר עם AI כדי לקבל<br>
        <span>תוצאות טובות באמת</span>
      </h1>
    </div>

    <div class="intro-card">
      <p class="card-text">אם ניסית לעבוד עם ChatGPT ויצאת עם תוצאה בינונית, הבעיה ברוב המקרים אינה בך ואינה בכלי.</p>
      <p class="card-text mt-8"><strong style="color:var(--text-1)">הבעיה היא בדרך שבה מבקשים.</strong></p>
    </div>

    <div class="intro-card mt-12">
      <p class="section-label" style="margin-bottom:10px">מה יש כאן</p>
      <ul class="intro-checklist">
        ${['הסבר פשוט על הטעות הכי נפוצה',
           'נוסחה לפרומפט טוב',
           'שני תרגולים אינטראקטיביים',
           'דוגמאות לפני ואחרי',
           'בנק תבניות + בדיקה עצמית'].map(t => `
          <li><span class="intro-check" aria-hidden="true">✓</span>${t}</li>
        `).join('')}
      </ul>
    </div>

    <div class="intro-cta-wrap">
      <button class="intro-cta-btn" onclick="navigate(1)">התחילי ← </button>
    </div>
  `;
  return div;
}

/* --- Screen 1: Chapter 1 ---------------------------------- */
function renderCh1() {
  const div = make('div');
  div.innerHTML = `
    <h2 class="screen-title">למה זה לא עובד כמו שציפית?</h2>
    <p class="screen-subtitle">רוב האנשים כותבים בקשה קצרה ומצפים לתוצאה מדויקת. אבל קצר לא תמיד אומר ברור.</p>

    <p class="section-label">דוגמאות שכולנו מכירות</p>
    ${[
      ['"תכתוב לי פוסט"',   'איזה פוסט? על מה? לאיזה קהל?'],
      ['"תעשה לי תמונה"',   'של מה? באיזה סגנון? לאיזה שימוש?'],
      ['"תן לי רעיון"',     'רעיון למה? עבור מי? מה המגבלות?'],
    ].map(([req, q]) => `
      <div class="card">
        <p style="font-size:15px;font-weight:500;color:var(--text-1);">${req}</p>
        <p style="font-size:13px;color:var(--text-3);margin-top:4px;">← ${q}</p>
      </div>
    `).join('')}

    <div class="highlight-box">
      <p>קצר זה לא תמיד ברור.</p>
    </div>

    <p class="card-text">כשאת כותבת בקשה כללית מדי, הכלי לא יודע מי את, מה בדיוק את צריכה, למי זה מיועד ומה המטרה. אז הוא מנחש, ומנחש בצורה כללית מאוד.</p>
  `;
  return div;
}

/* --- Screen 2: Chapter 2 ---------------------------------- */
function renderCh2() {
  const div = make('div');
  div.innerHTML = `
    <h2 class="screen-title">הטעות הכי נפוצה מול AI</h2>
    <p class="screen-subtitle">בקשה כללית מדי. תוצאה גנרית בהתאם.</p>

    <div class="card">
      <p class="card-title">מה אנשים כותבים:</p>
      <div style="background:var(--bg-2,#111D31);border-radius:var(--r-sm);padding:10px 14px;margin-top:8px;font-size:15px;color:var(--text-1);border:1px solid var(--border)">
        "כתוב לי משהו על בריאות"
      </div>
    </div>

    <div class="card">
      <p class="card-title">מה חסר לכלי:</p>
      <ul class="check-list mt-8">
        ${['מי כותב? (מאמן? מטפל? בלוגר?)',
           'לאיזו פלטפורמה?',
           'מי קהל היעד?',
           'מה המטרה? (מכירה? השראה? מידע?)',
           'באיזה סגנון?'].map(i => `
          <li><span class="li-icon">?</span>${i}</li>
        `).join('')}
      </ul>
    </div>

    <div class="card">
      <p class="card-title">למה מתקבלת תוצאה גנרית:</p>
      <p class="card-text mt-8">הכלי חייב להשלים את כל הפרטים החסרים. הוא לא מכיר אותך, לא מכיר את הקהל שלך ולא יודע מה המטרה. אז הוא מייצר משהו שיכול להתאים לכולם — ולמעשה לא מתאים לאף אחד.</p>
    </div>

    <div class="highlight-box">
      <p>מה שהכלי לא יודע, הוא ממציא.</p>
    </div>
  `;
  return div;
}

/* --- Screen 3: Chapter 3 ---------------------------------- */
const formulaItems = [
  { label: 'משימה', title: 'מה אתה רוצה שהכלי יעשה?', desc: 'פועל + נושא. כמה שיותר ספציפי.', example: 'במקום: "תכתוב לי פוסט"\nעדיף: "כתוב פוסט אינסטגרם של 4 שורות על שינה לנשים עסוקות"' },
  { label: 'הקשר',  title: 'רקע ונושא', desc: 'על מה בדיוק? מה התחום? מה הרקע? כמה מידע שתתני — כך התוצאה תהיה מדויקת יותר.', example: 'הקשר: "אני קואצ\'רית שעובדת עם נשים בגיל 40+, מתמחה במעברים מקצועיים"' },
  { label: 'קהל',   title: 'למי זה מיועד?', desc: 'מי יקרא / ישמע / יראה? גיל, תחום, רמת ידע, מה הם מרגישים ביחס לנושא.', example: 'קהל: "נשים בגיל 35-55 שרוצות להשתמש ב-AI אבל מרגישות מוצפות"' },
  { label: 'מטרה',  title: 'מה אתה רוצה שיקרה?', desc: 'מה המטרה? מה את רוצה שהקורא יחשוב, ירגיש, יעשה?', example: 'מטרה: "שיבינו שאפשר להתחיל מקטן ושירשמו לסדנה"' },
  { label: 'סגנון', title: 'איך לכתוב?', desc: 'מקצועי? חברותי? עם הומור? קצר וחד? מעורר השראה? רשמי?', example: 'סגנון: "חברותי, מעודד, לא מטיף, ישיר"' },
  { label: 'פורמט', title: 'איך להחזיר את התוצאה?', desc: 'רשימה? פסקה? כותרות? כמה שורות? כדאי לציין גם אורך.', example: 'פורמט: "3-4 שורות, ללא כותרות, עם אמוג\'י אחד בסוף"' },
];

function renderCh3() {
  const div = make('div');
  div.innerHTML = `
    <h2 class="screen-title">הנוסחה הפשוטה לפרומפט טוב</h2>
    <p class="screen-subtitle">שישה רכיבים. לא חייבים את כולם — אבל כל אחד שמוסיפים, משפר את התוצאה.</p>

    <div class="formula-row">
      ${formulaItems.map((item, i) => `
        <span class="formula-badge">${item.label}</span>
        ${i < formulaItems.length - 1 ? '<span class="formula-sep">+</span>' : ''}
      `).join('')}
    </div>

    ${formulaItems.map((item, i) => `
      <div class="accordion-item">
        <div class="accordion-header" onclick="toggleAcc('ch3-${i}')" tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' ')toggleAcc('ch3-${i}')">
          <span><strong>${item.label}</strong> — ${item.title}</span>
          <svg class="accordion-chevron" id="chevron-ch3-${i}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="accordion-body" id="acc-ch3-${i}">
          <p style="margin-top:10px">${item.desc}</p>
          <pre class="accordion-example"><strong>דוגמה:</strong>\n${item.example}</pre>
        </div>
      </div>
    `).join('')}
  `;
  return div;
}

/* --- Screen 4: Exercise 1 — Free Prompt Builder ----------- */
function renderEx1() {
  const s = state.ex1;
  const div = make('div');
  div.innerHTML = `
    <span class="ex-badge free">🔓 תרגול 1 מתוך 2 — כתיבה חופשית</span>
    <h2 class="screen-title">בני פרומפט מאפס</h2>
    <p class="screen-subtitle">מלאי את השדות בצורה חופשית — לא צריך להתאים לשום תבנית. כל שדה נוסף שממלאים, הפרומפט נהיה מדויק יותר.</p>

    <div class="card" style="margin-bottom:16px;background:rgba(96,165,250,.06);border-color:rgba(96,165,250,.2);">
      <p style="font-size:13px;color:#93C5FD;line-height:1.6;">💡 <strong>מה מיוחד בתרגול הזה:</strong> את ממלאת שדות כלליים ומקבלת פרומפט מנוסח. אין הגבלה על הנושא — כל בקשה שתרצי.</p>
    </div>

    <div class="form-group">
      <label class="form-label" for="ex1-task">מה אני רוצה שהכלי יעשה? <span style="color:var(--accent)">*</span></label>
      <input class="form-input" id="ex1-task" type="text" autocomplete="off"
             placeholder="לדוגמה: לכתוב פוסט אינסטגרם על חשיבות השינה"
             value="${escHtml(s.task)}" oninput="state.ex1.task=this.value">
    </div>
    <div class="form-group">
      <label class="form-label" for="ex1-audience">למי זה מיועד?</label>
      <input class="form-input" id="ex1-audience" type="text" autocomplete="off"
             placeholder="לדוגמה: נשים עסוקות בגיל 35-50"
             value="${escHtml(s.audience)}" oninput="state.ex1.audience=this.value">
    </div>
    <div class="form-group">
      <label class="form-label" for="ex1-goal">מה המטרה שלי?</label>
      <input class="form-input" id="ex1-goal" type="text" autocomplete="off"
             placeholder="לדוגמה: שיתחילו לישון בשעה קבועה"
             value="${escHtml(s.goal)}" oninput="state.ex1.goal=this.value">
    </div>
    <div class="form-group">
      <label class="form-label" for="ex1-style">באיזה סגנון?</label>
      <input class="form-input" id="ex1-style" type="text" autocomplete="off"
             placeholder="לדוגמה: חברותי ומעודד, לא מטיף"
             value="${escHtml(s.style)}" oninput="state.ex1.style=this.value">
    </div>
    <div class="form-group">
      <label class="form-label" for="ex1-format">באיזה פורמט?</label>
      <input class="form-input" id="ex1-format" type="text" autocomplete="off"
             placeholder="לדוגמה: 3-4 שורות, עם אמוג'י"
             value="${escHtml(s.format)}" oninput="state.ex1.format=this.value">
    </div>

    <button class="btn-inline" onclick="generateEx1()">✦ צור לי פרומפט</button>

    <div class="output-box" id="ex1-output">
      <p class="output-box-label">הפרומפט שלך — מוכן להעתקה</p>
      <p class="output-text" id="ex1-output-text"></p>
      <div class="output-actions">
        <button class="btn-copy" id="btn-copy-ex1" onclick="copyText('ex1-output-text','btn-copy-ex1')">
          ${iconCopy()} העתיקי
        </button>
      </div>
    </div>
    <div style="height:8px"></div>
  `;
  return div;
}

function generateEx1() {
  const { task, audience, goal, style, format } = state.ex1;
  const inp = document.getElementById('ex1-task');
  if (!task || !task.trim()) {
    inp.focus();
    inp.style.borderColor = 'var(--accent)';
    inp.style.boxShadow   = '0 0 0 3px var(--accent-glow)';
    setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 2000);
    return;
  }
  const lines = [task.trim()];
  if (audience.trim()) lines.push('קהל יעד: ' + audience.trim());
  if (goal.trim())     lines.push('מטרה: '     + goal.trim());
  if (style.trim())    lines.push('סגנון: '    + style.trim());
  if (format.trim())   lines.push('פורמט: '    + format.trim());
  const out = document.getElementById('ex1-output');
  document.getElementById('ex1-output-text').textContent = lines.join('\n');
  out.classList.add('visible');
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* --- Screen 5: Chapter 4 — Before / After ----------------- */
const beforeAfterTabs = [
  {
    label: 'פוסט',
    weak: '"תכתוב לי פוסט על בריאות"',
    weakResult: 'פוסט כללי שיכול להתאים לכולם ולאף אחד.',
    strong: '"כתוב פוסט לינקדאין של 4-5 שורות על חשיבות גבולות עבודה-בית. קהל: מנהלים 35-50. טון: כנה, מעשי. סיים בשאלה לקהל."',
    strongResult: 'פוסט ממוקד, אמין, עם קריאה לאינטראקציה.',
  },
  {
    label: 'סדנה',
    weak: '"תן לי רעיון לסדנה על AI"',
    weakResult: 'רעיון שלא מתאים לאף קהל ספציפי.',
    strong: '"הצע 3 רעיונות לסדנה של שעתיים לנשים עצמאיות (קואצ\'ינג, טיפול) שרוצות להכניס AI לעסק. מטרה: להתחיל מיד. רמה: מתחילות."',
    strongResult: 'רעיונות ספציפיים, מותאמים לקהל, עם שם ומבנה.',
  },
  {
    label: 'תמונה',
    weak: '"צור לי תמונה יפה לעסק שלי"',
    weakResult: 'תמונה גנרית שלא קשורה לעסק.',
    strong: '"צור תמונה לפרופיל עסקי: אישה ליד מחשב נייד, חלל עבודה מסודר וחמים, תאורה טבעית, צבעים בז\' ולבן. תחושה: מקצועי, נגיש."',
    strongResult: 'תמונה מותאמת למותג, עם תחושה ברורה ומדויקת.',
  },
];

function renderCh4() {
  const div = make('div');
  div.innerHTML = `
    <h2 class="screen-title">אותה בקשה. תוצאה אחרת לגמרי.</h2>
    <p class="screen-subtitle">ההבדל הוא לא בכלי. הוא בדרך שבה מבקשים.</p>

    <div class="tabs" id="tabs-ch4">
      ${beforeAfterTabs.map((t, i) => `
        <button class="tab-btn ${i===0?'active':''}" id="tab-btn-ch4-${i}"
                onclick="switchTab('ch4',${i},${beforeAfterTabs.length})">${t.label}</button>
      `).join('')}
    </div>

    ${beforeAfterTabs.map((t, i) => `
      <div class="tab-panel ${i===0?'active':''}" id="tab-ch4-${i}">
        <div class="compare-grid">
          <div class="compare-card weak">
            <p class="compare-card-label">בקשה חלשה</p>
            <p>${t.weak}</p>
          </div>
          <div class="compare-card strong">
            <p class="compare-card-label">בקשה טובה</p>
            <p>${t.strong}</p>
          </div>
        </div>
        <div class="compare-result-grid">
          <div class="compare-result weak-result">
            <p class="compare-result-label">מה כנראה נקבל:</p>
            <p>${t.weakResult}</p>
          </div>
          <div class="compare-result strong-result">
            <p class="compare-result-label">מה נקבל עכשיו:</p>
            <p>${t.strongResult}</p>
          </div>
        </div>
      </div>
    `).join('')}
  `;
  return div;
}

/* --- Screen 6: Chapter 5 — Use Cases --------------------- */
const useCases = [
  { icon:'📝', title:'כתיבת פוסט', when:'לפרסום ברשתות החברתיות', template:'כתוב פוסט [אינסטגרם/לינקדאין] בנושא [נושא].\nקהל: [קהל]. מטרה: [מטרה].\nסגנון: [סגנון]. פורמט: [פורמט].' },
  { icon:'💡', title:'רעיונות לתוכן', when:'כשנגמרים הרעיונות או לתכנון חודשי', template:'הצע [מספר] רעיונות לתוכן עבור [קהל יעד].\nתחום: [תחום]. פלטפורמה: [פלטפורמה].\nלכל רעיון: כותרת + זווית + קריאה לפעולה.' },
  { icon:'💬', title:'הודעה ללקוחות', when:'לתקשורת עם לקוחות — שינוי, עדכון, הזמנה', template:'כתוב הודעת [ווטסאפ/מייל] על: [נושא].\nטון: [חברותי/מקצועי]. לא יותר מ-3 שורות.\nכלול: [פרטים חשובים].' },
  { icon:'🖼', title:'יצירת תמונה', when:'לפוסטים, מצגות, כיסויים, פרופיל עסקי', template:'צור תמונה של [תיאור].\nצבעים: [צבעים]. תחושה: [תחושה].\nסגנון: [ריאליסטי/איור]. שימוש: [שימוש].' },
  { icon:'📋', title:'סיכום חומר', when:'לטקסט ארוך שצריך להפוך לנקודות', template:'סכם את הטקסט הבא ב-[מספר] נקודות עיקריות.\nפורמט: [נקודות/פסקה]. דגש על: [מה חשוב].\n\n[הדבק כאן את הטקסט]' },
];

function renderCh5() {
  const div = make('div');
  div.innerHTML = `
    <h2 class="screen-title">בואי נתרגם את זה לשימוש יומיומי</h2>
    <p class="screen-subtitle">5 שימושים נפוצים עם תבנית מוכנה לכל אחד.</p>
    ${useCases.map(uc => `
      <div class="use-case-card">
        <div class="use-case-header">
          <span class="use-case-icon">${uc.icon}</span>
          <span class="use-case-title">${uc.title}</span>
        </div>
        <p class="use-case-when">${uc.when}</p>
        <div class="use-case-template">${uc.template.replace(/\n/g,'<br>')}</div>
      </div>
    `).join('')}
  `;
  return div;
}

/* --- Screen 7: Exercise 2 — Type-Specific Builder --------- */
const typeConfig = {
  post:    { label:'פוסט',    icon:'📝', fields:[
    { key:'topic',    label:'על מה הפוסט?',   ph:'לדוגמה: חשיבות גבולות בעבודה' },
    { key:'audience', label:'למי זה מיועד?',  ph:'לדוגמה: נשים עסוקות בגיל 40+' },
    { key:'goal',     label:'מה המטרה?',       ph:'לדוגמה: שיפנו אלי בהודעה' },
    { key:'style',    label:'סגנון',           ph:'לדוגמה: חברותי, לא מטיף' },
    { key:'format',   label:'פורמט',          ph:"לדוגמה: 4 שורות, עם אמוג'י" },
  ], build: d => `כתוב פוסט${d.format?' בפורמט: '+d.format:''} בנושא: ${d.topic||'___'}${d.audience?'\nקהל יעד: '+d.audience:''}${d.goal?'\nמטרה: '+d.goal:''}${d.style?'\nסגנון: '+d.style:''}` },
  ideas:   { label:'רעיונות', icon:'💡', fields:[
    { key:'topic',    label:'באיזה תחום?',     ph:'לדוגמה: בריאות, כסף, יחסים' },
    { key:'audience', label:'עבור מי?',        ph:'לדוגמה: יוצרות תוכן' },
    { key:'format',   label:'כמה רעיונות?',   ph:'לדוגמה: 5' },
    { key:'goal',     label:'מה המטרה?',       ph:'לדוגמה: תוכן לחודש הבא' },
  ], build: d => `הצע ${d.format||'5'} רעיונות לתוכן עבור ${d.audience||'הקהל שלי'}${d.topic?' בתחום '+d.topic:''}${d.goal?'.\nמטרה: '+d.goal:''}.\nלכל רעיון: כותרת + זווית + קריאה לפעולה.` },
  message: { label:'הודעה',   icon:'💬', fields:[
    { key:'topic',    label:'על מה ההודעה?',  ph:'לדוגמה: עדכון מחיר' },
    { key:'audience', label:'למי?',            ph:'לדוגמה: לקוחות קיימות' },
    { key:'style',    label:'טון',             ph:'לדוגמה: חברותי, לא רשמי' },
    { key:'format',   label:'פלטפורמה',       ph:'ווטסאפ / מייל' },
  ], build: d => `כתוב ${d.format||'הודעת ווטסאפ'} ל${d.audience||'הלקוחות שלי'} על: ${d.topic||'___'}${d.style?'\nטון: '+d.style:''}\nלא יותר מ-3 שורות.` },
  image:   { label:'תמונה',   icon:'🖼', fields:[
    { key:'topic',    label:'מה בתמונה?',       ph:'לדוגמה: אישה בחלל עבודה מסודר' },
    { key:'style',    label:'צבעים ותחושה',     ph:'לדוגמה: בהיר, חמים, מקצועי' },
    { key:'goal',     label:'סגנון ייצוג',      ph:'ריאליסטי / איור / עיצובי' },
    { key:'audience', label:'לאיזה שימוש?',    ph:'לדוגמה: פוסט אינסטגרם' },
  ], build: d => `צור תמונה של: ${d.topic||'___'}${d.style?'\nצבעים ותחושה: '+d.style:''}${d.goal?'\nסגנון: '+d.goal:''}${d.audience?'\nשימוש: '+d.audience:''}` },
  summary: { label:'סיכום',   icon:'📋', fields:[
    { key:'topic',    label:'מה לסכם?',          ph:'לדוגמה: מאמר, ראיון, הרצאה' },
    { key:'format',   label:'כמה נקודות?',      ph:'לדוגמה: 5' },
    { key:'goal',     label:'מה חשוב להדגיש?', ph:'לדוגמה: המלצות מעשיות' },
    { key:'audience', label:'מי יקרא?',         ph:'לדוגמה: הצוות שלי' },
  ], build: d => `סכם את [הטקסט] ב-${d.format||'5'} נקודות עיקריות${d.goal?'.\nדגש על: '+d.goal:''}${d.audience?'.\nקהל: '+d.audience:''}.\nפורמט: נקודות קצרות וברורות.` },
};

function renderEx2() {
  const selectedType = state.ex2.type;
  const div = make('div');
  div.innerHTML = `
    <span class="ex-badge guided">🗂 תרגול 2 מתוך 2 — תבנית לפי סוג</span>
    <h2 class="screen-title">בחרי סוג ותקבלי תבנית מותאמת</h2>
    <p class="screen-subtitle">כאן בוחרים קטגוריה ספציפית, מקבלים שדות מותאמים לאותו שימוש, ופלט מעשי ומוכן יותר.</p>

    <div class="card" style="margin-bottom:16px;background:rgba(167,139,250,.06);border-color:rgba(167,139,250,.2);">
      <p style="font-size:13px;color:#C4B5FD;line-height:1.6;">💡 <strong>מה שונה כאן:</strong> בניגוד לתרגול הראשון, כאן השדות מותאמים לסוג התוכן שבחרת. הפלט ממוקד יותר ויישומי יותר.</p>
    </div>

    <div class="selection-grid">
      ${Object.entries(typeConfig).map(([key, cfg]) => `
        <button class="selection-card ${selectedType===key?'selected':''}"
                onclick="selectEx2Type('${key}')">
          <span class="sel-icon">${cfg.icon}</span>
          ${cfg.label}
        </button>
      `).join('')}
    </div>

    ${selectedType ? `
      <div id="ex2-fields">
        ${typeConfig[selectedType].fields.map(f => `
          <div class="form-group">
            <label class="form-label">${f.label}</label>
            <input class="form-input" type="text" autocomplete="off"
                   placeholder="${escHtml(f.ph)}"
                   value="${escHtml(state.ex2[f.key]||'')}"
                   oninput="state.ex2['${f.key}']=this.value">
          </div>
        `).join('')}
        <button class="btn-inline" onclick="generateEx2()">✦ צור לי תבנית מוכנה</button>
      </div>
    ` : `<p style="text-align:center;color:var(--text-3);font-size:14px;padding:16px 0;">↑ בחרי סוג תוכן כדי להמשיך</p>`}

    <div class="output-box" id="ex2-output">
      <p class="output-box-label">התבנית שלך — מוכנה להעתקה</p>
      <p class="output-text" id="ex2-output-text"></p>
      <div class="output-actions">
        <button class="btn-copy" id="btn-copy-ex2" onclick="copyText('ex2-output-text','btn-copy-ex2')">
          ${iconCopy()} העתיקי
        </button>
      </div>
    </div>
  `;
  return div;
}

function selectEx2Type(type) {
  state.ex2 = { type, topic:'', audience:'', goal:'', style:'', format:'' };
  const c = document.getElementById('screen-container');
  c.innerHTML = '';
  c.appendChild(renderEx2());
}

function generateEx2() {
  const { type } = state.ex2;
  if (!type) return;
  const prompt = typeConfig[type].build(state.ex2);
  const out = document.getElementById('ex2-output');
  document.getElementById('ex2-output-text').textContent = prompt;
  out.classList.add('visible');
  out.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

/* --- Screen 8: Template Bank ------------------------------ */
const templates = [
  { title:'כתיבת פוסט',        icon:'📝', when:'לפרסום ברשתות', body:`כתוב פוסט [אינסטגרם/לינקדאין/פייסבוק] בנושא: [נושא].\nקהל יעד: [תאר את הקהל].\nמטרה: [מה אתה רוצה שהקורא יעשה/ירגיש].\nסגנון: [חברותי/מקצועי/הומוריסטי].\nפורמט: [מספר שורות, אמוג'י כן/לא].` },
  { title:'רעיונות לתוכן',     icon:'💡', when:'כשנגמרים הרעיונות', body:`הצע [מספר] רעיונות לתוכן עבור [תאר את הקהל].\nתחום: [תחום]. פלטפורמה: [פלטפורמה].\nלכל רעיון: כותרת + זווית + קריאה לפעולה.` },
  { title:'הודעת ווטסאפ',      icon:'💬', when:'לתקשורת ישירה עם לקוחות', body:`כתוב הודעת ווטסאפ ל[מי] על: [נושא].\nטון: [חברותי/מקצועי/רשמי].\nלא יותר מ-3 שורות.\nכלול: [מה חשוב לציין].` },
  { title:'מייל',              icon:'📧', when:'לתקשורת רשמית או שיווקית', body:`כתוב מייל ל[מי] בנושא: [נושא].\nמטרה: [מה אתה רוצה שיקרה].\nטון: [טון]. אורך: [קצר/בינוני/מפורט].\nכלול: [נקודות חשובות].` },
  { title:'יצירת תמונה',       icon:'🖼', when:'לפוסטים, מצגות, פרופיל', body:`צור תמונה של: [תיאור מה רואים].\nצבעים: [צבעים מרכזיים]. תחושה: [תחושה רצויה].\nסגנון: [ריאליסטי/איור/עיצובי]. שימוש: [פוסט/כיסוי/פרופיל].` },
  { title:'סיכום טקסט',        icon:'📋', when:'לכל טקסט ארוך שצריך לעכל', body:`סכם את הטקסט הבא:\n[הדבק את הטקסט]\n\nאורך הסיכום: [מספר נקודות/שורות].\nפורמט: [נקודות/פסקה/כותרות]. דגש על: [מה חשוב].` },
  { title:'רעיון לסדנה/מוצר',  icon:'🎯', when:'לפיתוח שירות חדש', body:`הצע [מספר] רעיונות ל[סדנה/מוצר/שירות] עבור [קהל יעד].\nתחום: [תחום]. אורך: [משך/היקף].\nמטרה: [מה הלקוח ירוויח]. רמה: [מתחילים/מתקדמים].` },
  { title:'שיפור טקסט קיים',   icon:'✏️', when:'לטקסט שכתבת וצריך לשפר', body:`שפר את הטקסט הבא:\n[הדבק את הטקסט]\n\nמה לשפר: [בהירות/זרימה/סגנון/קיצור].\nשמור על: [מה חשוב לא לשנות]. הקהל: [מי יקרא].` },
  { title:'סדר וארגון מחשבות', icon:'🗂', when:'כשיש הרבה מחשבות בראש', body:`יש לי כמה מחשבות בנושא [נושא]. עזור לי לסדר אותם לתוכנית ברורה.\nהמטרה הסופית: [מה אני רוצה להשיג].\n\nהמחשבות שלי:\n[רשום בחופשיות]` },
  { title:'ניסוח בסגנון מסוים', icon:'🎨', when:'לשינוי טון או סגנון', body:`כתוב מחדש את הטקסט הבא בסגנון [פשוט/אקדמי/שיווקי/סיפורי/ישיר]:\n[הטקסט]\n\nשמור על: [מה חשוב]. קהל: [מי יקרא].` },
];

function renderTemplates() {
  const div = make('div');
  div.innerHTML = `
    <h2 class="screen-title">בנק תבניות מוכן להעתקה</h2>
    <p class="screen-subtitle">10 תבניות לשימוש מיידי. פתחי, התאימי, העתיקי.</p>
    ${templates.map((t, i) => `
      <div class="accordion-item">
        <div class="accordion-header" onclick="toggleAcc('tmpl-${i}')" tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' ')toggleAcc('tmpl-${i}')">
          <span style="display:flex;align-items:center;gap:8px"><span>${t.icon}</span>${t.title}</span>
          <svg class="accordion-chevron" id="chevron-tmpl-${i}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="accordion-body" id="acc-tmpl-${i}">
          <p style="font-size:12px;color:var(--text-3);margin:10px 0 8px">${t.when}</p>
          <pre style="white-space:pre-wrap;font-family:var(--font);font-size:13px;color:var(--text-2);
               background:var(--bg-2,#111D31);padding:10px 12px;border-radius:var(--r-sm);
               line-height:1.75;border:1px solid var(--border);
               direction:rtl;text-align:right;" id="tmpl-pre-${i}">${escHtml(t.body)}</pre>
          <div class="output-actions" style="margin-top:8px">
            <button class="btn-copy" id="btn-tmpl-${i}" onclick="copyTemplate(${i})">
              ${iconCopy()} העתיקי תבנית
            </button>
          </div>
        </div>
      </div>
    `).join('')}
  `;
  return div;
}

function copyTemplate(i) {
  writeToClipboard(templates[i].body, `btn-tmpl-${i}`, 'העתיקי תבנית');
}

/* --- Screen 9: Self-Check --------------------------------- */
const selfCheckItems = [
  'כתבתי למי זה מיועד (קהל יעד)?',
  'כתבתי מה המטרה שלי?',
  'ביקשתי סגנון ספציפי?',
  'ביקשתי פורמט ברור?',
  'נתתי מספיק הקשר?',
];

function renderSelfCheck() {
  const div = make('div');
  const checked = state.selfcheck;
  const total   = selfCheckItems.length;
  const count   = checked.size;
  const allDone = count === total;

  div.innerHTML = `
    <h2 class="screen-title">בדקי את עצמך לפני שתשלחי</h2>
    <p class="screen-subtitle">לפני שאת מעתיקה את הפרומפט הבא לכלי AI, עברי על הרשימה הזו. כל סעיף שממלאים — משפר את התוצאה.</p>

    ${selfCheckItems.map((item, i) => `
      <div class="selfcheck-item ${checked.has(i)?'checked':''}" onclick="toggleCheck(${i})">
        <div class="selfcheck-box">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2.5">
            <polyline points="2 6 5 9 10 3"/>
          </svg>
        </div>
        <span class="selfcheck-text">${item}</span>
      </div>
    `).join('')}

    <div class="selfcheck-progress ${allDone?'all-done':''}" id="sc-progress">
      ${allDone
        ? `<span class="selfcheck-score">${count}/${total}</span><br>מצוין! הפרומפט שלך מוכן לשימוש.`
        : `${count} מתוך ${total} סעיפים סומנו`}
    </div>

    ${count >= 3 ? `
      <div class="highlight-box" style="margin-top:0">
        <p>${count === total ? '✓ פרומפט עשיר וברור — סיכוי גבוה לתוצאה טובה.' : 'טוב! עוד כמה פרטים ותוצאה תהיה מדויקת עוד יותר.'}</p>
      </div>
    ` : ''}
  `;
  return div;
}

function toggleCheck(idx) {
  if (state.selfcheck.has(idx)) {
    state.selfcheck.delete(idx);
  } else {
    state.selfcheck.add(idx);
  }
  const c = document.getElementById('screen-container');
  c.innerHTML = '';
  c.appendChild(renderSelfCheck());
}

/* --- Screen 10: Ending ------------------------------------ */
function renderEnding() {
  const div = make('div');
  div.innerHTML = `
    <div class="ending-wrap">
      <span class="ending-check" role="img" aria-label="סיום">✅</span>
      <h2 class="screen-title">מעכשיו עובדים ברור יותר</h2>
    </div>

    <div class="card mt-16">
      <p class="card-text" style="line-height:1.85">
        אם הגעת עד כאן, כבר יש לך יתרון גדול על רוב האנשים שמנסים לעבוד עם AI בצורה אקראית.
      </p>
      <p class="card-text mt-12" style="font-weight:600;color:var(--text-1);">
        את רק צריכה להתחיל ברור יותר. פחות ניסוי וטעייה. יותר דיוק. יותר תוצאה.
      </p>
    </div>

    <div class="ending-cta-card">
      <p class="ending-cta-title">רוצה להמשיך?</p>
      <p class="ending-cta-text">
        אם החוברת הזו עשתה לך סדר, בקבוצה שלי אני משתפת עוד תכנים, דוגמאות ודרכי עבודה פשוטות שיעזרו לך להשתמש ב-AI בצורה ברורה, פרקטית וחכמה יותר.<br><br>
        אם את עדיין לא שם, אפשר להצטרף כאן.
      </p>
      <a href="https://chat.whatsapp.com/IQ7iKLBplPC2zJyArmbfuq"
         target="_blank" rel="noopener noreferrer" class="btn-cta-link">
        הצטרפות לקבוצה ←
      </a>
    </div>
    <div style="height:48px"></div>
  `;
  return div;
}

/* ============================================================
   QUIZ SCREEN (Screen 8)
   ============================================================ */

const quizData = [
  {
    q: 'למה תוצאה חלשה מ-AI לא בהכרח אומרת שהכלי לא טוב?',
    opts: [
      'כי הכלי צריך שדרוג',
      'כי הבקשה שנשלחה לא הייתה מספיק ברורה',
      'כי שפה עברית לא נתמכת היטב',
      'כי AI לא יכול להבין עסקים קטנים',
    ],
    correct: 1,
    explain: 'הכלי מנחש את מה שחסר. ברוב המקרים הבעיה היא בניסוח — לא בכלי עצמו.',
  },
  {
    q: 'מה הטעות הכי נפוצה של אנשים שמשתמשים ב-AI?',
    opts: [
      'כותבים בקשות ארוכות מדי',
      'כותבים בשפה פורמלית מדי',
      'כותבים בקשות כלליות מדי, בלי פרטים',
      'לא מציינים את שם הכלי',
    ],
    correct: 2,
    explain: 'בקשה כללית מדי מכריחה את הכלי לנחש. התוצאה תהיה תמיד גנרית.',
  },
  {
    q: 'איזה מידע הכי חשוב לציין בפרומפט לכתיבת פוסט?',
    opts: [
      'שם הפלטפורמה, תאריך פרסום, מספר תווים',
      'קהל יעד, מטרה וסגנון רצוי',
      'הכותרת המוצעת ומספר השורות בלבד',
      'הנושא בלבד — שאר הפרטים פחות חשובים',
    ],
    correct: 1,
    explain: 'קהל + מטרה + סגנון הופכים פוסט גנרי לפוסט שמדבר ישירות אל הקהל הנכון.',
  },
  {
    q: 'מה ההבדל בין בקשה כללית לבקשה מדויקת?',
    opts: [
      'הבקשה המדויקת ארוכה יותר בלבד',
      'הבקשה המדויקת כוללת שאלות לכלי',
      'אין הבדל — שניהן מייצרות תוצאות דומות',
      'הבקשה המדויקת כוללת הקשר, קהל, מטרה וסגנון',
    ],
    correct: 3,
    explain: 'הוספת הקשר, קהל, מטרה וסגנון היא מה שהופכת בקשה רגילה לפרומפט שנותן תוצאה.',
  },
  {
    q: 'מה קורה כאשר הכלי לא מקבל מספיק מידע?',
    opts: [
      'הוא מבקש ממך להרחיב',
      'הוא מחזיר שגיאה',
      'הוא ממציא ומשלים את החסר',
      'הוא מחזיר תשובה ריקה',
    ],
    correct: 2,
    explain: 'הכלל המרכזי: מה שהכלי לא יודע, הוא ממציא. לכן חשוב לתת כמה שיותר הקשר.',
  },
];

const optLetters = ['א', 'ב', 'ג', 'ד'];

function renderQuiz() {
  const qState = state.quiz;
  const div = make('div');

  if (qState.phase === 'results') {
    renderQuizResults(div);
  } else {
    renderQuizQuestion(div, qState.current);
  }
  return div;
}

function renderQuizQuestion(container, qIdx) {
  const q        = quizData[qIdx];
  const answered = state.quiz.phase === 'answered';
  const userAns  = state.quiz.answers[qIdx];

  container.innerHTML = `
    <h2 class="screen-title">בוחן הבנה</h2>
    <p class="screen-subtitle">5 שאלות קצרות על מה שלמדת. בסוף תוכלי לראות את התשובות הנכונות.</p>

    <p class="quiz-q-num">שאלה ${qIdx + 1} מתוך ${quizData.length}</p>
    <p class="quiz-q-text">${q.q}</p>

    <div id="quiz-opts">
      ${q.opts.map((opt, i) => {
        let cls = 'quiz-opt';
        if (answered) {
          if (i === q.correct) cls += ' correct';
          else if (i === userAns) cls += ' wrong';
          else cls += ' neutral-disabled';
        }
        return `
          <button class="${cls}"
                  ${answered ? 'disabled' : `onclick="quizSelect(${qIdx},${i})"`}>
            <span class="quiz-opt-letter">${optLetters[i]}</span>
            ${escHtml(opt)}
          </button>`;
      }).join('')}
    </div>

    ${answered ? `
      <div class="quiz-hint">
        <strong>${userAns === q.correct ? '✓ נכון!' : '✗ לא בדיוק.'}</strong>
        ${escHtml(q.explain)}
      </div>
      <button class="quiz-next-btn" onclick="${qIdx < quizData.length - 1 ? 'quizAdvance()' : 'quizResults()'}">
        ${qIdx < quizData.length - 1 ? `שאלה ${qIdx + 2} מתוך ${quizData.length} ←` : 'ראי את התוצאה ←'}
      </button>
    ` : ''}
  `;
}

function renderQuizResults(container) {
  const total = quizData.length;
  const score = Object.entries(state.quiz.answers)
    .filter(([i, ans]) => Number(ans) === quizData[i].correct).length;

  let emoji, msg;
  if      (score === total)    { emoji = '🏆'; msg = 'מושלם! הכל ברור.'; }
  else if (score >= total - 1) { emoji = '⭐'; msg = 'כמעט מושלם — עוד מעט שם.'; }
  else if (score >= 3)         { emoji = '💪'; msg = 'טוב! יש על מה לבנות.'; }
  else                         { emoji = '📖'; msg = 'כדאי לחזור ולעיין בפרקים.'; }

  container.innerHTML = `
    <h2 class="screen-title">בוחן הבנה</h2>

    <div class="quiz-score-wrap">
      <span style="font-size:48px;display:block;margin-bottom:10px;line-height:1">${emoji}</span>
      <div class="quiz-score-num">${score}/${total}</div>
      <p class="quiz-score-label">${msg}</p>
      <p class="quiz-score-sub">ענית נכון על ${score} מתוך ${total} שאלות</p>
    </div>

    <div class="quiz-review">
      ${quizData.map((q, i) => {
        const userAns = state.quiz.answers[i];
        const ok      = Number(userAns) === q.correct;
        return `
          <div class="quiz-review-item ${ok ? 'ok' : 'bad'}">
            <span class="quiz-review-icon">${ok ? '✓' : '✗'}</span>
            <div class="quiz-review-text">
              <strong>${escHtml(q.q)}</strong>
              <span>${ok ? 'תשובה נכונה.' : `התשובה הנכונה: ${escHtml(q.opts[q.correct])}`}</span>
            </div>
          </div>`;
      }).join('')}
    </div>
  `;

  // Unhide the footer "next" button
  const footer  = document.getElementById('app-footer');
  const btnNext = document.getElementById('btn-next');
  if (footer)  footer.style.display  = 'flex';
  if (btnNext) { btnNext.style.display = ''; btnNext.textContent = 'המשך לתבניות'; }
}

function quizSelect(qIdx, optIdx) {
  state.quiz.answers[qIdx] = optIdx;
  state.quiz.phase = 'answered';
  reRenderQuiz();
}

function quizAdvance() {
  state.quiz.current++;
  state.quiz.phase = 'q';
  reRenderQuiz();
}

function quizResults() {
  state.quiz.phase = 'results';
  reRenderQuiz();
}

function reRenderQuiz() {
  const c = document.getElementById('screen-container');
  c.innerHTML = '';
  c.appendChild(renderQuiz());
  c.scrollTop = 0;
}

/* ============================================================
   SHARED UTILITIES
   ============================================================ */

function toggleAcc(id) {
  const body    = document.getElementById('acc-' + id);
  const chevron = document.getElementById('chevron-' + id);
  const header  = body.previousElementSibling;
  const isOpen  = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  header.classList.toggle('open', !isOpen);
  if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

function switchTab(screenId, idx, total) {
  for (let i = 0; i < total; i++) {
    const btn   = document.getElementById(`tab-btn-${screenId}-${i}`);
    const panel = document.getElementById(`tab-${screenId}-${i}`);
    if (btn)   { btn.classList.toggle('active', i === idx); btn.setAttribute('aria-selected', i === idx); }
    if (panel) panel.classList.toggle('active', i === idx);
  }
}

function copyText(elId, btnId) {
  writeToClipboard(document.getElementById(elId).textContent, btnId, 'העתיקי');
}

function writeToClipboard(text, btnId, originalLabel) {
  const done = (ok) => {
    const btn = document.getElementById(btnId);
    if (!btn || !ok) return;
    btn.classList.add('copied');
    btn.innerHTML = `${iconCheck()} הועתק!`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `${iconCopy()} ${originalLabel}`;
    }, 2200);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => done(true)).catch(() => execCopy(text, done));
  } else {
    execCopy(text, done);
  }
}

function execCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  done(ok);
}

function make(tag, props = {}) {
  const n = document.createElement(tag);
  Object.assign(n, props);
  return n;
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function iconCopy() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`;
}

function iconCheck() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <polyline points="20 6 9 12 4 10"/>
  </svg>`;
}

/* --- Init ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => { renderApp(); });
