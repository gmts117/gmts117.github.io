/**
 * It is IT 동아리 홈페이지 메인 자바스크립트 (모바일 최적화)
 */

/**
 * 모바일 환경 감지 함수
 * @returns {boolean} 모바일 기기 여부
 */
function isMobileDevice() {
  return (window.innerWidth <= 700 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

/**
 * 커스텀 알림창 함수
 * @param {string} message - 표시할 메시지 내용
 * @param {function|null} callback - 알림창이 닫힌 후 실행할 콜백 함수 (선택적)
 */
function showCustomAlert(message, callback = null) {
  // 이미 알림창이 있다면 제거
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // 새 알림창 요소 생성
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  
  // 알림창 내용 구성
  alertBox.innerHTML = `
    <div class="alert-content">
      <div class="alert-icon">
        <i class="fa-solid fa-circle-info"></i>
      </div>
      <div class="alert-message">${message}</div>
      <button class="alert-close">확인</button>
    </div>
  `;
  
  // 알림창을 DOM에 추가
  document.body.appendChild(alertBox);
  
  // 등장 애니메이션
  setTimeout(() => {
    alertBox.classList.add('show');
  }, 10);
  
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
  const closeButton = alertBox.querySelector('.alert-close');
  closeButton.addEventListener('click', closeAlert);
  
  // 배경 클릭 이벤트
  alertBox.addEventListener('click', (e) => {
    if (e.target === alertBox) closeAlert();
  });
  
  // 모바일에서는 자동으로 5초 후 닫히게 설정
  if (isMobileDevice()) {
    setTimeout(() => {
      if (document.body.contains(alertBox)) closeAlert();
    }, 5000);
  }
}

// 버튼 클릭 상태 추적 변수
var introButtonPressed = false;

/**
 * 페이지 로드 완료 시 실행되는 초기화 함수
 */
document.addEventListener('DOMContentLoaded', function() {
  // 모바일 디바이스 감지 및 body에 클래스 추가
  if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
  }
  
  // 버튼 이벤트 설정
  const introApplyButton = document.getElementById('apply-button');
  const mainApplyButton = document.getElementById('main-apply-button');
  
  // 인트로 신청 버튼 이벤트
  if (introApplyButton) {
    introApplyButton.addEventListener('click', function (event) {
      event.preventDefault();
      
      if (!introButtonPressed) {
        showCustomAlert('설마 밑에 안 읽으신건 아니죠..?', function() {
          document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
        });
        introButtonPressed = true;
      } else {
        document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // 실제 신청 버튼 이벤트
  if (mainApplyButton) {
    mainApplyButton.addEventListener('click', function (event) {
      event.preventDefault();
      const applicationUrl = "https://drive.google.com/file/d/1omTKqbIn5hJ1demcl2UVjj4Wsh90eRWj/view?usp=sharing";
      
      showCustomAlert("반드시 학교계정으로 로그인 해 주세요!", function() {
        window.open(applicationUrl, '_blank');
      });
    });
  }
  
  // 부드러운 스크롤 지원 확인 및 폴백 구현
  if (typeof window.scroll !== 'function' || !('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId !== "#") {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({behavior: 'smooth'});
          }
        }
      });
    });
  }
  
  // 모바일 터치 이벤트 지연 해결
  document.addEventListener('touchstart', function() {}, {passive: true});

  // 이미지 지연 로딩 적용
  document.querySelectorAll('img').forEach(img => {
    if (!img.classList.contains('logo-img')) {
      img.loading = 'lazy';
    }
  });

  // 모바일에서 스크롤 애니메이션 최적화
  if (isMobileDevice()) {
    // 모바일에서 애니메이션 거리 축소
    window.sr = ScrollReveal({ 
      reset: true,
      distance: '30px',  // 더 짧은 거리
      duration: 400,     // 더 빠른 속도
      mobile: true,
      useDelay: 'onload'
    });
    
    // 모바일에서의 애니메이션 설정 재정의
    sr.reveal(".logo-img", {
      origin: "top",
      duration: 400,
      distance: "50px",
    });

    sr.reveal(".logo", {
      origin: "right",
      duration: 400,
      distance: "50px",
    });

    sr.reveal(".logo-des", {
      origin: "bottom",
      duration: 400,
      distance: "50px",
    });
    
    sr.reveal(".PR-title", {
      origin: "left",
      duration: 400,
      distance: "30px",
    });
    
    sr.reveal(".cur", {
      origin: "bottom",
      duration: 400,
      distance: "20px",
      interval: 150
    });
    
    sr.reveal(".achievement-item", {
      origin: "bottom",
      duration: 400,
      distance: "20px",
      interval: 150
    });
    
    sr.reveal(".curri-box", {
      origin: "right",
      duration: 400,
      distance: "20px",
      interval: 80
    });
  }

  // 오리엔테이션 변경 감지 및 처리
  window.addEventListener('orientationchange', function() {
    // 방향 전환 시 0.3초 후 화면 재조정 (레이아웃 재계산)
    setTimeout(function() {
      window.scrollBy(0, 1);
    }, 300);
  });

  // 스크롤 성능 개선
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        scrollTimeout = null;
      }, 100);
    }
  }, {passive: true});
  
  // 모바일에서 탭 네비게이션 개선
  const allLinks = document.querySelectorAll('a, button');
  allLinks.forEach(link => {
    link.addEventListener('touchend', function(e) {
      if (this === document.activeElement) {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // 페이지 리소스 최적화 - 불필요한 리소스 지연 로드
  setTimeout(() => {
    // Font Awesome 아이콘을 실제로 사용하는 시점에 로드
    const faIcons = document.querySelectorAll('.fa-brands, .fa-solid');
    if (faIcons.length > 0 && !document.querySelector('#font-awesome-css')) {
      const faLink = document.createElement('link');
      faLink.id = 'font-awesome-css';
      faLink.rel = 'stylesheet';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(faLink);
    }
  }, 2000);
  
  // 초기 페이지 로드 시간 측정 (디버깅용)
  console.log('페이지 로드 완료 시간: ' + (performance.now() / 1000).toFixed(2) + '초');
});

// 페이지 완전 로드 후 추가 최적화
window.addEventListener('load', function() {
  // 모든 리소스 로드 후 성능 최적화
  setTimeout(() => {
    // 사용하지 않는 리소스 해제
    if (window.CollectGarbage) {
      window.CollectGarbage();
    }
  }, 1000);
  
  // 모바일 기기에서 폰트 렌더링 최적화
  if (isMobileDevice()) {
    document.body.style.textRendering = 'optimizeSpeed';
  }
});
