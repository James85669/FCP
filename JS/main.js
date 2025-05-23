document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const fog = document.querySelector('.fog-transition');
  const about = document.querySelector('.about');
  const hero = document.querySelector('.hero');
  const body = document.body;

  const header = document.querySelector('.header');
  const logoImg = document.getElementById('header-logo');
  const memberIcon = document.querySelector('.member-icon');
  const backToTop = document.getElementById('backToTop');
  const btnStart = document.querySelector('.btn-start');

  const TOTAL_STAGES = 12;
  let currentStage = 0;
  let isScrolling = false;
  let hasEnteredAbout = false;

  // 初始：鎖住滾動
  body.classList.add('lock-scroll');

  // 延遲 3 秒顯示第一則留言
  setTimeout(() => {
    updateSlides();
  }, 3000);

  function updateSlides() {
    // 清除所有 slide 狀態
    slides.forEach(slide => {
      slide.classList.remove(
        'slide--step-0', 'slide--step-1', 'slide--step-2',
        'slide--hidden-left', 'slide--hidden-right'
      );
    });

    fog.className = 'fog-transition';

    // 留言階段 (0~8)
    if (currentStage <= 8) {
      const currentSlideIndex = Math.floor(currentStage / 3);
      const currentStep = currentStage % 3;

      slides.forEach((slide, index) => {
        if (index < currentSlideIndex) {
          slide.classList.add('slide--hidden-left');
        } else if (index > currentSlideIndex) {
          slide.classList.add('slide--hidden-right');
        } else {
          slide.classList.add(`slide--step-${currentStep}`);
        }
      });

      body.classList.add('lock-scroll');
      hero.style.opacity = '1';
      fog.style.display = 'none';
    }

    // 白霧階段 (9~11)
    if (currentStage >= 9 && currentStage <= 11) {
      const fogStep = currentStage - 9;
      fog.style.display = 'block';
      fog.classList.add(`fog-stage-${fogStep}`);

      if (currentStage === 9) {
        slides[2].classList.remove('slide--step-2');
        slides[2].classList.add('slide--hidden-left');
      }

      if (currentStage === 11 && !hasEnteredAbout) {
        hasEnteredAbout = true;
        hero.style.transition = 'opacity 1s ease';
        hero.style.opacity = '0';
        body.classList.remove('lock-scroll');

        setTimeout(() => {
          about.scrollIntoView({ behavior: 'smooth' });

          const fogObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                fog.style.transition = 'opacity 1s ease';
                fog.style.opacity = '0';
                setTimeout(() => {
                  fog.style.display = 'none';
                }, 1000);
                obs.disconnect();
              }
            });
          });
          fogObserver.observe(about);
        }, 1200);
      }
    }
  }

  // 滾動控制
  function handleScroll(e) {
    if (isScrolling) return;
    isScrolling = true;

    if (e.deltaY > 0 && currentStage < TOTAL_STAGES - 1) {
      currentStage++;
    } else if (e.deltaY < 0 && currentStage > 0) {
      currentStage--;
    }

    updateSlides();

    setTimeout(() => {
      isScrolling = false;
    }, 400);
  }

  window.addEventListener('wheel', handleScroll);

  // Header 顏色變化（scroll 監聽）
  function updateHeaderStyle() {
    const aboutTop = about.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (aboutTop <= windowHeight * 0.3) {
      header.classList.add('header--light');
      header.classList.remove('header--dark');
      logoImg.src = './img/logo-dark.svg';
      memberIcon.src = './img/member-dark.svg';
      backToTop?.classList.add('show');
    } else {
      header.classList.add('header--dark');
      header.classList.remove('header--light');
      logoImg.src = './img/logo-light.svg';
      memberIcon.src = './img/member-light.svg';
      backToTop?.classList.remove('show');
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateHeaderStyle);
  });
  window.addEventListener('load', updateHeaderStyle);

  // 開始策畫按鈕 hover
  if (btnStart) {
    btnStart.addEventListener('mouseover', () => {
      btnStart.src = './img/btn-start-hover.svg';
    });
    btnStart.addEventListener('mouseout', () => {
      btnStart.src = './img/btn-start.svg';
    });
  }

  // 回到頂部按鈕 hover + 點擊
  if (backToTop) {
    const icon = backToTop.querySelector('img');

    backToTop.addEventListener('mouseover', () => {
      icon.src = './img/backtotop-hover.svg';
    });

    backToTop.addEventListener('mouseout', () => {
      icon.src = './img/backtotop.svg';
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      hero.style.opacity = '1';
      body.classList.add('lock-scroll');
      currentStage = 0;
      hasEnteredAbout = false; // reset
      updateSlides();
    });
  }
});
