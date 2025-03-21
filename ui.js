// ui.js
import * as Character from './character.js';
import * as API from './api.js';
import * as Dialog from './dialog.js';
import * as Animation from './animation.js';
import * as Storage from './storage.js';



// DOM 요소 및 이벤트 리스너 관리
export function init(
    loadCharacter,
    saveCharacter,
    updateCharacter,
    displayCurrentCharacter,
    updateStatsDisplay,
    resetStats,
    addToDialogLogs,
    renderDialogLogs,
    testApiConnection,
    generateDialogs,
    generateGifts,
    animateCharacter,
    playNightAnimation,
    callGeminiAPI,
    createCharacterPrompt,
    renderFavoriteGifts) {


    // DOM 요소
    const characterContainer = document.getElementById('character-container');
    const noCharacterDisplay = document.getElementById('no-character');
    const characterImage = document.getElementById('character-image');
    const speechBubble = document.getElementById('speech-bubble');
    const characterSpeech = document.getElementById('character-speech');
    const gameTitle = document.getElementById('game-title');
    const affectionBar = document.getElementById('affection-bar');
    const hungerBar = document.getElementById('hunger-bar');
    const happinessBar = document.getElementById('happiness-bar');
    const affectionValue = document.getElementById('affection-value');
    const hungerValue = document.getElementById('hunger-value');
    const happinessValue = document.getElementById('happiness-value');
    const daysCountDisplay = document.getElementById('days-count');
    const characterStatus = document.getElementById('character-status-text');
    const profileImage = document.getElementById('profile-image');
    const statsResetBtn = document.getElementById('stats-reset-btn');

    // 액션 버튼
    const feedButton = document.getElementById('feed-button');
    const playButton = document.getElementById('play-button');
    const giftButton = document.getElementById('gift-button');
    const sleepButton = document.getElementById('sleep-button');
    const customGiftInput = document.getElementById('custom-gift-input');
    const giveGiftBtn = document.getElementById('give-gift-btn');

    // 컨트롤 버튼
    const characterUploadBtn = document.getElementById('character-upload-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const apiConnectionBtn = document.getElementById('api-connection-btn');
    const profileBtn = document.getElementById('profile-btn');
    const shareBtn = document.getElementById('share-btn');
    const dialogLogsBtn = document.getElementById('dialog-logs-btn'); // 대화 로그 버튼

    // 모달
    const characterModal = document.getElementById('character-modal');
    const settingsModal = document.getElementById('settings-modal');
    const apiModal = document.getElementById('api-modal');
    const profileModal = document.getElementById('profile-modal');
    const shareModal = document.getElementById('share-modal');
    const editCharacterModal = document.getElementById('edit-character-modal');
    const dialogLogsModal = document.getElementById('dialog-logs-modal'); // 대화 로그 모달
    const nightOverlay = document.getElementById('night-overlay');

    // 모달 닫기 버튼
    const closeButtons = document.querySelectorAll('.close');

    // 대화 로그 관련 요소
    const dialogLogsList = document.getElementById('dialog-logs-list');

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
    const savedCharactersList = document.getElementById('saved-characters-list');
    const editCharacterBtn = document.getElementById('edit-character-btn');

    // 설정 폼
    const currentCharacterName = document.getElementById('current-character-name');
    const customDialogInput = document.getElementById('custom-dialog');
    const customGiftList = document.getElementById('custom-gift');
    const saveSettingsBtn = document.getElementById('save-settings');
    const generateDialogBtn = document.getElementById('generate-dialog-btn');
    const generateGiftsBtn = document.getElementById('generate-gifts-btn');
    const dialogGenerationStatus = document.getElementById('dialog-generation-status');
    const giftGenerationStatus = document.getElementById('gift-generation-status');

    // 캐릭터 수정 폼
    const editCharacterSelect = document.getElementById('edit-character-select');
    const editCharacterForm = document.getElementById('edit-character-form');
    const editCharacterNameInput = document.getElementById('edit-character-name');
    const editCharacterImgInput = document.getElementById('edit-character-img');
    const currentCharacterImg = document.getElementById('current-character-img');
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
    const connectionStatus = document.getElementById('connection-status');
    const testMessageInput = document.getElementById('test-message');
    const testApiBtn = document.getElementById('test-api');
    const apiResponse = document.getElementById('api-response');
    const modelFlashRadio = document.getElementById('model-flash');
    const modelProRadio = document.getElementById('model-pro');

    // 프로필 설정
    const profileCharacterName = document.getElementById('profile-character-name');
    const profileImgInput = document.getElementById('profile-img');
    const saveProfileBtn = document.getElementById('save-profile');
    const profilePreviewImg = document.getElementById('profile-preview-img');

    // 이미지 공유
    const createShareImageBtn = document.getElementById('create-share-image');
    const shareImageContainer = document.getElementById('share-image-container');
    const downloadShareImageBtn = document.getElementById('download-share-image');

    // 기본 대화 및 선물 목록
    const defaultDialogs = [
        "오늘은 날씨가 좋네요!",
        "같이 놀아요!",
        "뭐하고 있어요?",
        "기분이 좋아요!",
        "심심해요~"
    ];

    const defaultGifts = [
        "귀여운 인형",
        "맛있는 초콜릿",
        "예쁜 꽃",
        "특별한 책",
        "멋진 옷"
    ];



    // 이벤트 리스너 등록

    //캐릭터 이미지 클릭
    characterImage.addEventListener('click', async () => {
        if (!Character.currentCharacter) return;

        // 애니메이션 실행
        animateCharacter();

        // AI 응답 생성 시도
        try {
            if (API.apiConnected) {
                console.log("캐릭터 클릭: AI 응답 요청 시작");
                const aiResponse = await generateAIResponse("click");
                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "클릭");
                    return;
                }
            }
        } catch (error) {
            console.error("캐릭터 클릭 이벤트 오류:", error);
        }

        // API 연결 실패 시 기본 응답 사용
        const defaultResponse = getRandomDialog();
        showSpeechBubble(defaultResponse);
        addToDialogLogs(defaultResponse, "클릭");
    });

    // 밥주기 버튼 클릭
    feedButton.addEventListener('click', async () => {
        if (!Character.currentCharacter) return;

        console.log("밥주기 버튼 클릭됨");

        // 스탯 변경 (Stats 모듈 사용)
        const currentStats = { ...Storage.getStats() }; // 현재 스탯 가져오기, 객체 복사
        currentStats.hunger = Math.min(100, currentStats.hunger + 20);
        currentStats.happiness = Math.min(100, currentStats.happiness + 5);
        updateStatsDisplay(currentStats);


        // 애니메이션 실행
        animateCharacter();

        // AI 응답 생성 시도
        try {
            if (API.apiConnected) {
                console.log("밥주기: AI 응답 요청 시작");
                const aiResponse = await generateAIResponse("feed");
                console.log("밥주기: AI 응답 결과:", aiResponse);

                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "밥주기");
                    return;
                }
            }
        } catch (error) {
            console.error("밥주기 이벤트 오류:", error);
        }

        // API 연결 실패 시 기본 응답 사용
        const hungerLevel = currentStats.hunger; // 수정된 스탯 사용
        let response;

        if (hungerLevel < 30) {
            response = '와, 정말 배고팠어요! 감사합니다!';
        } else if (hungerLevel > 80) {
            response = '으, 배가 너무 불러요... 그래도 고마워요.';
        } else {
            response = '맛있어요! 감사합니다!';
        }

        showSpeechBubble(response);
        addToDialogLogs(response, "밥주기");
    });

    // 놀아주기 버튼 클릭
    playButton.addEventListener('click', async () => {
        if (!Character.currentCharacter) return;

        console.log("놀아주기 버튼 클릭됨");

        // 스탯 변경 (Stats 모듈 사용)
        const currentStats = { ...Storage.getStats() };
        currentStats.happiness = Math.min(100, currentStats.happiness + 20);
        currentStats.affection = Math.min(100, currentStats.affection + 10);
        currentStats.hunger = Math.max(0, currentStats.hunger - 5);
        updateStatsDisplay(currentStats);

        // 애니메이션 실행
        animateCharacter();

        // AI 응답 생성 시도
        try {
            if (API.apiConnected) {
                console.log("놀아주기: AI 응답 요청 시작");
                const aiResponse = await generateAIResponse("play");
                console.log("놀아주기: AI 응답 결과:", aiResponse);

                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "놀아주기");
                    return;
                }
            }
        } catch (error) {
            console.error("놀아주기 이벤트 오류:", error);
        }

        // API 연결 실패 시 기본 응답 사용
        const defaultResponse = getRandomDialog();
        showSpeechBubble(defaultResponse);
        addToDialogLogs(defaultResponse, "놀아주기");
    });

    //선물주기 버튼 클릭
    giftButton.addEventListener('click', async () => {
        if (!Character.currentCharacter) return;

        console.log("선물주기 버튼 클릭됨");

        // 스탯 변경 (Stats 모듈 사용)
        const currentStats = { ...Storage.getStats() };
        currentStats.affection = Math.min(100, currentStats.affection + 20);
        currentStats.happiness = Math.min(100, currentStats.happiness + 15);
        updateStatsDisplay(currentStats);

        // 선물 선택
        const gift = getRandomGift();
        console.log(`선택된 랜덤 선물: ${gift}`);

        // 애니메이션 실행
        animateCharacter();

        // AI 응답 생성 시도
        try {
            if (API.apiConnected) {
                console.log("선물주기: AI 응답 요청 시작");
                const aiResponse = await generateAIResponse("gift");
                console.log("선물주기: AI 응답 결과:", aiResponse);

                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "선물주기 (" + gift + ")");
                    return;
                }
            }
        } catch (error) {
            console.error("선물주기 이벤트 오류:", error);
        }

        // API 연결 실패 시 기본 응답 사용
        const response = `${gift}! 정말 좋아해요!`;
        showSpeechBubble(response);
        addToDialogLogs(response, "선물주기 (" + gift + ")");
    });

    // 잠자기 버튼 클릭
    sleepButton.addEventListener('click', async () => {
        if (!Character.currentCharacter) return;

        console.log("잠자기 버튼 클릭됨");

        // 밤/낮 전환 애니메이션
        playNightAnimation();

        // AI 응답 생성 시도
        let aiResponse = null;
        try {
            if (API.apiConnected) {
                console.log("잠자기: AI 응답 요청 시작");
                aiResponse = await generateAIResponse("sleep");
                console.log("잠자기: AI 응답 결과:", aiResponse);
            }
        } catch (error) {
            console.error("잠자기 이벤트 오류:", error);
        }

        // 시간이 지남에 따른 스탯 변화
        setTimeout(() => {
            // 스탯 변경 (Stats 모듈 사용)
            const currentStats = { ...Storage.getStats() }; // 현재 스탯 가져오기
            // 수면 중 허기 감소
            currentStats.hunger = Math.max(0, currentStats.hunger - 30);

            // 수면에 따른 호감도와 행복도 변화
            if (currentStats.hunger < 20) {
                // 배고프면 행복도와 호감도 감소
                currentStats.happiness = Math.max(0, currentStats.happiness - 25);
                currentStats.affection = Math.max(0, currentStats.affection - 15);

                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "잠자기");
                } else {
                    const response = '배고파요... 밥 주세요ㅠㅠ';
                    showSpeechBubble(response);
                    addToDialogLogs(response, "잠자기");
                }
            } else {
                // 배부르면 행복도와 호감도 증가
                currentStats.happiness = Math.min(100, currentStats.happiness + 15);
                currentStats.affection = Math.min(100, currentStats.affection + 10);

                if (aiResponse) {
                    showSpeechBubble(aiResponse);
                    addToDialogLogs(aiResponse, "잠자기");
                } else {
                    const response = '잘 잤어요! 기분이 좋아요!';
                    showSpeechBubble(response);
                    addToDialogLogs(response, "잠자기");
                }
            }

            updateStatsDisplay(currentStats); // 변경된 스탯으로 업데이트
        }, 1500);
    });

    // 직접 선물 주기 버튼 클릭
    giveGiftBtn.addEventListener('click', async () => {
        if (!Character.currentCharacter) return;

        console.log("커스텀 선물주기 버튼 클릭됨");

        const customGift = customGiftInput.value.trim();

        if (customGift === '') {
            alert('선물 이름을 입력해주세요.');
            return;
        }

        console.log(`입력된 커스텀 선물: ${customGift}`);

        // 스탯 변경 (Stats 모듈 사용)
        const currentStats = { ...Storage.getStats() }; // 현재 스탯 가져오기
        currentStats.affection = Math.min(100, currentStats.affection + 15);
        currentStats.happiness = Math.min(100, currentStats.happiness + 10);
        updateStatsDisplay(currentStats);


        // 애니메이션 실행
        animateCharacter();

        // AI 응답 생성 시도
        try {
            if (API.apiConnected) {
                console.log("커스텀 선물주기: AI 응답 요청 시작");
                const aiResponse = await generateAIResponse("customGift");
                console.log("커스텀 선물주기: AI 응답 결과:", aiResponse);

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

        // API 연결 실패 시 기본 응답 사용
        const response = `${customGift}! 정말 좋아해요!`;
        showSpeechBubble(response);
        addToDialogLogs(response, "선물주기 (" + customGift + ")");

        // 입력 필드 초기화
        customGiftInput.value = '';
    });


    // 스탯 리셋 버튼 클릭
    statsResetBtn.addEventListener('click', () => {
        if (!Character.currentCharacter) return;

        if (confirm('정말 스탯을 초기화하시겠습니까?')) {
            resetStats();
            showSpeechBubble('스탯이 초기화되었어요!');
        }
    });

    // API 연결 버튼 클릭
    connectApiBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        Storage.setApiKey(apiKey);
        testApiConnection();
    });

    // API 테스트 버튼 클릭
    testApiBtn.addEventListener('click', () => {
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

        // Gemini API 호출 (선택된 모델 사용)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${API.selectedModel}:generateContent?key=${Storage.getApiKey()}`;

        fetch(apiUrl, {
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
    });

    // 맞춤 대화 자동 생성 버튼 클릭
    generateDialogBtn.addEventListener('click', () => {
        generateDialogs();
    });

    // 맞춤 선물 자동 생성 버튼 클릭
    generateGiftsBtn.addEventListener('click', () => {
        generateGifts();
    });


    // 캐릭터 저장 버튼 클릭
    saveCharacterBtn.addEventListener('click', () => {
        const name = characterNameInput.value.trim();
        const fileInput = characterImgInput;

        if (name === '' || !fileInput.files || fileInput.files.length === 0) {
            alert('캐릭터 이름과 이미지를 모두 입력해주세요.');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const newCharacter = Character.createCharacter(
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

            // 새 캐릭터를 현재 캐릭터로 설정
            Character.currentCharacter = newCharacter;
            displayCurrentCharacter();
             // 캐릭터 목록 및 드롭다운 업데이트
            Character.renderSavedCharacters();
            Character.populateEditCharacterSelect();

        };

        reader.readAsDataURL(file);
    });

    // 캐릭터 수정 버튼 클릭
    updateCharacterBtn.addEventListener('click', () => {
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
            // 이미지 변경 없이 업데이트
            finalizeCharacterUpdate(index, updatedCharacter);
        }
    });

    function finalizeCharacterUpdate(index, updatedCharacter) {
        updateCharacter(index, updatedCharacter);  // character.js의 updateCharacter 함수 호출
        Character.renderSavedCharacters(); // UI 업데이트
        Character.populateEditCharacterSelect(); // UI 업데이트

        if (Character.currentCharacter && Character.currentCharacter.name === updatedCharacter.name) {
            displayCurrentCharacter();
        }

        editCharacterModal.style.display = 'none';
        alert('캐릭터가 성공적으로 수정되었습니다.');
    }

    // 설정 저장 버튼 클릭
    saveSettingsBtn.addEventListener('click', () => {
        if (!Character.currentCharacter) {
            alert('먼저 캐릭터를 선택해주세요.');
            return;
        }

        // 현재 캐릭터의 설정 업데이트
        Character.currentCharacter.customDialog = customDialogInput.value.trim();
        Character.currentCharacter.customGift = customGiftList.value.trim();

        // characters 배열에서 현재 캐릭터 업데이트
        const index = Character.characters.findIndex(char => char.name === Character.currentCharacter.name);

        if (index !== -1) {
            Character.characters[index] = Character.currentCharacter;
        }

        Storage.saveToLocalStorage(); // 로컬 스토리지에 저장
        renderFavoriteGifts();        // 즐겨찾는 선물 목록 다시 렌더링
        settingsModal.style.display = 'none';

        // 저장 완료 메시지
        showSpeechBubble('설정이 저장되었어요!');
    });



    // 모달 컨트롤 (이벤트 리스너 등록)
    characterUploadBtn.onclick = function () {
        characterModal.style.display = 'block';
    };

    settingsBtn.onclick = function () {
        settingsModal.style.display = 'block';
    };

    apiConnectionBtn.onclick = function () {
        apiModal.style.display = 'block';
    };

    profileBtn.onclick = function () {
        profileModal.style.display = 'block';
    };

    shareBtn.onclick = function () {
        shareModal.style.display = 'block';
    };

    // 대화 로그 버튼 이벤트 리스너
    if (dialogLogsBtn) {
        dialogLogsBtn.onclick = function () {
            console.log("대화 로그 버튼 클릭됨");
            if (dialogLogsModal) {
                dialogLogsModal.style.display = 'block';
                renderDialogLogs(); // 최신 로그 표시
            } else {
                console.error("대화 로그 모달이 존재하지 않습니다.");
            }
        };
    }

    editCharacterBtn.onclick = function () {
       Character.populateEditCharacterSelect();
        editCharacterModal.style.display = 'block';
    };

    // 모달 닫기 버튼 이벤트 리스너
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // 수정할 캐릭터 선택 시 폼 채우기
    editCharacterSelect.addEventListener('change', function () {
        const selectedIndex = this.value;

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
    });

    // 창 외부 클릭 시 모달 닫기
    window.onclick = function (event) {
        if (event.target === characterModal) {
            characterModal.style.display = 'none';
        }
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target === apiModal) {
            apiModal.style.display = 'none';
        }
        if (event.target === profileModal) {
            profileModal.style.display = 'none';
        }
        if (event.target === shareModal) {
            shareModal.style.display = 'none';
        }
        if (event.target === editCharacterModal) {
            editCharacterModal.style.display = 'none';
        }
        if (event.target === dialogLogsModal) {
            dialogLogsModal.style.display = 'none';
        }
    };

    // 페이지 로드 시 저장된 모델 설정 반영
    function loadSavedModelSelection() {
      const selectedModel = Storage.getSelectedModel();
        if (selectedModel === 'gemini-2.0-flash') {
            modelFlashRadio.checked = true;
        } else {
            modelProRadio.checked = true;
        }
    }

    // 모델 선택 라디오 버튼 이벤트 리스너
    modelFlashRadio.addEventListener('change', function () {
        if (this.checked) {
          Storage.setSelectedModel('gemini-2.0-flash');
        }
    });

    modelProRadio.addEventListener('change', function () {
        if (this.checked) {
          Storage.setSelectedModel('gemini-2.0-pro-exp-02-05');

        }
    });


    // 랜덤 대화 선택
    function getRandomDialog() {
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

    // 랜덤 선물 선택
    function getRandomGift() {
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

    // AI 기반 반응 생성 함수
    async function generateAIResponse(action, additionalContext = '') {
        console.log(`${action} 액션에 대한 AI 응답 생성 시작`);

        if (!API.apiConnected || !Character.currentCharacter) {
            console.log("API 연결되지 않았거나 캐릭터가 선택되지 않음");
            return null;
        }

        let prompt = "";

        switch (action) {
            case "feed":
                const hungerStatus = Storage.getStats().hunger < 30 ? "매우 배고픈 상태에서 " :
                    Storage.getStats().hunger > 80 ? "이미 배부른 상태에서 " : "";
                prompt = createCharacterPrompt("밥을 줬을 때", `${hungerStatus}밥을 받았습니다.`);
                break;

            case "play":
                const happinessStatus = Storage.getStats().happiness < 30 ? "매우 우울한 상태에서 " :
                    Storage.getStats().happiness > 80 ? "이미 매우 행복한 상태에서 " : "";
                prompt = createCharacterPrompt("같이 놀아줬을 때", `${happinessStatus}사용자가 놀아주었습니다.`);
                break;

            case "gift":
                const gift = getRandomGift();
                console.log(`선물 주기: 선택된 선물 - ${gift}`);
                const affectionStatus = Storage.getStats().affection < 30 ? "호감도가 낮은 상태에서 " :
                    Storage.getStats().affection > 80 ? "이미 호감도가 높은 상태에서 " : "";
                prompt = createCharacterPrompt(`'${gift}'라는 선물을 줬을 때`, `${affectionStatus}마음에 들어할 만한 '${gift}'를 선물 받았습니다.`);
                break;

            case "sleep":
                const sleepStatus = Storage.getStats().hunger < 30 ? "배고픈 상태에서 " :
                  Storage.getStats().hunger > 80 && Storage.getStats().happiness > 60 ? "배부르고 행복한 상태에서 " : "";
                prompt = createCharacterPrompt("잠자리에 들었을 때", `${sleepStatus}잠이 들었다가 아침에 일어났습니다.`);
                break;

            case "customGift":
                const customGift = customGiftInput.value.trim();
                console.log(`커스텀 선물 주기: ${customGift}`);
                if (customGift) {
                    const likeStatus = Character.currentCharacter.customGift && Character.currentCharacter.customGift.includes(customGift) ?
                        "좋아하는 " : "처음 받아보는 ";
                    prompt = createCharacterPrompt(`'${customGift}'라는 선물을 줬을 때`, `${likeStatus}'${customGift}'를 선물 받았습니다.`);
                } else {
                    prompt = createCharacterPrompt("선물을 줬을 때", "어떤 선물인지 정확히 알 수 없는 선물을 받았습니다.");
                }
                break;

            case "click":
                prompt = createCharacterPrompt("캐릭터를 클릭했을 때", "사용자가 갑자기 자신을 건드렸습니다.");
                break;

            default:
                if (additionalContext) {
                    prompt = createCharacterPrompt(action, additionalContext);
                } else {
                    console.log(`알 수 없는 액션: ${action}`);
                    return null;
                }
        }

        try {
            console.log(`${action} 액션 프롬프트 생성 완료, API 호출 시작`);
            const response = await callGeminiAPI(prompt); // API 모듈의 함수 사용
            console.log(`${action} 액션에 대한 AI 응답 수신 성공`);
            return response;
        } catch (error) {
            console.error(`AI 응답 생성 오류 (${action}):`, error);
            return null;
        }
    }

     // 말풍선 표시
    function showSpeechBubble(text) {
        characterSpeech.textContent = text;
        speechBubble.classList.remove('hide');

        // 5초 후 말풍선 숨기기
        setTimeout(() => {
            speechBubble.classList.add('hide');
        }, 5000);
    }

    // 저장된 모델 설정 불러오기
    loadSavedModelSelection();
}
