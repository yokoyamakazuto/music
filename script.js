const form = document.getElementById('liveForm');
const setlistContainer = document.getElementById('setlistContainer');
const addSetlistBtn = document.getElementById('addSetlistBtn');
let saved = JSON.parse(localStorage.getItem('lives') || '[]');

// 曲追加
addSetlistBtn.addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'setlist-item';
  div.innerHTML = `
    <input type="text" name="setlist[]" placeholder="曲名">
    <button type="button" class="remove-btn">削除</button>
  `;
  setlistContainer.appendChild(div);
  addRemoveHandler(div);
  addDragHandlers(div);
});

// 削除ボタン処理
function addRemoveHandler(div) {
  div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
}

document.querySelectorAll('.remove-btn').forEach(btn => addRemoveHandler(btn.parentElement));

// ドラッグ＆ドロップ
let dragSrcEl = null;
function handleDragStart(e){ dragSrcEl=this; e.dataTransfer.effectAllowed='move'; }
function handleDragOver(e){ e.preventDefault(); e.dataTransfer.dropEffect='move'; return false; }
function handleDrop(e){ e.stopPropagation(); if(dragSrcEl!=this){ this.parentNode.insertBefore(dragSrcEl,this); } return false; }
function addDragHandlers(div){
  div.setAttribute('draggable',true);
  div.addEventListener('dragstart',handleDragStart,false);
  div.addEventListener('dragover',handleDragOver,false);
  div.addEventListener('drop',handleDrop,false);
}

// フォーム送信
form.addEventListener('submit', e=>{
  e.preventDefault();
  const formData = new FormData(form);
  const data = {
    date: formData.get('date'),
    artist: formData.get('artist'),
    venue: formData.get('venue'),
    setlist: Array.from(setlistContainer.querySelectorAll('input[name="setlist[]"]'))
                   .map(i=>i.value.trim())
                   .filter(v=>v)
  };
  saved.push(data);
  saved.sort((a,b)=>new Date(b.date)-new Date(a.date));
  localStorage.setItem('lives', JSON.stringify(saved));
  alert('追加しました！');
  form.reset();
  setlistContainer.innerHTML = `
    <div class="setlist-item">
      <input type="text" name="setlist[]" placeholder="曲名">
      <button type="button" class="remove-btn">削除</button>
    </div>
  `;
  document.querySelectorAll('.setlist-item').forEach(addDragHandlers);
  document.querySelectorAll('.remove-btn').forEach(btn => addRemoveHandler(btn.parentElement));
});
