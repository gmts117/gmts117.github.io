/**
 * 인트로 섹션 관련 기능
 * 메인 화면 인트로 섹션에 특화된 기능 구현
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 인트로 섹션 관리 모듈
   */
  const IntroManager = {
    /**
     * 인트로 애니메이션 설정
     */
    setupIntroAnimations: function() {
      // ScrollReveal이 있는지 확인
      if (window.sr) {
        // 로고 이미지 애니메이션: 위에서 아래로 내려오는 효과
        window.sr.reveal(".logo-img", {
          origin: "top",
          duration: 500,
          distance: "200px",
        });

        // 로고 텍스트 애니메이션: 오른쪽에서 왼쪽으로 이동
        window.sr.reveal(".logo", {
          origin: "right",
          duration: 500,
          distance: "200px",
        });

        // 로고 설명 애니메이션: 아래에서 위로 올라오는 효과
        window.sr.reveal(".logo-des", {
          origin: "bottom",
          duration: 500,
          distance: "200px",
        });
      }
    },
    
    /**
     * 모바일 환경 인트로 최적화
     */
    optimizeMobileIntro: function() {
      // 모바일 환경에서는 로고 배치 최적화
      if (window.ItIsIt.BrowserUtils.isMobile()) {
        const logo = document.querySelector('.logo');
        if (logo) {
          logo.style.flexDirection = 'column';
          logo.style.textAlign = 'center';
        }
        
        const logoImg = document.querySelector('.logo-img');
        if (logoImg) {
          logoImg.style.marginRight = '0';
          logoImg.style.marginBottom = '1rem';
        }
      }
    },
    
    /**
     * 로고 애니메이션 효과 추가
     */
    enhanceLogoEffects: function() {
      const logoImg = document.querySelector('.logo-img');
      if (!logoImg) return;
      
      // 로고 호버 효과
      logoImg.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(2deg)';
        this.style.transition = 'transform 0.3s ease';
      });
      
      logoImg.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
      });
      
      // 로고 클릭 효과
      logoImg.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
      });
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupIntroAnimations();
      this.optimizeMobileIntro();
      this.enhanceLogoEffects();
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.IntroManager = IntroManager;
  
  // DOM 로드 완료 시 초기화
  document.addEventListener('DOMContentLoaded', function() {
    window.ItIsIt.IntroManager.init();
  });
})();