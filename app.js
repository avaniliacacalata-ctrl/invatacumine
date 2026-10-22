const materialModal = document.querySelector('#material-modal');
const subjectModal = document.querySelector('#subject-modal');
const subjectRenames = { 'Istorie': 'Geografie', 'Biologie': 'Fizică' };
const materials = JSON.parse(localStorage.getItem('studio-materials') || '[]');
const subjects = JSON.parse(localStorage.getItem('studio-subjects') || '["Matematică","Limba română","Geografie","Fizică"]')
  .map(subject => subjectRenames[subject] || subject);
materials.forEach(material => { material.subject = subjectRenames[material.subject] || material.subject; });
const colors = ['violet', 'lavender', 'lilac', 'mauve'];

function save() { localStorage.setItem('studio-materials', JSON.stringify(materials)); localStorage.setItem('studio-subjects', JSON.stringify(subjects)); }
function updateSelect() { document.querySelector('#subject-select').innerHTML = subjects.map(s => `<option>${s}</option>`).join(''); }
function renderSubjects() {
  document.querySelector('#subject-grid').innerHTML = subjects.map((subject, i) => {
    const count = materials.filter(m => m.subject === subject).length;
    return `<button class="subject-card ${colors[i % colors.length]}" data-subject="${subject}"><span class="subject-icon">${['∑','Aa','⌘','✿'][i % 4]}</span><strong>${subject}</strong><small>${count} materiale</small><b>→</b></button>`;
  }).join('');
}
function renderMaterials() {
  const search = document.querySelector('#search');
  if (!search) return;
  const term = search.value.toLowerCase();
  const shown = materials.filter(m => `${m.title} ${m.subject} ${m.type}`.toLowerCase().includes(term));
  document.querySelector('#empty-state').hidden = materials.length > 0;
  const list = document.querySelector('#material-list'); list.hidden = materials.length === 0;
  list.innerHTML = shown.map(m => `<article class="material-item"><span class="file-icon">▤</span><div><strong>${m.title}</strong><small>${m.subject} · ${m.type}${m.details ? ` · ${m.details}` : ''}</small></div>${m.details?.startsWith('http') ? `<a target="_blank" href="${m.details}">Deschide ↗</a>` : ''}</article>`).join('') || '<p class="empty-state">Nu am găsit niciun material.</p>';
}
function openMaterial(subject) { updateSelect(); if (subject) document.querySelector('#subject-select').value = subject; materialModal.showModal(); }
function setSubjectsVisibility(visible, shouldScroll = true) {
  const section = document.querySelector('#materii');
  section.hidden = !visible;
  document.querySelector('#show-subjects').setAttribute('aria-expanded', String(visible));
  document.querySelector('#subjects-label').textContent = visible ? 'Ascunde materiile' : 'Vezi materiile';
  document.querySelector('#subjects-arrow').textContent = visible ? '↑' : '↓';
  if (visible && shouldScroll) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.querySelector('#open-modal').onclick = () => openMaterial();
const emptyAdd = document.querySelector('#empty-add');
if (emptyAdd) emptyAdd.onclick = () => openMaterial();
document.querySelector('#add-subject').onclick = () => subjectModal.showModal();
document.querySelector('#show-subjects').onclick = event => { event.preventDefault(); const section = document.querySelector('#materii'); setSubjectsVisibility(section.hidden); };
document.querySelector('nav a[href="#materii"]').onclick = event => { event.preventDefault(); setSubjectsVisibility(true); };
const search = document.querySelector('#search');
if (search) search.oninput = renderMaterials;
document.querySelector('#subject-grid').onclick = e => { const card = e.target.closest('[data-subject]'); if (card) openMaterial(card.dataset.subject); };
document.querySelector('#material-form').addEventListener('submit', e => { if (e.submitter.value === 'cancel') return; e.preventDefault(); const data = Object.fromEntries(new FormData(e.target)); materials.unshift(data); save(); renderSubjects(); renderMaterials(); e.target.reset(); materialModal.close(); });
document.querySelector('#subject-form').addEventListener('submit', e => { if (e.submitter.value === 'cancel') return; e.preventDefault(); const name = new FormData(e.target).get('name').trim(); if (name && !subjects.includes(name)) { subjects.push(name); save(); renderSubjects(); } e.target.reset(); subjectModal.close(); });
save(); renderSubjects(); renderMaterials();
