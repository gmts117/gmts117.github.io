/**
 * 스크롤 관련 유틸리티
 * 스크롤 이벤트 및 스크롤 관련 기능
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 스크롤 유틸리티 모듈
   */
  const ScrollUtils = {
    /**
     * 부드러운 스크롤 기능
     * @param {string} targetId - 스크롤할 대상 요소의 ID
     * @param {number} duration - 스크롤 애니메이션 지속 시간 (ms)
     * @param {number} offset - 스크롤 위치 오프셋 (px)
     */
    smoothScroll: function(targetId, duration = 500, offset = 0) {
      const target = document.querySelector(targetId);
      if (!target) return;
      
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;
      
      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }
      
      // 이징 함수: easeInOutQuad
      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
      
      requestAnimationFrame(animation);
    },
    
    /**
     * 내부 링크에 부드러운 스크롤 적용
     */
    setupSmoothScrolling: function() {
      // 네이티브 스크롤 행동 지원 확인
      if (typeof window.scroll !== 'function' || !('scrollBehavior' in document.documentElement.style)) {
        const anchors = document.querySelectorAll('a[href^="#"]');
        const anchorCount = anchors.length;
        
        for (let i = 0; i < anchorCount; i++) {
          anchors[i].addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== "#") {
              e.preventDefault();
              ScrollUtils.smoothScroll(targetId);
            }
          });
        }
      }
    },
    
    /**
     * 요소가 뷰포트 내에 있는지 확인
     * @param {HTMLElement} el - 확인할 HTML 요소
     * @param {number} offset - 오프셋 (px)
     * @returns {boolean} 뷰포트 내 여부
     */
    isInViewport: function(el, offset = 0) {
      if (!el) return false;
      
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      return (
        rect.top <= windowHeight - offset &&
        rect.bottom >= offset
      );
    },
    
    /**
     * 스크롤 위치 가져오기
     * @returns {number} 현재 스크롤 위치
     */
    getScrollPosition: function() {
      return window.pageYOffset || document.documentElement.scrollTop;
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupSmoothScrolling();
    }
  };
  
  /**
   * 스크롤 감지 모듈
   */
  const ScrollDetector = {
    scrollTimeout: null,
    isScrolling: false,
    lastScrollY: 0,
    
    /**
     * 스크롤 중 감지 설정
     */
    setup: function() {
      // 스크롤 시작 시 클래스 추가
      window.addEventListener('scroll', function() {
        if (!ScrollDetector.isScrolling) {
          document.documentElement.classList.add('scrolling');
          ScrollDetector.isScrolling = true;
        }
        
        // 스크롤 종료 감지 (지연 실행)
        clearTimeout(ScrollDetector.scrollTimeout);
        ScrollDetector.scrollTimeout = setTimeout(function() {
          document.documentElement.classList.remove('scrolling');
          ScrollDetector.isScrolling = false;
        }, 150);
      }, {passive: true});
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setup();
    }
  };
  
  /**
   * 스크롤 애니메이션 모듈
   */
  const ScrollAnimations = {
    /**
     * InteresectionObserver를 사용한 스크롤 이벤트 설정
     */
    setupScrollEvents: function() {
      // 브라우저 IntersectionObserver API 사용 (최적화)
      if ('IntersectionObserver' in window) {
        const visibilityObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              
              // 텍스트 요소 렌더링 안정화 (한 번만 실행)
              if (!entry.target.dataset.processed) {
                const textElems = entry.target.querySelectorAll('.darkT.smls.pret.tacen');
                if (textElems.length > 0) {
                  void textElems[0].offsetHeight; // 단일 강제 리플로우로 최적화
                }
                entry.target.dataset.processed = 'true';
              }
            }
          });
        }, {
          rootMargin: '0px',
          threshold: 0.1
        });
        
        // 대상 요소들 관찰
        const targets = document.querySelectorAll('.curri-box, .achievement-item, .cur');
        targets.forEach(target => visibilityObserver.observe(target));
      } else {
        // 폴백: 쓰로틀링된 스크롤 이벤트
        this.setupScrollEventsFallback();
      }
    },
    
    /**
     * 스크롤 이벤트 폴백 (IntersectionObserver 미지원 시)
     */
    setupScrollEventsFallback: function() {
      let scrollTimeout;
      let lastScrollY = window.scrollY;
      
      window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
          scrollTimeout = setTimeout(function() {
            // 현재 스크롤 위치 변화량이 충분할 때만 처리
            if (Math.abs(window.scrollY - lastScrollY) > 50) {
              ScrollAnimations.checkVisibleElements();
              lastScrollY = window.scrollY;
            }
            scrollTimeout = null;
          }, 100);
        }
      }, {passive: true});
    },
    
    /**
     * 뷰포트에 보이는 요소 처리 함수 (폴백)
     */
    checkVisibleElements: function() {
      const targets = document.querySelectorAll('.curri-box:not(.visible), .achievement-item:not(.visible), .cur:not(.visible)');
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      
      targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= viewportHeight &&
          rect.right <= viewportWidth
        );
        
        if (isVisible) {
          el.classList.add('visible');
        }
      });
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupScrollEvents();
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.ScrollUtils = ScrollUtils;
  window.ItIsIt.ScrollDetector = ScrollDetector;
  window.ItIsIt.ScrollAnimations = ScrollAnimations;
})();