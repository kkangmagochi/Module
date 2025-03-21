// character.js
import * as Storage from './storage.js';
import * as Stats from './stats.js';  // Stats 모듈 import
import * as Dialog from './dialog.js';


let characters = [];
let currentCharacter = null;
let characterStats = {}; //캐릭터별 스텟

// 캐릭터 데이터 내보내기 (다른 모듈에서 접근 가능)
export { characters, currentCharacter, characterStats };

// 캐릭터 생성
export function createCharacter(name, image, type, genre, tone, lore, personality, speechStyle) {
  const newCharacter = {
    name: name,
    image: image,
    type: type,
    genre: genre,
    tone: tone,
    lore: lore,
    personality: personality,
    speechStyle: speechStyle,
    customDialog: '',
    customGift: ''
  };

  characters.push(newCharacter);
  Storage.saveToLocalStorage(); // 로컬 스토리지 업데이트
  return newCharacter;
}

// 캐릭터 수정
export function updateCharacter(index, updatedCharacter) {
     // 캐릭터 이름 변경 시 스탯도 함께 업데이트 (Stats 모듈의 characterStats 사용)
    if (characters[index].name !== updatedCharacter.name) {
        if (Stats.characterStats[characters[index].name]) { // Stats.characterStats 사용
            Stats.characterStats[updatedCharacter.name] = { ...Stats.characterStats[characters[index].name] };
            delete Stats.characterStats[characters[index].name];
        }
    }

    // 현재 캐릭터가 수정한 캐릭터인 경우 업데이트
    if (currentCharacter && currentCharacter.name === characters[index].name) {
        currentCharacter = updatedCharacter;
    }


    characters[index] = updatedCharacter;
    Storage.saveToLocalStorage();  // 로컬 스토리지 업데이트
}

// 캐릭터 로드
export function loadCharacter(index) {
    currentCharacter = characters[index];

    // 캐릭터별 스탯 로드 (Stats 모듈의 loadCharacterStats 사용)
    Stats.loadCharacterStats(currentCharacter.name);
    Storage.saveToLocalStorage();
}


// 캐릭터 저장
export function saveCharacter() {
  Storage.saveToLocalStorage();
}

// 현재 캐릭터 표시
export function displayCurrentCharacter() {
  const characterImage = document.getElementById('character-image');
  const noCharacterDisplay = document.getElementById('no-character');
  const characterContainer = document.getElementById('character-container');
  const gameTitle = document.getElementById('game-title');
  const currentCharacterName = document.getElementById('current-character-name');
  const profileCharacterName = document.getElementById('profile-character-name');
  const profilePreviewImg = document.getElementById('profile-preview-img');
  const customDialogInput = document.getElementById('custom-dialog');
  const customGiftList = document.getElementById('custom-gift');
  const profileImage = document.getElementById('profile-image');

  if (currentCharacter) {
    characterImage.src = currentCharacter.image;
    noCharacterDisplay.classList.remove('show');
    noCharacterDisplay.classList.add('hide');
    characterContainer.classList.remove('hide');
    characterContainer.classList.add('show');

    // 프로필 이미지 설정
    if (currentCharacter.profileImage) {
      profileImage.src = currentCharacter.profileImage;
    } else {
      profileImage.src = currentCharacter.image;
    }

    // 게임 타이틀 업데이트
    updateGameTitle();

    // 현재 캐릭터 이름 설정 창에 표시
    currentCharacterName.textContent = currentCharacter.name;
    profileCharacterName.textContent = currentCharacter.name;
    profilePreviewImg.src = currentCharacter.profileImage || currentCharacter.image;

    // 설정 로드
    if (currentCharacter.customDialog) {
      customDialogInput.value = currentCharacter.customDialog;
    } else {
      customDialogInput.value = '';
    }

    if (currentCharacter.customGift) {
      customGiftList.value = currentCharacter.customGift;
    } else {
      customGiftList.value = '';
    }

    // 캐릭터별 스탯 로드 (Stats 모듈에서 처리)
    Stats.loadCharacterStats(currentCharacter.name);

     // 좋아하는 선물 목록 표시
      renderFavoriteGifts();

  } else {
    noCharacterDisplay.classList.remove('hide');
    noCharacterDisplay.classList.add('show');
    characterContainer.classList.remove('show');
    characterContainer.classList.add('hide');

    // 게임 타이틀 업데이트
    updateGameTitle();

    // 설정 창 초기화
    currentCharacterName.textContent = '없음';
    profileCharacterName.textContent = '없음';
    customDialogInput.value = '';
    customGiftList.value = '';
    profilePreviewImg.src = '';
  }
    // Stats 모듈의 updateStatsDisplay 호출 (스탯 표시 업데이트)
    Stats.updateStatsDisplay();
}

// 게임 타이틀 업데이트
function updateGameTitle() {
    const gameTitle = document.getElementById('game-title');
    if (currentCharacter) {
        gameTitle.textContent = `${currentCharacter.name} 키우기`;
        document.title = `${currentCharacter.name} 키우기`;
    } else {
        gameTitle.textContent = '깡통 키우기';
        document.title = '깡통 키우기';
    }
}

// 캐릭터 프롬프트 생성
export function createCharacterPrompt(action, additionalContext = '') {
  if (!currentCharacter) return "";

  let prompt = `당신은 이제부터 '${currentCharacter.name}'이라는 캐릭터가 되어 응답해주세요. 다음 캐릭터 정보를 바탕으로 성격과 말투를 완벽히 재현해 주세요.\n\n`;

  // 캐릭터 기본 정보 추가
  if (currentCharacter.type === 'existing') {
    prompt += `캐릭터 유형: 기존 작품의 캐릭터\n`;
  } else {
    prompt += `캐릭터 유형: 오리지널 캐릭터\n`;
  }

  if (currentCharacter.genre) {
    prompt += `장르: ${currentCharacter.genre}\n`;
  }
  if (currentCharacter.tone) {
    prompt += `말투: ${currentCharacter.tone}\n`;
  }
  if (currentCharacter.lore) {
    prompt += `세계관: ${currentCharacter.lore}\n`;
  }
  if (currentCharacter.personality) {
    prompt += `성격: ${currentCharacter.personality}\n`;
  }
  if (currentCharacter.speechStyle) {
    prompt += `말투 특징: ${currentCharacter.speechStyle}\n`;
  }

  // 현재 캐릭터 상태 정보 추가 (Stats 모듈에서 가져옴)
    const stats = Stats.getStats(); // Stats 모듈에서 현재 스탯 가져오기
    prompt += `\n현재 캐릭터 상태:
- 호감도: ${stats.affection}/100 (${stats.affection < 30 ? '매우 낮음' : stats.affection < 60 ? '보통' : '높음'})
- 허기: ${stats.hunger}/100 (${stats.hunger < 30 ? '매우 배고픔' : stats.hunger < 60 ? '약간 배고픔' : '배부름'})
- 행복도: ${stats.happiness}/100 (${stats.happiness < 30 ? '우울함' : stats.happiness < 60 ? '보통' : '행복함'})\n`;

  // 상황별 추가 컨텍스트 제공
  prompt += `\n현재 상황: 사용자가 ${action}을(를) 했습니다. ${additionalContext}\n`;

  // 응답 요청 사항
  prompt += `\n${currentCharacter.name}의 반응을 다음 지침에 맞게 생성해주세요:
1. 캐릭터의 성격, 말투, 현재 상태를 정확히 반영할 것
2. 매번 다른 느낌의 대사를 생성할 것 (문장 구조와 어투를 다양하게 변화시킬 것)
3. 상황과 감정을 생생하게 표현할 것
4. 정형화된 문장이나 패턴을 반복하지 말 것
5. 현재 상태(호감도, 허기, 행복도)에 적합한 감정 상태를 반영할 것
6. 한 문장에서 세 문장 사이로 간결하게 응답할 것

캐릭터의 대사만 작성하고, 다른 설명은 포함하지 마세요.`;

  return prompt;
}


// 좋아하는 선물 목록 표시
export function renderFavoriteGifts() {
  const favoriteGiftsList = document.getElementById('favorite-gifts-list');
  favoriteGiftsList.innerHTML = '';

  if (!currentCharacter || !currentCharacter.customGift) return;

  const gifts = currentCharacter.customGift.split(',').map(gift => gift.trim());

  gifts.forEach(gift => {
    if (gift === '') return;

    const giftTag = document.createElement('div');
    giftTag.className = 'gift-tag';
    giftTag.textContent = gift;

    giftTag.addEventListener('click', () => {
      const customGiftInput = document.getElementById('custom-gift-input'); // customGiftInput 참조 가져오기
      customGiftInput.value = gift;
    });

    favoriteGiftsList.appendChild(giftTag);
  });
}



// 저장된 캐릭터 목록 렌더링 (UI 업데이트 함수)
export function renderSavedCharacters() {
    const savedCharactersList = document.getElementById('saved-characters-list');
    savedCharactersList.innerHTML = '';

    characters.forEach((char, index) => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';

        const img = document.createElement('img');
        img.src = char.image;
        img.alt = char.name;

        const name = document.createElement('p');
        name.textContent = char.name;

        characterCard.appendChild(img);
        characterCard.appendChild(name);

        characterCard.addEventListener('click', () => {
            loadCharacter(index);
            const characterModal = document.getElementById('character-modal'); // characterModal 참조를 가져옴
            characterModal.style.display = 'none';
        });

        savedCharactersList.appendChild(characterCard);
    });
}

// 수정할 캐릭터 선택 드롭다운 채우기 (UI 업데이트 함수)
export function populateEditCharacterSelect() {
    const editCharacterSelect = document.getElementById('edit-character-select');
    editCharacterSelect.innerHTML = '';
    characters.forEach((char, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = char.name;
        editCharacterSelect.appendChild(option);
    });
}

// characters, currentCharacter 변수 내보내기 (다른 모듈에서 접근할 수 있도록)
export { characters, currentCharacter };
