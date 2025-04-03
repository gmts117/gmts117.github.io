/**
 * 커리큘럼 섹션 관련 기능
 * 커리큘럼 표시 및 효과 관련 기능 구현
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 커리큘럼 관리 모듈
   */
  const CurriculumManager = {
    /**
     * 커리큘럼 박스 최적화 함수
     */
    optimizeCurriculumBoxes: function() {
      const curriBoxes = document.querySelectorAll('.curri-box');
      const boxCount = curriBoxes.length;
      
      if (boxCount === 0) return;
      
      // RAF 사용하여 렌더링 최적화
      requestAnimationFrame(() => {
        for (let i = 0; i < boxCount; i++) {
          const box = curriBoxes[i];
          const textElements = box.querySelectorAll('.darkT.smls.pret.tacen');
          const elemCount = textElements.length;
          
          // 텍스트 요소 최적화
          for (let j = 0; j < elemCount; j++) {
            const el = textElements[j];
            // 공통 스타일 속성을 클래스로 이동하고 인라인 스타일 최소화
            el.style.textAlign = window.ItIsIt.BrowserUtils.isMobile() ? 'left' : 'center';
            el.style.display = el.textContent.trim() ? 'block' : 'none';
          }
          
          // 박스 가시성 최적화
          box.classList.add('optimized');
        }
        
        // 새로고침 상태 확인 및 처리
        if (sessionStorage.getItem('pageReloaded') === 'true') {
          this.handlePageReload(curriBoxes);
        }
      });
    },
    
    /**
     * 새로고침 후 페이지 처리 함수
     * @param {NodeList} curriBoxes - 커리큘럼 박스 요소들
     */
    handlePageReload: function(curriBoxes) {
      // 세션 스토리지 플래그 초기화
      sessionStorage.removeItem('pageReloaded');
      
      // 박스 최적화 (타이밍 조정으로 성능 개선)
      requestAnimationFrame(() => {
        // 커리큘럼 박스에 특별 클래스 추가
        const boxCount = curriBoxes.length;
        for (let i = 0; i < boxCount; i++) {
          curriBoxes[i].classList.add('reloaded');
        }
        
        // 박스들의 레이아웃 강제 리플로우 (단일 리플로우로 최적화)
        const curriculumSection = document.querySelector('.curriculum');
        if (curriculumSection) {
          curriculumSection.style.opacity = '0.99';
          requestAnimationFrame(() => {
            curriculumSection.style.opacity = '1';
          });
        }
      });
    },
    
    /**
     * 커리큘럼 항목 강조 효과
     */
    setupCurriculumHighlight: function() {
      const curItems = document.querySelectorAll('.cur');
      
      curItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-8px)';
          this.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
          this.style.transform = '';
          this.style.boxShadow = '';
        });
      });
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.optimizeCurriculumBoxes();
      this.setupCurriculumHighlight();
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.CurriculumManager = CurriculumManager;
})();