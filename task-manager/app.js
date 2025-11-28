(function(){
  const STORAGE_KEY = 'tm_tasks_v1';
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const count = document.getElementById('count');
  const clearBtn = document.getElementById('clear-completed');
  const filters = document.getElementById('filters');
  const search = document.getElementById('search');

  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let activeFilter = 'all';
  let searchTerm = '';

  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

  function render(){
    list.innerHTML = '';
    const filtered = tasks.filter(t => {
      if(activeFilter === 'active' && t.completed) return false;
      if(activeFilter === 'completed' && !t.completed) return false;
      if(searchTerm && !t.text.toLowerCase().includes(searchTerm)) return false;
      return true;
    });

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id;
      li.innerHTML = `
        <div class="task-left">
          <input type="checkbox" ${task.completed? 'checked':''} data-action="toggle" />
          <div class="task-text ${task.completed? 'completed':''}" data-action="text">${escapeHtml(task.text)}</div>
        </div>
        <div class="task-actions">
          <button data-action="edit">✏️</button>
          <button data-action="delete">🗑️</button>
        </div>
      `;
      list.appendChild(li);
    });

    count.textContent = `${tasks.length} task${tasks.length===1? '':'s'}`;
  }

  function addTask(text){
    tasks.unshift({ id: Date.now().toString(36), text: text.trim(), completed:false });
    save(); render();
  }

  function toggleTask(id){
    const t = tasks.find(x=>x.id===id); if(!t) return; t.completed = !t.completed; save(); render();
  }

  function deleteTask(id){ tasks = tasks.filter(x=>x.id!==id); save(); render(); }

  function editTask(id){
    const t = tasks.find(x=>x.id===id); if(!t) return;
    const newText = prompt('Edit task', t.text);
    if(newText !== null){ t.text = newText.trim() || t.text; save(); render(); }
  }

  list.addEventListener('click', e=>{
    const action = e.target.dataset.action;
    if(!action) return;
    const li = e.target.closest('li');
    const id = li && li.dataset.id;
    if(action === 'toggle') toggleTask(id);
    if(action === 'delete') deleteTask(id);
    if(action === 'edit') editTask(id);
  });

  // double-click to edit
  list.addEventListener('dblclick', e=>{
    const t = e.target; if(t.dataset.action==='text'){ const li = t.closest('li'); editTask(li.dataset.id); }
  });

  form.addEventListener('submit', e=>{ e.preventDefault(); if(!input.value.trim()) return; addTask(input.value); input.value = ''; });

  clearBtn.addEventListener('click', ()=>{ tasks = tasks.filter(t=>!t.completed); save(); render(); });

  filters.addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b) return;
    Array.from(filters.querySelectorAll('button')).forEach(btn=>btn.classList.remove('active'));
    b.classList.add('active'); activeFilter = b.dataset.filter; render();
  });

  search.addEventListener('input', e=>{ searchTerm = e.target.value.trim().toLowerCase(); render(); });

  function escapeHtml(s){ return s.replace(/[&<>\"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

  render();
})();