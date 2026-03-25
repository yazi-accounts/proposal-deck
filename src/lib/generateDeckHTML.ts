// Generates a standalone HTML deck matching deck.askyazi.com design system
// Based on the OM Bank template — full-viewport slides with transitions,
// flow diagrams, competitor cards, dashboard with SVG charts

interface UseCaseItem { icon: string; title: string; desc: string; tags: string[] }
interface FlowBranch { label: string; color: "olive" | "gold" | "coral" }
interface CompetitorCard { name: string; stat: string; desc: string; badge: string; doing?: string }
interface KpiCard { label: string; value: string; delta: string }
interface IssueRow { issue: string; mentions: number; severity: "High" | "Medium" | "Low" }
interface ChatMsg { from: "bot" | "user"; text: string }

interface DeckData {
  intro: { headline: string; subtitle: string };
  feedbackUseCases: UseCaseItem[];
  researchUseCases: UseCaseItem[];
  flowSteps: { emoji: string; label: string; desc: string }[];
  flowBranches: FlowBranch[];
  flowOutputs: { label: string; desc: string }[];
  chatMessages: ChatMsg[];
  competitors: CompetitorCard[];
  competitorCta: string;
  kpis: KpiCard[];
  npsData: number[];
  sentiment: { positive: number; neutral: number; negative: number };
  issues: IssueRow[];
  sampleQuestions: string[];
}

interface FormData {
  companyName: string;
  brandName: string;
  brandColor: string;
  context: string;
}

const COMP_COLORS = ["hsl(211, 60%, 50%)", "hsl(280, 50%, 55%)", "hsl(350, 60%, 50%)"];
const COMP_CLASSES = ["capitec", "tyme", "discovery"];

export function generateDeckHTML(deck: DeckData, form: FormData, logoDataUrl: string | null): string {
  const brand = form.brandName || form.companyName;
  const bc = form.brandColor || "#1A6B3C";

  // Logo HTML
  const logoHtml = logoDataUrl
    ? `<img src="${logoDataUrl}" alt="${brand}" style="max-height:50px;max-width:140px;object-fit:contain;border-radius:8px;">`
    : `<svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="28" fill="${bc}"/><text x="28" y="34" text-anchor="middle" fill="#fff" font-family="'DM Sans',sans-serif" font-size="22" font-weight="700">${brand.charAt(0)}</text></svg>`;

  // Use case cards
  const ucColors = [
    { bg: "hsl(152,40%,92%)", fg: "hsl(152,40%,30%)" },
    { bg: "hsl(211,60%,92%)", fg: "hsl(211,75%,35%)" },
    { bg: "hsl(30,80%,92%)", fg: "hsl(20,80%,40%)" },
    { bg: "hsl(0,60%,93%)", fg: "hsl(0,60%,40%)" },
  ];
  const resColors = [
    { bg: "hsl(280,40%,92%)", fg: "hsl(280,40%,38%)" },
    { bg: "hsl(93,30%,90%)", fg: "hsl(93,22%,38%)" },
    { bg: "hsl(180,40%,92%)", fg: "hsl(180,40%,30%)" },
    { bg: "hsl(350,50%,93%)", fg: "hsl(350,50%,38%)" },
  ];

  const feedbackCards = deck.feedbackUseCases.map((uc, i) => {
    const c = ucColors[i % ucColors.length];
    return `<div class="card"><div class="card-icon" style="background:${c.bg};">${uc.icon}</div><div class="card-title">${uc.title}</div><div class="card-desc">${uc.desc}</div><span class="tag" style="background:${c.bg};color:${c.fg};">${uc.tags.join(" · ")}</span></div>`;
  }).join("\n    ");

  const researchCards = deck.researchUseCases.map((uc, i) => {
    const c = resColors[i % resColors.length];
    return `<div class="card"><div class="card-icon" style="background:${c.bg};">${uc.icon}</div><div class="card-title">${uc.title}</div><div class="card-desc">${uc.desc}</div><span class="tag" style="background:${c.bg};color:${c.fg};">${uc.tags.join(" · ")}</span></div>`;
  }).join("\n    ");

  // Competitor cards
  const compCards = deck.competitors.map((c, i) => {
    const color = COMP_COLORS[i % COMP_COLORS.length];
    const cls = COMP_CLASSES[i % COMP_CLASSES.length];
    return `<div class="comp-card ${cls}">
      <div class="comp-name">${c.name}</div>
      <div class="comp-stat" style="color:${color};">${c.stat}</div>
      <div class="comp-desc">${c.desc}</div>
      <hr class="comp-divider">
      <div class="comp-doing-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg> What they're doing:</div>
      <div class="comp-doing">${c.doing || c.badge}</div>
    </div>`;
  }).join("\n    ");

  // NPS chart SVG
  const npsMin = Math.min(...deck.npsData);
  const npsMax = Math.max(...deck.npsData);
  const npsRange = npsMax - npsMin || 1;
  const chartW = 360, chartH = 130, padL = 30, padR = 10, padT = 10, padB = 20;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const npsPoints = deck.npsData.map((v, i) => {
    const x = padL + 40 + i * (plotW - 40) / (deck.npsData.length - 1);
    const y = padT + plotH - ((v - npsMin) / npsRange) * plotH;
    return { x, y };
  });
  const polyline = npsPoints.map(p => `${p.x},${p.y}`).join(" ");
  const areaPath = `M${npsPoints[0].x} ${npsPoints[0].y} ${npsPoints.map(p => `L${p.x} ${p.y}`).join(" ")} L${npsPoints[npsPoints.length-1].x} ${padT+plotH} L${npsPoints[0].x} ${padT+plotH} Z`;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(pct => {
    const y = padT + plotH * (1 - pct);
    const val = Math.round(npsMin + npsRange * pct);
    return `<line x1="${padL}" y1="${y}" x2="${chartW-padR}" y2="${y}" stroke="var(--border)" stroke-width="0.5"/><text x="${padL-6}" y="${y+3}" text-anchor="end" fill="var(--muted-fg)" font-size="8" font-family="DM Sans">${val}</text>`;
  }).join("");
  const xLabels = deck.npsData.map((_, i) => {
    const x = npsPoints[i].x;
    return `<text x="${x}" y="${padT+plotH+14}" text-anchor="middle" fill="var(--muted-fg)" font-size="8" font-family="DM Sans">W${i+1}</text>`;
  }).join("");
  const dots = npsPoints.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="var(--bg)" stroke="${bc}" stroke-width="2"/>`).join("");

  // Issues
  const issueRows = deck.issues.map(i => {
    const color = i.severity === "High" ? "hsl(0,65%,55%)" : "hsl(40,80%,55%)";
    return `<div class="issue-row"><div class="issue-dot" style="background:${color};"></div><span class="issue-name">${i.issue}</span><span class="issue-count">${i.mentions} mentions</span><span class="issue-sev" style="color:${color};">${i.severity}</span></div>`;
  }).join("\n          ");

  // KPIs
  const kpiIcons = [
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-fg)" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-fg)" stroke-width="2"><path d="M14 9V5a3 3 0 00-6 0v4"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>',
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-fg)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-fg)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  ];
  const kpiCards = deck.kpis.map((k, i) => `<div class="kpi-card"><div class="kpi-label">${kpiIcons[i % kpiIcons.length]} ${k.label}</div><div class="kpi-value">${k.value}</div><div class="kpi-delta">${k.delta}</div></div>`).join("\n      ");

  // Question pills
  const qPills = deck.sampleQuestions.map(q => `<span class="q-pill">"${q}"</span>`).join("\n    ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Yazi × ${brand}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
:root{--bg:hsl(37,100%,97%);--fg:hsl(211,75%,15%);--primary:hsl(35,88%,59%);--olive:hsl(86,18%,43%);--muted:hsl(36,30%,90%);--muted-fg:hsl(211,30%,40%);--border:hsl(36,30%,85%);--accent:hsl(14,83%,54%);--card:#fff;--radius:16px;--brand:${bc};--whatsapp:#075E54;--whatsapp-light:#25D366}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{overflow:hidden;height:100%;background:var(--bg);color:var(--fg);font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:'Instrument Serif',Georgia,serif;font-weight:400}
.deck{position:relative;width:100vw;height:100vh;overflow:hidden}
.slide{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transform:translateY(30px);transition:opacity .45s cubic-bezier(.25,.46,.45,.94),transform .45s cubic-bezier(.25,.46,.45,.94);pointer-events:none;padding:2rem}
.slide.active{opacity:1;transform:translateY(0);pointer-events:auto;z-index:10}
.slide.exit-up{opacity:0;transform:translateY(-30px)}
.slide.active .stagger{animation:fadeUp .5s cubic-bezier(.25,.46,.45,.94) both}
.slide.active .stagger:nth-child(1){animation-delay:.08s}.slide.active .stagger:nth-child(2){animation-delay:.16s}.slide.active .stagger:nth-child(3){animation-delay:.24s}.slide.active .stagger:nth-child(4){animation-delay:.32s}.slide.active .stagger:nth-child(5){animation-delay:.4s}.slide.active .stagger:nth-child(6){animation-delay:.48s}.slide.active .stagger:nth-child(7){animation-delay:.56s}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.label{text-transform:uppercase;letter-spacing:.2em;font-size:clamp(.7rem,1vw,.85rem);font-weight:600;color:var(--muted-fg);font-family:'DM Sans',sans-serif}
.headline{font-size:clamp(2.5rem,5.5vw,5rem);line-height:1.08;letter-spacing:-.02em;color:var(--fg)}
.subheadline{font-size:clamp(1.8rem,3.8vw,3rem);line-height:1.15;letter-spacing:-.01em;color:var(--fg)}
.body-text{font-size:clamp(1rem,1.5vw,1.25rem);line-height:1.6;color:var(--muted-fg);max-width:560px}
.card{background:rgba(255,255,255,.8);backdrop-filter:blur(8px);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem 1.35rem;transition:transform .3s,box-shadow .3s,border-color .3s}
.card:hover{transform:translateY(-3px);box-shadow:0 12px 32px -8px rgba(0,0,0,.1);border-color:hsl(36,30%,75%)}
.card-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;margin-bottom:.75rem}
.card-title{font-family:'DM Sans',sans-serif;font-weight:600;font-size:.9rem;color:var(--fg);margin-bottom:.3rem;line-height:1.3}
.card-desc{font-size:.75rem;line-height:1.55;color:var(--muted-fg);margin-bottom:.6rem}
.tag{display:inline-block;padding:.2rem .6rem;border-radius:100px;font-size:.65rem;font-weight:600}
.nav-pill{position:fixed;top:20px;right:20px;z-index:100;display:flex;align-items:center;gap:8px;background:hsla(37,100%,97%,.85);backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:100px;padding:6px 16px;box-shadow:0 4px 20px -4px rgba(0,0,0,.1);font-family:'DM Sans',sans-serif}
.nav-pill .bar{width:3px;height:18px;border-radius:3px;background:var(--olive)}
.nav-pill .counter{font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted-fg)}
.nav-pill .slide-name{font-size:.85rem;font-weight:500;color:var(--fg)}
.progress{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:100;display:flex;align-items:center;gap:10px;background:hsla(37,100%,97%,.85);backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:100px;padding:8px 14px;box-shadow:0 4px 20px -4px rgba(0,0,0,.08)}
.progress button{background:none;border:none;cursor:pointer;padding:4px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--fg);transition:background .2s}
.progress button:hover{background:var(--muted)}.progress button:disabled{opacity:.2;pointer-events:none}
.dot{width:6px;height:6px;border-radius:100px;background:hsla(211,75%,15%,.15);transition:all .3s;cursor:pointer;border:none;padding:0}
.dot.active{width:20px;background:var(--fg)}
.demo-btn{position:fixed;top:20px;left:20px;z-index:100;display:flex;align-items:center;gap:6px;background:hsla(37,100%,97%,.85);backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:100px;padding:8px 16px;box-shadow:0 4px 20px -4px rgba(0,0,0,.1);font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;color:var(--fg);cursor:pointer;transition:background .2s;text-decoration:none}
.demo-btn:hover{background:var(--muted)}.demo-btn svg{color:var(--primary)}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;width:100%;max-width:1050px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;width:100%;max-width:950px}
.section-dot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:8px;vertical-align:middle}
.comp-card{background:rgba(255,255,255,.85);backdrop-filter:blur(8px);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;position:relative;overflow:hidden;transition:transform .3s,box-shadow .3s}
.comp-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px -8px rgba(0,0,0,.1)}
.comp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
.comp-card.capitec::before{background:hsl(211,60%,50%)}.comp-card.tyme::before{background:hsl(280,50%,55%)}.comp-card.discovery::before{background:hsl(350,60%,50%)}
.comp-name{font-family:'Instrument Serif',serif;font-size:1.3rem;color:var(--fg);margin-bottom:.15rem}
.comp-stat{font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;margin-bottom:.75rem}
.comp-desc{font-size:.78rem;color:var(--muted-fg);line-height:1.6;margin-bottom:.75rem}
.comp-divider{border:none;border-top:1px solid var(--border);margin:.75rem 0}
.comp-doing-label{font-size:.75rem;font-weight:600;color:var(--fg);margin-bottom:.3rem;display:flex;align-items:center;gap:5px}
.comp-doing{font-size:.75rem;color:var(--muted-fg);line-height:1.55}
.warning-banner{display:flex;align-items:center;gap:12px;background:hsl(40,90%,95%);border:1px solid hsl(40,70%,82%);border-radius:12px;padding:.85rem 1.25rem;max-width:720px;width:100%}
.warning-banner svg{flex-shrink:0}.warning-banner p{font-size:.82rem;color:var(--fg);line-height:1.5}
.cta-bar{display:flex;align-items:center;gap:12px;background:var(--fg);border-radius:14px;padding:1rem 1.5rem;max-width:680px;width:100%}
.cta-bar svg{flex-shrink:0;color:var(--primary)}.cta-bar p{font-size:.85rem;color:var(--bg);font-weight:500;line-height:1.5}
.dash-container{width:100%;max-width:1000px;background:var(--card);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 16px 48px -12px rgba(0,0,0,.08)}
.dash-header{display:flex;align-items:center;justify-content:space-between;padding:.65rem 1.25rem;background:var(--brand)}
.dash-header-left{display:flex;align-items:center;gap:8px}.dash-header-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3)}
.dash-header span{color:#fff;font-size:.82rem;font-weight:600}
.dash-live{display:flex;align-items:center;gap:5px}.dash-live-dot{width:6px;height:6px;border-radius:50%;background:#66BB6A;animation:pulse 2s infinite}.dash-live span{color:#A5D6A7;font-size:.75rem;font-weight:500}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;padding:.85rem 1rem}
.kpi-card{background:var(--bg);border-radius:12px;padding:.75rem .85rem}
.kpi-label{font-size:.65rem;color:var(--muted-fg);font-weight:500;display:flex;align-items:center;gap:4px;margin-bottom:.25rem}
.kpi-value{font-family:'DM Sans',sans-serif;font-size:1.5rem;font-weight:700;color:var(--fg);line-height:1.1}
.kpi-delta{font-size:.68rem;font-weight:600;color:var(--brand);margin-top:.2rem}
.dash-body{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;padding:0 1rem 1rem}
.dash-panel{background:var(--bg);border-radius:12px;padding:.85rem}
.dash-panel-title{font-size:.78rem;font-weight:600;color:var(--fg);margin-bottom:.6rem;display:flex;align-items:center;gap:6px}
.sentiment-row{display:flex;align-items:center;gap:8px;margin-bottom:.45rem}
.sentiment-label{font-size:.7rem;color:var(--muted-fg);width:50px;flex-shrink:0}
.sentiment-track{flex:1;height:9px;background:hsl(36,20%,92%);border-radius:100px;overflow:hidden}
.sentiment-fill{height:100%;border-radius:100px;transition:width .8s ease}
.sentiment-pct{font-size:.72rem;font-weight:700;color:var(--fg);width:32px;text-align:right;flex-shrink:0}
.issue-row{display:flex;align-items:center;gap:8px;margin-bottom:.35rem}
.issue-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.issue-name{font-size:.72rem;font-weight:500;color:var(--fg);flex:1}
.issue-count{font-size:.68rem;color:var(--muted-fg)}.issue-sev{font-size:.68rem;font-weight:700;width:50px;text-align:right}
.chart-area{position:relative;height:130px;margin-top:.3rem}.chart-area svg{width:100%;height:100%}
.q-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;margin-top:.75rem;max-width:1000px}
.q-pill{padding:.3rem .8rem;border-radius:100px;font-size:.68rem;background:hsla(36,30%,90%,.5);color:var(--muted-fg);border:1px solid hsla(36,30%,85%,.4)}
.scroll-hint{position:absolute;bottom:3rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px}
.scroll-hint p{font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;font-weight:500;color:var(--muted-fg);animation:hintPulse 2.5s infinite ease-in-out}
.scroll-mouse{width:20px;height:32px;border-radius:100px;border:2px solid var(--muted-fg);position:relative;opacity:.4;animation:hintBounce 1.8s infinite ease-in-out}
.scroll-mouse::after{content:'';position:absolute;top:6px;left:50%;transform:translateX(-50%);width:3px;height:6px;border-radius:3px;background:var(--muted-fg);animation:scrollDot 1.8s infinite ease-in-out}
@keyframes hintPulse{0%,100%{opacity:.4}50%{opacity:.9}}
@keyframes hintBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
@keyframes scrollDot{0%,100%{transform:translateX(-50%) translateY(0);opacity:1}50%{transform:translateX(-50%) translateY(6px);opacity:.3}}
@media(max-width:900px){.grid-4{grid-template-columns:repeat(2,1fr)}.grid-3{grid-template-columns:1fr;max-width:400px}.kpi-row{grid-template-columns:repeat(2,1fr)}.dash-body{grid-template-columns:1fr}.nav-pill .slide-name{display:none}}
@media print{.nav-pill,.progress,.demo-btn,.scroll-hint{display:none!important}.deck{overflow:visible;height:auto}.slide{position:relative;opacity:1;transform:none;pointer-events:auto;page-break-after:always;min-height:100vh}.slide .stagger{animation:none!important;opacity:1;transform:none}@page{size:landscape;margin:0}}
</style>
</head>
<body>

<a class="demo-btn" href="mailto:hello@askyazi.com?subject=${encodeURIComponent(brand)}%20x%20Yazi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 4.5H18l-3.5 2.5L16 14.5 12 11.5 8 14.5l1.5-4.5L6 7.5h4.5z"/></svg>Let's Talk</a>

<div class="nav-pill"><div class="bar"></div><div><div class="counter" id="slideCounter">1 / 5</div><div class="slide-name" id="slideName">Introduction</div></div></div>

<div class="progress">
  <button onclick="go(current-1)" id="prevBtn" disabled><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
  <div id="dots" style="display:flex;align-items:center;gap:6px;"></div>
  <button onclick="go(current+1)" id="nextBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
</div>

<div class="deck">

<!-- SLIDE 1: INTRO -->
<div class="slide active" id="s0">
  <div class="stagger" style="display:flex;align-items:center;gap:20px;margin-bottom:2rem;">
    <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="28" fill="#1a2e3a"/><text x="28" y="33" text-anchor="middle" fill="#FBF7F2" font-family="'Instrument Serif',serif" font-size="22">y</text></svg>
    <span style="font-size:2rem;color:var(--muted-fg);opacity:.3;font-weight:300;">×</span>
    ${logoHtml}
  </div>
  <h1 class="headline stagger" style="text-align:center;">${deck.intro.headline.replace(brand, `<em>${brand}</em>`)}</h1>
  <p class="body-text stagger" style="text-align:center;margin-top:1rem;">${deck.intro.subtitle}</p>
  <div class="scroll-hint stagger"><p>Swipe to explore</p><div class="scroll-mouse"></div></div>
</div>

<!-- SLIDE 2: USE CASES -->
<div class="slide" id="s1">
  <p class="label stagger">Tailored for ${brand}</p>
  <h2 class="subheadline stagger" style="text-align:center;margin:.25rem 0 .5rem;">Where Yazi Delivers <em>Value</em></h2>
  <div class="stagger" style="display:flex;align-items:center;gap:6px;margin-bottom:.5rem;">
    <span class="section-dot" style="background:var(--olive);"></span>
    <span style="font-size:.82rem;font-weight:600;">Customer Feedback — CX & Brand Perception</span>
  </div>
  <div class="grid-4 stagger">
    ${feedbackCards}
  </div>
  <div class="stagger" style="display:flex;align-items:center;gap:6px;margin:.75rem 0 .5rem;">
    <span class="section-dot" style="background:hsl(211,75%,40%);"></span>
    <span style="font-size:.82rem;font-weight:600;">Market Research — Trackers & Ad-Hoc Studies</span>
  </div>
  <div class="grid-4 stagger">
    ${researchCards}
  </div>
</div>

<!-- SLIDE 3: FLOW DIAGRAM -->
<div class="slide" id="s2" style="padding-top:2.5rem;padding-bottom:2rem;">
  <p class="label stagger" style="margin-bottom:.15rem;">How It Works for ${brand}</p>
  <h2 class="stagger" style="font-family:'Instrument Serif',serif;font-size:clamp(1.1rem,2.2vw,1.6rem);text-align:center;color:var(--muted-fg);margin-bottom:1rem;">${brand} · <em>Automated CX intelligence loop</em></h2>
  <div class="stagger" style="display:flex;flex-direction:column;align-items:center;gap:0;max-width:700px;width:100%;">
    <div style="background:hsl(0,60%,98%);border:1.5px solid hsl(0,50%,82%);border-radius:14px;padding:1rem 1.5rem;display:flex;align-items:center;gap:1rem;width:100%;max-width:620px;">
      <div style="width:44px;height:44px;border-radius:12px;background:hsl(0,45%,92%);display:flex;align-items:center;justify-content:center;">⚡</div>
      <div><h4 style="font-family:'DM Sans',sans-serif;font-weight:600;font-size:.95rem;">${deck.flowSteps[0]?.label || 'Trigger Event'}</h4><p style="font-size:.78rem;color:var(--muted-fg);margin-top:2px;">${deck.flowSteps[0]?.desc || ''}</p></div>
    </div>
    <div style="width:2px;height:28px;background:var(--border);position:relative;"><div style="position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid var(--border);"></div></div>
    <div style="background:hsl(86,40%,97%);border:1.5px solid hsl(86,30%,75%);border-radius:14px;padding:1rem 1.5rem;display:flex;align-items:center;gap:1rem;width:100%;max-width:620px;">
      <div style="width:44px;height:44px;border-radius:12px;background:hsl(86,35%,90%);display:flex;align-items:center;justify-content:center;">💬</div>
      <div><h4 style="font-family:'DM Sans',sans-serif;font-weight:600;font-size:.95rem;">WhatsApp conversation sent</h4><p style="font-size:.78rem;color:var(--muted-fg);margin-top:2px;">Yazi AI engages customer in natural, adaptive dialogue</p></div>
    </div>
    <div style="width:2px;height:28px;background:var(--border);position:relative;"><div style="position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid var(--border);"></div></div>
    <div style="display:flex;gap:1rem;width:100%;max-width:620px;justify-content:center;">
      ${deck.flowBranches.map(b => `<div style="flex:1;background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:1rem;text-align:center;"><h4 style="font-family:'DM Sans',sans-serif;font-weight:600;font-size:.85rem;">${b.label}</h4></div>`).join("\n      ")}
    </div>
    <div style="width:2px;height:28px;background:var(--border);position:relative;"><div style="position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid var(--border);"></div></div>
    <div style="display:flex;gap:1rem;width:100%;max-width:620px;">
      ${deck.flowOutputs.map((o, i) => `<div style="flex:1;background:${i===0?'hsl(211,50%,97%)':'hsl(37,60%,96%)'};border:1.5px solid ${i===0?'hsl(211,40%,80%)':'hsl(30,60%,80%)'};border-radius:14px;padding:1rem 1.5rem;display:flex;align-items:center;gap:1rem;"><div style="width:44px;height:44px;border-radius:12px;background:${i===0?'hsl(211,40%,92%)':'hsl(30,50%,92%)'};display:flex;align-items:center;justify-content:center;">${i===0?'📊':'🔔'}</div><div><h4 style="font-family:'DM Sans',sans-serif;font-weight:600;font-size:.95rem;">${o.label}</h4><p style="font-size:.78rem;color:var(--muted-fg);margin-top:2px;">${o.desc}</p></div></div>`).join("\n      ")}
    </div>
  </div>
</div>

<!-- SLIDE 4: COMPETITORS -->
<div class="slide" id="s3">
  <p class="label stagger">Competitive Intelligence</p>
  <h2 class="subheadline stagger" style="text-align:center;margin:.25rem 0 1rem;">Your Competitors Are <em>Already Listening</em></h2>
  <div class="warning-banner stagger">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="hsl(30,80%,50%)" stroke="none"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
    <p>Without a real-time feedback loop, ${brand} is flying blind on what keeps customers or drives them to competitors.</p>
  </div>
  <div class="grid-3 stagger" style="margin:1.25rem 0;">
    ${compCards}
  </div>
  <div class="cta-bar stagger">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
    <p>${deck.competitorCta}</p>
  </div>
</div>

<!-- SLIDE 5: DASHBOARD -->
<div class="slide" id="s4" style="padding-top:1.5rem;">
  <p class="label stagger">Live Reporting</p>
  <h2 class="subheadline stagger" style="text-align:center;margin:.25rem 0 .75rem;">Your ${brand} <em>Insights Dashboard</em></h2>
  <div class="dash-container stagger">
    <div class="dash-header">
      <div class="dash-header-left"><div class="dash-header-dot"></div><span>${brand} — Customer Intelligence Dashboard</span></div>
      <div class="dash-live"><div class="dash-live-dot"></div><span>Live</span></div>
    </div>
    <div class="kpi-row">
      ${kpiCards}
    </div>
    <div class="dash-body">
      <div class="dash-panel">
        <div class="dash-panel-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>NPS Trend</div>
        <div class="chart-area">
          <svg viewBox="0 0 ${chartW} ${chartH}" preserveAspectRatio="none">
            <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${bc}" stop-opacity="0.12"/><stop offset="100%" stop-color="${bc}" stop-opacity="0.01"/></linearGradient></defs>
            ${gridLines}
            ${xLabels}
            <path d="${areaPath}" fill="url(#g1)"/>
            <polyline points="${polyline}" fill="none" stroke="${bc}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            ${dots}
          </svg>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.75rem;">
        <div class="dash-panel">
          <div class="dash-panel-title">Sentiment Breakdown — This Week</div>
          <div class="sentiment-row"><span class="sentiment-label">Positive</span><div class="sentiment-track"><div class="sentiment-fill" style="width:${deck.sentiment.positive}%;background:${bc};"></div></div><span class="sentiment-pct">${deck.sentiment.positive}%</span></div>
          <div class="sentiment-row"><span class="sentiment-label">Neutral</span><div class="sentiment-track"><div class="sentiment-fill" style="width:${deck.sentiment.neutral}%;background:hsl(40,80%,55%);"></div></div><span class="sentiment-pct">${deck.sentiment.neutral}%</span></div>
          <div class="sentiment-row"><span class="sentiment-label">Negative</span><div class="sentiment-track"><div class="sentiment-fill" style="width:${deck.sentiment.negative}%;background:hsl(0,65%,55%);"></div></div><span class="sentiment-pct">${deck.sentiment.negative}%</span></div>
        </div>
        <div class="dash-panel">
          <div class="dash-panel-title">Top Issues — AI-Categorised</div>
          ${issueRows}
        </div>
      </div>
    </div>
  </div>
  <div class="q-pills stagger">
    ${qPills}
  </div>
</div>

</div>

<script>
const slideNames=['Introduction','Use Cases','How It Works','Competitive Edge','Dashboard'];
const total=5;let current=0;let animating=false;
const dotsEl=document.getElementById('dots');
for(let i=0;i<total;i++){const d=document.createElement('button');d.className='dot'+(i===0?' active':'');d.onclick=()=>go(i);dotsEl.appendChild(d);}
function go(idx){if(animating||idx===current||idx<0||idx>=total)return;animating=true;const prev=document.getElementById('s'+current);const next=document.getElementById('s'+idx);const dir=idx>current?1:-1;prev.classList.remove('active');prev.classList.add(dir>0?'exit-up':'');prev.style.transform=dir>0?'translateY(-30px)':'translateY(30px)';next.style.transform=dir>0?'translateY(30px)':'translateY(-30px)';next.style.opacity='0';requestAnimationFrame(()=>{requestAnimationFrame(()=>{next.classList.add('active');next.style.transform='';next.style.opacity='';});});setTimeout(()=>{prev.classList.remove('exit-up');prev.style.transform='';prev.style.opacity='';animating=false;},480);current=idx;updateUI();}
function updateUI(){document.getElementById('slideCounter').textContent=(current+1)+' / '+total;document.getElementById('slideName').textContent=slideNames[current];document.getElementById('prevBtn').disabled=current===0;document.getElementById('nextBtn').disabled=current===total-1;dotsEl.querySelectorAll('.dot').forEach((d,i)=>{d.className='dot'+(i===current?' active':'');});}
document.addEventListener('keydown',(e)=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();go(current+1);}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();go(current-1);}});
let tx=0,ty=0;document.addEventListener('touchstart',(e)=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});document.addEventListener('touchend',(e)=>{const dx=e.changedTouches[0].clientX-tx;const dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>50){dx<0?go(current+1):go(current-1);}},{passive:true});
let wheelTimeout;document.addEventListener('wheel',(e)=>{e.preventDefault();if(wheelTimeout)return;wheelTimeout=setTimeout(()=>{wheelTimeout=null;},600);e.deltaY>0?go(current+1):go(current-1);},{passive:false});
</script>
</body>
</html>`;
}
