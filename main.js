/**
 * It is IT 동아리 홈페이지 메인 자바스크립트 (최적화)
 */

// 전역 변수
let introButtonPressed = false;

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

/**
 * 버튼 이벤트 설정 함수
 */
function setupButtonEvents() {
  const introApplyButton = document.getElementById('apply-button');
  const mainApplyButton = document.getElementById('main-apply-button');
  
  // 인트로 신청 버튼 이벤트
  if (introApplyButton) {
    introApplyButton.addEventListener('click', function(event) {
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
    mainApplyButton.addEventListener('click', function(event) {
      event.preventDefault();
      const applicationUrl = "https://forms.gle/UgucYhfGQ23WXC1V8";
      
      showCustomAlert("반드시 학교계정으로 로그인 해 주세요!", function() {
        window.open(applicationUrl, '_blank');
      });
    });
  }
}

/**
 * 우클릭 방지 및 컨텍스트 메뉴 비활성화 설정 함수
 */
function disableRightClick() {
  // 전체 문서에 우클릭 이벤트 방지
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  
  // 드래그 선택 방지 (선택적으로 적용)
  document.addEventListener('selectstart', function(e) {
    // 특정 요소(입력 필드 등)는 선택 가능하도록 예외 처리
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return true;
    }
    e.preventDefault();
    return false;
  });
  
  // F12 개발자 도구 방지 (선택적으로 적용)
  document.addEventListener('keydown', function(e) {
    // F12 키 방지
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C 방지
    if (e.ctrlKey && (
        (e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.key === 'u' || e.key === 'U')
      )) {
      e.preventDefault();
      return false;
    }
  });
}

/**
 * 부드러운 스크롤 설정 함수
 */
function setupSmoothScroll() {
  // CSS scroll-behavior를 지원하지 않는 브라우저용 폴백
  if (typeof window.scroll !== 'function' || !('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
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
}

/**
 * 이미지 지연 로딩 설정 함수
 */
function setupLazyLoading() {
  // 로고 이미지를 제외한 모든 이미지에 지연 로딩 적용
  document.querySelectorAll('img').forEach(img => {
    if (!img.classList.contains('logo-img') && !img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
  });
}

/**
 * 커리큘럼 박스 최적화 함수
 */
function optimizeCurriculumBoxes() {
  const curriBoxes = document.querySelectorAll('.curri-box');
  
  if (curriBoxes.length === 0) return;
  
  // 첫 로드 시 강제 리플로우/리페인트 실행
  setTimeout(function() {
    curriBoxes.forEach(box => {
      // 텍스트 요소들 정리
      const textElements = box.querySelectorAll('.darkT.smls.pret.tacen');
      textElements.forEach(el => {
        // 강제로 스타일 재설정
        el.style.display = 'block';
        el.style.width = '100%';
        el.style.textAlign = isMobileDevice() ? 'left' : 'center';
        el.style.padding = '0 0.5rem';
        el.style.boxSizing = 'border-box';
        el.style.margin = '0.5rem 0';
        
        // 내용이 있는지 확인하고 빈 내용이면 숨김
        if (!el.textContent.trim()) {
          el.style.display = 'none';
        }
      });
      
      // 박스 가시성 확인 및 처리
      box.classList.add('optimized');
    });
    
    // 새로고침 상태 확인 및 처리
    if (sessionStorage.getItem('pageReloaded') === 'true') {
      handlePageReload(curriBoxes);
    }
  }, 100);
}

/**
 * 페이지 리소스 최적화 함수
 */
function optimizePageResources() {
  // 필요에 따라 리소스 지연 로드
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
  }, 1000);
}

/**
 * 새로고침 후 페이지 처리 함수
 * @param {NodeList} curriBoxes - 커리큘럼 박스 요소들
 */
function handlePageReload(curriBoxes) {
  // 세션 스토리지 플래그 초기화
  sessionStorage.removeItem('pageReloaded');
  
  // 커리큘럼 섹션 특별 처리
  setTimeout(function() {
    // 커리큘럼 박스에 특별 클래스 추가
    curriBoxes.forEach(box => {
      box.classList.add('reloaded');
    });
    
    // 박스들의 레이아웃 강제 리플로우
    const curriculumSection = document.querySelector('.curriculum');
    if (curriculumSection) {
      curriculumSection.style.opacity = '0.99';
      setTimeout(() => {
        curriculumSection.style.opacity = '1';
      }, 50);
    }
  }, 200);
}

/**
 * 스크롤 이벤트 최적화 함수
 */
function setupScrollEvents() {
  // 스크롤 성능 개선을 위한 쓰로틀링
  let scrollTimeout;
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        // 현재 스크롤 위치가 마지막 처리 위치와 충분히 다를 때만 처리
        if (Math.abs(window.scrollY - lastScrollY) > 50) {
          checkVisibleElements();
          lastScrollY = window.scrollY;
        }
        scrollTimeout = null;
      }, 100);
    }
  }, {passive: true});
}

/**
 * 뷰포트에 보이는 요소 처리 함수
 */
function checkVisibleElements() {
  // 뷰포트에 보이는 커리큘럼 박스만 처리
  const curriBoxes = document.querySelectorAll('.curri-box');
  curriBoxes.forEach(box => {
    const rect = box.getBoundingClientRect();
    const isVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    if (isVisible && !box.classList.contains('visible')) {
      // 가시 영역에 들어온 박스 재조정
      box.classList.add('visible');
      
      // 텍스트 요소 렌더링 안정화
      box.querySelectorAll('.darkT.smls.pret.tacen').forEach(el => {
        void el.offsetHeight; // 강제 리플로우
      });
    }
  });
}

/**
 * 모바일 터치 이벤트 최적화 함수
 */
function setupTouchEvents() {
  // 모바일에서 터치 이벤트 지연 해결
  document.addEventListener('touchstart', function() {}, {passive: true});
  
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
}

/**
 * 방향 전환 이벤트 처리 함수
 */
function setupOrientationEvent() {
  window.addEventListener('orientationchange', function() {
    // 방향 전환 시 0.3초 후 화면 재조정 (레이아웃 재계산)
    setTimeout(function() {
      window.scrollBy(0, 1);
    }, 300);
  });
}

/**
 * 페이지 로드 완료 시 실행되는 초기화 함수
 */
document.addEventListener('DOMContentLoaded', function() {
  // 모바일 디바이스 감지 및 body에 클래스 추가
  if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
  }
  
  // 각종 기능 초기화
  setupButtonEvents();
  setupSmoothScroll();
  setupLazyLoading();
  setupTouchEvents();
  optimizeCurriculumBoxes();
  setupScrollEvents();
  setupOrientationEvent();
  optimizePageResources();
  disableRightClick(); // 우클릭 방지 함수 추가
  
  // 새로고침 이벤트 감지 및 처리
  window.addEventListener('beforeunload', function() {
    // 페이지 상태 세션 스토리지에 저장
    sessionStorage.setItem('pageReloaded', 'true');
  });
  
  // 초기 페이지 로드 시간 측정 (개발용)
  console.log('페이지 로드 완료 시간: ' + (performance.now() / 1000).toFixed(2) + '초');
});

/**
 * 페이지 완전 로드 후 추가 최적화
 */
window.addEventListener('load', function() {
  // 모든 리소스 로드 후 성능 최적화
  setTimeout(() => {
    // 사용하지 않는 리소스 해제
    if (window.CollectGarbage) {
      window.CollectGarbage();
    }
    
    // 커리큘럼 박스 최종 정리
    const curriBoxes = document.querySelectorAll('.curri-box');
    curriBoxes.forEach(box => {
      // 최종 레이아웃 안정화
      if (!box.style.minHeight) {
        box.style.minHeight = box.offsetHeight + 'px';
      }
    });
    
    // 모바일 기기에서 폰트 렌더링 최적화
    if (isMobileDevice()) {
      document.body.style.textRendering = 'optimizeSpeed';
    }
  }, 500);
});

/**
 * 수상 실적 효과를 위한 추가 스크립트
 * main.js 파일 끝에 추가하거나 별도의 스크립트로 로드
 */

document.addEventListener('DOMContentLoaded', function() {
  // 수상 실적에 추가 효과 적용
  setupAwardEffects();
});

/**
 * 수상 실적 효과 설정 함수
 */
function setupAwardEffects() {
  // 메달 클래스가 있는 실적 아이템 찾기
  const medalItems = document.querySelectorAll('.medal-gold, .medal-bronze');
  
  if (medalItems.length === 0) return;
  
  // 각 메달 아이템에 추가 효과 적용
  medalItems.forEach(item => {
    // 파티클 효과 추가 (대상 수상작에만)
    if (item.classList.contains('medal-gold')) {
      addGoldParticles(item);
    }
    
    // 빛나는 효과에 랜덤 지연 추가
    const shineEffect = item.querySelector('.shine-effect');
    if (shineEffect) {
      const randomDelay = Math.random() * 2; // 0~2초 사이 랜덤 지연
      shineEffect.style.animationDelay = `${randomDelay}s`;
    }
  });
  
  // ScrollReveal과 통합 - 메달 아이템 강조
  if (window.sr) {
    window.sr.reveal(".medal-gold", {
      origin: "top",
      duration: 800,
      distance: "20px",
      scale: 1.05,
      reset: true,
      delay: 200
    });
    
    window.sr.reveal(".medal-bronze", {
      origin: "bottom",
      duration: 600,
      distance: "20px",
      reset: true,
      delay: 100
    });
  }
}

/**
 * 금메달 아이템에 추가 파티클 효과 - 강화된 버전
 * @param {HTMLElement} element - 금메달 아이템 요소
 */
function addGoldParticles(element) {
  // 이미 처리됐으면 중복 실행 방지
  if (element.dataset.particlesAdded) return;
  element.dataset.particlesAdded = "true";
  
  // 파티클 개수 증가
  const particleCount = 12;
  
  // 파티클 추가
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'gold-particle';
    
    // 랜덤 크기 추가
    const randomSize = 4 + Math.random() * 6;
    
    // 랜덤 위치 및 애니메이션 지연
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomDelay = Math.random() * 5;
    const randomDuration = 2 + Math.random() * 3;
    
    // 인라인 스타일 설정 - 강화된 색상과 효과
    particle.style.cssText = `
      position: absolute;
      width: ${randomSize}px;
      height: ${randomSize}px;
      background: rgba(255, 215, 0, 0.9);
      box-shadow: 0 0 10px rgba(255, 165, 0, 0.8), 0 0 5px rgba(255, 165, 0, 0.6);
      border-radius: 50%;
      top: ${randomY}%;
      left: ${randomX}%;
      z-index: 3;
      opacity: 0;
      pointer-events: none;
      animation: particles ${randomDuration}s infinite ease-in-out;
      animation-delay: ${randomDelay}s;
    `;
    
    // 요소에 추가
    element.appendChild(particle);
  }
}

/**
 * 가시성 변경 시 애니메이션 최적화
 */
document.addEventListener('visibilitychange', function() {
  const medalItems = document.querySelectorAll('.medal-gold, .medal-bronze');
  
  if (document.hidden) {
    // 페이지가 보이지 않을 때는 애니메이션 일시 중지
    medalItems.forEach(item => {
      const shineEffect = item.querySelector('.shine-effect');
      if (shineEffect) {
        shineEffect.style.animationPlayState = 'paused';
      }
      
      const particles = item.querySelectorAll('.gold-particle');
      particles.forEach(particle => {
        particle.style.animationPlayState = 'paused';
      });
    });
  } else {
    // 페이지가 다시 보일 때 애니메이션 재개
    medalItems.forEach(item => {
      const shineEffect = item.querySelector('.shine-effect');
      if (shineEffect) {
        shineEffect.style.animationPlayState = 'running';
      }
      
      const particles = item.querySelectorAll('.gold-particle');
      particles.forEach(particle => {
        particle.style.animationPlayState = 'running';
      });
    });
  }
});

/**
 * 섹션 전환 및 스크롤 효과 개선 
 * main.js 파일에 추가
 */

document.addEventListener('DOMContentLoaded', function() {
  // 기존 버튼 이벤트 유지
  setupButtonEvents();
  
  // 섹션 스크롤 효과 개선
  enhanceSectionTransitions();
  
  // 스크롤 효과 설정
  setupScrollEffects();
});

/**
 * 섹션 전환 애니메이션 개선 함수
 */
function enhanceSectionTransitions() {
  // ScrollReveal 객체가 있는지 확인
  if (!window.sr) return;
  
  // 성과 섹션 애니메이션
  window.sr.reveal(".achievements .section-title", {
    origin: "top",
    duration: 800,
    distance: "30px",
    delay: 100
  });
  
  // 구분선 애니메이션
  window.sr.reveal(".section-divider", {
    origin: "left",
    duration: 1000,
    distance: "100%",
    delay: 200
  });
  
  // 프로젝트 섹션 애니메이션
  window.sr.reveal(".projects-section .section-title", {
    origin: "top",
    duration: 800,
    distance: "30px",
    delay: 300
  });
  
  // 프로젝트 아이템 애니메이션
  window.sr.reveal(".project-item", {
    origin: "bottom",
    duration: 600,
    distance: "30px",
    interval: 200
  });
}

/**
 * 세부 스크롤 효과 설정 함수
 */
function setupScrollEffects() {
  // IntersectionObserver 지원 확인
  if ('IntersectionObserver' in window) {
    // 섹션 관찰자 생성
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 화면에 들어오면 active 클래스 추가
        if (entry.isIntersecting) {
          entry.target.classList.add('section-active');
          
          // 성과/프로젝트 섹션이 화면에 들어올 때 효과 적용
          if (entry.target.classList.contains('achievements') || 
              entry.target.classList.contains('projects-section')) {
            highlightItems(entry.target);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    
    // 섹션 관찰 시작
    document.querySelectorAll('.page').forEach(section => {
      sectionObserver.observe(section);
    });
  }
}

/**
 * 섹션 내 아이템 강조 효과 함수
 * @param {HTMLElement} section - 강조할 아이템을 포함한 섹션
 */
function highlightItems(section) {
  // 모든 아이템 선택
  const items = section.querySelectorAll('.achievement-item, .project-item');
  
  // 아이템이 없으면 종료
  if (items.length === 0) return;
  
  // 각 아이템에 지연 강조 효과 적용
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('item-highlight');
      
      // 메달이 있는 아이템은 추가 효과
      if (item.classList.contains('medal-gold') || item.classList.contains('medal-bronze')) {
        item.classList.add('medal-highlight');
      }
    }, 300 * index);
  });
}

// CSS 클래스 추가 (스타일시트에 추가할 내용)
// 문자열로만 제공하는 코드이므로 실제로는 CSS 파일에 추가해야 함
const transitionCSS = `
/* 섹션 활성화 효과 */
.section-active {
  opacity: 1;
}

/* 아이템 강조 효과 */
@keyframes itemHighlight {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
}

.item-highlight {
  animation: itemHighlight 1s ease-in-out;
}

/* 메달 하이라이트 효과 */
@keyframes medalPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
}

.medal-gold.medal-highlight .medal-ribbon {
  animation: medalPulse 1.5s ease-in-out;
}

.medal-bronze.medal-highlight .medal-ribbon {
  animation: medalPulse 1.5s ease-in-out;
  animation-delay: 0.3s;
}
`;

// 런타임에서 스타일 추가 (실제 구현에서는 CSS 파일에 직접 추가해야 함)
function addTransitionCSS() {
  const styleElement = document.createElement('style');
  styleElement.textContent = transitionCSS;
  document.head.appendChild(styleElement);
}

// 페이지 로드 완료 시 스타일 추가
window.addEventListener('load', addTransitionCSS);
