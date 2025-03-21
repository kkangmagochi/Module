// dialog.js
import * as Storage from './storage.js';
import * as Character from './character.js';

// 대화 로그 저장 배열 (최대 10개)
let dialogLogs = [];

// 내보내기 (다른 모듈에서 읽기/쓰기 가능)
export { dialogLogs };


// 대화 로그에 추가
export function addToDialogLogs(dialog, action) {
  if (!dialog || dialog.trim() === '') return;

    // 최대 10개만 저장
    if (dialogLogs.length >= 10) {
        dialogLogs.pop(); // 가장 오래된 로그 제거
    }

    // 새 로그 추가 (맨 앞에)
    dialogLogs.unshift({
        text: dialog,
        action: action,
        timestamp: new Date().toLocaleString(),
        character: Character.currentCharacter ? Character.currentCharacter.name : '캐릭터'
    });

    // 로컬 스토리지에 저장 (Storage 모듈 사용)
    Storage.saveToLocalStorage();
}

// 대화 로그 목록 렌더링
export function renderDialogLogs() {
  const dialogLogsList = document.getElementById('dialog-logs-list');
    if (!dialogLogsList) return;

    dialogLogsList.innerHTML = '';

    if (dialogLogs.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'empty-logs';
        emptyItem.textContent = '저장된 대화 로그가 없습니다.';
        dialogLogsList.appendChild(emptyItem);
        return;
    }

    dialogLogs.forEach((log, index) => {
        const logItem = document.createElement('div');
        logItem.className = 'dialog-log-item';

        const logText = document.createElement('div');
        logText.className = 'dialog-log-text';
        logText.textContent = log.text;

        const logInfo = document.createElement('div');
        logInfo.className = 'dialog-log-info';
        logInfo.textContent = `${log.character} - ${log.action} [${log.timestamp}]`;

        const logActions = document.createElement('div');
        logActions.className = 'dialog-log-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'log-action-btn';
        copyBtn.textContent = '복사';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(log.text)
                .then(() => {
                    copyBtn.textContent = '복사됨!';
                    setTimeout(() => {
                        copyBtn.textContent = '복사';
                    }, 2000);
                })
                .catch(err => {
                    console.error('클립보드 복사 실패:', err);
                });
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'log-action-btn delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => {
            dialogLogs.splice(index, 1);
            // 로컬 스토리지 업데이트 (Storage 모듈 사용)
            Storage.saveToLocalStorage();
            renderDialogLogs(); // 다시 렌더링
        });

        logActions.appendChild(copyBtn);
        logActions.appendChild(deleteBtn);

        logItem.appendChild(logText);
        logItem.appendChild(logInfo);
        logItem.appendChild(logActions);

        dialogLogsList.appendChild(logItem);
    });
}
