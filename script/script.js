
    // DOM Elements
    const loader = document.getElementById('loader');
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    // Loading Screen
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1000);
    });

    // Scroll Effects
    window.addEventListener('scroll', () => {
      // Header background on scroll
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Back to top button
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }

      // Active navigation link
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-link');
      
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
        }
      });
    });

    // Scroll Animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animate stats counting
          if (entry.target.classList.contains('stats')) {
            animateStats();
          }
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    document.querySelectorAll('.solution-card').forEach(card => {
      observer.observe(card);
    });

    document.querySelectorAll('.tech-item').forEach(item => {
      observer.observe(item);
    });

    document.querySelectorAll('.team-member').forEach(member => {
      observer.observe(member);
    });

    // About image animation
    const aboutImage = document.getElementById('aboutImage');
    const aboutImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    aboutImageObserver.observe(aboutImage);

    // Animate Stats Counting
    function animateStats() {
      const stat1 = document.getElementById('stat1');
      const stat2 = document.getElementById('stat2');
      const stat3 = document.getElementById('stat3');
      const stat4 = document.getElementById('stat4');
      
      animateValue(stat1, 0, 150, 2000);
      animateValue(stat2, 0, 75, 2000);
      animateValue(stat3, 0, 12, 2000);
      animateValue(stat4, 0, 320, 2000);
    }

    function animateValue(element, start, end, duration) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }

    // Form Validation and Submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset previous errors
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      let isValid = true;
      
      // Validate name
      if (name === '') {
        document.getElementById('nameGroup').classList.add('error');
        isValid = false;
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('emailGroup').classList.add('error');
        isValid = false;
      }
      
      // Validate subject
      if (subject === '') {
        document.getElementById('subjectGroup').classList.add('error');
        isValid = false;
      }
      
      // Validate message
      if (message === '') {
        document.getElementById('messageGroup').classList.add('error');
        isValid = false;
      }
      
      // If form is valid, show success message
      if (isValid) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission
        setTimeout(() => {
          formSuccess.style.display = 'block';
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 5000);
        }, 1500);
      }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Back to top functionality
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Add some interactive elements to team members
    document.querySelectorAll('.team-member').forEach(member => {
      member.addEventListener('click', () => {
        member.style.transform = 'scale(1.02)';
        setTimeout(() => {
          member.style.transform = '';
        }, 300);
      });
    });
  