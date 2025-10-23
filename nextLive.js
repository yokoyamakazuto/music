const upcomingLiveList = document.getElementById('upcomingLiveList');

// ===== 削除確認モーダルの初期化 =====
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

let deleteTargetIndex = null; // 削除対象の配列インデックス
const yesBtn = confirmModal.querySelector('.confirm-yes');
const noBtn = confirmModal.querySelector('.confirm-no');

// ===== ライブリスト描画 =====
function renderUpcomingLives() {
    upcomingLiveList.innerHTML = '';
    let upcomingLives = JSON.parse(localStorage.getItem('upcomingLives') || '[]');
    upcomingLives.sort((a, b) => new Date(a.date) - new Date(b.date));

    upcomingLives.forEach((live, index) => {
        const div = document.createElement('div');
        div.className = 'live-card';
        div.innerHTML = `
            <h3>${live.date} - ${live.artist}</h3>
            <p>会場: ${live.venue}</p>
            <button class="delete-btn">削除</button>
        `;

        // 削除ボタンクリックでモーダル表示
        div.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTargetIndex = index;
            confirmModal.classList.add('active');
        });

        upcomingLiveList.appendChild(div);
    });
}

// ===== モーダル操作 =====
yesBtn.addEventListener('click', () => {
    if (deleteTargetIndex !== null) {
        let upcomingLives = JSON.parse(localStorage.getItem('upcomingLives') || '[]');
        upcomingLives.splice(deleteTargetIndex, 1); // 配列から削除
        localStorage.setItem('upcomingLives', JSON.stringify(upcomingLives));
        deleteTargetIndex = null;
        renderUpcomingLives(); // 再描画
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

// 初期表示
renderUpcomingLives();
