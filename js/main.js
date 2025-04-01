/**
 * It is IT 동아리 홈페이지 메인 자바스크립트
 * 모든 모듈을 초기화하고 관리하는 진입점
 */

// 전역 네임스페이스 정의
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';

  /**
   * 모든 기능 모듈 초기화 함수
   */
  function initializeAll() {
    // 모바일 감지 즉시 적용
    if (window.ItIsIt.BrowserUtils.isMobile()) {
      document.body.classList.add('mobile-device');
    }
    
    // 주요 기능 초기화 (중요도 및 실행 순서 최적화)
    window.ItIsIt.ButtonHandler.init();
    window.ItIsIt.NavigationUtils.init();
    window.ItIsIt.ResourceOptimizer.init();
    window.ItIsIt.SecurityManager.init();
    
    // DOM 로드 완료 시 실행되는 기능들
    document.addEventListener('DOMContentLoaded', function() {
      window.ItIsIt.ScrollRevealManager.init();
      window.ItIsIt.ScrollDetector.init();
      window.ItIsIt.CurriculumManager.init();
      window.ItIsIt.ScrollAnimations.init();
      window.ItIsIt.AchievementEffects.init();
    });
    
    // 페이지 완전 로드 후 추가 최적화
    window.addEventListener('load', function() {
      window.ItIsIt.MobileOptimizer.init();
      window.ItIsIt.ReloadTracker.init();
      window.ItIsIt.VisibilityHandler.init();
      
      // 커리큘럼 박스 최종 정리 (필요한 경우만)
      finalizeBoxSizes();
      
      // 가비지 컬렉션 유도 (지원하는 브라우저만)
      if (window.CollectGarbage) {
        setTimeout(() => window.CollectGarbage(), 500);
      }
    });
  }
  
  /**
   * 커리큘럼 박스 최종 크기 고정
   */
  function finalizeBoxSizes() {
    const curriBoxes = document.querySelectorAll('.curri-box:not([style*="min-height"])');
    if (curriBoxes.length > 0) {
      requestAnimationFrame(() => {
        curriBoxes.forEach(box => {
          box.style.minHeight = box.offsetHeight + 'px';
        });
      });
    }
  }
  
  // 브라우저 호환성 검사 및 폴백 설정
  function setupCompatibility() {
    // IntersectionObserver 폴백
    if (!('IntersectionObserver' in window)) {
      console.log('IntersectionObserver not supported, loading polyfill');
      // 폴백 코드는 여기에
    }
    
    // 클래스 리스트 폴백 (IE 지원용)
    if (!('classList' in document.documentElement)) {
      console.log('classList not supported, using alternative');
      // 폴백 코드는 여기에
    }
  }
  
  // 초기화 함수 실행
  setupCompatibility();
  initializeAll();
  
  // 전역 네임스페이스에 공개 API 추가
  window.ItIsIt.init = initializeAll;
})();