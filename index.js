// ===== フォーム関連 =====
const form = document.getElementById('liveForm');
const setlistContainer = document.getElementById('setlistContainer');
const addSetlistBtn = document.getElementById('addSetlistBtn');
let saved = JSON.parse(localStorage.getItem('lives') || '[]');

// 初期セットリスト項目に削除＆ドラッグ設定
document.querySelectorAll('.setlist-item').forEach(div => {
    addRemoveHandler(div);
    addDragHandlers(div);
});

// 曲追加ボタン
addSetlistBtn.addEventListener('click', () => createSetlistItem());

// 曲追加用関数
function createSetlistItem(value = '') {
    const div = document.createElement('div');
    div.className = 'setlist-item';
    div.innerHTML = `
        <input type="text" name="setlist[]" placeholder="曲名" value="${value}">
        <button type="button" class="remove-btn">削除</button>
    `;
    setlistContainer.appendChild(div);
    addRemoveHandler(div);
    addDragHandlers(div);
}

// 削除ボタン
function addRemoveHandler(div) {
    div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
}

// ドラッグ＆ドロップ
let dragSrcEl = null;
function handleDragStart(e) { dragSrcEl = this; e.dataTransfer.effectAllowed = 'move'; }
function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; return false; }
function handleDrop(e) { e.stopPropagation(); if (dragSrcEl != this) { this.parentNode.insertBefore(dragSrcEl, this); } return false; }
function addDragHandlers(div) {
    div.setAttribute('draggable', true);
    div.addEventListener('dragstart', handleDragStart, false);
    div.addEventListener('dragover', handleDragOver, false);
    div.addEventListener('drop', handleDrop, false);
}

// ===== 追加完了ポップアップモーダル =====
const addInfoModal = document.createElement('div');
addInfoModal.className = 'modal';
addInfoModal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <p id="infoText"></p>
  </div>
`;
document.body.appendChild(addInfoModal);

const infoText = addInfoModal.querySelector('#infoText');
const infoClose = addInfoModal.querySelector('.close');

infoClose.addEventListener('click', () => addInfoModal.classList.remove('active'));
addInfoModal.addEventListener('click', e => {
    if (e.target === addInfoModal) addInfoModal.classList.remove('active');
});

// モーダル表示関数
function showInfoPopup(message) {
    infoText.textContent = message;
    addInfoModal.classList.add('active');
    setTimeout(() => addInfoModal.classList.remove('active'), 3000); // 3秒で自動閉じ
}

// ===== ライブフォーム送信 =====
form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        date: formData.get('date'),
        artist: formData.get('artist'),
        venue: formData.get('venue'),
        setlist: Array.from(setlistContainer.querySelectorAll('input[name="setlist[]"]'))
                       .map(i => i.value.trim())
                       .filter(v => v)
    };

    saved.push(data);
    saved.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem('lives', JSON.stringify(saved));

    // ポップアップ表示
    showInfoPopup('ライブを追加しました！');

    form.reset();
    setlistContainer.innerHTML = `
        <div class="setlist-item">
            <input type="text" name="setlist[]" placeholder="曲名">
            <button type="button" class="remove-btn">削除</button>
        </div>
    `;
    document.querySelectorAll('.setlist-item').forEach(div => {
        addRemoveHandler(div);
        addDragHandlers(div);
    });
});

// ===== ライブメモと今後のライブフォーム切替 =====
const memoBtn = document.getElementById('memoBtn');
const nextLiveBtn = document.getElementById('nextLiveFormBtn');
const liveFormElem = document.getElementById('liveForm');
const nextLiveFormElem = document.getElementById('nextLiveForm');

memoBtn.addEventListener('click', () => {
    memoBtn.classList.add('active');
    nextLiveBtn.classList.remove('active');
    liveFormElem.classList.add('active-form');
    liveFormElem.classList.remove('hidden-form');
    nextLiveFormElem.classList.add('hidden-form');
    nextLiveFormElem.classList.remove('active-form');
});

nextLiveBtn.addEventListener('click', () => {
    nextLiveBtn.classList.add('active');
    memoBtn.classList.remove('active');
    nextLiveFormElem.classList.add('active-form');
    nextLiveFormElem.classList.remove('hidden-form');
    liveFormElem.classList.add('hidden-form');
    liveFormElem.classList.remove('active-form');
});

// ===== 今後のライブフォーム送信 =====
const nextLiveForm = document.getElementById('nextLiveForm');
let upcomingSaved = JSON.parse(localStorage.getItem('upcomingLives') || '[]');

nextLiveForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(nextLiveForm);
    const data = {
        date: formData.get('date'),
        artist: formData.get('artist'),
        venue: formData.get('venue')
    };

    upcomingSaved.push(data);
    upcomingSaved.sort((a, b) => new Date(a.date) - new Date(b.date)); // 昇順
    localStorage.setItem('upcomingLives', JSON.stringify(upcomingSaved));

    // ポップアップ表示
    showInfoPopup('今後のライブを追加しました！');

    nextLiveForm.reset();
    renderUpcomingLive(); // 左上に即反映
});

// ===== index.html 左上に次のライブ予定表示 =====
const upcomingLiveContainer = document.getElementById('upcomingLive');

function renderUpcomingLive() {
    let upcomingLives = JSON.parse(localStorage.getItem('upcomingLives') || '[]');
    if (upcomingLives.length === 0) {
        upcomingLiveContainer.innerHTML = `<p class="no-live">次のライブ予定はありません</p>`;
        return;
    }

    // 日付順にソート（昇順）
    upcomingLives.sort((a, b) => new Date(a.date) - new Date(b.date));
    const nextLive = upcomingLives[0];

    upcomingLiveContainer.innerHTML = `
        <div class="upcoming-title">次のライブ</div>
        <div class="live-card">
            <h3>${nextLive.date} - ${nextLive.artist}</h3>
            <p>会場: ${nextLive.venue}</p>
        </div>
    `;
}

// 初期表示
renderUpcomingLive();
