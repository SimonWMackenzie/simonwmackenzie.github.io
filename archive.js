const search = document.querySelector('#paper-search');
const filters = [...document.querySelectorAll('[data-filter]')];
const papers = [...document.querySelectorAll('[data-paper]')];
const groups = [...document.querySelectorAll('[data-group]')];
const count = document.querySelector('#paper-count');
const empty = document.querySelector('#no-results');
let topic = 'all';
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function applyFilters(){
  const words=norm(search.value.trim()).split(/\s+/).filter(Boolean);
  let visible=0;
  for(const paper of papers){const matches=(topic==='all'||paper.dataset.topic===topic)&&words.every(word=>norm(paper.dataset.search).includes(word));paper.hidden=!matches;if(matches)visible++;}
  for(const group of groups)group.hidden=![...group.querySelectorAll('[data-paper]')].some(p=>!p.hidden);
  count.textContent=visible+' of '+papers.length+' entries';empty.hidden=visible>0;
  for(const button of filters)button.setAttribute('aria-pressed',String(button.dataset.filter===topic));
  const url=new URL(location.href);if(topic==='all')url.searchParams.delete('topic');else url.searchParams.set('topic',topic);if(search.value.trim())url.searchParams.set('q',search.value.trim());else url.searchParams.delete('q');
  try{history.replaceState(null,'',url);}catch{}
}
if(search){
  const params=new URLSearchParams(location.search);search.value=params.get('q')||'';if(filters.some(b=>b.dataset.filter===params.get('topic')))topic=params.get('topic');
  search.addEventListener('input',applyFilters);filters.forEach(button=>button.addEventListener('click',()=>{topic=button.dataset.filter;applyFilters();}));
  document.querySelector('#clear-filters').addEventListener('click',()=>{search.value='';topic='all';applyFilters();search.focus();});applyFilters();
}
