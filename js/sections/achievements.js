/**
 * 실적 섹션 관련 기능
 * 실적 카드 및 메달 효과 구현 
 */

// 전역 네임스페이스
window.ItIsIt = window.ItIsIt || {};

(function() {
  'use strict';
  
  /**
   * 실적 효과 모듈
   */
  const AchievementEffects = {
    /**
     * 수상 실적 효과 설정 함수
     */
    setupAwardEffects: function() {
      // 메달 클래스가 있는 실적 아이템 찾기
      const medalItems = document.querySelectorAll('.medal-gold, .medal-bronze');
      const medalCount = medalItems.length;
      
      if (medalCount === 0) return;
      
      // 각 메달 아이템에 지연 적용 (성능 최적화)
      for (let i = 0; i < medalCount; i++) {
        const item = medalItems[i];
        
        // 빛나는 효과에 랜덤 지연 추가
        const shineEffect = item.querySelector('.shine-effect');
        if (shineEffect) {
          shineEffect.style.animationDelay = `${Math.random() * 2}s`;
        }
        
        // 금메달 아이템에 파티클 효과 (고성능 버전)
        if (item.classList.contains('medal-gold') && !item.dataset.particlesAdded) {
          this.addGoldParticles(item);
        }
      }
      
      // ScrollReveal 통합 (존재할 경우만)
      if (window.sr) {
        window.sr.reveal(".medal-gold", {
          origin: "top",
          duration: 800,
          distance: "20px",
          scale: 1.05,
          reset: false,
          delay: 200
        });
        
        window.sr.reveal(".medal-bronze", {
          origin: "bottom",
          duration: 600,
          distance: "20px",
          reset: false,
          delay: 100
        });
      }
    },
    
    /**
     * 금메달 아이템에 최적화된 파티클 효과
     * @param {HTMLElement} element - 금메달 아이템 요소
     */
    addGoldParticles: function(element) {
      window.ItIsIt.AnimationUtils.createParticles(element, 8, 'rgba(255,215,0,0.9)');
    },
    
    /**
     * 실적 항목 상세 정보 토글 기능
     */
    setupAchievementDetails: function() {
      // 실적 아이템에 클릭 이벤트 추가
      const achievementItems = document.querySelectorAll('.achievement-item');
      
      achievementItems.forEach(item => {
        // 호버 효과 강화
        item.addEventListener('mouseenter', function() {
          const thumbnail = this.querySelector('.achievement-thumbnail');
          if (thumbnail) {
            thumbnail.style.transform = 'scale(1.1)';
          }
        });
        
        item.addEventListener('mouseleave', function() {
          const thumbnail = this.querySelector('.achievement-thumbnail');
          if (thumbnail) {
            thumbnail.style.transform = '';
          }
        });
      });
    },
    
    /**
     * 섹션 전환 애니메이션 최적화
     */
    enhanceSectionTransitions: function() {
      // ScrollReveal 존재 확인
      if (!window.sr) return;
      
      // 묶음 처리로 성능 최적화
      const reveals = [
        {
          selector: ".achievements .section-title",
          options: { origin: "top", duration: 800, distance: "30px", delay: 100 }
        },
        {
          selector: ".section-divider",
          options: { origin: "left", duration: 1000, distance: "100%", delay: 200 }
        },
        {
          selector: ".projects-section .section-title",
          options: { origin: "top", duration: 800, distance: "30px", delay: 300 }
        },
        {
          selector: ".project-item",
          options: { origin: "bottom", duration: 600, distance: "30px", interval: 200 }
        }
      ];
      
      // 한번에 등록
      reveals.forEach(({ selector, options }) => {
        if (document.querySelector(selector)) {
          window.sr.reveal(selector, options);
        }
      });
    },
    
    /**
     * 섹션 스크롤 효과 최적화
     */
    setupScrollEffects: function() {
      // IntersectionObserver 지원 확인 및 활용
      if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('section-active');
              
              // 특정 섹션에만 추가 효과 적용 (조건부 처리)
              if (entry.target.classList.contains('achievements') || 
                  entry.target.classList.contains('projects-section')) {
                // 이미 처리되었는지 확인하여 중복 실행 방지
                if (!entry.target.dataset.highlighted) {
                  this.highlightItems(entry.target);
                  entry.target.dataset.highlighted = 'true';
                }
              }
              
              // 항목이 활성화된 후 관찰 중단 (성능 최적화)
              sectionObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1
        });
        
        // 섹션 관찰 시작
        document.querySelectorAll('.page').forEach(section => {
          sectionObserver.observe(section);
        });
      }
    },
    
    /**
     * 섹션 내 아이템 강조 효과 최적화
     * @param {HTMLElement} section - 강조할 아이템을 포함한 섹션
     */
    highlightItems: function(section) {
      // 모든 아이템 선택
      const items = section.querySelectorAll('.achievement-item, .project-item');
      const itemCount = items.length;
      
      if (itemCount === 0) return;
      
      // 효율적인 지연 적용 방법
      for (let i = 0; i < itemCount; i++) {
        const item = items[i];
        // 클로저 사용을 피하고 인덱스 활용
        setTimeout(() => {
          item.classList.add('item-highlight');
          
          // 메달 아이템에 추가 효과
          if (item.classList.contains('medal-gold') || item.classList.contains('medal-bronze')) {
            item.classList.add('medal-highlight');
          }
        }, 200 * i); // 지연 시간 미세 최적화
      }
    },
    
    /**
     * 초기화 함수
     */
    init: function() {
      this.setupAwardEffects();
      this.setupAchievementDetails();
      this.enhanceSectionTransitions();
      this.setupScrollEffects();
    }
  };
  
  // 전역 네임스페이스에 모듈 추가
  window.ItIsIt.AchievementEffects = AchievementEffects;
})();