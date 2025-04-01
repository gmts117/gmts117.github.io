/**
 * 스크롤 애니메이션 관련 기능
 * ScrollReveal 라이브러리 설정 및 관리
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * ScrollReveal 관리 모듈
   */
  const ScrollRevealManager = {
    /**
     * ScrollReveal 설정 최적화 함수
     */
    setupScrollReveal: function() {
      // ScrollReveal 초기화 여부 확인
      if (!window.sr && window.ScrollReveal) {
        // reset을 false로 설정하여 한 번만 애니메이션 적용되도록 함
        window.sr = ScrollReveal({ 
          reset: false,           // 중요: 한 번만 애니메이션 적용
          useDelay: 'onload',     // 페이지 로드 시에만 지연 적용
          viewFactor: 0.2,        // 20%만 보여도 애니메이션 시작
          viewOffset: {
            top: 40,              // 상단 여백
            bottom: 40            // 하단 여백
          }
        });
        
        // 기본 요소 애니메이션 설정
        this.setupBasicAnimations();
        
        // 섹션별 특수 애니메이션 설정
        this.setupSectionAnimations();
      }
    },
    
    /**
     * 기본 요소 애니메이션 설정
     */
    setupBasicAnimations: function() {
      if (!window.sr) return;
      
      // 로고 이미지 애니메이션: 위에서 아래로 내려오는 효과
      window.sr.reveal(".logo-img", {
        origin: "top",          // 시작 위치: 상단
        duration: 500,          // 애니메이션 시간(ms)
        distance: "200px",      // 이동 거리
      });

      // 로고 텍스트 애니메이션: 오른쪽에서 왼쪽으로 이동
      window.sr.reveal(".logo", {
        origin: "right",        // 시작 위치: 오른쪽
        duration: 500,          // 애니메이션 시간(ms)
        distance: "200px",      // 이동 거리
      });

      // 로고 설명 애니메이션: 아래에서 위로 올라오는 효과
      window.sr.reveal(".logo-des", {
        origin: "bottom",       // 시작 위치: 하단
        duration: 500,          // 애니메이션 시간(ms)
        distance: "200px",      // 이동 거리
      });
    },
    
    /**
     * 섹션별 특수 애니메이션 설정
     */
    setupSectionAnimations: function() {
      if (!window.sr) return;
      
      // 자랑 섹션 제목 애니메이션: 왼쪽에서 오른쪽으로 이동
      window.sr.reveal(".PR-title", {
        origin: "left",         // 시작 위치: 왼쪽
        duration: 500,          // 애니메이션 시간(ms)
        distance: "100px",      // 이동 거리
      });
      
      // 교육 내용 항목 애니메이션: 순차적으로 아래에서 위로 
      window.sr.reveal(".cur", {
        origin: "bottom",       // 시작 위치: 하단
        duration: 500,          // 애니메이션 시간(ms)
        distance: "50px",       // 이동 거리
        interval: 200           // 각 항목 간 시간 간격(ms)
      });
      
      // 실적 아이템 애니메이션: 순차적으로 아래에서 위로
      window.sr.reveal(".achievement-item", {
        origin: "bottom",       // 시작 위치: 하단
        duration: 500,          // 애니메이션 시간(ms)
        distance: "50px",       // 이동 거리
        interval: 200           // 각 항목 간 시간 간격(ms)
      });
      
      // 커리큘럼 박스 애니메이션: 오른쪽에서 왼쪽으로 순차적 이동
      window.sr.reveal(".curri-box", {
        origin: "right",        // 시작 위치: 오른쪽
        duration: 500,          // 애니메이션 시간(ms)
        distance: "50px",       // 이동 거리
        interval: 100           // 각 항목 간 시간 간격(ms)
      });
    },
    
    /**
     * 스크롤 중인지 감지하는 플래그 설정
     */
    setupScrollDetection: function() {
      let scrollTimeout;
      let isScrolling = false;
      
      // 스크롤 시작 시 클래스 추가
      window.addEventListener('scroll', function() {
        if (!isScrolling) {
          document.documentElement.classList.add('scrolling');
          isScrolling = true;
        }
        
        // 스크롤 종료 감지 (지연 실행)
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
          document.documentElement.classList.remove('scrolling');
          isScrolling = false;
        }, 150);
      }, {passive: true});
    },
    
    /**
     * 가시성 변경 이벤트 최적화
     */
    setupVisibilityHandler: function() {
      document.addEventListener('visibilitychange', function() {
        const isHidden = document.hidden;
        const playState = isHidden ? 'paused' : 'running';
        
        // 애니메이션 요소 선택자 (CSS 선택자 성능 최적화)
        const selectors = [
          '.medal-gold .shine-effect',
          '.medal-bronze .shine-effect',
          '.gold-particle'
        ];
        
        // 요소 선택 최소화 및 스타일 변경 최적화
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          const elemCount = elements.length;
          
          if (elemCount > 0) {
            for (let i = 0; i < elemCount; i++) {
              elements[i].style.animationPlayState = playState;
            }
          }
        });
      });
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupScrollReveal();
      this.setupScrollDetection();
      this.setupVisibilityHandler();
    }
  };
  
  /**
   * 새로고침 추적 모듈
   */
  const ReloadTracker = {
    /**
     * 새로고침 상태 추적 함수
     */
    setupReloadTracking: function() {
      // 새로고침 감지
      window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('pageReloaded', 'true');
        sessionStorage.setItem('scrollPosition', window.scrollY);
      });
      
      // 페이지 로드 시 이전 스크롤 위치 복원
      if (sessionStorage.getItem('pageReloaded') === 'true') {
        const savedPosition = parseInt(sessionStorage.getItem('scrollPosition'), 10);
        if (!isNaN(savedPosition)) {
          // 약간의 지연 후 스크롤 복원 (렌더링이 완료된 후)
          setTimeout(() => {
            window.scrollTo(0, savedPosition);
            // 스크롤 위치에 있는 애니메이션 요소들 즉시 표시
            this.forceShowAnimationsInView();
          }, 100);
        }
      }
    },
    
    /**
     * 뷰포트 내 애니메이션 요소들 즉시 표시
     */
    forceShowAnimationsInView: function() {
      // ScrollReveal이 있는 경우 관련 요소 처리
      if (window.sr) {
        // 주요 애니메이션 요소들 선택자
        const selectors = [
          '.achievement-item', 
          '.curri-box', 
          '.cur',
          '.medal-gold',
          '.medal-bronze'
        ];
        
        // 뷰포트 치수 가져오기
        const viewportHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        const scrollBottom = scrollTop + viewportHeight;
        
        // 각 선택자에 대해 뷰포트 내 요소 확인 및 강제 표시
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          
          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementBottom = elementTop + rect.height;
            
            // 뷰포트 내에 있는 요소인지 확인
            if (elementBottom >= scrollTop && elementTop <= scrollBottom) {
              // ScrollReveal 요소 강제 표시
              el.style.visibility = 'visible';
              el.style.opacity = '1';
              el.style.transform = 'none';
              el.style.transition = 'none';
              
              // 애니메이션 완료 클래스 추가
              el.classList.add('sr-reveal-complete');
              el.classList.add('visible');
              el.classList.add('item-highlight');
              
              // 메달 효과 처리
              if (el.classList.contains('medal-gold') || el.classList.contains('medal-bronze')) {
                el.classList.add('medal-highlight');
              }
            }
          });
        });
      }
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupReloadTracking();
    }
  };
  
  /**
   * 모바일 최적화 모듈
   */
  const MobileOptimizer = {
    /**
     * 모바일 환경 최적화 함수
     */
    setupMobileOptimizations: function() {
      // 모바일 환경일 때만 실행
      if (!window.ItIsIt.BrowserUtils.isMobile()) return;
      
      // 모바일에서 터치 이벤트 최적화
      document.addEventListener('touchstart', function() {}, {passive: true});
      
      // 모바일 폰트 렌더링 최적화
      document.body.style.textRendering = 'optimizeSpeed';
      
      // 방향 전환 처리
      window.addEventListener('orientationchange', function() {
        // 리소스 사용 최소화
        setTimeout(function() {
          window.scrollBy(0, 1);
        }, 300);
      });
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupMobileOptimizations();
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.ScrollRevealManager = ScrollRevealManager;
  window.ItIsIt.ReloadTracker = ReloadTracker;
  window.ItIsIt.MobileOptimizer = MobileOptimizer;
  window.ItIsIt.VisibilityHandler = {
    init: function() {
      ScrollRevealManager.setupVisibilityHandler();
    }
  };
})();