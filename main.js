// main.js

import * as Character from './character.js';
import * as Stats from './stats.js';
import * as UI from './ui.js';
import * as API from './api.js';
import * as Storage from './storage.js';
import * as Dialog from './dialog.js';
import * as Animation from './animation.js';

document.addEventListener('DOMContentLoaded', () => {
    // 로컬 스토리지에서 데이터 로드
    Storage.loadFromLocalStorage();

    // 초기 캐릭터 표시 및 스탯 업데이트
    Character.displayCurrentCharacter();
    Stats.updateStatsDisplay();

    // UI 이벤트 리스너 및 초기화
    UI.init(
        Character.loadCharacter,
        Character.saveCharacter,
        Character.updateCharacter,
        Character.displayCurrentCharacter,
        Stats.updateStatsDisplay,
        Stats.resetStats,
        Dialog.addToDialogLogs,
        Dialog.renderDialogLogs,
        API.testApiConnection,
        API.generateDialogs,
        API.generateGifts,
        Animation.animateCharacter,
        Animation.playNightAnimation,
        API.callGeminiAPI,
        Character.createCharacterPrompt,  // API 모듈에서 필요한 함수 참조
        Character.renderFavoriteGifts,    // UI 모듈에서 필요한 함수 참조
    );

    // API 연결 상태 확인 및 초기화
    if (Storage.getApiKey()) {
        API.testApiConnection();
    }

    // 기타 초기화 (필요한 경우)
});
