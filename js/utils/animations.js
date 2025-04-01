/**
 * 애니메이션 유틸리티
 * 사이트 전체에서 사용되는 애니메이션 관련 기능
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 애니메이션 유틸리티 모듈
   */
  const AnimationUtils = {
    /**
     * 요소에 페이드인 애니메이션 적용
     * @param {HTMLElement} element - 애니메이션을 적용할 요소
     * @param {number} duration - 애니메이션 지속 시간 (ms)
     * @param {Function} callback - 애니메이션 완료 후 콜백
     */
    fadeIn: function(element, duration = 300, callback) {
      if (!element) return;
      
      element.style.opacity = '0';
      element.style.display = 'block';
      
      let start = null;
      
      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      }
      
      requestAnimationFrame(animate);
    },
    
    /**
     * 요소에 페이드아웃 애니메이션 적용
     * @param {HTMLElement} element - 애니메이션을 적용할 요소
     * @param {number} duration - 애니메이션 지속 시간 (ms)
     * @param {Function} callback - 애니메이션 완료 후 콜백
     */
    fadeOut: function(element, duration = 300, callback) {
      if (!element) return;
      
      let start = null;
      const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
      
      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.max(initialOpacity - (progress / duration), 0);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = 'none';
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      }
      
      requestAnimationFrame(animate);
    },
    
    /**
     * 요소에 슬라이드 다운 애니메이션 적용
     * @param {HTMLElement} element - 애니메이션을 적용할 요소
     * @param {number} duration - 애니메이션 지속 시간 (ms)
     * @param {Function} callback - 애니메이션 완료 후 콜백
     */
    slideDown: function(element, duration = 300, callback) {
      if (!element) return;
      
      // 높이 계산을 위해 display를 block으로 설정
      const originalDisplay = element.style.display;
      element.style.display = 'block';
      element.style.overflow = 'hidden';
      element.style.height = '0px';
      
      // 요소의 실제 높이 가져오기
      const height = element.scrollHeight;
      
      let start = null;
      
      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        element.style.height = (height * percentage) + 'px';
        
        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          // 원래 상태로 복원
          element.style.height = '';
          element.style.overflow = '';
          element.style.display = originalDisplay || 'block';
          
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      }
      
      requestAnimationFrame(animate);
    },
    
    /**
     * 요소에 슬라이드 업 애니메이션 적용
     * @param {HTMLElement} element - 애니메이션을 적용할 요소
     * @param {number} duration - 애니메이션 지속 시간 (ms)
     * @param {Function} callback - 애니메이션 완료 후 콜백
     */
    slideUp: function(element, duration = 300, callback) {
      if (!element) return;
      
      // 현재 높이 저장
      const height = element.offsetHeight;
      element.style.overflow = 'hidden';
      element.style.height = height + 'px';
      
      let start = null;
      
      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        element.style.height = (height - (height * percentage)) + 'px';
        
        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = 'none';
          element.style.height = '';
          element.style.overflow = '';
          
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      }
      
      requestAnimationFrame(animate);
    },
    
    /**
     * 파티클 효과 생성
     * @param {HTMLElement} element - 파티클을 추가할 요소
     * @param {number} count - 파티클 개수
     * @param {string} color - 파티클 색상 (CSS 색상 문자열)
     */
    createParticles: function(element, count = 8, color = 'rgba(255,215,0,0.9)') {
      if (!element) return;
      
      element.dataset.particlesAdded = "true";
      
      // DocumentFragment 사용하여 단일 DOM 조작
      const fragment = document.createDocumentFragment();
      
      // 파티클 추가
      for (let i = 0; i < count; i++) {
        const size = 4 + Math.random() * 6;
        const particle = document.createElement('span');
        particle.className = 'gold-particle';
        
        // 인라인 스타일 최소화 (클래스로 대체할 부분 제외)
        particle.style.cssText = 
          'position:absolute;' +
          `width:${size}px;` +
          `height:${size}px;` +
          `background:${color};` +
          'box-shadow:0 0 10px rgba(255,165,0,0.8),0 0 5px rgba(255,165,0,0.6);' +
          'border-radius:50%;' +
          `top:${Math.random() * 100}%;` +
          `left:${Math.random() * 100}%;` +
          'z-index:3;' +
          'opacity:0;' +
          'pointer-events:none;' +
          `animation:particles ${2 + Math.random() * 3}s infinite ease-in-out;` +
          `animation-delay:${Math.random() * 5}s;`;
        
        // Fragment에 추가
        fragment.appendChild(particle);
      }
      
      // 단일 DOM 조작으로 모든 파티클 추가
      element.appendChild(fragment);
    },
    
    /**
     * 애니메이션 일시 중지/재개
     * @param {HTMLElement} element - 대상 요소
     * @param {boolean} pause - 일시 중지 여부
     */
    toggleAnimation: function(element, pause) {
      if (!element) return;
      
      const playState = pause ? 'paused' : 'running';
      element.style.animationPlayState = playState;
      
      // 자식 요소들 애니메이션도 함께 처리
      const animatedChildren = element.querySelectorAll('[style*="animation"]');
      animatedChildren.forEach(child => {
        child.style.animationPlayState = playState;
      });
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.AnimationUtils = AnimationUtils;
})();