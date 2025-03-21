// stats.js

import * as Storage from './storage.js';
import * as Character from './character.js';


// 상태 변수 (다른 모듈에서 접근할 수 있도록)
let stats = {
  affection: 50,
  hunger: 50,
  happiness: 50
};

// 캐릭터별 스탯 (다른 모듈에서 접근할 수 있도록)
let characterStats = {};



// 스탯 내보내기 (다른 모듈에서 읽기 전용으로 접근)
export function getStats() {
    return { ...stats }; // 복사본 반환
}


// 스탯 업데이트
export function updateStats(newStats) {
  stats = { ...newStats };
    // 현재 캐릭터의 스탯 저장
    if(Character.currentCharacter){
        characterStats[Character.currentCharacter.name] = { ...stats };
    }
  updateStatsDisplay();
  Storage.saveToLocalStorage();  // 스토리지 업데이트
}

// 캐릭터별 스탯 로드
export function loadCharacterStats(characterName) {
    if (characterStats[characterName]) {
        stats = { ...characterStats[characterName] };
    } else {
        // 스탯이 없으면 기본값으로 설정
        stats = { affection: 50, hunger: 50, happiness: 50 };
        characterStats[characterName] = { ...stats };
    }
    updateStatsDisplay(); // 스탯 로드 후 화면 업데이트
}


// 스탯 표시 업데이트
export function updateStatsDisplay() {
  const affectionBar = document.getElementById('affection-bar');
  const hungerBar = document.getElementById('hunger-bar');
  const happinessBar = document.getElementById('happiness-bar');
  const affectionValue = document.getElementById('affection-value');
  const hungerValue = document.getElementById('hunger-value');
  const happinessValue = document.getElementById('happiness-value');
  const characterStatus = document.getElementById('character-status-text');


  affectionBar.style.width = `${stats.affection}%`;
  hungerBar.style.width = `${stats.hunger}%`;
  happinessBar.style.width = `${stats.happiness}%`;

  affectionValue.textContent = Math.round(stats.affection);
  hungerValue.textContent = Math.round(stats.hunger);
  happinessValue.textContent = Math.round(stats.happiness);


  // 현재 캐릭터의 스탯 저장 (character.js의 characterStats 사용)
    if (Character.currentCharacter) {
      characterStats[Character.currentCharacter.name] = { ...stats }; // characterStats에 직접 접근
    }

  Storage.saveToLocalStorage();
  updateCharacterStatus(); //캐릭터 상태도 함께 업데이트
}

// 캐릭터 상태 업데이트
function updateCharacterStatus() {
    const characterStatus = document.getElementById('character-status-text'); // DOM 요소 가져오기
    if (!Character.currentCharacter) return;

    let status = "기본 상태";

    if (stats.hunger < 20) {
        status = "배고픔";
    } else if (stats.happiness < 20) {
        status = "우울함";
    } else if (stats.affection < 20) {
        status = "외로움";
    } else if (stats.hunger > 80 && stats.happiness > 80 && stats.affection > 80) {
        status = "최상의 상태";
    } else if (stats.hunger > 60 && stats.happiness > 60 && stats.affection > 60) {
        status = "행복한 상태";
    }

    characterStatus.textContent = status;
}

// 스탯 리셋
export function resetStats() {
  stats = { affection: 50, hunger: 50, happiness: 50 };
  if (Character.currentCharacter) {
    characterStats[Character.currentCharacter.name] = { ...stats };
  }
  updateStatsDisplay();
}

// characterStats 변수 내보내기 (다른 모듈에서 접근할 수 있도록).
export { characterStats };
