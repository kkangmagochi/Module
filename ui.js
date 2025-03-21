// ui.js
import * as Character from './character.js';
import * as API from './api.js';
import * as Dialog from './dialog.js';
import * as Animation from './animation.js';
import * as Storage from './storage.js';

// DOM 요소 및 이벤트 리스너 관리
export function init(
    loadCharacter,
    saveCharacter,  // 사용하지 않음 (삭제)
    updateCharacter,
    displayCurrentCharacter, // Character 모듈에서 직접 호출
    updateStatsDisplay,     // Stats 모듈에서 직접 호출
    resetStats,
    addToDialogLogs,
    renderDialogLogs,
    testApiConnection,
    generateDialogs,
    generateGifts,
    animateCharacter,
    playNightAnimation,
    callGeminiAPI,       // API 모듈에서 직접 호출
    createCharacterPrompt,  // Character 또는 API 모듈에서 직접 호출
    renderFavoriteGifts     // Character 모듈에서 직접 호출
) {

    // DOM 요소 (간소화)
    const characterImage = document.getElementById('character-image');
    const speechBubble = document.getElementById('speech-bubble');
    const characterSpeech = document.getElementById('character-speech');
    const customGiftInput = document.getElementById('custom-gift-input');

    // 액션 버튼
    const feedButton = document.getElementById('feed-button');
    const playButton = document.getElementById('play-button');
    const giftButton = document.getElementById('gift-button');
    const sleepButton = document.getElementById('sleep-button');
    const giveGiftBtn = document.getElementById('give-gift-btn');

    // 컨트롤 버튼
    const characterUploadBtn = document.getElementById('character-upload-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const apiConnectionBtn = document.getElementById('api-connection-btn');
    const profileBtn = document.getElementById('profile-btn');
    const shareBtn = document.getElementById('share-btn');
    const dialogLogsBtn = document.getElementById('dialog-logs-btn');

    // 모달
    const characterModal = document.getElementById('character-modal');
    const settingsModal = document.getElementById('settings-modal');
    const apiModal = document.getElementById('api-modal');
    const profileModal = document.getElementById('profile-modal');
    const shareModal = document.getElementById('share-modal');
    const editCharacterModal = document.getElementById('edit-character-modal');
    const dialogLogsModal = document.getElementById('dialog-logs-modal');

    // 모달 닫기 버튼
    const closeButtons = document.querySelectorAll('.close');

    // 캐릭터 업로드 폼
    const characterNameInput = document.getElementById('character-name');
    const characterImgInput = document.getElementById('character-img');
    const characterTypeExisting = document.getElementById('character-type-existing');
    const characterTypeOriginal = document.getElementById('character-type-original');
    const characterGenreInput = document.getElementById('character-genre');
    const characterToneInput = document.getElementById('character-tone');
    const characterLoreInput = document.getElementById('character-lore');
    const characterPersonalityInput = document.getElementById('character-personality');
    const characterSpeechStyleInput = document.getElementById('character-speech-style');
    const saveCharacterBtn = document.getElementById('save-character');
    const editCharacterBtn = document.getElementById('edit-character-btn');

    // 설정 폼
    const saveSettingsBtn = document.getElementById('save-settings');
    const generateDialogBtn = document.getElementById('generate-dialog-btn');
    const generateGiftsBtn = document.getElementById('generate-gifts-btn');

    // 캐릭터 수정 폼
    const editCharacterSelect = document.getElementById('edit-character-select');
    const editCharacterNameInput = document.getElementById('edit-character-name');
    const editCharacterImgInput = document.getElementById('edit-character-img');
    const editCharacterTypeExisting = document.getElementById('edit-character-type-existing');
    const editCharacterTypeOriginal = document.getElementById('edit-character-type-original');
    const editCharacterGenreInput = document.getElementById('edit-character-genre');
    const editCharacterToneInput = document.getElementById('edit-character-tone');
    const editCharacterLoreInput = document.getElementById('edit-character-lore');
    const editCharacterPersonalityInput = document.getElementById('edit-character-personality');
    const editCharacterSpeechStyleInput = document.getElementById('edit-character-speech-style');
    const updateCharacterBtn = document.getElementById('update-character');

    // API 폼
    const apiKeyInput = document.getElementById('api-key');
    const connectApiBtn = document.getElementById('connect-api');
    const testMessageInput = document.getElementById('test-message');
    const testApiBtn = document.getElementById('test-api');
    const apiResponse = document.getElementById('api-response');
    const modelFlashRadio = document.getElementById('model-flash');
    const modelProRadio = document.getElementById('model-pro');

    // 프로필 설정
    const profileImgInput = document.getElementById('profile-img');
    const saveProfileBtn = document.getElementById('save-profile');


    // 이벤트 리스너 등록 (함수 형태로 묶어서 관리)

    function setupActionButtons() {
        characterImage.addEventListener('click', handleCharacterClick);
        feedButton.addEventListener('click', handleFeed);
        playButton.addEventListener('click', handlePlay);
        giftButton.addEventListener('click', handleGift);
        sleepButton.addEventListener('click', handleSleep);
        giveGiftBtn.addEventListener('click', handleCustomGift);
        statsResetBtn.addEventListener('click', handleResetStats);
    }

    function setupControlButtons() {
        characterUploadBtn.addEventListener('click', () => characterModal.style.display = 'block');
        settingsBtn.addEventListener('click', () => settingsModal.style.display = 'block');
        apiConnectionBtn.addEventListener('click', () => apiModal.style.display = 'block');
        profileBtn.addEventListener('click', () => profileModal.style.display = 'block');
        shareBtn.addEventListener('click', () => shareModal.style.display = 'block');
        dialogLogsBtn.addEventListener('click', () => {
            dialogLogsModal.style.display = 'block';
            renderDialogLogs();
        });
        editCharacterBtn.addEventListener('click', () => {
            Character.populateEditCharacterSelect();
            editCharacterModal.style.display = 'block';
        });
    }

    function setupModalCloseButtons() {
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

     function setupCharacterForm() {
        saveCharacterBtn.addEventListener('click', handleSaveCharacter);
        editCharacterSelect.addEventListener('change', handleEditCharacterSelect);
        updateCharacterBtn.addEventListener('click', handleUpdateCharacter);
    }

    function setupSettingsForm() {
        saveSettingsBtn.addEventListener('click', handleSaveSettings);
        generateDialogBtn.addEventListener('click', generateDialogs); // API 함수 직접 호출
        generateGiftsBtn.addEventListener('click', generateGifts);     // API 함수 직접 호출
    }
    function setupApiForm(){
        connectApiBtn.addEventListener('click', handleConnectApi);
        testApiBtn.addEventListener('click', handleTestApi);
        modelFlashRadio.addEventListener('change', handleModelChange);
        modelProRadio.addEventListener('change', handleModelChange);
    }

    function setupProfileForm(){
        saveProfileBtn.addEventListener('click', handleSaveProfile);
    }

    // 이벤트 핸들러 함수들
    async function handleCharacterClick() {
        if (!Character.currentCharacter) return;
        animateCharacter();
        try {
            if (API.apiConnected) {
                const aiResponse = await API.generateAIResponse("click"); // API 모듈 함수 직접호출
                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "클릭");
                    return;
                }
            }
        } catch (error) {
            console.error("캐릭터 클릭 이벤트 오류:", error);
        }
        const defaultResponse = getRandomDialog();
        showSpeechBubble(defaultResponse);
        addToDialogLogs(defaultResponse, "클릭");
    }

    async function handleFeed() {
        if (!Character.currentCharacter) return;

        // 스탯 변경 (Stats 모듈 사용)
        const currentStats = { ...Storage.getStats() };
        currentStats.hunger = Math.min(100, currentStats.hunger + 20);
        currentStats.happiness = Math.min(100, currentStats.happiness + 5);
        Stats.updateStats(currentStats); // Stats 모듈 함수 직접 호출


        // 애니메이션 실행
        animateCharacter();

        // AI 응답 (API 모듈 함수 직접 호출)
        try {
            if (API.apiConnected) {
                const aiResponse = await API.generateAIResponse("feed");
                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "밥주기");
                    return;
                }
            }
        } catch (error) {
            console.error("밥주기 이벤트 오류:", error);
        }

        const hungerLevel = currentStats.hunger;
        let response = (hungerLevel < 30) ? '와, 정말 배고팠어요! 감사합니다!' :
                       (hungerLevel > 80) ? '으, 배가 너무 불러요... 그래도 고마워요.' :
                       '맛있어요! 감사합니다!';
        showSpeechBubble(response);
        addToDialogLogs(response, "밥주기");
    }

    async function handlePlay() {
         if (!Character.currentCharacter) return;

        const currentStats = { ...Storage.getStats() };
        currentStats.happiness = Math.min(100, currentStats.happiness + 20);
        currentStats.affection = Math.min(100, currentStats.affection + 10);
        currentStats.hunger = Math.max(0, currentStats.hunger - 5);
        Stats.updateStats(currentStats);

        animateCharacter();

        try {
            if (API.apiConnected) {
                const aiResponse = await API.generateAIResponse("play");
                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "놀아주기");
                    return;
                }
            }
        } catch (error) {
            console.error("놀아주기 이벤트 오류:", error);
        }

        const defaultResponse = getRandomDialog();
        showSpeechBubble(defaultResponse);
        addToDialogLogs(defaultResponse, "놀아주기");
    }

    async function handleGift() {
       if (!Character.currentCharacter) return;

        const currentStats = { ...Storage.getStats() };
        currentStats.affection = Math.min(100, currentStats.affection + 20);
        currentStats.happiness = Math.min(100, currentStats.happiness + 15);
        Stats.updateStats(currentStats);

        const gift = getRandomGift();
        animateCharacter();

        try {
            if (API.apiConnected) {
                const aiResponse = await API.generateAIResponse("gift");
                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "선물주기 (" + gift + ")");
                    return;
                }
            }
        } catch (error) {
            console.error("선물주기 이벤트 오류:", error);
        }

        const response = `${gift}! 정말 좋아해요!`;
        showSpeechBubble(response);
        addToDialogLogs(response, "선물주기 (" + gift + ")");
    }

    async function handleSleep() {
        if (!Character.currentCharacter) return;

        playNightAnimation();

        let aiResponse = null;
        try {
            if (API.apiConnected) {
                aiResponse = await API.generateAIResponse("sleep");
            }
        } catch (error) {
            console.error("잠자기 이벤트 오류:", error);
        }

        setTimeout(() => {
            const currentStats = { ...Storage.getStats() };
            currentStats.hunger = Math.max(0, currentStats.hunger - 30);

            if (currentStats.hunger < 20) {
                currentStats.happiness = Math.max(0, currentStats.happiness - 25);
                currentStats.affection = Math.max(0, currentStats.affection - 15);

                const response = aiResponse || '배고파요... 밥 주세요ㅠㅠ';
                 showSpeechBubble(response);
                addToDialogLogs(response, "잠자기");

            } else {
                currentStats.happiness = Math.min(100, currentStats.happiness + 15);
                currentStats.affection = Math.min(100, currentStats.affection + 10);

                const response = aiResponse || '잘 잤어요! 기분이 좋아요!';
                showSpeechBubble(response);
                addToDialogLogs(response, "잠자기");
            }

            Stats.updateStats(currentStats);
        }, 1500);
    }

    async function handleCustomGift() {
        if (!Character.currentCharacter) return;

        const customGift = customGiftInput.value.trim();
        if (customGift === '') {
            alert('선물 이름을 입력해주세요.');
            return;
        }

        const currentStats = { ...Storage.getStats() };
        currentStats.affection = Math.min(100, currentStats.affection + 15);
        currentStats.happiness = Math.min(100, currentStats.happiness + 10);
        Stats.updateStats(currentStats);

        animateCharacter();

        try {
            if (API.apiConnected) {
                const aiResponse = await API.generateAIResponse("customGift");
                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "선물주기 (" + customGift + ")");
                    customGiftInput.value = '';
                    return;
                }
            }
        } catch (error) {
            console.error("커스텀 선물주기 이벤트 오류:", error);
        }

        const response = `${customGift}! 정말 좋아해요!`;
        showSpeechBubble(response);
        addToDialogLogs(response, "선물주기 (" + customGift + ")");
        customGiftInput.value = '';
    }

    function handleResetStats() {
        if (!Character.currentCharacter) return;

        if (confirm('정말 스탯을 초기화하시겠습니까?')) {
            resetStats(); // Stats 모듈 함수 직접 호출
            showSpeechBubble('스탯이 초기화되었어요!');
        }
    }

    function handleSaveCharacter() {
      const name = characterNameInput.value.trim();
      const fileInput = characterImgInput;

      if (name === '' || !fileInput.files || fileInput.files.length === 0) {
          alert('캐릭터 이름과 이미지를 모두 입력해주세요.');
          return;
      }

      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
          const newCharacter = Character.createCharacter( // Character 모듈 함수 직접 호출
              name,
              e.target.result,
              characterTypeExisting.checked ? 'existing' : 'original',
              characterGenreInput.value.trim(),
              characterToneInput.value.trim(),
              characterLoreInput.value.trim(),
              characterPersonalityInput.value.trim(),
              characterSpeechStyleInput.value.trim()
          );

          // 폼 초기화
          characterNameInput.value = '';
          fileInput.value = '';
          characterGenreInput.value = '';
          characterToneInput.value = '';
          characterLoreInput.value = '';
          characterPersonalityInput.value = '';
          characterSpeechStyleInput.value = '';

          // 새 캐릭터를 현재 캐릭터로 설정하고 UI 업데이트
          Character.currentCharacter = newCharacter;
          displayCurrentCharacter();
          Character.renderSavedCharacters();  // UI 업데이트
          Character.populateEditCharacterSelect(); // UI 업데이트

          characterModal.style.display = 'none'; // 모달 닫기
      };

      reader.readAsDataURL(file);
  }

    function handleEditCharacterSelect() {
      const selectedIndex = editCharacterSelect.value;
      const editCharacterForm = document.getElementById('edit-character-form');
      const currentCharacterImg = document.getElementById('current-character-img');


      if (selectedIndex === "") {
          editCharacterForm.style.display = 'none';
          return;
      }

      const selectedCharacter = Character.characters[selectedIndex];

      editCharacterNameInput.value = selectedCharacter.name;
      currentCharacterImg.src = selectedCharacter.image;

      if (selectedCharacter.type === 'existing') {
          editCharacterTypeExisting.checked = true;
      } else {
          editCharacterTypeOriginal.checked = true;
      }

      editCharacterGenreInput.value = selectedCharacter.genre || '';
      editCharacterToneInput.value = selectedCharacter.tone || '';
      editCharacterLoreInput.value = selectedCharacter.lore || '';
      editCharacterPersonalityInput.value = selectedCharacter.personality || '';
      editCharacterSpeechStyleInput.value = selectedCharacter.speechStyle || '';

      editCharacterForm.style.display = 'block';
  }

    function handleUpdateCharacter() {
      const selectedIndex = editCharacterSelect.value;

      if (selectedIndex === "") {
          alert('수정할 캐릭터를 선택해주세요.');
          return;
      }

      const index = parseInt(selectedIndex);
      const name = editCharacterNameInput.value.trim();

      if (name === '') {
          alert('캐릭터 이름은 필수입니다.');
          return;
      }

      const updatedCharacter = {
          ...Character.characters[index],
          name: name,
          type: editCharacterTypeExisting.checked ? 'existing' : 'original',
          genre: editCharacterGenreInput.value.trim(),
          tone: editCharacterToneInput.value.trim(),
          lore: editCharacterLoreInput.value.trim(),
          personality: editCharacterPersonalityInput.value.trim(),
          speechStyle: editCharacterSpeechStyleInput.value.trim()
      };

      const fileInput = editCharacterImgInput;

      if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const reader = new FileReader();

          reader.onload = function (e) {
              updatedCharacter.image = e.target.result;
              finalizeCharacterUpdate(index, updatedCharacter);
          };

          reader.readAsDataURL(file);
      } else {
          finalizeCharacterUpdate(index, updatedCharacter);
      }
  }

    function finalizeCharacterUpdate(index, updatedCharacter) {
        updateCharacter(index, updatedCharacter);
        Character.renderSavedCharacters();
        Character.populateEditCharacterSelect();

        if (Character.currentCharacter && Character.currentCharacter.name === updatedCharacter.name) {
            displayCurrentCharacter(); // Character 모듈 함수 직접 호출
        }

        editCharacterModal.style.display = 'none';
        alert('캐릭터가 성공적으로 수정되었습니다.');
    }

    function handleSaveSettings() {
      if (!Character.currentCharacter) {
          alert('먼저 캐릭터를 선택해주세요.');
          return;
      }

      Character.currentCharacter.customDialog = customDialogInput.value.trim();
      Character.currentCharacter.customGift = customGiftList.value.trim();

      const index = Character.characters.findIndex(char => char.name === Character.currentCharacter.name);
      if (index !== -1) {
          Character.characters[index] = Character.currentCharacter;
      }

      Storage.saveToLocalStorage();
      Character.renderFavoriteGifts();
      settingsModal.style.display = 'none';
      showSpeechBubble('설정이 저장되었어요!');
  }

  function handleConnectApi() {
    const apiKey = apiKeyInput.value.trim();
    Storage.setApiKey(apiKey);
    testApiConnection(); // API 모듈 함수 직접 호출
  }

  function handleTestApi(){
    const testMessage = testMessageInput.value.trim();

      if (testMessage === '') {
          alert('테스트 메시지를 입력해주세요.');
          return;
      }

      if (!API.apiConnected) {
          alert('먼저 API를 연결해주세요.');
          return;
      }

      apiResponse.innerHTML = '<p>API 호출 중...</p>';

      let characterName = Character.currentCharacter ? Character.currentCharacter.name : '다마고치';

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${API.selectedModel}:generateContent?key=${Storage.getApiKey()}`;

      fetch(apiUrl, {  //fetch함수도 handleConnectApi와 handleTestApi에서 중복되니, 별도의 함수로 빼는것이 좋음.
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              contents: [{
                  parts: [{
                      text: `당신은 이제부터 ${characterName}이라는 캐릭터가 되어서 대화해주세요. 사용자 메시지: ${testMessage}`
                  }]
              }],
              generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 100
              }
          })
      })
      .then(response => {
          if (!response.ok) {
              return response.json().then(errorData => {
                  throw new Error(`API 요청 실패: ${errorData.error?.message || '알 수 없는 오류'}`);
              });
          }
          return response.json();
      })
      .then(data => {
          if (data.candidates && data.candidates[0].content) {
              const aiResponse = data.candidates[0].content.parts[0].text;
              apiResponse.innerHTML = `<p>${aiResponse}</p>`;
          } else {
              apiResponse.innerHTML = '<p>API 응답이 올바른 형식이 아닙니다.</p>';
          }
      })
      .catch(error => {
          apiResponse.innerHTML = `<p>오류 발생: ${error.message}</p>`;
      });
  }

  function handleModelChange(){
    if (this.checked) {
        Storage.setSelectedModel(this.id === 'model-flash' ? 'gemini-2.0-flash' : 'gemini-2.0-pro-exp-02-05');
    }
  }

  function handleSaveProfile(){
    if (!Character.currentCharacter) {
      alert('먼저 캐릭터를 선택해주세요.');
      return;
    }

    const fileInput = profileImgInput;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function(e) {
        Character.currentCharacter.profileImage = e.target.result;
        // 프로필 이미지 UI 업데이트
        const profileImage = document.getElementById('profile-image');
        const profilePreviewImg =  document.getElementById('profile-preview-img');
        profileImage.src = Character.currentCharacter.profileImage;
        profilePreviewImg.src = Character.currentCharacter.profileImage;

        Storage.saveToLocalStorage();
        profileModal.style.display = 'none'; // 모달 닫기
        showSpeechBubble('프로필 사진이 저장되었어요!');
      }
      reader.readAsDataURL(file);
    } else {
      alert('프로필 이미지를 선택해주세요.');
    }
  }


    // 기타 함수 (내부 함수로 유지)
    function showSpeechBubble(text) {
        characterSpeech.textContent = text;
        speechBubble.classList.remove('hide');
        setTimeout(() => speechBubble.classList.add('hide'), 5000);
    }

    function getRandomDialog() {
      const defaultDialogs = [
          "오늘은 날씨가 좋네요!",
          "같이 놀아요!",
          "뭐하고 있어요?",
          "기분이 좋아요!",
          "심심해요~"
      ];
        if (!Character.currentCharacter) return defaultDialogs[Math.floor(Math.random() * defaultDialogs.length)];

        let dialogs = defaultDialogs;
        if (Character.currentCharacter.customDialog && Character.currentCharacter.customDialog.trim() !== '') {
            dialogs = Character.currentCharacter.customDialog.split(',').map(dialog => dialog.trim());
            if (dialogs.length === 0 || (dialogs.length === 1 && dialogs[0] === '')) {
                dialogs = defaultDialogs;
            }
        }
        return dialogs[Math.floor(Math.random() * dialogs.length)];
    }

    function getRandomGift() {
        const defaultGifts = [
            "귀여운 인형",
            "맛있는 초콜릿",
            "예쁜 꽃",
            "특별한 책",
            "멋진 옷"
        ];
        if (!Character.currentCharacter) return defaultGifts[Math.floor(Math.random() * defaultGifts.length)];

        let gifts = defaultGifts;
        if (Character.currentCharacter.customGift && Character.currentCharacter.customGift.trim() !== '') {
            gifts = Character.currentCharacter.customGift.split(',').map(gift => gift.trim());
            if (gifts.length === 0 || (gifts.length === 1 && gifts[0] === '')) {
                gifts = defaultGifts;
            }
        }
        return gifts[Math.floor(Math.random() * gifts.length)];
    }

      // window 클릭 이벤트 (모달 닫기)
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {  // classList 사용
        event.target.style.display = 'none';
      }
    });


    // 초기화 함수 호출 (이벤트 리스너 등록)
    setupActionButtons();
    setupControlButtons();
    setupModalCloseButtons();
    setupCharacterForm();
    setupSettingsForm();
    setupApiForm();
    setupProfileForm();
}
