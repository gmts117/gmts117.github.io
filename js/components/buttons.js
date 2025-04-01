/**
 * 버튼 관련 컴포넌트
 * 사이트 내 버튼 이벤트 핸들링 및 기능 구현
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 버튼 핸들러 모듈
   */
  const ButtonHandler = {
    // 상태 변수
    introButtonPressed: false,
    
    /**
     * 버튼 이벤트 설정 함수
     */
    setupButtonEvents: function() {
      const introApplyButton = document.getElementById('apply-button');
      const mainApplyButton = document.getElementById('main-apply-button');
      
      // 인트로 신청 버튼 이벤트
      if (introApplyButton) {
        introApplyButton.addEventListener('click', (event) => {
          event.preventDefault();
          
          if (!this.introButtonPressed) {
            window.ItIsIt.CustomAlert.show('설마 밑에 안 읽으신건 아니죠..?', function() {
              document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
            });
            this.introButtonPressed = true;
          } else {
            document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
      
      // 실제 신청 버튼 이벤트
      if (mainApplyButton) {
        mainApplyButton.addEventListener('click', (event) => {
          event.preventDefault();
          
          window.ItIsIt.CustomAlert.show("반드시 학교계정으로 로그인 해 주세요!", function() {
            window.open("https://forms.gle/UgucYhfGQ23WXC1V8", '_blank');
          });
        });
      }
    },
    
    /**
     * 모든 링크 이벤트 개선
     */
    enhanceLinks: function() {
      // 외부 링크에 rel 속성 추가
      const externalLinks = document.querySelectorAll('a[href^="http"]:not([rel])');
      externalLinks.forEach(link => {
        if (!link.hostname.includes(window.location.hostname)) {
          link.setAttribute('rel', 'noopener noreferrer');
          
          // 새 탭에서 열리게 설정
          if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
          }
        }
      });
      
      // 모든 링크에 hover 이벤트 처리
      const allLinks = document.querySelectorAll('a:not(.no-hover)');
      allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
          this.style.transition = 'all 0.3s ease';
        });
      });
    },
    
    /**
     * 포커스 관련 접근성 개선
     */
    setupAccessibility: function() {
      // 포커스 가능한 요소에 키보드 접근성 추가
      const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      
      focusableElements.forEach(el => {
        // 키보드 포커스 스타일 개선
        el.addEventListener('focus', function() {
          if (!this.classList.contains('no-focus-style')) {
            this.style.outline = '2px solid #4e5668';
            this.style.outlineOffset = '2px';
          }
        });
        
        el.addEventListener('blur', function() {
          this.style.outline = '';
          this.style.outlineOffset = '';
        });
        
        // Enter 키 이벤트 추가 (클릭 가능 요소)
        if (el.tagName === 'A' || el.tagName === 'BUTTON') {
          el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.click();
            }
          });
        }
      });
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupButtonEvents();
      this.enhanceLinks();
      this.setupAccessibility();
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.ButtonHandler = ButtonHandler;
  
  /**
   * 내비게이션 유틸리티 모듈
   */
  const NavigationUtils = {
    /**
     * 부드러운 스크롤 및 내비게이션 설정 함수
     */
    setupNavigation: function() {
      // 모든 내부 링크에 부드러운 스크롤 적용
      if (typeof window.scroll !== 'function' || !('scrollBehavior' in document.documentElement.style)) {
        const anchors = document.querySelectorAll('a[href^="#"]');
        const anchorCount = anchors.length;
        
        for (let i = 0; i < anchorCount; i++) {
          anchors[i].addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== "#") {
              e.preventDefault();
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                targetElement.scrollIntoView({behavior: 'smooth'});
              }
            }
          });
        }
      }
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupNavigation();
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.NavigationUtils = NavigationUtils;
})();