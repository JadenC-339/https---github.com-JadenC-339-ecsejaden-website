// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Preloader
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(preloader);
  
  // Remove preloader after page loads
  window.addEventListener('load', function() {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 500);
  });
  
  // Initialize animations and interactive elements
  initializeSite();
});

function initializeSite() {
  // Mobile Menu Toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Theme Toggle - ENHANCED VERSION
  const toggle = document.getElementById("themeToggle");
  const thumb = document.getElementById("toggleThumb");
  
  if (toggle && thumb) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme on page load
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      toggle.checked = true;
      thumb.style.transform = "translateX(24px)";
    } else {
      document.body.classList.remove('light-mode');
      toggle.checked = false;
      thumb.style.transform = "translateX(0)";
    }
    
    // Toggle theme on change
    toggle.addEventListener("change", () => {
      document.body.classList.toggle("light-mode");
      
      if (document.body.classList.contains("light-mode")) {
        localStorage.setItem('theme', 'light');
        thumb.style.transform = "translateX(24px)";
      } else {
        localStorage.setItem('theme', 'dark');
        thumb.style.transform = "translateX(0)";
      }
    });
  }
  
  // Cursor Follower
  const cursorFollower = document.querySelector('.cursor-follower');
  if (cursorFollower) {
    document.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      cursorFollower.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
    });
  }

  // Draggable Icon
  const icon = document.getElementById("draggableIcon");
  if (icon) {
    let isDragging = false;
    
    icon.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      let offsetX = e.clientX - icon.getBoundingClientRect().left;
      let offsetY = e.clientY - icon.getBoundingClientRect().top;
      
      function onMouseMove(e) {
        if (isDragging) {
          icon.style.left = `${e.clientX - offsetX}px`;
          icon.style.top = `${e.clientY - offsetY}px`;
        }
      }
      
      function onMouseUp() {
        isDragging = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
      
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
    
    // Mobile touch support for draggable icon
    icon.addEventListener("touchstart", (e) => {
      e.preventDefault();
      isDragging = true;
      let touch = e.touches[0];
      let offsetX = touch.clientX - icon.getBoundingClientRect().left;
      let offsetY = touch.clientY - icon.getBoundingClientRect().top;
      
      function onTouchMove(e) {
        if (isDragging) {
          let touch = e.touches[0];
          icon.style.left = `${touch.clientX - offsetX}px`;
          icon.style.top = `${touch.clientY - offsetY}px`;
        }
      }
      
      function onTouchEnd() {
        isDragging = false;
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      }
      
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onTouchEnd);
    });
  }
  
  // Typewriter Effect
  const typewriterElement = document.querySelector('.typewriter');
  if (typewriterElement && typeof Typed !== 'undefined') {
    new Typed(typewriterElement, {
      strings: ['design.', 'code.', 'photography.', 'innovation.'],
      typeSpeed: 70,
      backSpeed: 50,
      loop: true,
      backDelay: 1500
    });
  }
  
  // Animated Background Particles
  const particles = document.querySelector('.particles');
  if (particles) {
    createParticles();
  }
  
  // Scroll Animation for Skills
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillProgress = entry.target.querySelector('.skill-progress');
        if (skillProgress) {
          const skill = entry.target.dataset.skill;
          skillProgress.style.width = skill === 'Design' ? '85%' : 
                                      skill === 'Development' ? '90%' : 
                                      skill === 'Photography' ? '75%' : '70%';
        }
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.skill-card').forEach(card => {
    observer.observe(card);
  });
  
  // Active Navigation Link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
    
    // Update floating navigation dots
    const dots = document.querySelectorAll('[data-section]');
    dots.forEach(dot => {
      dot.classList.remove('bg-yellow-400');
      dot.classList.add('bg-gray-500');
      if (dot.dataset.section === current) {
        dot.classList.remove('bg-gray-500');
        dot.classList.add('bg-yellow-400');
      }
    });
  });
  
  // Newsletter Popup
  const showNewsletter = document.getElementById('showNewsletter');
  const closeNewsletter = document.getElementById('closeNewsletter');
  const newsletter = document.getElementById('newsletter');
  
  if (showNewsletter && closeNewsletter && newsletter) {
    showNewsletter.addEventListener('click', () => {
      newsletter.classList.remove('hidden');
      if (typeof gsap !== 'undefined') {
        gsap.from(newsletter.querySelector('div'), {
          scale: 0.5,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      }
    });
    
    closeNewsletter.addEventListener('click', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(newsletter.querySelector('div'), {
          scale: 0.5,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            newsletter.classList.add('hidden');
          }
        });
      } else {
        newsletter.classList.add('hidden');
      }
    });
    
    // Close popup when clicking outside
    newsletter.addEventListener('click', (e) => {
      if (e.target === newsletter) {
        closeNewsletter.click();
      }
    });
  }
  
  // Form submission animation (only for non-Formspree forms)
  const contactForm = document.getElementById('contactForm');
  if (contactForm && !contactForm.hasAttribute('action')) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'bg-green-500 text-white p-4 rounded-lg mt-4 animate__animated animate__fadeIn';
      successMsg.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      
      contactForm.appendChild(successMsg);
      
      // Reset form
      contactForm.reset();
      
      // Remove message after 3 seconds
      setTimeout(() => {
        successMsg.classList.replace('animate__fadeIn', 'animate__fadeOut');
        setTimeout(() => {
          successMsg.remove();
        }, 500);
      }, 3000);
    });
  }
}

// Create animated background particles
function createParticles() {
  const particles = document.querySelector('.particles');
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    const size = Math.random() * 5 + 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
    
    particles.appendChild(particle);
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    }
  });
});

// Gallery image popup
document.addEventListener('click', (e) => {
  if (e.target.closest('.gallery-item img')) {
    const img = e.target.closest('.gallery-item img');
    const src = img.getAttribute('src');
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="max-w-4xl mx-auto p-4">
        <button class="absolute top-4 right-4 text-white hover:text-yellow-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img src="${src}" class="max-h-[80vh] max-w-full object-contain" alt="Gallery image">
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('button')) {
        document.body.style.overflow = '';
        modal.remove();
      }
    });
  }
});

// Animate elements when they come into view
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item, .skill-card, .about-image').forEach(el => {
  fadeObserver.observe(el);
});