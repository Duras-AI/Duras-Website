// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
    }
    
    // Active nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Smooth scrolling
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

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    updateCounter();
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (counter.textContent === '0') {
                    animateCounter(counter);
                }
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const successAlert = document.getElementById('successAlert');
    
    // Get form inputs
    const inputs = form.querySelectorAll('input, textarea');
    const nameInput = inputs[0];
    const emailInput = inputs[1];
    const subjectInput = inputs[2];
    const messageInput = inputs[3];
    
    // Get form data
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
    };
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Send to Django API
    fetch('https://duras-admin-panel.onrender.com/contact/api/submit/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            successAlert.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                ${data.message}
            `;
            successAlert.classList.remove('d-none', 'alert-danger');
            successAlert.classList.add('alert-success');
            
            // Reset form
            form.reset();
            
            // Hide success message after 8 seconds
            setTimeout(() => {
                successAlert.classList.add('d-none');
            }, 8000);
            
            // Scroll to success message
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Show error message
            showAlert(data.error || 'Failed to send message. Please try again.', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert(
            'Failed to send message. Please try again or contact us directly at nathantshamba@gmail.com',
            'danger'
        );
    })
    .finally(() => {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

// Helper function to show alerts
function showAlert(message, type) {
    const successAlert = document.getElementById('successAlert');
    successAlert.innerHTML = `
        <i class="fas fa-${type === 'danger' ? 'exclamation-circle' : 'check-circle'} me-2"></i>
        ${message}
    `;
    successAlert.classList.remove('d-none', 'alert-success', 'alert-danger');
    successAlert.classList.add(`alert-${type}`);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        successAlert.classList.add('d-none');
    }, 8000);
    
    // Scroll to alert
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

// Add smooth fade-in for alerts
const style = document.createElement('style');
style.textContent = `
    #successAlert {
        transition: opacity 0.3s ease-in-out;
    }
    #successAlert.d-none {
        opacity: 0;
        display: none !important;
    }
    #successAlert:not(.d-none) {
        opacity: 1;
        animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
