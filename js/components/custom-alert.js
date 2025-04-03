/**
 * 커스텀 알림창 컴포넌트
 * 사이트 전역에서 사용되는 커스텀 알림창 기능 구현
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 커스텀 알림창 모듈
   */
  const CustomAlert = {
    /**
     * 알림창 생성 및 표시
     * @param {string} message - 표시할 메시지 내용
     * @param {Function} callback - 알림창이 닫힌 후 실행할 콜백 함수
     */
    show: function(message, callback = null) {
      // 이미 알림창이 있다면 제거
      const existingAlert = document.querySelector('.custom-alert');
      if (existingAlert) existingAlert.remove();
      
      // 새 알림창 요소 생성
      const alertBox = document.createElement('div');
      alertBox.className = 'custom-alert';
      
      // 알림창 내용 구성
      alertBox.innerHTML = 
        '<div class="alert-content">' +
        '<div class="alert-icon">' +
        '<i class="fa-solid fa-circle-info"></i>' +
        '</div>' +
        '<div class="alert-message">' + message + '</div>' +
        '<button class="alert-close">확인</button>' +
        '</div>';
      
      // 알림창을 DOM에 추가
      document.body.appendChild(alertBox);
      
      // 등장 애니메이션
      requestAnimationFrame(() => alertBox.classList.add('show'));
      
      // 닫기 함수
      const closeAlert = () => {
        alertBox.classList.remove('show');
        setTimeout(() => {
          if (document.body.contains(alertBox)) {
            alertBox.remove();
            if (callback) callback();
          }
        }, 300);
      };
      
      // 확인 버튼 클릭 이벤트
      alertBox.querySelector('.alert-close').addEventListener('click', closeAlert);
      
      // 배경 클릭 이벤트
      alertBox.addEventListener('click', (e) => {
        if (e.target === alertBox) closeAlert();
      });
      
      // ESC 키 이벤트
      const escKeyHandler = (e) => {
        if (e.key === 'Escape') {
          closeAlert();
          document.removeEventListener('keydown', escKeyHandler);
        }
      };
      document.addEventListener('keydown', escKeyHandler);
      
      // 모바일에서는 자동으로 5초 후 닫히게 설정
      if (window.ItIsIt.BrowserUtils.isMobile()) {
        setTimeout(closeAlert, 5000);
      }
      
      return {
        close: closeAlert
      };
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      // 여기서는 특별한 초기화가 필요 없음
      // 필요 시 이 함수에서 초기 설정을 수행
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.CustomAlert = CustomAlert;
})();