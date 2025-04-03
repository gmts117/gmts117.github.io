/**
 * 브라우저 감지 유틸리티
 * 브라우저 및 디바이스 타입 감지 관련 기능
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 브라우저 유틸리티 모듈
   */
  const BrowserUtils = {
    /**
     * 모바일 환경 감지 함수
     * @returns {boolean} 모바일 기기 여부
     */
    isMobile: function() {
      return (window.innerWidth <= 700 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    },
    
    /**
     * 태블릿 환경 감지 함수
     * @returns {boolean} 태블릿 기기 여부
     */
    isTablet: function() {
      return (/iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent) || (window.innerWidth <= 1024 && window.innerWidth > 700));
    },
    
    /**
     * iOS 기기 감지 함수
     * @returns {boolean} iOS 기기 여부
     */
    isIOS: function() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
    
    /**
     * 안드로이드 기기 감지 함수
     * @returns {boolean} 안드로이드 기기 여부
     */
    isAndroid: function() {
      return /Android/i.test(navigator.userAgent);
    },
    
    /**
     * 삼성 인터넷 브라우저 감지 함수
     * @returns {boolean} 삼성 인터넷 브라우저 여부
     */
    isSamsungBrowser: function() {
      return /SamsungBrowser/i.test(navigator.userAgent);
    },
    
    /**
     * 가로 모드 감지 함수
     * @returns {boolean} 가로 모드 여부
     */
    isLandscape: function() {
      return window.innerWidth > window.innerHeight;
    },
    
    /**
     * 브라우저 정보 가져오기
     * @returns {Object} 브라우저 및 OS 정보 객체
     */
    getBrowserInfo: function() {
      const ua = navigator.userAgent;
      let browserName = "Unknown";
      let browserVersion = "Unknown";
      let osName = "Unknown";
      
      // 브라우저 감지
      if (/Edge\/|Edg\//.test(ua)) {
        browserName = "Microsoft Edge";
      } else if (/MSIE|Trident/.test(ua)) {
        browserName = "Internet Explorer";
      } else if (/Chrome/.test(ua)) {
        browserName = "Chrome";
      } else if (/Firefox/.test(ua)) {
        browserName = "Firefox";
      } else if (/Safari/.test(ua)) {
        browserName = "Safari";
      } else if (/Opera|OPR/.test(ua)) {
        browserName = "Opera";
      }
      
      // OS 감지
      if (/Windows/.test(ua)) {
        osName = "Windows";
      } else if (/Macintosh|Mac OS X/.test(ua)) {
        osName = "macOS";
      } else if (/Linux/.test(ua)) {
        osName = "Linux";
      } else if (/Android/.test(ua)) {
        osName = "Android";
      } else if (/iOS|iPhone|iPad|iPod/.test(ua)) {
        osName = "iOS";
      }
      
      return {
        browser: browserName,
        version: browserVersion,
        os: osName,
        isMobile: this.isMobile(),
        isTablet: this.isTablet(),
        userAgent: ua
      };
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      // 첫 방문 감지 및 클래스 추가
      if (!localStorage.getItem('itisit_visited')) {
        document.body.classList.add('first-visit');
        localStorage.setItem('itisit_visited', 'true');
      }
      
      // 모바일 클래스 추가
      if (this.isMobile()) {
        document.documentElement.classList.add('mobile');
      }
      
      // Safari 브라우저용 특수 처리
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        document.documentElement.classList.add('safari');
      }
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.BrowserUtils = BrowserUtils;
})();