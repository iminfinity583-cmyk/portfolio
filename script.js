document.addEventListener('DOMContentLoaded', () => {

  /* Theme Toggle */
  const themeToggle = document.getElementById('theme-toggle');
  const icon = themeToggle.querySelector('i');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      icon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      icon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'light');
    }
  });

  /* Mobile Menu */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  /* Active Nav Link */
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
    navLinks.querySelectorAll('a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  /* Scroll Reveal */
  const revealElements = document.querySelectorAll('.timeline-item, .work-item, .testimonial-card, .pub-item, .metric');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* Back to Top */
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

  /* Smooth scroll for anchor links */
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
