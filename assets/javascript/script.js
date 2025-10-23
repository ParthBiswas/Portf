// Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 12000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const force = (120 - distance) / 120;
                particle.vx -= (dx / distance) * force * 0.02;
                particle.vy -= (dy / distance) * force * 0.02;
            }

            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color.replace('60%)', `${particle.opacity})`);
            this.ctx.fill();

            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(0, 245, 255, ${0.15 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Navbar Scroll Effect
class NavbarController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.scrollProgress = document.querySelector('.scroll-progress');
        this.scrollTopBtn = document.querySelector('.scroll-top');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            // Navbar background
            if (scrolled > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Scroll progress
            const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled_percentage = (scrolled / winHeight) * 100;
            this.scrollProgress.style.width = scrolled_percentage + '%';

            // Scroll to top button
            if (scrolled > 400) {
                this.scrollTopBtn.classList.add('visible');
            } else {
                this.scrollTopBtn.classList.remove('visible');
            }
        });
    }
}

// Scroll Animation Observer
class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, this.observerOptions);

        this.init();
    }

    init() {
        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.about-text, .about-image, .skill-category, .project-card, .contact-info, .contact-form, .experience-item'
        );

        animateElements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    }

    closeMobileMenu() {
        const sideMenu = document.querySelector('.side-menu');
        const overlay = document.querySelector('.menu-overlay');
        const hamburger = document.querySelector('.hamburger');

        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
    }
}



// 3D Cube Mouse Interaction
class CubeController {
    constructor() {
        this.cube = document.querySelector('.cube');
        this.container = document.querySelector('.cube-container');
        this.init();
    }

    init() {
        if (!this.cube || !this.container) return;

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (y / rect.height) * 40;
            const rotateY = (x / rect.width) * 40;

            this.cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        this.container.addEventListener('mouseleave', () => {
            this.cube.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }
}

// Chatbot Controller

class ChatbotController {
    constructor(portfolioData) {
        this.toggle = document.querySelector('.chatbot-toggle');
        this.window = document.querySelector('.chatbot-window');
        this.close = document.querySelector('.chatbot-close');
        this.input = document.querySelector('.chatbot-input');
        this.send = document.querySelector('.chatbot-send');
        this.messages = document.querySelector('.chatbot-messages');
        this.isOpen = false;

        this.portfolio = portfolioData;

        this.init();
    }

    init() {
        this.toggle.addEventListener('click', () => this.toggleWindow());
        this.close.addEventListener('click', () => this.closeWindow());
        this.send.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleWindow() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('active', this.isOpen);
        if (this.isOpen) this.input.focus();
    }

    closeWindow() {
        this.isOpen = false;
        this.window.classList.remove('active');
    }

    sendMessage() {
        const userMessage = this.input.value.trim();
        if (!userMessage) return;

        this.addMessage(userMessage, 'user');
        this.input.value = '';

        // Generate dynamic response
        setTimeout(() => {
            const response = this.getDynamicResponse(userMessage.toLowerCase());
            this.addMessage(response, 'bot');
        }, 800); // slight delay for typing effect
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    getDynamicResponse(message) {
        // Portfolio info keywords
        if (message.includes('skill') || message.includes('technologies') || message.includes('tools')) {
            return `Parth's skills: ${this.portfolio.skills.join(', ')}.`;
        }
        if (message.includes('project')) {
            let projects = this.portfolio.projects.map(p => `${p.name}: ${p.description}`).join('\n');
            return `Parth's projects:\n${projects}`;
        }
        if (message.includes('certificate')) {
            return `Certificates: ${this.portfolio.certificates.map(c => `${c.name} (${c.link})`).join(', ')}`;
        }
        if (message.includes('education')) {
            return `Education: ${this.portfolio.education.map(e => `${e.degree}, ${e.institute} , ${e.UniversityName} (${e.year})`).join('; ')}`;
        }
        if (message.includes('github')) {
            return `GitHub: ${this.portfolio.github}`;
        }
        if (message.includes('linkedin')) {
            return `LinkedIn: ${this.portfolio.linkedin}`;
        }
        if (message.includes('contact') || message.includes('email')) {
            return `You can contact Parth via email: ${this.portfolio.email}`;
        }
        if (message.includes('contact') || message.includes('number')) {
            return `You can contact Parth via Mobile Number: ${this.portfolio.number}`;
        }
        if (message.includes('about') || message.includes('experience')) {
            return `About Parth: ${this.portfolio.about}`;
        }

        return "Sorry, I didn't understand. You can ask about skills, projects, certificates, education, GitHub, LinkedIn, or contact info.";
    }
}

// Example Portfolio Data (you can import or define this in a separate JS file)
const parthPortfolio = {
    about: "Parth Biswas is a fresher Software Tester specializing in manual and automated testing with tools like Selenium, JIRA, Postman, and TestRail.",
    skills: ["Manual Testing", "Automation Testing", "Selenium", "JIRA", "Postman", "TestRail", "SQL", "Java", "Python"],
    projects: [
        {name: "Web App Testing", description: "Tested a React-based web application for functionality and performance."},
        {name: "Mobile App Testing", description: "Performed UI and regression testing on Android and iOS apps."},
        {name: "API Testing", description: "Used Postman to validate RESTful APIs and endpoints."}
    ],
    certificates: [
        {name: "ISTQB Foundation Level", link: "https://example.com/cert1"},
        {name: "Selenium Automation", link: "https://example.com/cert2"}
    ],
    education: [
        {degree: "B.Tech in Computer Science", institute: "Phonics Group Of Institutions, Roorkee, Uttarakhand", UniversityName: "Uttarakhand Technical University, Dehradun", year: "2025"}
    ],
    github: "https://github.com/ParthBiswas",
    linkedin: "https://linkedin.com/in/parthubiswas",
    email: "parthurmibiswas@gmail.com",
    number: "+91 8630482438"
};

// Initialize chatbot with dynamic portfolio data
const chatbot = new ChatbotController(parthPortfolio);




// Form Handler
class FormHandler {
    constructor() {
        this.contactForm = document.querySelector('.contact-form');
        this.newsletterForm = document.querySelector('.newsletter-form');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }

        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterForm();
            });
        }
    }

    handleContactForm() {
        const button = this.contactForm.querySelector('.submit-btn');
        const originalText = button.textContent;

        button.textContent = 'Sending...';
        button.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            button.textContent = 'Message Sent!';
            button.style.background = 'linear-gradient(135deg, #00e676 0%, #00c853 100%)';
            this.contactForm.reset();

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        }, 2000);
    }

    handleNewsletterForm() {
        const button = this.newsletterForm.querySelector('.newsletter-btn');
        const input = this.newsletterForm.querySelector('.newsletter-input');
        const originalText = button.textContent;

        button.textContent = 'Subscribing...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Subscribed!';
            input.value = '';

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }, 1500);
    }
}

// Mobile Menu Controller
class MobileMenuController {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.sideMenu = document.querySelector('.side-menu');
        this.overlay = document.querySelector('.menu-overlay');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.hamburger) return;

        this.hamburger.addEventListener('click', () => {
            this.toggle();
        });

        this.overlay.addEventListener('click', () => {
            this.close();
        });

        // Close menu when clicking on links
        document.querySelectorAll('.side-menu-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.hamburger.classList.add('active');
        this.sideMenu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.hamburger.classList.remove('active');
        this.sideMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Typing Effect
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particles');
    new ParticleSystem(canvas);

    // Initialize other components
    new ScrollAnimator();
    new SmoothScroll();
    new NavbarController();
    new CubeController();
    new ChatbotController();
    new FormHandler();
    new MobileMenuController();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Initialize typing effect after page load
    setTimeout(() => {
        const subtitle = document.querySelector('.hero .subtitle');
        if (subtitle) {
            const originalText = subtitle.textContent;
            typeWriter(subtitle, originalText, 80);
        }
    }, 2000);
});

// Performance optimization
let ticking = false;

function updateOnScroll() {
    // Throttle scroll events
    if (!ticking) {
        requestAnimationFrame(() => {
            // Parallax effect for floating shapes
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');

            shapes.forEach((shape, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = -(scrolled * speed);
                shape.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Add mouse trail effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 15;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });

        this.animate();
    }

    addTrailPoint(x, y) {
        this.trail.push({ x, y, life: 1 });

        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }
    }

    animate() {
        this.trail.forEach((point, index) => {
            point.life -= 0.08;
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize mouse trail
new MouseTrail();

// Add some interactive hover effects
document.querySelectorAll('.project-card, .skill-category, .experience-content').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add dynamic background color change based on scroll
window.addEventListener('scroll', () => {
    const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    const hue = Math.floor(scrollPercent * 60 + 180); // From cyan to purple
    document.documentElement.style.setProperty('--dynamic-hue', hue);
});

// Floating animation for icons
document.querySelectorAll('.icons-wrapper i').forEach(icon => {
    icon.addEventListener('mouseover', () => {
        icon.style.transform = 'translateY(-8px) scale(1.3)';
    });
    icon.addEventListener('mouseout', () => {
        icon.style.transform = 'translateY(0) scale(1)';
    });
});


//  JS to reset form after submit

//   const contactForm = document.getElementById('contact-form');
//   const formStatus = document.getElementById('form-status');

//   contactForm.addEventListener('submit', function(e) {
//     e.preventDefault(); // prevent default form submission

//     // Submit using fetch to FormSubmit
//     const formData = new FormData(contactForm);
//     fetch(contactForm.action, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Accept': 'application/json'
//       }
//     }).then(response => {
//       if (response.ok) {
//         formStatus.textContent = "Message sent successfully!";
//         formStatus.style.color = "green";
//         contactForm.reset(); // Reset form after submit
//         document.getElementById('name') // keep default name
//       } else {
//         formStatus.textContent = "Oops! Something went wrong.";
//         formStatus.style.color = "red";
//       }
//     }).catch(error => {
//       formStatus.textContent = "Oops! Something went wrong.";
//       formStatus.style.color = "red";
//     });
//   });


//   document.getElementById('newsletter-form').addEventListener('submit', function(e) {
//     e.preventDefault(); // form default submit roke

//     const form = this;
//     const status = document.getElementById('newsletter-status');

//     fetch(form.action, {
//         method: 'POST',
//         body: new FormData(form),
//         headers: { 'Accept': 'application/json' }
//     }).then(response => {
//         if (response.ok) {
//             status.style.display = 'block';
//             status.innerText = 'Thank you! Your subscription was successful.';
//             form.reset(); // form reset
//         } else {
//             response.json().then(data => {
//                 if (Object.hasOwn(data, 'errors')) {
//                     status.style.display = 'block';
//                     status.style.color = 'red';
//                     status.innerText = data["errors"].map(error => error["message"]).join(", ");
//                 } else {
//                     status.style.display = 'block';
//                     status.style.color = 'red';
//                     status.innerText = 'Oops! There was a problem submitting your form.';
//                 }
//             })
//         }
//     }).catch(error => {
//         status.style.display = 'block';
//         status.style.color = 'red';
//         status.innerText = 'Oops! There was a problem submitting your form.';
//     });
// });

