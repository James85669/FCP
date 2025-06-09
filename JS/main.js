document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js 已載入！");

  const slides = document.querySelectorAll('.slide');
  const fog = document.querySelector('.fog-transition');
  const about = document.querySelector('.about');
  const hero = document.querySelector('.hero');
  const body = document.body;
  const btnStart = document.getElementById('btnStart');

  const TOTAL_STAGES = 12;
  let currentStage = 0;
  let isScrolling = false;
  let hasEnteredAbout = false;
  let hoverInterval;
  let frame = 1;

  body.classList.add('lock-scroll');

  setTimeout(() => {
    updateSlides();
  }, 3000);

  function updateSlides() {
    slides.forEach(slide => {
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

      body.classList.add('lock-scroll');
      hero.style.opacity = '1';
      fog.style.display = 'none';
    }

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

  // Hover 切換六張圖
  if (btnStart) {
    btnStart.addEventListener('mouseover', () => {
      hoverInterval = setInterval(() => {
        frame++;
        if (frame > 6) frame = 1;
        btnStart.src = `/img/btn-start-${frame}.svg`;
      }, 100);
    });

    btnStart.addEventListener('mouseout', () => {
      clearInterval(hoverInterval);
      frame = 1;
      btnStart.src = './img/btn-start-1.svg';
    });
  }
});