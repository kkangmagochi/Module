// animation.js

// 캐릭터 애니메이션 (위아래로 움직임)
export function animateCharacter() {
  const characterImage = document.getElementById('character-image');
    characterImage.classList.add('bounce');

    // 애니메이션이 끝나면 클래스 제거
    setTimeout(() => {
        characterImage.classList.remove('bounce');
    }, 500);
}

// 밤/낮 전환 애니메이션
export function playNightAnimation() {
  const nightOverlay = document.getElementById('night-overlay');
    // 밤 효과 표시
    nightOverlay.style.opacity = '1';

    // 1.5초 후 밤 효과 숨기기
    setTimeout(() => {
        nightOverlay.style.opacity = '0';
    }, 1500);
}
