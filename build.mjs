import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const data = JSON.parse(await readFile(new URL('dist/projects.json', root), 'utf8'));
const esc = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = (pair, tag = 'span', attrs = '') => `<${tag} ${attrs} data-en="${esc(pair.en)}" data-zh="${esc(pair.zh)}">${esc(pair.en)}</${tag}>`;
const bi = (en, zh, tag = 'span', attrs = '') => text({en, zh}, tag, attrs);
const publicUrl = value => { const url = new URL(value); if (['microusada.com','raidline.microusada.com'].includes(url.hostname) && url.searchParams.has('lang')) url.searchParams.set('lang','en'); return url.href; };
const svg = (body) => `<svg viewBox="0 0 480 300" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const line = (x1,y1,x2,y2,extra='') => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#36564a" stroke-width="2" ${extra}/>`;
const circle = (x,y,r=7,fill='#f4f0e8') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#36564a" stroke-width="2"/>`;
const mono = (x,y,value,extra='') => `<text x="${x}" y="${y}" fill="#36564a" font-family="Consolas,monospace" font-size="12" ${extra}>${value}</text>`;
const plots = {
  contextweave: svg(`<path d="M80 218V80M80 218H405" fill="none" stroke="#839184"/>${Array.from({length:8},(_,i)=>`<path d="M${100+i*36} 208 C${80+i*36} 163 ${138+i*28} ${110+(i%3)*23} ${138+i*30} 71" fill="none" stroke="${i%2?'#36564a':'#b76b39'}" stroke-width="${i%2?2:1.5}" opacity=".65"/>`).join('')}${[0,1,2,3,4,5,6,7].map(i=>circle(115+i*34,200-i*15,4,i%2?'#36564a':'#f4f0e8')).join('')}${mono(84,250,'CONTROL → PERTURBATION')}${mono(347,46,'01 / CELLS')}`),
  'enveda-casmi26': svg(`${line(55,212,426,212)}${[22,48,31,119,54,78,28,149,65,38,92,43,25,59].map((v,i)=>`<path d="M${74+i*25} 212V${212-v}" stroke="${i===7?'#b76b39':'#36564a'}" stroke-width="${i===7?4:2}"/>`).join('')}<path d="M205 53l25-14 25 14v28l-25 14-25-14zM255 53l25-14 25 14v28l-25 14-25-14" fill="none" stroke="#839184" stroke-width="2"/>${mono(58,247,'MASS → CANDIDATES')}${mono(356,46,'02 / MS²')}`),
  'smart-buildings': svg(`${[0,1,2].map(i=>`<rect x="${66+i*120}" y="74" width="105" height="116" fill="${i===1?'#e3d1bc':'#d8dfd6'}" stroke="#839184"/>${mono(82+i*120,102,'ZONE '+(i+1))}${circle(119+i*120,151,10,i===1?'#b76b39':'#36564a')}`).join('')}<path d="M56 227H420M119 190V227M239 190V227M359 190V227" fill="none" stroke="#b76b39" stroke-width="3"/>${mono(68,261,'SHARED LOOP / LOCAL DEMAND')}${mono(341,46,'03 / ZONES')}`),
  raidline: svg(`<path d="M51 217H136L229 124H315L411 68M51 230H142L235 137H320L418 80" fill="none" stroke="#36564a" stroke-width="3"/>${[[83,223],[186,174],[274,130],[366,101]].map(([x,y],i)=>`${circle(x,y,9,i===2?'#b76b39':'#f4f0e8')}${mono(x-8,y-25,'0'+(i+1))}`).join('')}<path d="M168 89h55v39h-27l-13 12v-12h-15z" fill="#f4f0e8" stroke="#839184"/>${mono(59,267,'CHAT → JOURNEY → MEMORY')}${mono(321,46,'04 / TOGETHER')}`),
  versionpass: svg(`${[0,1,2].map(i=>`<rect x="${57+i*141}" y="81" width="104" height="133" fill="#f4f0e8" stroke="#839184"/><path d="M${75+i*141} 110H${137+i*141}M${75+i*141} 124H${126+i*141}M${75+i*141} 138H${137+i*141}" stroke="#839184"/>${mono(76+i*141,190,['BYTES','SEND','ACCEPT'][i])}`).join('')}${line(161,147,198,147)}${line(302,147,339,147)}<path d="M360 160l9 9 19-24" fill="none" stroke="#36564a" stroke-width="3"/>${mono(60,258,'ONE FILE / ONE FINGERPRINT')}${mono(316,46,'05 / RECEIPTS')}`),
  'abby-vue': svg(`<path d="M65 105l65 109 65-109h-33l-32 54-32-54z" fill="#36564a" opacity=".85"/><path d="M238 143H324" stroke="#839184" stroke-width="2" stroke-dasharray="5 7"/>${circle(224,143,9,'#b76b39')}<rect x="328" y="86" width="91" height="117" fill="#f4f0e8" stroke="#839184"/>${mono(348,119,'flags')}${mono(348,145,'config')}${mono(348,171,'tests')}${mono(60,257,'TYPED / ISOLATED / SSR-SAFE')}${mono(332,46,'06 / BRIDGE')}`)
};
const cards = data.projects.map(p => `<article class="project" data-category="${esc(p.category)}" id="${esc(p.id)}">
  <div class="project-topline"><span class="project-number">${esc(p.number)} / 06</span>${text(p.discipline,'span','class="project-discipline"')}</div>
  <div class="project-visual" data-visual="${esc(p.id)}">${plots[p.id]}</div>
  ${text(p.name,'h3')}
  ${text(p.summary,'p','class="project-summary"')}
  <a class="project-open" href="#case-${esc(p.id)}" data-open="${esc(p.id)}">${bi('Read field note','閱讀作品筆記')} <span aria-hidden="true">↗</span></a>
  <div class="project-meta"><span class="status-dot" aria-hidden="true"></span>${text(p.status,'span','class="project-status"')}<span class="project-metric"><strong>${esc(p.metric.value)}</strong> · ${text(p.metric.label)}</span></div>
</article>`).join('\n');
const cases = data.projects.map(p=>`<article class="fallback-case" id="case-${esc(p.id)}"><h3>${text(p.name)}</h3>${[['Question','問題','question'],['Approach','做法','approach'],['Observed result','已觀察成果','outcome'],['Limits','限制','limitation']].map(([en,zh,key])=>`<section class="case-section">${bi(en,zh,'h4')}${text(p[key],'p')}</section>`).join('')}<p><a href="${esc(publicUrl(p.url))}" data-project-url="${esc(p.id)}" target="_blank" rel="noopener noreferrer">${bi('View public evidence','查看公開成果')} ↗</a>${p.sourceUrl?` · <a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">${bi('Public source','公開原始碼')} ↗</a>`:''}</p></article>`).join('\n');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="SIGNAL ATLAS — six AI-assisted projects by CC HSIEH, from question to observed result, with their limits in view.">
<meta name="color-scheme" content="light"><meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'">
<title>SIGNAL ATLAS — CC HSIEH</title>
<link rel="icon" href="./mark.svg" type="image/svg+xml"><link rel="stylesheet" href="./styles.css"><script src="./app.js" defer></script>
</head>
<body>
${bi('Skip to content','跳至主要內容','a','class="skip-link" href="#main"')}
<header class="site-header">
 <a class="wordmark" href="#main"><span class="wordmark-mark" aria-hidden="true"><svg viewBox="0 0 28 28"><path d="M4 21V7h7v7h6V7h7v14h-7v-7h-6v7z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></span>${bi('SIGNAL ATLAS','訊號圖譜','span','class="wordmark-label"')}</a>
 <div class="header-right"><a href="#work">${bi('Selected work','精選作品')}</a><a href="#method">${bi('Method','方法')}</a><button class="language-switch" data-lang="en" aria-pressed="true" lang="en">EN</button><button class="language-switch" data-lang="zh" aria-pressed="false" lang="zh-Hant">中文</button></div>
</header>
<main id="main">
 <section class="hero wrap" aria-labelledby="hero-title">
  <div class="hero-copy">${bi('CC HSIEH / An evidence-led portfolio','CC HSIEH / 從證據出發的作品集','p','class="eyebrow"')}
   ${bi('From a question to a testable result.','從問題出發，讓成果可驗證。','h1','class="display-title" id="hero-title"')}
   ${bi('I build AI-assisted experiments across science, software and shared experiences. Each project here shows what was made, what was observed, and what remains uncertain.','我以 AI 協助探索科學、軟體與共同參與的體驗。每件作品都記下做了什麼、觀察到什麼，以及還有哪些未知。','p','class="lede"')}
   <div class="hero-actions"><a class="button button-primary" href="#work">${bi('Explore six field notes','探索六篇作品筆記')} <span aria-hidden="true">↓</span></a><a class="button button-text" href="#about">${bi('About this practice','關於創作方式')} <span aria-hidden="true">↗</span></a></div>
  </div>
  <figure class="atlas-panel">
   ${bi('ATLAS 01 — six paths through a problem','圖譜 01 — 穿越問題的六條路徑','p','class="atlas-label"')}
   <div class="atlas-graphic"><svg viewBox="0 0 440 376" aria-hidden="true" focusable="false"><g fill="none" stroke="#839184" stroke-width="1.2"><path d="M47 278L130 92L239 59L364 128L302 270L170 318Z"/><path d="M47 278L239 59L302 270L130 92L364 128L170 318Z" stroke-dasharray="3 7"/><circle cx="213" cy="189" r="102" stroke-dasharray="2 8"/></g><g fill="#f4f0e8" stroke="#36564a" stroke-width="2"><circle cx="130" cy="92" r="17"/><circle cx="239" cy="59" r="17"/><circle cx="364" cy="128" r="17"/><circle cx="302" cy="270" r="17"/><circle cx="170" cy="318" r="17"/><circle cx="47" cy="278" r="17"/></g><g fill="#36564a" font-family="Consolas,monospace" font-size="12" text-anchor="middle"><text x="130" y="96">01</text><text x="239" y="63">02</text><text x="364" y="132">03</text><text x="302" y="274">04</text><text x="170" y="322">05</text><text x="47" y="282">06</text></g><circle cx="213" cy="189" r="29" fill="#36564a"/><path d="M198 191h10l5-12 6 23 5-11h6" fill="none" stroke="#f4f0e8" stroke-width="2"/><g fill="#36564a" font-family="Consolas,monospace" font-size="10"><text x="59" y="49">QUESTION</text><text x="301" y="338">EVIDENCE</text></g></svg></div>
   ${bi('An index of connections, not a performance chart. Open a field note to follow the evidence.','這是作品關聯索引，不是成效圖表。開啟筆記，沿著證據閱讀。','figcaption','class="atlas-caption"')}
  </figure>
 </section>
 <div class="ledger-bar wrap" aria-label="Portfolio at a glance"><div class="ledger-stat"><strong>06</strong>${bi('documented projects','有紀錄的作品')}</div><div class="ledger-stat"><strong>03</strong>${bi('fields of practice','探索領域')}</div><div class="ledger-stat"><strong>EN / 中</strong>${bi('two reading languages','兩種閱讀語言')}</div><div class="ledger-stat"><strong>2026</strong>${bi('field notes, as of 5 November','筆記更新至 11 月 5 日')}</div></div>
 <section id="work" class="wrap" aria-labelledby="work-title"><div class="section-heading">${bi('01 / FIELD NOTES','01 / 作品筆記','p','class="section-kicker"')}${bi('Built. Tested. Still learning.','實作、驗證，持續學習。','h2','id="work-title"')}${bi('Browse by the kind of problem. Every case includes the result and its boundary. Diagrams are conceptual illustrations.','依問題領域閱讀。每案均附成果與限制；圖示為概念示意。','p','class="section-note"')}</div>
 <div class="filters" role="group" aria-label="Filter projects" hidden><button class="filter" data-filter="all" aria-pressed="true">${bi('All six','全部六件')}</button><button class="filter" data-filter="science" aria-pressed="false">${bi('Science & data','科學與資料')}</button><button class="filter" data-filter="systems" aria-pressed="false">${bi('Interactive systems','互動系統')}</button><button class="filter" data-filter="open-source" aria-pressed="false">${bi('Open source','開源貢獻')}</button></div>
 <p class="filter-count" role="status" aria-live="polite" hidden></p><div class="work-grid">${cards}</div>
 </section>
 <section id="method" class="method-section" aria-labelledby="method-title"><div class="method-grid wrap"><div class="method-intro">${bi('02 / THE PRACTICE','02 / 工作方法','p','class="section-kicker"')}${bi('Make the claim match the evidence.','讓主張與證據相符。','h2','id="method-title"')}${bi('AI makes it easier to explore. A useful result still needs a clear question, a working implementation and an honest account of its limits.','AI 讓探索更容易。有用的成果，仍需要清楚的問題、可運作的實作，以及坦誠的限制說明。','p')}</div><div class="method-steps"><ol><li>${bi('Frame a question','界定問題','h3')}${bi('Name a concrete behavior to change or prediction to test. Keep the scope small enough to finish.','先選定要改變的行為或要檢驗的預測，讓範圍足以完成。','p')}</li><li>${bi('Build with a trail','留下實作軌跡','h3')}${bi('Use AI assistance openly. Keep versions, checks and public evidence separate from private data.','公開說明 AI 協助，保留版本與驗證紀錄，區分公開成果與私人資料。','p')}</li><li>${bi('Observe, then qualify','觀察後說明邊界','h3')}${bi('Report the observed result. Keep simulations, public scores and pending reviews in their proper context.','記錄實際觀察，清楚標示模擬、公開分數與待審查狀態。','p')}</li></ol></div></div></section>
 <section id="about" class="about-section wrap" aria-labelledby="about-title"><div class="about-heading">${bi('03 / ABOUT','03 / 關於','p','class="section-kicker"')}${bi('CC HSIEH','CC HSIEH','h2','id="about-title"')}</div><div class="about-copy">${bi('A portfolio of directed, AI-assisted work: from biological prediction and molecular retrieval to community play, file provenance and an open-source SDK. I value making an idea inspectable, especially when the result is incomplete.','這份作品集收錄我主導、由 AI 協助的實作：從細胞預測、分子檢索，到社群互動、檔案溯源與開源 SDK。我重視讓想法能被檢視，也如實保留尚未完成的部分。','p')}${bi('This site shares already-public project summaries and links. It includes no private competition dataset, account key or personal contact form. The page itself uses no analytics, cookies or remote assets.','本站只整理已公開的作品摘要與連結，不含私人競賽資料、帳號金鑰或個人聯絡表單。頁面本身不使用分析追蹤、Cookie 或遠端素材。','p')}<a href="https://microusada.com/" target="_blank" rel="noopener noreferrer">${bi('Visit the wider project collection','前往完整作品集合')} ↗</a></div></section>
 <section class="case-fallback wrap" aria-labelledby="case-fallback-title">${bi('Complete field notes','完整作品筆記','h2','id="case-fallback-title"')}${cases}</section>
</main>
<footer class="site-footer wrap"><p>© 2026 CC HSIEH · ${bi('SIGNAL ATLAS','訊號圖譜')}</p><p>${bi('AI-assisted. Evidence in view.','AI 協助實作，證據清楚呈現。')}</p><a href="#main">${bi('Back to top','回到頁首')} ↑</a></footer>
<dialog class="project-dialog" aria-labelledby="case-title" aria-describedby="case-summary"><div class="dialog-header"><span>SIGNAL ATLAS / ${bi('FIELD NOTE','作品筆記')}</span><button class="dialog-close" aria-label="Close field note">×</button></div><div class="dialog-body"></div></dialog>
<script type="application/json" id="project-data">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>
</body></html>`;
await writeFile(new URL('dist/index.html',root), html);
await writeFile(new URL('dist/mark.svg',root), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#36564a"/><path d="M6 24V8h7v8h6V8h7v16h-7v-8h-6v8z" fill="none" stroke="#f4f0e8" stroke-width="1.6"/></svg>\n');
console.log(`Built ${data.projects.length} field notes without network or dependencies.`);
