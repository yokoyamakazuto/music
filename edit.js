const editForm = document.getElementById('editForm');
const setlistContainer = document.getElementById('setlistContainer');
const addSongBtn = document.getElementById('addSongBtn');
let saved = JSON.parse(localStorage.getItem('lives') || '[]');

// URLパラメータからインデックス取得
const params = new URLSearchParams(window.location.search);
const index = Number(params.get('index'));
if(isNaN(index) || !saved[index]){
    alert('無効な編集ページです');
    window.location.href='list.html';
}

// 編集データ読み込み
const data = saved[index];
editForm.date.value = data.date;
editForm.artist.value = data.artist;
editForm.venue.value = data.venue;
setlistContainer.innerHTML = '';
data.setlist.forEach(song=>{
    const div = document.createElement('div');
    div.className = 'setlist-item';
    div.innerHTML = `
        <input type="text" name="setlist" value="${song}">
        <button type="button" class="remove-btn">削除</button>
    `;
    setlistContainer.appendChild(div);
    div.querySelector('.remove-btn').addEventListener('click', ()=> div.remove());
});

// ドラッグ＆ドロップ設定（追加）
let dragSrcEl = null;
function handleDragStart(e) { 
    dragSrcEl = this; 
    e.dataTransfer.effectAllowed = 'move'; 
}
function handleDragOver(e) { 
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move'; 
    return false; 
}
function handleDrop(e) { 
    e.stopPropagation(); 
    if (dragSrcEl !== this) { 
        this.parentNode.insertBefore(dragSrcEl, this); 
    } 
    return false; 
}
function addDragHandlers(div) {
    div.setAttribute('draggable', true);
    div.addEventListener('dragstart', handleDragStart, false);
    div.addEventListener('dragover', handleDragOver, false);
    div.addEventListener('drop', handleDrop, false);
}
// 既存セットリスト項目にドラッグ設定
document.querySelectorAll('.setlist-item').forEach(addDragHandlers);

// 曲追加
addSongBtn.addEventListener('click', ()=>{
    const div = document.createElement('div');
    div.className = 'setlist-item';
    div.innerHTML = `
        <input type="text" name="setlist" placeholder="曲名">
        <button type="button" class="remove-btn">削除</button>
    `;
    setlistContainer.appendChild(div);
    div.querySelector('.remove-btn').addEventListener('click', ()=> div.remove());
    addDragHandlers(div); // 新規追加項目にもドラッグ設定
});

// 保存
editForm.addEventListener('submit', e => {
    e.preventDefault();

    Swal.fire({
        title: '保存しますか？',
        showCancelButton: true,
        confirmButtonText: 'はい',
        cancelButtonText: 'いいえ',
        icon: undefined,        
        customClass: {
            popup: 'swal2-simple-popup',   
            confirmButton: 'swal2-simple-confirm',
            cancelButton: 'swal2-simple-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData(editForm);
            data.date = formData.get('date');
            data.artist = formData.get('artist');
            data.venue = formData.get('venue');
            data.setlist = formData.getAll('setlist').filter(s => s.trim() !== '');
            saved[index] = data;
            localStorage.setItem('lives', JSON.stringify(saved));

            Swal.fire({
                title: '保存しました！',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                icon: undefined,
                customClass: {
                    popup: 'swal2-simple-popup',
                    confirmButton: 'swal2-simple-confirm'
                }
            }).then(() => {
                window.location.href = 'list.html';
            });
        }
    });
});





// 戻るボタン
document.getElementById('backBtn').addEventListener('click', ()=>{
    window.location.href='list.html';
});
