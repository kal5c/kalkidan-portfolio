/* =====================================================
   MAIN.JS
   Shared interactivity for the portfolio site:
   - Mobile hamburger nav
   - Active nav link highlighting
   - Navbar shrink/shadow on scroll
   - Back-to-top button
   - Scroll-reveal animations
   - Contact form validation
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  initActiveNavLink();
  initNavbarScroll();
  initBackToTop();
  initScrollReveal();
  initContactForm();
});


/* =====================================================
   MOBILE HAMBURGER MENU
===================================================== */

function initNavToggle() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const ul = navbar.querySelector('ul');
  if (!ul) return;

  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Toggle navigation menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  navbar.insertBefore(toggle, ul);

  toggle.addEventListener('click', function () {
    const isOpen = ul.classList.toggle('nav-open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu whenever a link is clicked (mobile UX)
  ul.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      ul.classList.remove('nav-open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close the menu on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      ul.classList.remove('nav-open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* =====================================================
   ACTIVE NAV LINK (auto-detects current page)
===================================================== */

function initActiveNavLink() {
  const links = document.querySelectorAll('.navbar ul li a');
  if (!links.length) return;

  let currentPage = window.location.pathname.split('/').pop();
  if (currentPage === '') currentPage = 'portfolio.html';
  currentPage = decodeURIComponent(currentPage).toLowerCase();

  links.forEach(function (link) {
    const li = link.closest('li');
    if (!li) return;

    let href = (link.getAttribute('href') || '').toLowerCase();

    li.classList.remove('active');

    const isHome = currentPage === 'portfolio.html' && (href === '#' || href === 'portfolio.html');
    const isMatch = href === currentPage;

    if (isHome || isMatch) {
      li.classList.add('active');
    }
  });
}


/* =====================================================
   NAVBAR SHRINK / SHADOW ON SCROLL
===================================================== */

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
}


/* =====================================================
   BACK TO TOP BUTTON
===================================================== */

function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="bx bx-up-arrow-alt"></i>';

  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* =====================================================
   SCROLL REVEAL ANIMATIONS
===================================================== */

function initScrollReveal() {
  const selector = [
    '.about-hero-content', '.about-text', '.developer-card',
    '.focus-box', '.goal-container',
    '.hero-content', '.hero-image', '.section-heading',
    '.skill-card', '.technology-container',
    '.service-box', '.tool-box', '.learning-content',
    '.project-card', '.current-content',
    '.contact-info', '.contact-form-container',
    '.cta-container'
  ].join(', ');

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  elements.forEach(function (el, index) {
    el.classList.add('js-reveal');
    el.style.transitionDelay = (index % 4) * 0.08 + 's';
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('js-reveal-visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('js-reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(function (el) { observer.observe(el); });
}


/* =====================================================
   CONTACT FORM VALIDATION
   (Frontend validation only — no backend connected yet)
===================================================== */

function initContactForm() {
  const form = document.querySelector('.contact-form-container form');
  if (!form) return;

  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    subject: form.querySelector('#subject'),
    message: form.querySelector('#message')
  };

  function showError(field, message) {
    clearError(field);
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('error');

    const msg = document.createElement('span');
    msg.className = 'form-error-msg';
    msg.textContent = message;
    group.appendChild(msg);
  }

  function clearError(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.remove('error');
    const existing = group.querySelector('.form-error-msg');
    if (existing) existing.remove();
  }

  function validateField(field) {
    if (!field) return true;
    const value = field.value.trim();

    if (field === fields.name) {
      if (value.length < 2) {
        showError(field, 'Please enter your name (at least 2 characters).');
        return false;
      }
    }

    if (field === fields.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        showError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    if (field === fields.subject) {
      if (value.length < 3) {
        showError(field, 'Please enter a subject.');
        return false;
      }
    }

    if (field === fields.message) {
      if (value.length < 10) {
        showError(field, 'Your message should be at least 10 characters.');
        return false;
      }
    }

    clearError(field);
    return true;
  }

  Object.values(fields).forEach(function (field) {
    if (!field) return;

    field.addEventListener('blur', function () {
      validateField(field);
    });

    field.addEventListener('input', function () {
      const group = field.closest('.form-group');
      if (group && group.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    Object.values(fields).forEach(function (field) {
      if (field && !validateField(field)) isValid = false;
    });

    const existingSuccess = form.parentElement.querySelector('.form-success-box');
    if (existingSuccess) existingSuccess.remove();

    if (!isValid) {
      const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    const successBox = document.createElement('div');
    successBox.className = 'form-success-box';
    successBox.innerHTML =
      '<i class="bx bx-check-circle"></i> ' +
      'Looks good! Your message passed validation. ' +
      '(This form isn\'t connected to a backend yet, so nothing was actually sent.)';

    form.parentElement.insertBefore(successBox, form);

    window.setTimeout(function () {
      successBox.remove();
    }, 7000);

    form.reset();
    Object.values(fields).forEach(function (field) {
      if (field) clearError(field);
    });
  });
}
