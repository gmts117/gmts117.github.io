// 버튼 클릭 상태 추적
var introButtonPressed = false;
const introApplyButton = document.getElementById('apply-button'); // 상단 인트로 버튼
const mainApplyButton = document.getElementById('main-apply-button'); // 하단 실제 신청 버튼

// 커스텀 알림창 함수 (링크 매개변수 추가)
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
  
  // 배경 클릭 시 알림창 닫기
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
}

// 인트로 화면의 신청 버튼 클릭 이벤트
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
