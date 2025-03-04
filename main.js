// 모바일 환경 감지 함수
function isMobileDevice() {
  return (window.innerWidth <= 700 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

// 커스텀 알림창 함수 (모바일 최적화 버전)
function showCustomAlert(message, callback = null) {
  // 이미 알림창이 있다면 제거
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // 새 알림창 생성
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  
  // 알림창 내용
  alertBox.innerHTML = `
    <div class="alert-content">
      <div class="alert-icon">
        <i class="fa-solid fa-circle-info"></i>
      </div>
      <div class="alert-message">${message}</div>
      <button class="alert-close">확인</button>
    </div>
  `;
  
  // 알림창 추가
  document.body.appendChild(alertBox);
  
  // 알림창 표시 애니메이션
  setTimeout(() => {
    alertBox.classList.add('show');
  }, 10);
  
  // 확인 버튼 클릭 시 처리
  const closeButton = alertBox.querySelector('.alert-close');
  closeButton.addEventListener('click', () => {
    // 알림창 닫기 애니메이션
    alertBox.classList.remove('show');
    
    // 애니메이션 완료 후 알림창 제거 및 콜백 호출
    setTimeout(() => {
      alertBox.remove();
      if (callback) {
        callback();
      }
    }, 300);
  });
  
  // 배경 클릭 시 알림창 닫기 (모바일에서는 더 큰 터치 영역 제공)
  alertBox.addEventListener('click', (e) => {
    if (e.target === alertBox) {
      alertBox.classList.remove('show');
      setTimeout(() => {
        alertBox.remove();
        if (callback) {
          callback();
        }
      }, 300);
    }
  });
  
  // 모바일에서는 자동으로 5초 후 닫히게 설정
  if (isMobileDevice()) {
    setTimeout(() => {
      if (document.body.contains(alertBox)) {
        alertBox.classList.remove('show');
        setTimeout(() => {
          if (document.body.contains(alertBox)) {
            alertBox.remove();
            if (callback) {
              callback();
            }
          }
        }, 300);
      }
    }, 5000);
  }
}

// 인트로 화면의 신청 버튼 클릭 이벤트
var introButtonPressed = false;
const introApplyButton = document.getElementById('apply-button');
const mainApplyButton = document.getElementById('main-apply-button');

if (introApplyButton) {
  introApplyButton.addEventListener('click', function (event) {
    // 기본 동작 방지 (링크 이동 방지)
    event.preventDefault();
    
    if (!introButtonPressed) {
      // 알림창 표시 후 콜백으로 페이지 스크롤 처리
      showCustomAlert('설마 밑에 안 읽으신건 아니죠..?', function() {
        // 알림창 닫힌 후 'apply' 섹션으로 스크롤
        document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
      });
      
      introButtonPressed = true;
    } else {
      // 이미 한번 클릭했다면 바로 스크롤
      document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// 실제 신청 버튼 클릭 이벤트
if (mainApplyButton) {
  mainApplyButton.addEventListener('click', function (event) {
    // 기본 동작 방지 (링크 이동 방지)
    event.preventDefault();
    
    // 지원 링크
    const applicationUrl = "https://drive.google.com/file/d/1omTKqbIn5hJ1demcl2UVjj4Wsh90eRWj/view?usp=sharing";
    
    // 학교 계정 로그인 안내 메시지 표시
    showCustomAlert("반드시 학교계정으로 로그인 해 주세요!", function() {
      // 알림창 닫힌 후 링크로 이동
      window.open(applicationUrl, '_blank');
    });
  });
}

// 페이지 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
  // 모바일 디바이스 감지 및 body에 클래스 추가
  if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
  }
  
  // 부드러운 스크롤 지원 확인 및 폴백
  if (typeof window.scroll !== 'function' || 
      !('scrollBehavior' in document.documentElement.style)) {
    // 부드러운 스크롤 폴백 구현
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
});
