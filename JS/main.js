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

  // 鎖住初始滾動
  body.classList.add('lock-scroll');

  // 顯示第一則留言（延遲模糊動畫結束後）
  setTimeout(() => {
    updateSlides();
  }, 3000);

  function updateSlides() {
    // 清除現有 slide 狀態
    slides.forEach((slide, index) => {
      slide.classList.remove(
        'slide--step-0', 'slide--step-1', 'slide--step-2',
        'slide--hidden-left', 'slide--hidden-right'
      );
    });

    fog.className = 'fog-transition';

    // 處理留言階段 0~8
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

      body.classList.add('lock-scroll'); // 返回留言時重新鎖住滾動
      hero.style.opacity = '1';
      fog.style.display = 'none';
    }

    // 處理白霧階段 9~11
    if (currentStage >= 9 && currentStage <= 11) {
      const fogStep = currentStage - 9;
      fog.style.display = 'block';
      fog.classList.add(`fog-stage-${fogStep}`);

      // 讓第三張留言滑走
      if (currentStage === 9) {
        slides[2].classList.remove('slide--step-2');
        slides[2].classList.add('slide--hidden-left');
      }

      // 到最後白霧階段後轉場
      if (currentStage === 11) {
        hero.style.transition = 'opacity 1s ease';
        hero.style.opacity = '0';
        body.classList.remove('lock-scroll');

        // 用 scrollIntoView 轉場
        setTimeout(() => {
          about.scrollIntoView({ behavior: 'smooth' });

          // fog 進入 .about 後淡出
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

  // 控制滾動狀態
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

  // Header 自動切換 dark / light 模式
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

  // 開始策畫按鈕 hover 切換圖片
  if (btnStart) {
    btnStart.addEventListener('mouseover', () => {
      btnStart.src = './img/btn-start-hover.svg';
    });
    btnStart.addEventListener('mouseout', () => {
      btnStart.src = './img/btn-start.svg';
    });
  }

  // 回到頂部按鈕
  // 回到頂部按鈕 hover 切換圖片
  if (backToTop) {
    backToTop.addEventListener('mouseover', () => {
      backToTop.querySelector('img').src = './img/backtotop-hover.svg';
    });
    backToTop.addEventListener('mouseout', () => {
      backToTop.querySelector('img').src = './img/backtotop.svg';
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      hero.style.opacity = '1';
      body.classList.add('lock-scroll');
      currentStage = 0;
      updateSlides();
    });
  }
});