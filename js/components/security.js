/**
 * 보안 관련 컴포넌트
 * 콘텐츠 보호, 우클릭 방지 등 보안 관련 기능 구현
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 보안 관리 모듈
   */
  const SecurityManager = {
    /**
     * 보안 기능 설정 함수 (우클릭 방지, 개발자 도구 방지)
     */
    setupSecurityFeatures: function() {
      // 전체 문서에 우클릭 이벤트 방지
      document.addEventListener('contextmenu', (e) => e.preventDefault(), { passive: true });
      
      // 드래그 선택 방지 (입력 필드 제외)
      document.addEventListener('selectstart', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return true;
        e.preventDefault();
      }, { passive: false });
      
      // 개발자 도구 방지 키 조합 처리
      document.addEventListener('keydown', (e) => {
        // F12 키 방지
        if (e.key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          return false;
        }
        
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U 방지
        if (e.ctrlKey && (
            (e.shiftKey && /^[ijc]$/i.test(e.key)) ||
            /^[u]$/i.test(e.key)
          )) {
          e.preventDefault();
          return false;
        }
      }, { passive: false });
    },
    
    /**
     * 콘텐츠 복사 방지 기능
     */
    preventCopying: function() {
      // 복사 방지 (입력 필드 제외)
      document.addEventListener('copy', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return true;
        e.preventDefault();
        return false;
      }, { passive: false });
      
      // 잘라내기 방지 (입력 필드 제외)
      document.addEventListener('cut', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return true;
        e.preventDefault();
        return false;
      }, { passive: false });
      
      // CSS를 이용한 복사 방지
      const style = document.createElement('style');
      style.innerHTML = `
        body {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        input, textarea {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
      `;
      document.head.appendChild(style);
    },
    
    /**
     * 개발자 도구 감지 기능
     */
    detectDevTools: function() {
      // 콘솔 출력 재정의
      const consoleLogOriginal = console.log;
      console.log = function() {
        if (arguments[0] === 'firebug' || 
            arguments[0] === 'debug' || 
            typeof arguments[0] === 'string' && arguments[0].includes('DevTools')) {
          window.location.reload();
          return;
        }
        consoleLogOriginal.apply(console, arguments);
      };
      
      // 개발자 도구 크기 변화 감지
      let widthThreshold = window.outerWidth - window.innerWidth > 160;
      let heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      function checkDevTools() {
        const widthDevToolsOpen = window.outerWidth - window.innerWidth > 160;
        const heightDevToolsOpen = window.outerHeight - window.innerHeight > 160;
        
        if (
          (widthDevToolsOpen && !widthThreshold) ||
          (heightDevToolsOpen && !heightThreshold)
        ) {
          document.body.classList.add('dev-tools-open');
        } else if (
          (!widthDevToolsOpen && widthThreshold) ||
          (!heightDevToolsOpen && heightThreshold)
        ) {
          document.body.classList.remove('dev-tools-open');
        }
        
        widthThreshold = widthDevToolsOpen;
        heightThreshold = heightDevToolsOpen;
      }
      
      window.addEventListener('resize', checkDevTools);
      setInterval(checkDevTools, 1000);
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupSecurityFeatures();
      this.preventCopying();
      
      // 개발 모드 확인 (실제 사이트에서만 활성화)
      if (window.location.hostname !== 'localhost' && 
          !window.location.hostname.includes('127.0.0.1') &&
          !window.location.hostname.includes('.local')) {
        this.detectDevTools();
      }
    }
  };
  
  /**
   * 리소스 최적화 모듈
   */
  const ResourceOptimizer = {
    /**
     * 이미지 및 리소스 최적화 함수
     */
    optimizeResources: function() {
      // 로고 이미지를 제외한 모든 이미지에 지연 로딩 적용
      const images = document.querySelectorAll('img:not(.logo-img)');
      const imageCount = images.length;
      
      for (let i = 0; i < imageCount; i++) {
        if (!images[i].hasAttribute('loading')) {
          images[i].loading = 'lazy';
        }
      }
      
      // Font Awesome 지연 로드
      let faLoaded = false;
      
      function loadFontAwesome() {
        if (!faLoaded && !document.querySelector('#font-awesome-css')) {
          const faIcons = document.querySelectorAll('.fa-brands, .fa-solid');
          if (faIcons.length > 0) {
            const faLink = document.createElement('link');
            faLink.id = 'font-awesome-css';
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(faLink);
            faLoaded = true;
          }
        }
      }
      
      // 200ms 지연 후 아이콘 사용 여부 확인
      setTimeout(loadFontAwesome, 200);
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.optimizeResources();
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.SecurityManager = SecurityManager;
  window.ItIsIt.ResourceOptimizer = ResourceOptimizer;
})();