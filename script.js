/* ============================================================
   ISA AGENCY — Script
   Scroll reveal, hero slider, portfolio filters, mobile menu,
   counter animation, modal, promo bar
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===================== NAV REFERENCE =====================
  const mainNav = document.getElementById('mainNav');

  // ===================== HERO SLIDER =====================
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(parseInt(dot.dataset.slide));
      startSlider();
    });
  });

  startSlider();

  // ===================== SCROLL REVEAL =====================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===================== COUNTER ANIMATION =====================
  const counters = document.querySelectorAll('.stats__number[data-count]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) counterObserver.observe(statsSection);

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        counter.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
          // Add + suffix
          if (target > 10) counter.textContent = target + '+';
        }
      }

      requestAnimationFrame(update);
    });

    // Also animate the project counter
    const projectCount = document.getElementById('projectCount');
    if (projectCount) {
      const target = 48;
      const duration = 2000;
      const startTime = performance.now();

      function updateProject(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        projectCount.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(updateProject);
        } else {
          projectCount.textContent = target;
        }
      }

      requestAnimationFrame(updateProject);
    }
  }

  // ===================== PORTFOLIO FILTERS =====================
  const filterBtns = document.querySelectorAll('.portfolio__filter');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Add fadeInUp keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // ===================== MOBILE MENU =====================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuLinks = document.querySelectorAll('[data-close-menu]');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  closeMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===================== MODAL (Portfolio Item Click) =====================
  const modal = document.getElementById('projectModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCat = document.getElementById('modalCat');
  const modalClose = document.getElementById('modalClose');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.dataset.img;
      const title = item.dataset.title;
      const category = item.querySelector('.portfolio__item-category')?.textContent || '';

      modalImage.src = imgSrc;
      modalTitle.textContent = title;
      modalCat.textContent = category;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ===================== NAV SCROLL EFFECT =====================
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add background solidify effect on scroll
    if (scrollY > 100) {
      mainNav.querySelector('.nav__inner').style.background = 'rgba(26, 22, 20, 0.95)';
    } else {
      mainNav.querySelector('.nav__inner').style.background = '';
    }

    lastScroll = scrollY;
  }, { passive: true });

  // ===================== SMOOTH SCROLL FOR ANCHORS =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = mainNav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===================== FORM SUBMISSION =====================
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.cta__form-submit');
    const originalText = btn.textContent;

    btn.textContent = 'Отправлено ✓';
    btn.style.background = '#4CAF50';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });



});
