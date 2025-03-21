// api.js
import * as Storage from './storage.js';

let apiConnected = false;
let selectedModel = 'gemini-2.0-flash'; // 기본 모델 설정


// 내보내기 (다른 모듈에서 읽기 전용)
export { apiConnected, selectedModel};


// API 연결 테스트
export function testApiConnection() {
    const connectionStatus = document.getElementById('connection-status');
    const testApiBtn = document.getElementById('test-api');
    connectionStatus.textContent = '테스트 중...';
    connectionStatus.style.color = 'orange';
    testApiBtn.disabled = true;
    apiConnected = false;


    const apiKey = Storage.getApiKey();

    if (!apiKey) {
        connectionStatus.textContent = '연결되지 않음';
        connectionStatus.style.color = 'red';
        return;
    }

    // Gemini API 엔드포인트 (선택된 모델 사용)
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;


    // 테스트 요청 전송
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: "안녕하세요. 이 메시지는 API 키가 유효한지 확인하기 위한 테스트입니다."
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
            console.log("API 응답:", data);
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                connectionStatus.textContent = '연결됨';
                connectionStatus.style.color = 'green';
                testApiBtn.disabled = false;
                apiConnected = true;
            } else {
                throw new Error('API 응답 형식이 올바르지 않습니다');
            }
        })
        .catch(error => {
            connectionStatus.textContent = `연결 실패: ${error.message}`;
            connectionStatus.style.color = 'red';
            console.error('API 연결 오류:', error);
        });
}


// Gemini API 호출 함수
export async function callGeminiAPI(prompt) {
   if (!apiConnected) {
        throw new Error("API가 연결되지 않았습니다.");
    }
    const apiKey = Storage.getApiKey(); // 로컬 스토리지에서 API 키 가져오기
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

    console.log(`선택된 모델로 API 호출: ${selectedModel}`);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 150
                }
            })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API 요청 실패: ${errorData.error?.message || '알 수 없는 오류'}`);
        }

        const data = await response.json();
        console.log("API 응답 수신:", data);

        if (data.candidates && data.candidates[0].content) {
          let responseText = data.candidates[0].content.parts[0].text;
          responseText = responseText.replace(/\n/g, ' ');  // 줄바꿈을 공백으로
          return responseText;
        } else {
            throw new Error('API 응답 형식이 올바르지 않습니다');
        }
    } catch (error) {
        console.error("API 호출 오류:", error);
        throw error;
    }
}


// 대화 자동 생성 함수
export async function generateDialogs() {
  const dialogGenerationStatus = document.getElementById('dialog-generation-status');
    if (!apiConnected || !Character.currentCharacter) {
        alert("API가 연결되지 않았거나 캐릭터가 선택되지 않았습니다.");
        return;
    }

    dialogGenerationStatus.textContent = "생성 중...";

    try {
        const prompt =
            `당신은 이제부터 '${Character.currentCharacter.name}'이라는 캐릭터의 대화를 생성해주세요. 캐릭터 정보:
${Character.currentCharacter.type === 'existing' ? '기존 작품 캐릭터' : '오리지널 캐릭터'}
${Character.currentCharacter.genre ? '장르: ' + Character.currentCharacter.genre : ''}
${Character.currentCharacter.tone ? '말투: ' + Character.currentCharacter.tone : ''}
${Character.currentCharacter.lore ? '세계관: ' + Character.currentCharacter.lore : ''}
${Character.currentCharacter.personality ? '성격: ' + Character.currentCharacter.personality : ''}
${Character.currentCharacter.speechStyle ? '말투 특징: ' + Character.currentCharacter.speechStyle : ''}

다음 지침에 따라 이 캐릭터의 다양한 대화 문장을 7개 생성해주세요:
1. 각 문장은 캐릭터의 개성이 뚜렷하게 드러나야 함
2. 다양한 상황과 감정을 표현하는 대화를 포함할 것
3. 문장 구조와 어미를 다양하게 변화시킬 것
4. 캐릭터의 특징적인 말투를 자연스럽게 반영할 것
5. 고정된 형식이나 반복되는 패턴을 피할 것

대화 문장만 쉼표(,)로 구분하여 나열해주세요. 다른 설명은 포함하지 마세요.`;

      const response = await callGeminiAPI(prompt);

      // 응답 처리
      let dialogs = response.replace(/^\d+\.\s*/gm, '').trim();
      dialogs = dialogs.replace(/\n/g, ', ').replace(/,,/g, ',');

      const customDialogInput = document.getElementById('custom-dialog');
      customDialogInput.value = dialogs;
      dialogGenerationStatus.textContent = "생성 완료!";

        setTimeout(() => {
            dialogGenerationStatus.textContent = "";
        }, 3000);
    } catch (error) {
        dialogGenerationStatus.textContent = `오류: ${error.message}`;
        console.error("대화 생성 오류:", error);
    }
}

// 선물 자동 생성 함수
export async function generateGifts() {
  const giftGenerationStatus = document.getElementById('gift-generation-status');
    if (!apiConnected || !Character.currentCharacter) {
        alert("API가 연결되지 않았거나 캐릭터가 선택되지 않았습니다.");
        return;
    }

    giftGenerationStatus.textContent = "생성 중...";

    try {
        const prompt =
            `당신은 이제부터 '${Character.currentCharacter.name}'이라는 캐릭터가 좋아할 만한 선물 목록을 생성해주세요. 캐릭터 정보:
${Character.currentCharacter.type === 'existing' ? '기존 작품 캐릭터' : '오리지널 캐릭터'}
${Character.currentCharacter.genre ? '장르: ' + Character.currentCharacter.genre : ''}
${Character.currentCharacter.personality ? '성격: ' + Character.currentCharacter.personality : ''}
${Character.currentCharacter.lore ? '세계관: ' + Character.currentCharacter.lore : ''}

다음 지침에 따라 이 캐릭터의 취향에 맞는 다양한 선물을 7개 생성해주세요:
1. 캐릭터의 성격과 취향을 반영하는 독특한 선물을 포함할 것
2. 장르와 세계관에 어울리는 선물을 포함할 것
3. 평범한 선물과 특별한 선물을 적절히 섞을 것
4. 구체적인 아이템 이름을 사용할 것 (예: '책' 대신 '판타지 모험 소설')

선물 이름만 쉼표(,)로 구분하여 나열해주세요. 다른 설명은 포함하지 마세요.`;

        const response = await callGeminiAPI(prompt);

         // 응답 처리
        let gifts = response.replace(/^\d+\.\s*/gm, '').trim();
        gifts = gifts.replace(/\n/g, ', ').replace(/,,/g, ',');

        const customGiftList = document.getElementById('custom-gift');
        customGiftList.value = gifts;

        giftGenerationStatus.textContent = "생성 완료!";

        setTimeout(() => {
            giftGenerationStatus.textContent = "";
        }, 3000);
    } catch (error) {
        giftGenerationStatus.textContent = `오류: ${error.message}`;
        console.error("선물 생성 오류:", error);
    }
}
