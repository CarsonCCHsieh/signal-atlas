(() => {
  'use strict';
  const data = JSON.parse(document.querySelector('#project-data').textContent);
  const byId = new Map(data.projects.map(project => [project.id, project]));
  const dialog = document.querySelector('.project-dialog');
  const body = dialog.querySelector('.dialog-body');
  const filters = document.querySelector('.filters');
  const count = document.querySelector('.filter-count');
  let language = new URL(location.href).searchParams.get('lang')?.startsWith('zh') ? 'zh' : 'en';
  let selectedFilter = 'all';
  let activeProject = null;
  let opener = null;
  const words = (en, zh) => language === 'zh' ? zh : en;
  const publicUrl = value => {
    const url = new URL(value);
    if (['microusada.com','raidline.microusada.com'].includes(url.hostname) && url.searchParams.has('lang')) url.searchParams.set('lang',language === 'zh' ? 'zh-TW' : 'en');
    return url.href;
  };
  const make = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value != null) element.textContent = value;
    return element;
  };
  function updateFilter() {
    let visible = 0;
    document.querySelectorAll('.project').forEach(project => {
      project.hidden = selectedFilter !== 'all' && project.dataset.category !== selectedFilter;
      if (!project.hidden) visible++;
    });
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selectedFilter)));
    count.textContent = words(`${visible} of 6 field notes shown.`, `顯示 ${visible} / 6 篇作品筆記。`);
  }
  function renderCase(project) {
    body.replaceChildren();
    body.append(make('p','dialog-category',project.discipline[language]));
    const title = make('h2','',project.name[language]); title.id = 'case-title'; body.append(title);
    const summary = make('p','dialog-summary',project.summary[language]); summary.id = 'case-summary'; body.append(summary);
    body.append(make('p','dialog-metric',`${project.metric.value} · ${project.metric.label[language]}`));
    for (const [key, en, zh] of [['question','The question','問題'],['approach','The approach','做法'],['outcome','Observed result','已觀察成果'],['limitation','Limits & next unknowns','限制與待解問題']]) {
      const section = make('section','case-section');
      section.append(make('h3','',words(en,zh)),make('p','',project[key][language])); body.append(section);
    }
    const links = make('div','dialog-links');
    for (const [url,en,zh] of [[project.url,'View public evidence ↗','查看公開成果 ↗'],[project.sourceUrl,'View public source ↗','查看公開原始碼 ↗']]) {
      if (!url) continue;
      const link = make('a','button',words(en,zh)); link.href = publicUrl(url); link.target = '_blank'; link.rel = 'noopener noreferrer'; links.append(link);
    }
    body.append(links, make('p','dialog-note',words('Evidence snapshot: 5 November 2026. External links open separate sites; project status may later change.','證據快照：2026 年 11 月 5 日。外部連結會開啟其他網站，作品狀態可能於日後變更。')));
  }
  function setLanguage(next, updateUrl = true) {
    language = next;
    document.documentElement.lang = next === 'zh' ? 'zh-Hant' : 'en';
    document.title = words('SIGNAL ATLAS — CC HSIEH','訊號圖譜 — CC HSIEH');
    document.querySelectorAll('[data-en][data-zh]').forEach(element => { element.textContent = element.dataset[next]; });
    document.querySelectorAll('.language-switch').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.lang === next)));
    document.querySelectorAll('[data-project-url]').forEach(link => { link.href = publicUrl(byId.get(link.dataset.projectUrl).url); });
    filters.setAttribute('aria-label',words('Filter projects','篩選作品'));
    document.querySelector('.ledger-bar').setAttribute('aria-label',words('Portfolio at a glance','作品集概覽'));
    dialog.querySelector('.dialog-close').setAttribute('aria-label',words('Close field note','關閉作品筆記'));
    if (activeProject) renderCase(activeProject);
    updateFilter();
    if (updateUrl) { const url = new URL(location.href); url.searchParams.set('lang',next === 'zh' ? 'zh-TW' : 'en'); history.replaceState(null,'',url); }
  }
  function openCase(project, trigger) {
    opener = trigger || Array.from(document.querySelectorAll('[data-open]')).find(link => link.dataset.open === project.id);
    activeProject = project;
    renderCase(project);
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.dialog-close').focus();
  }
  function openFragment() {
    const id = location.hash.startsWith('#case-') ? location.hash.slice(6) : '';
    const project = byId.get(id);
    if (project) openCase(project);
    else if (dialog.open) dialog.close();
  }
  document.querySelectorAll('.language-switch').forEach(button => button.addEventListener('click',() => setLanguage(button.dataset.lang)));
  filters.addEventListener('click',event => { const button = event.target.closest('button[data-filter]'); if (!button) return; selectedFilter = button.dataset.filter; updateFilter(); });
  if (typeof dialog.showModal === 'function') {
    document.querySelector('.case-fallback').hidden = true;
    document.querySelectorAll('[data-open]').forEach(link => link.addEventListener('click',event => {
      const project = byId.get(link.dataset.open); if (!project) return;
      event.preventDefault();
      const url = new URL(location.href); url.hash = `case-${project.id}`; history.replaceState(null,'',url);
      openCase(project, link);
    }));
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event => { if (event.target === dialog) { const rect=dialog.getBoundingClientRect(); if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) dialog.close(); } });
    dialog.addEventListener('close',()=>{
      if (activeProject && location.hash === `#case-${activeProject.id}`) {
        const url = new URL(location.href); url.hash = ''; history.replaceState(null,'',url);
      }
      activeProject = null;
      if (opener?.isConnected) opener.focus();
    });
    window.addEventListener('hashchange', openFragment);
  }
  filters.hidden = false; count.hidden = false;
  setLanguage(language,false);
  if (typeof dialog.showModal === 'function') openFragment();
})();
