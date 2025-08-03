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

// Create floating particles
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

// Keep navbar transparent on scroll
window.addEventListener('scroll', () => {
    // Navbar remains transparent
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add typing effect to hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Form submission handler
function handleFormSubmit() {
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            // Simple validation
            if (name && email && message) {
                // Simulate form submission
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent!';
                    form.reset();
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }, 1000);
            }
        });
    }
}

// Animated section appearance
function animateOnScroll() {
    const sections = document.querySelectorAll('section:not(.hero)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    handleFormSubmit();
    animateOnScroll();
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 20px 40px rgba(74, 144, 226, 0.3)';
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = 'none';
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Animate skills with stagger effect
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
        skill.style.opacity = '0';
        skill.style.transform = 'translateY(20px)';
        skill.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            skill.style.opacity = '1';
            skill.style.transform = 'translateY(0)';
        }, index * 100 + 500);
    });
    
    // Animate certification cards
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 150 + 300);
    });
});

// Initialize typing effect after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-text h1');
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 50);
    }, 1000);
});