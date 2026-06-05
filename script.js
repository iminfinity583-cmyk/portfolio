document.addEventListener('DOMContentLoaded', () => {

  /* ---- Theme Toggle ---- */
  const themeToggle = document.getElementById('theme-toggle');
  const icon = themeToggle.querySelector('i');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      icon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'dark');
    }
  });

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = navLinks.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  /* ---- Active Nav Link ---- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  /* ---- Typing Effect ---- */
  const roles = ['Web Developer', 'UI/UX Designer', 'Creative Thinker'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedText = document.querySelector('.typed-text');

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 50 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500;
    }

    setTimeout(typeEffect, delay);
  }

  typeEffect();

  /* ---- Scroll Reveal ---- */
  const revealElements = document.querySelectorAll('.service-card, .project-card, .about-grid, .contact-grid, .skills, .about-stats, .section-subtitle');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---- Counter Animation ---- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        let count = 0;
        const increment = Math.ceil(target / 60);
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = count;
          }
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ---- Back to Top ---- */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Smooth scroll for anchor links (fallback) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
