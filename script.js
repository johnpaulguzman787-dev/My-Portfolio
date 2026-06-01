/* ============================================
   JOHN PAUL GUZMAN — PORTFOLIO SCRIPT
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- LOADER ---- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      startCounters();
    }, 1800);
  });
  document.body.style.overflow = 'hidden';

  /* ---- AOS INIT ---- */
  AOS.init({
    duration: 700,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    once: true,
    offset: 60,
  });

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Update active nav link
    updateActiveNavLink();
  }, { passive: true });

  /* ---- SMOOTH SCROLL NAV ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      // Close mobile nav
      const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navbarNav'));
      if (bsCollapse) bsCollapse.hide();
    });
  });

  /* ---- BACK TO TOP ---- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- ACTIVE NAV LINK ---- */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + navbar.offsetHeight + 60;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ---- THEME TOGGLE ---- */
  const darkToggle = document.getElementById('darkToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlEl = document.documentElement;
  let currentTheme = localStorage.getItem('portfolio-theme') || 'dark';

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('portfolio-theme', theme);
    currentTheme = theme;
  }

  applyTheme(currentTheme);

  darkToggle.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  /* ---- COUNTER ANIMATION ---- */
  function startCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'));
      const duration = 1500;
      const start = performance.now();

      function update(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
    });
  }

  /* ---- SKILL BAR ANIMATION ---- */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const width = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = width + '%'; }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(card => {
    skillObserver.observe(card);
  });

  /* ---- CONTACT FORM ---- */
  window.handleContactForm = function () {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const btn = document.querySelector('[onclick="handleContactForm()"]');

    if (!name || !email || !message) {
      shakeButton(btn);
      return;
    }

    if (!isValidEmail(email)) {
      shakeButton(btn);
      return;
    }

    // Simulate submission
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    btn.disabled = true;

    setTimeout(() => {
      document.getElementById('formSuccess').classList.remove('d-none');
      btn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
      btn.style.background = '#10B981';
      document.getElementById('contactName').value = '';
      document.getElementById('contactEmail').value = '';
      document.getElementById('contactSubject').value = '';
      document.getElementById('contactMessage').value = '';

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
        btn.style.background = '';
        btn.disabled = false;
        document.getElementById('formSuccess').classList.add('d-none');
      }, 4000);
    }, 1500);
  };

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeButton(btn) {
    btn.style.animation = 'shake 0.4s ease';
    btn.style.borderColor = '#EF4444';
    setTimeout(() => {
      btn.style.animation = '';
      btn.style.borderColor = '';
    }, 500);
  }

  /* ---- PARALLAX HERO ORBS ---- */
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPercent = (clientX / innerWidth - 0.5) * 20;
    const yPercent = (clientY / innerHeight - 0.5) * 20;

    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (orb1) orb1.style.transform = `translate(${xPercent * 0.6}px, ${yPercent * 0.6}px)`;
    if (orb2) orb2.style.transform = `translate(${-xPercent * 0.4}px, ${-yPercent * 0.4}px)`;
  });

  /* ---- PROJECT CARDS TILT ---- */
  document.querySelectorAll('.project-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- NAVBAR ACTIVE LINK STYLE ---- */
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active { color: var(--accent) !important; }
    @keyframes shake {
      0%,100%{transform:translateX(0);}
      20%,60%{transform:translateX(-6px);}
      40%,80%{transform:translateX(6px);}
    }
  `;
  document.head.appendChild(style);

});