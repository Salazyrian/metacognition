/* ============================================================
   METACOGNITION — logic (v4, strengthened)
   - pure perceptual: dots (flashed) + lines (near-threshold)
   - 2-down-1-up staircase holds accuracy ~71% -> d' comparable
   - confidence rating 1..4 after each trial
   - metric: area under the type-2 ROC (confidence vs correctness)
   - honest binary verdict + "strong" top-range badge
   - no community counter
   ============================================================ */

/* ---------- CONFIG ---------- */
const N_TRIALS    = 40;     // 20 dots + 20 lines, interleaved
const FLASH_MS    = { dots:600, lines:550 };  // both types flashed
const AUC_BAR     = 0.60;   // detected if type-2 AUC >= this
const AUC_STRONG  = 0.72;   // top-range badge
const AUC_MARGIN  = 0.06;   // borderline band around the bar

/* ---------- i18n ---------- */
const I18N = {
  ru:{
    brand:"МЕТАПОЗНАНИЕ",
    intro_eyebrow:"ИНСТРУМЕНТ ИЗМЕРЕНИЯ",
    intro_title:"Видит ли ваш разум сам себя?",
    intro_def:"Метапознание (метакогниция) — это отслеживание собственного мышления: способность чувствовать, когда вы скорее всего правы, а когда, скорее всего, ошиблись. Тест не проверяет, умны вы или нет, и не оценивает знания. Сложность задач подстраивается под вас так, чтобы держать точность около 70% — поэтому важно не «насколько хорошо вы видите», а одно: совпадает ли ваша уверенность с реальной правильностью ваших же ответов.",
    how_1:"40 коротких задач",
    how_2:"после каждой — оценка уверенности",
    how_3:"имя не нужно",
    start:"Начать",
    intro_fine:"Отвечайте честно и честно разводите уверенность: ставьте «наугад», когда правда гадаете. Тест измеряет соответствие уверенности и правильности — подыгрывать тут можно только себе во вред.",
    conf_q:"Насколько вы уверены в ответе?",
    conf_1:"Наугад", conf_2:"Сомневаюсь", conf_3:"Скорее уверен", conf_4:"Уверен",
    computing:"Сопоставляю уверенность и точность…",
    again:"Пройти заново",
    foot:"Сложность подстраивается под ~70% точности; результат — площадь под кривой type-2 ROC (уверенность vs правильность), где 0.50 — случайность. Упрощённая оценка, не диагностический инструмент.",
    p_dots:"Где было больше точек?",
    p_lines:"Какая линия длиннее?",
    a_left:"Слева", a_right:"Справа", a_A:"A", a_B:"B",
    m_auc:"мониторинг (AUC)", m_acc:"точность", m_conf:"ср. уверенность",
    m_chance:"0.50 — случайность",
    borderline:"Результат у границы. Короткий тест имеет погрешность, и при повторе он может качнуться в любую сторону — надёжен он, только когда заметно выше или ниже линии.",
    strong_badge:"СИЛЬНЫЙ МОНИТОРИНГ · ВЕРХНИЙ ДИАПАЗОН",
    yes_label:"РЕЗУЛЬТАТ",
    yes_title:"Метапознание обнаружено",
    yes_body:[
      "Ваша уверенность отслеживала реальную точность: где вы были уверены — там чаще оказывались правы, где сомневались — там чаще ошибались. Это и есть метакогнитивный мониторинг.",
      "Сложность по ходу подстраивалась под вашу точность, так что результат не про остроту зрения, а только про то, насколько ваше чувство «я прав» совпадает с фактом — ему можно доверять как сигналу, а не шуму."
    ],
    yes_strong_extra:"И сделали это заметно лучше большинства: ваш сигнал уверенности необычно информативен — это верхний диапазон шкалы.",
    no_label:"РЕЗУЛЬТАТ",
    no_title:"Чёткого сигнала не видно",
    no_body:[
      "На этом тесте ваша уверенность слабо отслеживала правильность: высокая уверенность встречалась в ошибках, низкая — в верных ответах. Тест мерит мониторинг собственных решений, а не интеллект и не знания — это разные вещи.",
      "Метакогнитивная чувствительность — непрерывная шкала, а не «есть или нет»; почти у всех она в той или иной степени присутствует. Устойчиво низкий сигнал здесь значит лишь, что в этих перцептивных задачах ваша уверенность менее информативна, чем сами ответы. Это распространено и само по себе ничего не говорит о способностях."
    ],
    incon_label:"РЕЗУЛЬТАТ",
    incon_title:"Недостаточно данных",
    incon_body:[
      "Вы почти не ошибались — а чтобы измерить соответствие уверенности и точности, нужны и попадания, и промахи. Сложность не успела подстроиться.",
      "Пройдите заново: задачи станут труднее, и сигнал проявится."
    ]
  },
  en:{
    brand:"METACOGNITION",
    intro_eyebrow:"A MEASURING INSTRUMENT",
    intro_title:"Does your mind see itself?",
    intro_def:"Metacognition is monitoring your own thinking: sensing when you are probably right and when you are probably wrong. This test does not check how smart you are and does not grade knowledge. Difficulty adapts to keep your accuracy near 70% — so what matters is not how well you can see, but one thing: whether your confidence lines up with how correct your answers actually were.",
    how_1:"40 short tasks",
    how_2:"a confidence rating after each",
    how_3:"no name required",
    start:"Begin",
    intro_fine:"Answer honestly, and spread your confidence honestly — use “guessing” when you really are. The test measures the match between confidence and correctness, so gaming it only fools you.",
    conf_q:"How sure are you of that answer?",
    conf_1:"Guessing", conf_2:"Unsure", conf_3:"Fairly sure", conf_4:"Certain",
    computing:"Matching confidence against accuracy…",
    again:"Take it again",
    foot:"Difficulty adapts toward ~70% accuracy; the score is the area under the type-2 ROC (confidence vs correctness), where 0.50 is chance. A simplified estimate, not a diagnostic instrument.",
    p_dots:"Which side had more dots?",
    p_lines:"Which line is longer?",
    a_left:"Left", a_right:"Right", a_A:"A", a_B:"B",
    m_auc:"monitoring (AUC)", m_acc:"accuracy", m_conf:"avg confidence",
    m_chance:"0.50 is chance",
    borderline:"Borderline result. A short test carries a margin of error, so on a retake it can tip either way — it is only reliable when clearly above or below the line.",
    strong_badge:"STRONG MONITORING · TOP RANGE",
    yes_label:"RESULT",
    yes_title:"Metacognition detected",
    yes_body:[
      "Your confidence tracked your real accuracy: where you felt sure you were more often right, where you doubted you were more often wrong. That is metacognitive monitoring.",
      "Difficulty adapted to your accuracy as you went, so this is not about sharp eyesight — only about how well your sense of “I’ve got this” matches the facts. It can be trusted as a signal rather than noise."
    ],
    yes_strong_extra:"And you did it well above most people: your confidence signal is unusually informative — the top range of the scale.",
    no_label:"RESULT",
    no_title:"No clear signal",
    no_body:[
      "On this test your confidence tracked correctness only weakly: high confidence showed up on errors, low confidence on correct answers. The test measures monitoring of your own decisions, not intelligence or knowledge — these are separate things.",
      "Metacognitive sensitivity is a continuous scale, not have-it-or-not; almost everyone has some. A steadily low signal here only means that, in these perceptual tasks, your confidence is less informative than your answers are. That is common and says nothing about ability on its own."
    ],
    incon_label:"RESULT",
    incon_title:"Not enough to tell",
    incon_body:[
      "You barely made mistakes — and to measure the match between confidence and accuracy, the test needs both hits and misses. Difficulty did not have time to adapt.",
      "Take it again: the tasks will get harder and the signal will show."
    ]
  }
};
let LANG="ru";

/* ---------- STAIRCASE ---------- */
// 2-down-1-up converges to ~71% correct. "delta" = difficulty handle
// (smaller delta = harder). Big step until the first reversals so it
// reaches threshold fast within a short run, then fine step. Per task.
const STAIR0 = {
  dots:  { delta:6,  step:1, bigStep:3, min:1, max:18, run:0, rev:0, lastDir:0 },
  lines: { delta:22, step:2, bigStep:8, min:2, max:80, run:0, rev:0, lastDir:0 }
};
let stair = structuredClone(STAIR0);
function stepStaircase(type, correct){
  const s=stair[type];
  const st = s.rev<2 ? s.bigStep : s.step;
  let dir=0;
  if(correct){ s.run++; if(s.run>=2){ s.delta=Math.max(s.min,s.delta-st); s.run=0; dir=-1; } }
  else { s.delta=Math.min(s.max,s.delta+st); s.run=0; dir=+1; }
  if(dir!==0){ if(s.lastDir!==0 && dir!==s.lastDir) s.rev++; s.lastDir=dir; }
}

/* ---------- TRIAL SCHEDULE ---------- */
// fixed interleave of task types; stimulus generated live from staircase
function buildSchedule(){
  const sched=[];
  for(let i=0;i<N_TRIALS;i++) sched.push(i%2===0?"dots":"lines");
  // light shuffle of pairs so it isn't perfectly alternating
  for(let i=sched.length-1;i>0;i--){
    if(Math.random()<0.25){ const j=Math.floor(Math.random()*(i+1)); [sched[i],sched[j]]=[sched[j],sched[i]]; }
  }
  return sched;
}

function makeDotsTrial(){
  const base=38+Math.floor(Math.random()*8);
  const less=Math.max(8, base - stair.dots.delta);
  const leftMore=Math.random()<0.5;
  return { type:"dots", left:leftMore?base:less, right:leftMore?less:base, correct:leftMore?"left":"right" };
}
function makeLinesTrial(){
  const long=300, short=Math.max(20, long - stair.lines.delta);
  const aLong=Math.random()<0.5;
  return { type:"lines", A:aLong?long:short, B:aLong?short:long, correct:aLong?"A":"B" };
}

/* ---------- STATE ---------- */
let SCHED=[], idx=0, current=null, lastCorrect=null;
const responses=[]; // {type, correct, confidence}

/* ---------- DOM ---------- */
const $=s=>document.querySelector(s);
const screens={ intro:$("#screen-intro"), test:$("#screen-test"), compute:$("#screen-compute"), result:$("#screen-result") };
function show(name){
  Object.values(screens).forEach(s=>s.classList.remove("is-visible"));
  screens[name].classList.add("is-visible");
  window.scrollTo({top:0,behavior:"smooth"});
}

/* ---------- i18n ---------- */
function t(k){ return I18N[LANG][k]!==undefined ? I18N[LANG][k] : k; }
function applyLang(){
  document.documentElement.lang=LANG;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const v=I18N[LANG][el.dataset.i18n];
    if(typeof v==="string") el.textContent=v;
  });
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("is-active",b.dataset.lang===LANG));
  if(screens.test.classList.contains("is-visible")) renderTrial();
  if(screens.result.classList.contains("is-visible")) reRenderResult();
}

/* ============================================================
   FLOW
   ============================================================ */
function startTest(){
  SCHED=buildSchedule(); idx=0; responses.length=0;
  stair = structuredClone(STAIR0);
  $("#trial-total").textContent=N_TRIALS;
  show("test"); renderTrial();
}

function renderTrial(){
  const type=SCHED[idx];
  // regenerate stimulus from CURRENT staircase difficulty (only when entering a new trial)
  if(!current || current._idx!==idx){
    current = type==="dots" ? makeDotsTrial() : makeLinesTrial();
    current._idx=idx;
  }
  const tr=current;

  $("#trial-now").textContent=idx+1;
  $("#progress-fill").style.width=(idx/N_TRIALS*100)+"%";
  $("#phase-confidence").hidden=true;
  $("#phase-question").hidden=false;

  const prompt=$("#trial-prompt"), stim=$("#stimulus"), ans=$("#answer-row");
  stim.innerHTML=""; ans.innerHTML="";

  if(tr.type==="dots"){
    prompt.textContent=t("p_dots");
    const wrap=document.createElement("div");
    wrap.style.cssText="display:flex;gap:clamp(14px,4vw,40px);align-items:center";
    const fL=makeDotField(tr.left), fR=makeDotField(tr.right);
    wrap.append(fL,fR); stim.append(wrap);
    buildAnswers(ans,[["left",t("a_left")],["right",t("a_right")]],tr.correct);
    flashThenHide([fL,fR],ans,"dots");
  } else {
    prompt.textContent=t("p_lines");
    const field=document.createElement("div"); field.className="line-field";
    field.append(makeLineRow("A",tr.A),makeLineRow("B",tr.B));
    stim.append(field);
    buildAnswers(ans,[["A",t("a_A")],["B",t("a_B")]],tr.correct);
    flashThenHide([field],ans,"lines");
  }
}

function makeDotField(n){
  const f=document.createElement("div"); f.className="dot-field";
  const placed=[];
  for(let i=0;i<n;i++){
    const p=document.createElement("span"); p.className="pip";
    let x,y,ok,tries=0;
    do{ x=6+Math.random()*150; y=6+Math.random()*150; ok=true;
        for(const q of placed){ if(Math.hypot(q.x-x,q.y-y)<9){ok=false;break;} } tries++; }
    while(!ok && tries<40);
    placed.push({x,y}); p.style.left=x+"px"; p.style.top=y+"px"; f.append(p);
  }
  return f;
}
function makeLineRow(key,len){
  const row=document.createElement("div"); row.className="line-row";
  const k=document.createElement("span"); k.className="line-key"; k.textContent=key;
  const bar=document.createElement("div"); bar.className="line-bar"; bar.style.width=len+"px";
  row.append(k,bar); return row;
}
function flashThenHide(fields,ans,type){
  ans.querySelectorAll(".ans").forEach(b=>b.disabled=true);
  setTimeout(()=>{
    fields.forEach(f=>f.querySelectorAll(".pip,.line-bar").forEach(el=>el.style.opacity="0"));
    ans.querySelectorAll(".ans").forEach(b=>b.disabled=false);
  },FLASH_MS[type]);
}
function buildAnswers(container,pairs,correctVal){
  pairs.forEach(([val,label])=>{
    const b=document.createElement("button"); b.className="ans"; b.textContent=label;
    b.addEventListener("click",()=>{ lastCorrect=(val===correctVal); goConfidence(); });
    container.append(b);
  });
}
function goConfidence(){ $("#phase-question").hidden=true; $("#phase-confidence").hidden=false; }

document.querySelectorAll(".dial-step").forEach(step=>{
  step.addEventListener("click",()=>{
    if(idx>=N_TRIALS) return;            // guard: test already finished
    const conf=parseInt(step.dataset.conf,10);
    const type=SCHED[idx];
    responses.push({type,correct:lastCorrect,confidence:conf});
    stepStaircase(type,lastCorrect);
    idx++; current=null;
    if(idx>=N_TRIALS) finish(); else renderTrial();
  });
});

/* ============================================================
   SCORING — area under the type-2 ROC
   ============================================================ */
function type2AUC(rs){
  const correct=rs.filter(r=>r.correct), incorrect=rs.filter(r=>!r.correct);
  if(correct.length<4 || incorrect.length<4) return null;
  const pts=[[0,0]];
  for(const c of [4,3,2]){ // confidence >= c
    const hr =correct.filter(r=>r.confidence>=c).length/correct.length;     // type-2 hit rate
    const far=incorrect.filter(r=>r.confidence>=c).length/incorrect.length; // type-2 false alarm
    pts.push([far,hr]);
  }
  pts.push([1,1]);
  pts.sort((a,b)=> a[0]-b[0] || a[1]-b[1]);
  let auc=0;
  for(let i=1;i<pts.length;i++) auc+=(pts[i][0]-pts[i-1][0])*(pts[i][1]+pts[i-1][1])/2;
  return auc;
}

function finish(){
  $("#phase-confidence").hidden=true;
  $("#progress-fill").style.width="100%";
  show("compute");
  setTimeout(()=>{
    const auc=type2AUC(responses);
    const acc=responses.filter(r=>r.correct).length/responses.length;
    const meanConf=responses.reduce((s,r)=>s+r.confidence,0)/responses.length;

    let verdict, strong=false;
    if(auc===null) verdict="incon";
    else if(auc>=AUC_STRONG){ verdict="yes"; strong=true; }
    else if(auc>=AUC_BAR) verdict="yes";
    else verdict="no";
    const borderline = (auc!==null) && Math.abs(auc-AUC_BAR)<AUC_MARGIN;

    renderResult(verdict,{auc,acc,meanConf,strong,borderline});
  },1400);
}

/* ============================================================
   RESULT
   ============================================================ */
let _last=null;
function renderResult(verdict,data){
  _last={verdict,data};
  const el=screens.result; el.classList.remove("is-yes","is-no");
  const mark=$("#verdict-mark"), badge=$("#verdict-badge");
  badge.hidden=true;

  if(verdict==="yes"){
    el.classList.add("is-yes"); mark.textContent="✓";
    $("#verdict-label").textContent=t("yes_label");
    $("#verdict-title").textContent=t("yes_title");
    const body=t("yes_body").slice();
    if(data.strong){ badge.hidden=false; badge.textContent=t("strong_badge"); body.push(t("yes_strong_extra")); }
    fillBody(body, data.borderline);
  } else if(verdict==="no"){
    el.classList.add("is-no"); mark.textContent="—";
    $("#verdict-label").textContent=t("no_label");
    $("#verdict-title").textContent=t("no_title");
    fillBody(t("no_body"), data.borderline);
  } else {
    el.classList.add("is-no"); mark.textContent="?";
    $("#verdict-label").textContent=t("incon_label");
    $("#verdict-title").textContent=t("incon_title");
    fillBody(t("incon_body"), false);
  }

  const aucTxt = data.auc===null ? "—" : data.auc.toFixed(2);
  $("#metrics").innerHTML=`
    <div class="metric"><span class="metric-v">${aucTxt}</span><span class="metric-k">${t("m_auc")}</span></div>
    <div class="metric"><span class="metric-v">${Math.round(data.acc*100)}%</span><span class="metric-k">${t("m_acc")}</span></div>
    <div class="metric"><span class="metric-v">${data.meanConf.toFixed(1)}</span><span class="metric-k">${t("m_conf")}</span></div>`;
  $("#metric-chance").textContent=t("m_chance");

  show("result");
}
function fillBody(arr, borderline){
  let html=arr.map(p=>`<p>${p}</p>`).join("");
  if(borderline) html+=`<p class="bl-note">${t("borderline")}</p>`;
  $("#verdict-body").innerHTML=html;
}
function reRenderResult(){ if(_last) renderResult(_last.verdict,_last.data); }

/* ---------- WIRING ---------- */
document.querySelectorAll(".lang-btn").forEach(b=>
  b.addEventListener("click",()=>{ LANG=b.dataset.lang; applyLang(); }));
$("#btn-start").addEventListener("click",startTest);
$("#btn-again").addEventListener("click",startTest);
applyLang();
