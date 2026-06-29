/* ============================================================
   METACOGNITION — logic
   - hybrid perceptual + knowledge trials
   - confidence rating after each
   - Goodman-Kruskal gamma between confidence & correctness
   - binary verdict by threshold
   - live local stats (+ optional global counter)
   ============================================================ */

/* ---------- CONFIG ---------- */
const GAMMA_THRESHOLD = 0.20;   // honest cut on a continuous measure
const FLASH_MS        = 750;    // perceptual stimulus exposure
const STATS_KEY       = "metacog_stats_v3";

// Optional global counter. Leave null to use local-only (live on this device).
// To enable shared stats, deploy the worker from README and put its URL here:
//   const GLOBAL_COUNTER = "https://your-worker.example.workers.dev";
const GLOBAL_COUNTER  = null;

/* ---------- i18n ---------- */
const I18N = {
  ru:{
    brand:"МЕТАПОЗНАНИЕ",
    intro_eyebrow:"ИНСТРУМЕНТ ИЗМЕРЕНИЯ",
    intro_title:"Видит ли ваш разум сам себя?",
    intro_def:"Метапознание (метакогниция) — это отслеживание собственного мышления: способность чувствовать, когда вы скорее всего правы, а когда, скорее всего, ошиблись. Тест не проверяет, умны вы или нет, и не оценивает знания. Он смотрит только на одно: совпадает ли ваша уверенность с реальной точностью ваших же ответов.",
    how_1:"24 коротких задачи",
    how_2:"после каждой — оценка уверенности",
    how_3:"имя не нужно",
    start:"Начать",
    intro_fine:"Отвечайте честно. Если в части задач вы не уверены — так и отмечайте: тест измеряет именно соответствие уверенности и правильности, а не саму правильность.",
    conf_q:"Насколько вы уверены в ответе?",
    conf_1:"Наугад", conf_2:"Сомневаюсь", conf_3:"Скорее уверен", conf_4:"Уверен",
    computing:"Сопоставляю уверенность и точность…",
    stat_head:"СРЕДИ ВСЕХ, КТО ПРОШЁЛ",
    legend_yes:"обнаружено", legend_no:"не обнаружено",
    stat_local:"статистика этого устройства",
    stat_global:"общая статистика",
    again:"Пройти заново",
    foot:"Упрощённая оценка метакогнитивной чувствительности (гамма-корреляция уверенности и точности). Не диагностический инструмент.",
    // trial prompts
    p_dots:"Где было больше точек?",
    p_lines:"Какая линия длиннее?",
    a_left:"Слева", a_right:"Справа", a_A:"A", a_B:"B",
    flash:"запоминайте…",
    // metrics
    m_gamma:"гамма (γ)", m_acc:"точность", m_conf:"ср. уверенность",
    // verdicts
    yes_label:"РЕЗУЛЬТАТ",
    yes_title:"Метапознание обнаружено",
    yes_body:[
      "Ваша уверенность шла в ногу с реальной точностью: где вы были уверены — там чаще оказывались правы, где сомневались — там чаще ошибались. Это и есть метакогнитивная чувствительность.",
      "Практически это значит, что вашему собственному ощущению «я прав» можно доверять как сигналу — оно несёт информацию, а не просто шум."
    ],
    no_label:"РЕЗУЛЬТАТ",
    no_title:"Чёткого сигнала не видно",
    no_body:[
      "На этом коротком тесте ваша уверенность не отслеживала правильность: высокая уверенность встречалась и в ошибках, низкая — и в верных ответах. Это не про ум. Метапознание и интеллект — разные вещи: задача мерила только совпадение чувства уверенности с фактом, а не способность решать.",
      "У такого исхода есть и обратная сторона. Сильный внутренний «мониторинг» в части исследований идёт рука об руку с тревожностью и руминацией — постоянным пересчётом собственных решений. Меньше самонаблюдения нередко означает больше решимости и меньше самокопания.",
      "И главное: метапознание зависит от области и сильно шумит на коротких тестах. Один прогон из 24 задач вас не определяет — в другой день или в знакомой теме сигнал может проявиться."
    ],
    incon_label:"РЕЗУЛЬТАТ",
    incon_title:"Недостаточно данных",
    incon_body:[
      "Вы ответили почти на все задачи одинаково — либо всё верно, либо всё с одной уверенностью. Чтобы измерить соответствие уверенности и точности, нужны и попадания, и промахи с разной уверенностью.",
      "Пройдите заново и постарайтесь честнее разводить уверенность: ставьте «наугад», когда правда гадаете."
    ]
  },
  en:{
    brand:"METACOGNITION",
    intro_eyebrow:"A MEASURING INSTRUMENT",
    intro_title:"Does your mind see itself?",
    intro_def:"Metacognition is monitoring your own thinking: sensing when you are probably right and when you are probably wrong. This test does not check how smart you are and does not grade knowledge. It looks at one thing only — whether your confidence lines up with how accurate your answers actually were.",
    how_1:"24 short tasks",
    how_2:"a confidence rating after each",
    how_3:"no name required",
    start:"Begin",
    intro_fine:"Answer honestly. When you are unsure, say so — the test measures the match between confidence and correctness, not correctness itself.",
    conf_q:"How sure are you of that answer?",
    conf_1:"Guessing", conf_2:"Unsure", conf_3:"Fairly sure", conf_4:"Certain",
    computing:"Matching confidence against accuracy…",
    stat_head:"AMONG EVERYONE WHO TOOK IT",
    legend_yes:"detected", legend_no:"not detected",
    stat_local:"stats from this device",
    stat_global:"shared statistics",
    again:"Take it again",
    foot:"Simplified estimate of metacognitive sensitivity (gamma correlation of confidence and accuracy). Not a diagnostic instrument.",
    p_dots:"Which side had more dots?",
    p_lines:"Which line is longer?",
    a_left:"Left", a_right:"Right", a_A:"A", a_B:"B",
    flash:"watch closely…",
    m_gamma:"gamma (γ)", m_acc:"accuracy", m_conf:"avg confidence",
    yes_label:"RESULT",
    yes_title:"Metacognition detected",
    yes_body:[
      "Your confidence kept pace with your actual accuracy: where you felt sure you were more often right, where you doubted you were more often wrong. That is metacognitive sensitivity.",
      "In practice it means your own sense of “I’ve got this” can be trusted as a signal — it carries information rather than noise."
    ],
    no_label:"RESULT",
    no_title:"No clear signal",
    no_body:[
      "On this short test your confidence did not track correctness: high confidence showed up on errors, low confidence on correct answers. This is not about intelligence. Metacognition and IQ are separable — the task only measured whether the feeling of certainty matched the facts, not your ability to solve.",
      "There is an upside to this. Strong internal monitoring, in some research, travels with anxiety and rumination — endlessly re-auditing your own decisions. Less self-monitoring often means more decisiveness and less second-guessing.",
      "And crucially: metacognition is domain-specific and very noisy on short tests. One run of 24 tasks does not define you — on another day, or in a familiar domain, the signal may well appear."
    ],
    incon_label:"RESULT",
    incon_title:"Not enough to tell",
    incon_body:[
      "You answered almost everything the same way — either all correct, or all at one confidence level. To measure the match between confidence and accuracy, the test needs both hits and misses at different confidence levels.",
      "Take it again and spread your confidence honestly: use “guessing” when you really are."
    ]
  }
};

let LANG = "ru";

/* ---------- TRIALS ---------- */
// Perceptual trials are generated; difficulty tiers guarantee a spread of
// correct/incorrect responses so the gamma correlation is well-defined.
function buildTrials(){
  const trials = [];

  // dot tiers: [more, less]
  const dotPairs = [
    [42,26],[40,28],            // very easy
    [38,30],[36,29],[44,35],    // easy
    [40,34],[37,32],[42,37],[45,39],    // medium
    [39,36],[41,38],[38,35],[43,40],    // hard
    [40,38],[42,40],[39,37]     // very hard
  ];
  dotPairs.forEach(([a,b])=>{
    const leftMore = Math.random()<0.5;
    trials.push({
      type:"dots",
      left:  leftMore? a : b,
      right: leftMore? b : a,
      correct: leftMore? "left":"right"
    });
  });

  // line trials: [lenA, lenB] in px
  const linePairs = [
    [330,210],   // easy
    [300,255],   // medium
    [300,278],   // hard
    [300,288]    // very hard
  ];
  linePairs.forEach(([a,b])=>{
    const aTop = Math.random()<0.5;
    trials.push({
      type:"lines",
      A: aTop? a : b,
      B: aTop? b : a,
      correct: (aTop? a:b) >= (aTop? b:a) ? "A":"B"
    });
  });

  // knowledge trials — bilingual, stable facts, varied difficulty
  const know = [
    { q:{ru:"Что выше?",en:"Which is taller?"},
      opts:[{ru:"Эйфелева башня",en:"Eiffel Tower"},{ru:"Пирамида Хеопса",en:"Great Pyramid of Giza"}], correct:0 }, // 330 vs 139 m — easy
    { q:{ru:"Что появилось раньше?",en:"Which came first?"},
      opts:[{ru:"Телефон",en:"The telephone"},{ru:"Лампа накаливания",en:"The light bulb"}], correct:0 }, // 1876 vs 1879 — medium
    { q:{ru:"Что больше по площади поверхности?",en:"Which has the larger surface area?"},
      opts:[{ru:"Африка",en:"Africa"},{ru:"Поверхность Луны",en:"The Moon’s surface"}], correct:1 }, // Moon ~38M > Africa ~30M — hard/counterintuitive
    { q:{ru:"В какой жидкости больше сахара (по объёму напитка)?",en:"Which drink has more sugar per serving?"},
      opts:[{ru:"Кола",en:"Cola"},{ru:"Яблочный сок",en:"Apple juice"}], correct:1 } // apple juice often ≥ cola — hard
  ];
  know.forEach(k=>trials.push({type:"know",...k}));

  // shuffle so types interleave
  for(let i=trials.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [trials[i],trials[j]]=[trials[j],trials[i]];
  }
  return trials;
}

/* ---------- STATE ---------- */
let TRIALS=[], idx=0, lastAnswerCorrect=null;
const responses=[]; // {correct:bool, confidence:1..4}

/* ---------- DOM ---------- */
const $=s=>document.querySelector(s);
const screens={
  intro:$("#screen-intro"), test:$("#screen-test"),
  compute:$("#screen-compute"), result:$("#screen-result")
};
function show(name){
  Object.values(screens).forEach(s=>s.classList.remove("is-visible"));
  screens[name].classList.add("is-visible");
  window.scrollTo({top:0,behavior:"smooth"});
}

/* ---------- i18n apply ---------- */
function t(key){return (I18N[LANG][key]!==undefined)?I18N[LANG][key]:key;}
function applyLang(){
  document.documentElement.lang=LANG;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const v=I18N[LANG][el.dataset.i18n];
    if(typeof v==="string") el.textContent=v;
  });
  document.querySelectorAll(".lang-btn").forEach(b=>
    b.classList.toggle("is-active",b.dataset.lang===LANG));
  // re-render current trial text if mid-test
  if(screens.test.classList.contains("is-visible")) renderTrial();
}

/* ============================================================
   TEST FLOW
   ============================================================ */
function startTest(){
  TRIALS=buildTrials();
  idx=0; responses.length=0;
  $("#trial-total").textContent=TRIALS.length;
  show("test");
  renderTrial();
}

function renderTrial(){
  const tr=TRIALS[idx];
  $("#trial-now").textContent=idx+1;
  $("#progress-fill").style.width=((idx)/TRIALS.length*100)+"%";

  $("#phase-confidence").hidden=true;
  $("#phase-question").hidden=false;

  const prompt=$("#trial-prompt");
  const stim=$("#stimulus");
  const ans=$("#answer-row");
  stim.innerHTML=""; ans.innerHTML="";

  if(tr.type==="dots"){
    prompt.textContent=t("p_dots");
    const wrap=document.createElement("div");
    wrap.style.cssText="display:flex;gap:clamp(14px,4vw,40px);align-items:center";
    const fieldL=makeDotField(tr.left);
    const fieldR=makeDotField(tr.right);
    wrap.append(fieldL,fieldR);
    stim.append(wrap);
    buildAnswers(ans,[["left",t("a_left")],["right",t("a_right")]],tr.correct);
    flashThenHide([fieldL,fieldR],stim,ans);
  }
  else if(tr.type==="lines"){
    prompt.textContent=t("p_lines");
    const field=document.createElement("div");
    field.className="line-field";
    field.append(makeLineRow("A",tr.A),makeLineRow("B",tr.B));
    stim.append(field);
    buildAnswers(ans,[["A",t("a_A")],["B",t("a_B")]],tr.correct);
  }
  else { // know
    prompt.textContent=tr.q[LANG];
    buildAnswers(
      ans,
      tr.opts.map((o,i)=>[String(i),o[LANG]]),
      String(tr.correct)
    );
  }
}

function makeDotField(n){
  const f=document.createElement("div");
  f.className="dot-field";
  const placed=[];
  for(let i=0;i<n;i++){
    const p=document.createElement("span");
    p.className="pip";
    let x,y,ok,tries=0;
    do{ x=6+Math.random()*150; y=6+Math.random()*150; ok=true;
        for(const q of placed){ if(Math.hypot(q.x-x,q.y-y)<9){ok=false;break;} }
        tries++; }while(!ok && tries<40);
    placed.push({x,y});
    p.style.left=x+"px"; p.style.top=y+"px";
    f.append(p);
  }
  return f;
}
function makeLineRow(key,len){
  const row=document.createElement("div"); row.className="line-row";
  const k=document.createElement("span"); k.className="line-key"; k.textContent=key;
  const bar=document.createElement("div"); bar.className="line-bar"; bar.style.width=len+"px";
  row.append(k,bar); return row;
}

function flashThenHide(fields,stim,ans){
  // disable answers during flash
  ans.querySelectorAll(".ans").forEach(b=>b.disabled=true);
  setTimeout(()=>{
    fields.forEach(f=>{
      f.querySelectorAll(".pip").forEach(p=>p.style.opacity="0");
    });
    ans.querySelectorAll(".ans").forEach(b=>b.disabled=false);
  },FLASH_MS);
}

function buildAnswers(container,pairs,correctVal){
  pairs.forEach(([val,label])=>{
    const b=document.createElement("button");
    b.className="ans"; b.textContent=label;
    b.addEventListener("click",()=>{
      lastAnswerCorrect=(val===correctVal);
      goConfidence();
    });
    container.append(b);
  });
}

function goConfidence(){
  $("#phase-question").hidden=true;
  $("#phase-confidence").hidden=false;
}

document.querySelectorAll(".dial-step").forEach(step=>{
  step.addEventListener("click",()=>{
    const conf=parseInt(step.dataset.conf,10);
    responses.push({correct:lastAnswerCorrect,confidence:conf});
    idx++;
    if(idx>=TRIALS.length){ finish(); }
    else { renderTrial(); }
  });
});

/* ============================================================
   SCORING — Goodman-Kruskal gamma
   ============================================================ */
function gammaCorrelation(rs){
  const right=rs.filter(r=>r.correct);
  const wrong=rs.filter(r=>!r.correct);
  let nc=0,nd=0;
  for(const c of right){
    for(const w of wrong){
      if(c.confidence>w.confidence) nc++;
      else if(c.confidence<w.confidence) nd++;
    }
  }
  if(nc+nd===0) return null;          // all correct, all wrong, or no variance
  return (nc-nd)/(nc+nd);
}

function finish(){
  $("#progress-fill").style.width="100%";
  show("compute");
  setTimeout(()=>{
    const gamma=gammaCorrelation(responses);
    const acc=responses.filter(r=>r.correct).length/responses.length;
    const meanConf=responses.reduce((s,r)=>s+r.confidence,0)/responses.length;

    let verdict; // 'yes' | 'no' | 'incon'
    if(gamma===null) verdict="incon";
    else verdict=(gamma>=GAMMA_THRESHOLD)?"yes":"no";

    if(verdict!=="incon") recordStat(verdict);
    renderResult(verdict,gamma,acc,meanConf);
  },1400);
}

/* ============================================================
   RESULT RENDER
   ============================================================ */
function renderResult(verdict,gamma,acc,meanConf){
  const el=screens.result;
  el.classList.remove("is-yes","is-no");
  const mark=$("#verdict-mark");

  if(verdict==="yes"){
    el.classList.add("is-yes");
    mark.textContent="✓";
    $("#verdict-label").textContent=t("yes_label");
    $("#verdict-title").textContent=t("yes_title");
    fillBody(t("yes_body"));
  } else if(verdict==="no"){
    el.classList.add("is-no");
    mark.textContent="—";
    $("#verdict-label").textContent=t("no_label");
    $("#verdict-title").textContent=t("no_title");
    fillBody(t("no_body"));
  } else {
    el.classList.add("is-no");
    mark.textContent="?";
    $("#verdict-label").textContent=t("incon_label");
    $("#verdict-title").textContent=t("incon_title");
    fillBody(t("incon_body"));
  }

  // metrics
  const gTxt=(gamma===null)?"—":(gamma>=0?"+":"")+gamma.toFixed(2);
  $("#metrics").innerHTML=`
    <div class="metric"><span class="metric-v">${gTxt}</span><span class="metric-k">${t("m_gamma")}</span></div>
    <div class="metric"><span class="metric-v">${Math.round(acc*100)}%</span><span class="metric-k">${t("m_acc")}</span></div>
    <div class="metric"><span class="metric-v">${meanConf.toFixed(1)}</span><span class="metric-k">${t("m_conf")}</span></div>`;

  // stats block only meaningful when recorded
  $("#stat-block").style.display=(verdict==="incon")?"none":"block";
  show("result");
  if(verdict!=="incon") refreshStats();
}

function fillBody(arr){
  $("#verdict-body").innerHTML=arr.map(p=>`<p>${p}</p>`).join("");
}

/* ============================================================
   STATS — live, no names. Local always; global if configured.
   ============================================================ */
function readLocal(){
  try{ return JSON.parse(localStorage.getItem(STATS_KEY))||{yes:0,no:0}; }
  catch{ return {yes:0,no:0}; }
}
function writeLocal(s){ try{ localStorage.setItem(STATS_KEY,JSON.stringify(s)); }catch{} }

function recordStat(verdict){
  const s=readLocal(); s[verdict]=(s[verdict]||0)+1; writeLocal(s);
  if(GLOBAL_COUNTER){
    fetch(`${GLOBAL_COUNTER}/hit/${verdict}`,{method:"POST",keepalive:true}).catch(()=>{});
  }
}

async function refreshStats(){
  let s=readLocal();
  let scopeKey="stat_local";
  if(GLOBAL_COUNTER){
    try{
      const r=await fetch(`${GLOBAL_COUNTER}/stats`,{cache:"no-store"});
      if(r.ok){ const g=await r.json(); if(typeof g.yes==="number"){ s=g; scopeKey="stat_global"; } }
    }catch{}
  }
  const total=(s.yes||0)+(s.no||0);
  const pctYes=total? Math.round(s.yes/total*100):0;
  const pctNo=100-pctYes;

  $("#seg-yes").style.width=pctYes+"%";
  $("#seg-no").style.width=pctNo+"%";
  $("#pct-yes").textContent=pctYes+"%";
  $("#pct-no").textContent=pctNo+"%";
  $("#stat-n").textContent="n = "+total;
  $("#stat-scope").textContent=t(scopeKey);
}

/* ============================================================
   WIRING
   ============================================================ */
document.querySelectorAll(".lang-btn").forEach(b=>
  b.addEventListener("click",()=>{ LANG=b.dataset.lang; applyLang();
    // keep result text in sync if on result screen
    if(screens.result.classList.contains("is-visible")){
      // re-render last result with stored values
      reRenderResult();
    }
  }));

let _last={verdict:null,gamma:null,acc:null,meanConf:null};
const _finishOrig=finish;
function reRenderResult(){
  if(_last.verdict){ renderResult(_last.verdict,_last.gamma,_last.acc,_last.meanConf); }
}
// wrap renderResult to cache last values
const _renderResult=renderResult;
renderResult=function(v,g,a,m){ _last={verdict:v,gamma:g,acc:a,meanConf:m}; _renderResult(v,g,a,m); };

$("#btn-start").addEventListener("click",startTest);
$("#btn-again").addEventListener("click",startTest);

applyLang();
