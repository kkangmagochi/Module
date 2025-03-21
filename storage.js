// storage.js
import * as Character from './character.js';
import * as Stats from './stats.js';
import * as Dialog from './dialog.js'

// 로컬 스토리지에서 데이터 불러오기
export function loadFromLocalStorage() {

  const savedCharacters = localStorage.getItem('tamagotchiCharacters');
    if (savedCharacters) {
      Character.characters.length = 0; // 기존 배열 비우기 (참조는 유지)
      Character.characters.push(...JSON.parse(savedCharacters)); // 새 데이터 추가

        // UI 업데이트 (캐릭터 목록, 수정 드롭다운)
        Character.renderSavedCharacters();
        Character.populateEditCharacterSelect();
    }

    const savedCharacterStats = localStorage.getItem('tamagotchiCharacterStats');
    if (savedCharacterStats) {
        // Stats.characterStats 객체 업데이트 (Object.assign 사용)
        Object.assign(Stats.characterStats, JSON.parse(savedCharacterStats));
    }

    const savedStats = localStorage.getItem('tamagotchiStats');
    if (savedStats) {
        // Stats.stats 객체 업데이트 (Object.assign 사용)
       Object.assign(Stats.stats, JSON.parse(savedStats));
    }

    const savedCurrentCharacter = localStorage.getItem('currentCharacter');
    if (savedCurrentCharacter) {
        // Character.currentCharacter 객체 업데이트
        // 주의: 객체 전체를 바꾸는 것이 아니라 내용만 변경
        Object.assign(Character.currentCharacter, JSON.parse(savedCurrentCharacter));
    }

    const savedDialogLogs = localStorage.getItem('dialogLogs');
    if (savedDialogLogs) {
        // dialogLogs 배열 업데이트 (Dialog 모듈)
        Dialog.dialogLogs.length = 0;
        Dialog.dialogLogs.push(...JSON.parse(savedDialogLogs));
        Dialog.renderDialogLogs(); // 대화 로그 렌더링

    }

    const savedDaysCount = localStorage.getItem('tamagotchiDaysCount');
    if (savedDaysCount) {
      const daysCountDisplay = document.getElementById('days-count');
        const daysCount = parseInt(savedDaysCount);
        daysCountDisplay.textContent = daysCount;
    }
}


// 로컬 스토리지에 데이터 저장
export function saveToLocalStorage() {
    localStorage.setItem('tamagotchiCharacters', JSON.stringify(Character.characters));
    localStorage.setItem('tamagotchiCharacterStats', JSON.stringify(Stats.characterStats));
    localStorage.setItem('tamagotchiStats', JSON.stringify(Stats.getStats())); // Stats.getStats() 사용

    // daysCount 저장
    const daysCountDisplay = document.getElementById('days-count');
    const daysCount = parseInt(daysCountDisplay.textContent);
    localStorage.setItem('tamagotchiDaysCount', daysCount.toString());


    // currentCharacter가 null일 때도 처리
    if (Character.currentCharacter) {
        localStorage.setItem('currentCharacter', JSON.stringify(Character.currentCharacter));
    } else {
        localStorage.removeItem('currentCharacter'); // null이면 제거
    }
  localStorage.setItem('dialogLogs', JSON.stringify(Dialog.dialogLogs));
}


// API 키 가져오기
export function getApiKey() {
    return localStorage.getItem('geminiApiKey') || ''; // null 대신 빈 문자열 반환
}

// API 키 설정
export function setApiKey(apiKey) {
    localStorage.setItem('geminiApiKey', apiKey);
}

// 선택된 모델 가져오기/설정
export function getSelectedModel() {
    return localStorage.getItem('selectedModel') || 'gemini-2.0-flash';
}

export function setSelectedModel(model) {
    localStorage.setItem('selectedModel', model);
}

// Stats 모듈의 stats 객체에 대한 getter 함수 추가
export function getStats() {
  return Stats.getStats();
}
