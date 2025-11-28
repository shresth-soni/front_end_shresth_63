(function(){
  const gallery = document.getElementById('gallery');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  // sample image ids from picsum.photos
  const images = [1025,1027,1035,106,1074,1084,1081,1011,1003,1015,1018,1020];
  const items = images.map((id,i)=>({id,thumb:`https://picsum.photos/id/${id}/600/400`,large:`https://picsum.photos/id/${id}/1200/800`,caption:`Photo ${i+1}`}));

  let currentIndex = -1;

  // render placeholders with data-src for lazy loading
  items.forEach((it, idx)=>{
    const a = document.createElement('a'); a.className = 'card'; a.href = '#'; a.dataset.index = idx;
    a.innerHTML = `\n      <img data-src="${it.thumb}" alt="${it.caption}" loading="lazy" />\n      <div class="caption">${it.caption}</div>\n    `;
    gallery.appendChild(a);
  });

  // IntersectionObserver for lazy loading
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const img = e.target.querySelector('img');
        if(img && img.dataset.src){ img.src = img.dataset.src; delete img.dataset.src; }
        obs.unobserve(e.target);
      }
    });
  },{rootMargin:'200px'});

  Array.from(gallery.children).forEach(card=>io.observe(card));

  gallery.addEventListener('click', e=>{
    e.preventDefault();
    const a = e.target.closest('.card'); if(!a) return;
    const idx = Number(a.dataset.index); openModal(idx);
  });

  function openModal(idx){ currentIndex = idx; const it = items[idx]; modalImg.src = it.large; modalImg.alt = it.caption; modal.classList.remove('hidden'); modal.focus(); }
  function closeModal(){ modal.classList.add('hidden'); modalImg.src = ''; currentIndex = -1; }
  function showNext(dir){ if(currentIndex===-1) return; currentIndex = (currentIndex + dir + items.length) % items.length; openModal(currentIndex); }

  modal.addEventListener('click', e=>{ if(e.target.dataset.action==='close' || e.target.closest('[data-action="close"]')) closeModal(); });
  prevBtn.addEventListener('click', ()=>showNext(-1)); nextBtn.addEventListener('click', ()=>showNext(1));

  document.addEventListener('keydown', e=>{
    if(modal.classList.contains('hidden')) return;
    if(e.key === 'Escape') closeModal();
    if(e.key === 'ArrowLeft') showNext(-1);
    if(e.key === 'ArrowRight') showNext(1);
  });
})();