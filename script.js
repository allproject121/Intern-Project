/**
 * Aken Tech Solution - Interactive Scripts
 * Strict Pixel-Accurate UI Recreation
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initServiceFilters();
  initPortfolioFilters();
  initBlogFiltersAndSearch();
  initTestimonials();
  initFaqAccordion();
  initForms();
  initModal();
  initServiceCardsScrollReveal();
  initProgressRail();
});

/* ==========================================================================
   HEADER & NAVIGATION
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Highlight current active page link if not manually active
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   MOBILE NAVIGATION TOGGLE (.mobile-toggle)
   Handles showing and hiding the navigation menu drawer on mobile devices
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  // Ensure a mobile backdrop overlay exists in the DOM
  let backdrop = document.querySelector('.mobile-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    document.body.appendChild(backdrop);
  }

  // Hamburger SVG icon template
  const hamburgerIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  `;

  // Close 'X' SVG icon template
  const closeIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  /**
   * Toggles the mobile menu state
   * @param {boolean} [forceState] - Optional explicit open (true) or close (false)
   */
  function setMenuState(open) {
    if (open) {
      navMenu.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close Navigation Menu');
      toggleBtn.innerHTML = closeIcon;
    } else {
      navMenu.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = ''; // Restore background scrolling
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open Navigation Menu');
      toggleBtn.innerHTML = hamburgerIcon;
    }
  }

  // 1. Handle .mobile-toggle click event
  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = navMenu.classList.contains('open');
    setMenuState(!isOpen);
  });

  // 2. Close menu when clicking outside on the backdrop
  backdrop.addEventListener('click', () => {
    setMenuState(false);
  });

  // 3. Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      setMenuState(false);
    }
  });

  // 4. Close menu when clicking any standard navigation link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      // If clicking a parent dropdown item on mobile, let the dropdown handler manage it
      const parentDropdown = link.closest('.nav-item-dropdown');
      if (parentDropdown && link === parentDropdown.querySelector(':scope > .nav-link')) {
        return;
      }
      setMenuState(false);
    });
  });

  // 5. Mobile dropdown submenus accordion handling
  const dropdownItems = navMenu.querySelectorAll('.nav-item-dropdown');
  dropdownItems.forEach(item => {
    const parentLink = item.querySelector('.nav-link');
    const dropdownMenu = item.querySelector('.dropdown-menu');
    const icon = parentLink ? parentLink.querySelector('.dropdown-icon') : null;

    if (parentLink && dropdownMenu) {
      parentLink.addEventListener('click', (e) => {
        if (window.innerWidth < 1024) {
          e.preventDefault();
          e.stopPropagation();

          const isExpanded = dropdownMenu.style.display === 'block';

          // Close other dropdowns
          dropdownItems.forEach(otherItem => {
            if (otherItem !== item) {
              const otherMenu = otherItem.querySelector('.dropdown-menu');
              const otherIcon = otherItem.querySelector('.dropdown-icon');
              if (otherMenu) otherMenu.style.display = 'none';
              if (otherIcon) otherIcon.style.transform = '';
            }
          });

          // Toggle current dropdown
          if (!isExpanded) {
            dropdownMenu.style.display = 'block';
            if (icon) icon.style.transform = 'rotate(180deg)';
          } else {
            dropdownMenu.style.display = 'none';
            if (icon) icon.style.transform = '';
          }
        }
      });
    }
  });

  // 6. Reset state if viewport resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && navMenu.classList.contains('open')) {
      setMenuState(false);
    }
  });
}

/* ==========================================================================
   SERVICES CATEGORY FILTER (PAGE #3)
   ========================================================================== */
function initServiceFilters() {
  const filterTabs = document.querySelectorAll('[data-service-filter]');
  const serviceCards = document.querySelectorAll('[data-service-category]');
  if (!filterTabs.length || !serviceCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-service-filter');
      serviceCards.forEach(card => {
        const category = card.getAttribute('data-service-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   PORTFOLIO CATEGORY FILTER (PAGE #8)
   ========================================================================== */
function initPortfolioFilters() {
  const filterTabs = document.querySelectorAll('[data-portfolio-filter]');
  const projectCards = document.querySelectorAll('[data-portfolio-category]');
  if (!filterTabs.length || !projectCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-portfolio-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-portfolio-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   BLOG CATEGORY FILTER & LIVE SEARCH (PAGE #6)
   ========================================================================== */
function initBlogFiltersAndSearch() {
  const filterTabs = document.querySelectorAll('[data-blog-filter]');
  const blogCards = document.querySelectorAll('[data-blog-category]');
  const searchInput = document.querySelector('#blog-search-input');
  if (!blogCards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    blogCards.forEach(card => {
      const cardCat = card.getAttribute('data-blog-category') || '';
      const title = (card.querySelector('.blog-card-title') || card.querySelector('h3') || {}).textContent || '';
      
      const matchesCategory = currentCategory === 'all' || cardCat.toLowerCase().includes(currentCategory.toLowerCase());
      const matchesSearch = !searchQuery || title.toLowerCase().includes(searchQuery.toLowerCase());

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-blog-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      applyFilters();
    });

    const searchBtn = document.querySelector('.blog-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        applyFilters();
      });
    }
  }
}

/* ==========================================================================
   TESTIMONIALS SLIDER / CAROUSEL
   ========================================================================== */
function initTestimonials() {
  const testimonials = [
    {
      quote: "Aken Tech Solution helped us generate high-quality real estate leads through Meta Ads. Their team is professional, responsive and truly understands our business.",
      author: "Rohit Mehta",
      role: "Director, Real Estate Company",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "The real estate CRM has simplified our sales process and increased our leads by 300%. We couldn't be happier with the outcome.",
      author: "Priya Shah",
      role: "Founder, Luxury Realty",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "Aken Tech delivered our NGO website and management system beyond our expectations. Their continuous support is top-notch!",
      author: "Ramesh Kumar",
      role: "Founder, Hope Foundation",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  ];

  let currentIndex = 0;
  const quoteElem = document.querySelector('.testimonial-quote-text');
  const nameElem = document.querySelector('.author-name');
  const roleElem = document.querySelector('.author-role');
  const prevBtn = document.querySelector('#prev-testimonial');
  const nextBtn = document.querySelector('#next-testimonial');

  if (!quoteElem || !prevBtn || !nextBtn) return;

  function renderTestimonial(idx) {
    const item = testimonials[idx];
    quoteElem.style.opacity = '0';
    setTimeout(() => {
      quoteElem.textContent = `"${item.quote}"`;
      if (nameElem) nameElem.textContent = item.author;
      if (roleElem) roleElem.textContent = item.role;
      quoteElem.style.opacity = '1';
    }, 150);
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderTestimonial(currentIndex);
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items if needed
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const icon = other.querySelector('.faq-icon-toggle');
          if (icon) icon.textContent = '+';
        }
      });

      // Toggle clicked item
      item.classList.toggle('active');
      const icon = item.querySelector('.faq-icon-toggle');
      if (icon) {
        icon.textContent = !isActive ? '−' : '+';
      }
    });
  });
}

/* ==========================================================================
   FORMS HANDLING & TOAST
   ========================================================================== */
function initForms() {
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Send Message';

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        showToast('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
        contactForm.reset();
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }, 700);
    });
  }

  // Newsletter subscription
  const newsletterForm = document.querySelector('#newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast(`Subscribed! We've sent a confirmation to ${emailInput.value}`);
        emailInput.value = '';
      }
    });
  }
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   MODAL POPUP ("Talk to an Expert")
   ========================================================================== */
function initModal() {
  const expertButtons = document.querySelectorAll('[data-open-modal="expert"], .btn-talk-expert, a[href="#talk-to-expert"], a[href="#expert-consultation"]');
  const modalOverlay = document.querySelector('#expert-modal');

  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector('.modal-close-btn');
  const modalForm = modalOverlay.querySelector('#modal-expert-form');

  function openModal(e) {
    if (e) e.preventDefault();
    modalOverlay.classList.add('open');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
  }

  expertButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Thank you! An expert will call or message you shortly.');
      modalForm.reset();
    });
  }
}

/* ==========================================================================
   INTERSECTION OBSERVER: SERVICE CARDS FADE-IN SCROLL REVEAL
   ========================================================================== */
function initServiceCardsScrollReveal() {
  const serviceCards = document.querySelectorAll('.service-card-mini, .service-box-large');
  if (!serviceCards.length) return;

  // Graceful fallback for older browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const observerOptions = {
    root: null, // Default to browser viewport
    rootMargin: '0px 0px -40px 0px', // Trigger when card enters bottom area
    threshold: 0.12 // 12% visible to trigger
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('fade-in-visible');
        obs.unobserve(card); // Trigger animation once

        // Clear staggered transition-delay after reveal animation so hover transitions respond immediately
        const delayStr = card.style.transitionDelay || '0s';
        const delayMs = parseFloat(delayStr) * (delayStr.endsWith('s') && !delayStr.endsWith('ms') ? 1000 : 1);
        setTimeout(() => {
          card.style.transitionDelay = '0s';
        }, 750 + (isNaN(delayMs) ? 0 : delayMs));
      }
    });
  }, observerOptions);

  serviceCards.forEach((card, index) => {
    card.classList.add('fade-in-init');
    // Stagger animation based on card column index for a smooth cascading wave effect
    const staggerDelay = (index % 7) * 75;
    card.style.transitionDelay = `${staggerDelay}ms`;
    observer.observe(card);
  });
}

/* ==========================================================================
   SECTION 6: OPTION 3 - HORIZONTAL PROGRESS RAIL INTERACTIVITY
   ========================================================================== */
function initProgressRail() {
  const container = document.querySelector('.process-rail-container');
  if (!container) return;

  const nodes = container.querySelectorAll('.rail-node');
  const cards = container.querySelectorAll('.process-rail-card');
  const fill = document.getElementById('processProgressFill');
  if (!nodes.length || !cards.length) return;

  const fillPercentages = ['12%', '38%', '65%', '100%'];
  let currentStep = 0;
  let autoTimer = null;
  let isHovered = false;

  function setActiveStep(stepIndex, scrollCard = true) {
    if (stepIndex < 0 || stepIndex >= cards.length) return;
    currentStep = stepIndex;

    // Update nodes
    nodes.forEach((node, idx) => {
      if (idx === stepIndex) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Update cards
    cards.forEach((card, idx) => {
      if (idx === stepIndex) {
        card.classList.add('active');
        if (scrollCard) {
          card.classList.remove('pulse-focus');
          void card.offsetWidth;
          card.classList.add('pulse-focus');
          if (window.innerWidth <= 768) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      } else {
        card.classList.remove('active');
        card.classList.remove('pulse-focus');
      }
    });

    // Update progress bar
    if (fill) {
      fill.style.width = fillPercentages[stepIndex] || '12%';
    }
  }

  // Node clicks
  nodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      setActiveStep(idx, true);
    });
  });

  // Card clicks and hovers
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      setActiveStep(idx, false);
    });
    card.addEventListener('mouseenter', () => {
      setActiveStep(idx, false);
    });
  });

  // Pause on hover
  container.addEventListener('mouseenter', () => {
    isHovered = true;
    if (autoTimer) clearInterval(autoTimer);
  });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    startAutoCycle();
  });

  // Subtle auto-advance cycle (every 4.5 seconds if user is idle)
  function startAutoCycle() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!isHovered && document.visibilityState === 'visible') {
        const next = (currentStep + 1) % cards.length;
        setActiveStep(next, false);
      }
    }, 4500);
  }

  startAutoCycle();
}

