const materials = JSON.parse(localStorage.getItem('studio-materials') || '[]');
const subjects = JSON.parse(localStorage.getItem('studio-subjects') || '["Matematică","Limba română","Geografie","Fizică"]');
const modal = document.querySelector('#material-modal');
function save() { localStorage.setItem('studio-materials', JSON.stringify(materials)); }
function render() {
  const term = document.querySelector('#search').value.toLowerCase();
  const shown = materials.filter(m => `${m.title} ${m.subject} ${m.type}`.toLowerCase().includes(term));
  document.querySelector('#empty-state').hidden = materials.length > 0;
  const list = document.querySelector('#material-list');
  list.hidden = materials.length === 0;
  list.innerHTML = shown.map(m => `<article class="material-item"><span class="file-icon">▤</span><div><strong>${m.title}</strong><small>${m.subject} · ${m.type}${m.details ? ` · ${m.details}` : ''}</small></div>${m.details?.startsWith('http') ? `<a target="_blank" href="${m.details}">Deschide ↗</a>` : ''}</article>`).join('') || '<p class="empty-state">Nu am găsit niciun material.</p>';
}
function openModal() { document.querySelector('#subject-select').innerHTML = subjects.map(subject => `<option>${subject}</option>`).join(''); modal.showModal(); }
document.querySelector('#open-modal').onclick = openModal;
document.querySelector('#empty-add').onclick = openModal;
document.querySelector('#search').oninput = render;
document.querySelector('#material-form').addEventListener('submit', event => { if (event.submitter.value === 'cancel') return; event.preventDefault(); materials.unshift(Object.fromEntries(new FormData(event.target))); save(); render(); event.target.reset(); modal.close(); });
render();
