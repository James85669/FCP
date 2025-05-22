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

  const TOTAL_STAGES = 12;
  let currentStage = 0;
  let isScrolling = false;

  // 鎖住滾動直到首頁動畫跑完
  body.classList.add('lock-scroll');

  // 等待模糊動畫結束再顯示第一則留言
  setTimeout(() => {
    updateSlides();
  }, 3000);

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.remove(
        'slide--step-0', 'slide--step-1', 'slide--step-2',
        'slide--hidden-left', 'slide--hidden-right'
      );
    });

    fog.className = 'fog-transition';

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
    }

    if (currentStage >= 9 && currentStage <= 11) {
      const fogStep = currentStage - 9;
      fog.style.display = 'block';
      fog.classList.add(`fog-stage-${fogStep}`);

      if (currentStage === 9) {
        slides[2].classList.remove('slide--step-2');
        slides[2].classList.add('slide--hidden-left');
      }
    }

    if (currentStage === 11) {
      hero.style.transition = 'opacity 1s ease';
      hero.style.opacity = '0';

      setTimeout(() => {
        body.classList.remove('lock-scroll');
        window.removeEventListener('wheel', handleScroll);
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

  // Header 切換 dark/light（scroll 觸發）
  function updateHeaderStyle() {
    const aboutTop = about.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (aboutTop <= windowHeight * 0.3) {
      header.classList.add('header--light');
      header.classList.remove('header--dark');
      logoImg.src = './img/logo-dark.svg';
      memberIcon.src = './img/member-dark.svg';
      backToTop.classList.add('show');
    } else {
      header.classList.add('header--dark');
      header.classList.remove('header--light');
      logoImg.src = './img/logo-light.svg';
      memberIcon.src = './img/member-light.svg';
      backToTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateHeaderStyle);
  });
  window.addEventListener('load', updateHeaderStyle);
});
