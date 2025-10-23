const list = document.getElementById('liveList');
let saved = JSON.parse(localStorage.getItem('lives') || '[]');

// ===== 共通 削除確認モーダル =====
const confirmModal = document.createElement('div');
confirmModal.className = 'confirm-modal';
confirmModal.innerHTML = `
  <div class="modal-content">
    <p>本当に削除しますか？</p>
    <button class="modal-btn confirm-yes">はい</button>
    <button class="modal-btn confirm-no">いいえ</button>
  </div>
`;
document.body.appendChild(confirmModal);

let deleteTargetIndex = null;
const yesBtn = confirmModal.querySelector('.confirm-yes');
const noBtn = confirmModal.querySelector('.confirm-no');

// ===== 詳細表示モーダル =====
const detailModal = document.createElement('div');
detailModal.className = 'modal';
detailModal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <h3></h3>
    <p></p>
  </div>
`;
document.body.appendChild(detailModal);

const detailClose = detailModal.querySelector('.close');
const detailTitle = detailModal.querySelector('h3');
const detailBody = detailModal.querySelector('p');

detailClose.addEventListener('click', () => {
    detailModal.classList.remove('active');
});

detailModal.addEventListener('click', e => {
    if (e.target === detailModal) detailModal.classList.remove('active');
});

// ===== リスト描画 =====
function renderList() {
    list.innerHTML = '';
    saved.forEach((data, index) => {
        const card = document.createElement('div');
        card.className = 'live-card';
        card.innerHTML = `
            <h3>${data.artist}</h3>
            <p><strong>日付:</strong> ${data.date}</p>
            <p><strong>会場:</strong> ${data.venue}</p>
            <button class="edit-btn">編集</button>
            <button class="delete-btn">削除</button>
        `;
        list.appendChild(card);

        // 編集ボタン
        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // カードクリックと重ならないように
            window.location.href = `edit.html?index=${index}`;
        });

        // 削除ボタン
        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTargetIndex = index;
            confirmModal.classList.add('active');
        });

        // カードクリックで詳細表示
        card.addEventListener('click', () => {
            detailTitle.textContent = data.artist;
            detailBody.innerHTML = `日付: ${data.date}<br>会場: ${data.venue}<br>${data.setlist ? 'セットリスト:<br>' + data.setlist.map((s, i) => `${i+1}. ${s}`).join('<br>') : ''}`;
            detailModal.classList.add('active');
        });
    });
}

// 「はい」「いいえ」ボタン
yesBtn.addEventListener('click', () => {
    if (deleteTargetIndex !== null) {
        saved.splice(deleteTargetIndex, 1);
        localStorage.setItem('lives', JSON.stringify(saved));
        deleteTargetIndex = null;
        renderList();
    }
    confirmModal.classList.remove('active');
});

noBtn.addEventListener('click', () => {
    deleteTargetIndex = null;
    confirmModal.classList.remove('active');
});

confirmModal.addEventListener('click', e => {
    if (e.target === confirmModal) {
        deleteTargetIndex = null;
        confirmModal.classList.remove('active');
    }
});

// 初期描画
renderList();
