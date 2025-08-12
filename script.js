// Advanced Interactive Portfolio Script

class LiquidPortfolio {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.initParticles();
        this.setupNavigation();
        this.setupAnimations();
        this.setupPortfolioFiltering();
        this.setupLiquidEffects();
        this.setupScrollAnimations();
        this.setupFormHandling();
        this.setupInteractiveElements();
        this.initNeuralNetwork();
        this.setupQuantumAnimations();
    }

    // Initialize Particles System
        initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Enhanced Constellation Particle System
        class ConstellationStar {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.1;
                this.vy = (Math.random() - 0.5) * 0.1;
                this.radius = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.7 + 0.3;
                this.twinkle = Math.random() * Math.PI * 2;
                this.twinkleSpeed = 0.02 + Math.random() * 0.03;
                this.color = this.getRandomStarColor();
            }
            
            getRandomStarColor() {
                const colors = [
                    'rgba(255, 255, 255,',
                    'rgba(0, 191, 255,',
                    'rgba(255, 165, 0,',
                    'rgba(173, 216, 230,'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.twinkle += this.twinkleSpeed;
                
                // Smooth boundary wrapping
                if (this.x < -50) this.x = canvas.width + 50;
                if (this.x > canvas.width + 50) this.x = -50;
                if (this.y < -50) this.y = canvas.height + 50;
                if (this.y > canvas.height + 50) this.y = -50;
                
                // Mouse interaction
                const dx = this.x - this.mouseX;
                const dy = this.y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    this.vx += (dx / distance) * force * 0.01;
                    this.vy += (dy / distance) * force * 0.01;
                }
                
                // Velocity damping
                this.vx *= 0.99;
                this.vy *= 0.99;
            }
            
            draw(ctx) {
                ctx.save();
                
                // Twinkling effect
                const twinkleOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.twinkle));
                
                // Star glow
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
                gradient.addColorStop(0, this.color + twinkleOpacity + ')');
                gradient.addColorStop(0.5, this.color + (twinkleOpacity * 0.5) + ')');
                gradient.addColorStop(1, this.color + '0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Star core
                ctx.fillStyle = this.color + '1)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }
        
        // Create enhanced constellation stars
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Track mouse for interaction
        canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        const starCount = Math.min(200, Math.floor((canvas.width * canvas.height) / 4000));
        for (let i = 0; i < starCount; i++) {
            this.particles.push(new ConstellationStar());
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw constellation connections
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const a = this.particles[i];
                    const b = this.particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.save();
                        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                        gradient.addColorStop(0, 'rgba(0, 191, 255, ' + (0.15 * (1 - dist / 120)) + ')');
                        gradient.addColorStop(1, 'rgba(255, 255, 255, ' + (0.1 * (1 - dist / 120)) + ')');
                        
                        ctx.globalAlpha = 0.15 * (1 - dist / 120);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
            
            // Update and draw stars
            this.particles.forEach(star => {
                star.update();
                star.mouseX = this.mouseX;
                star.mouseY = this.mouseY;
                star.draw(ctx);
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Initialize Neural Network Animation
    initNeuralNetwork() {
        const canvas = document.getElementById('neural-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;
        
        const neurons = [];
        const connections = [];
        
        // Create neurons
        for (let i = 0; i < 20; i++) {
            neurons.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 2,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        
        const drawNeuralNetwork = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update neurons
            neurons.forEach(neuron => {
                neuron.x += neuron.vx;
                neuron.y += neuron.vy;
                neuron.pulsePhase += 0.05;
                
                // Bounce off walls
                if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
                if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;
                
                // Keep within bounds
                neuron.x = Math.max(0, Math.min(canvas.width, neuron.x));
                neuron.y = Math.max(0, Math.min(canvas.height, neuron.y));
            });
            
            // Draw connections
            ctx.strokeStyle = 'rgba(0, 191, 255, 0.1)';
            ctx.lineWidth = 1;
            neurons.forEach((neuron1, i) => {
                neurons.slice(i + 1).forEach(neuron2 => {
                    const distance = Math.sqrt(
                        Math.pow(neuron1.x - neuron2.x, 2) +
                        Math.pow(neuron1.y - neuron2.y, 2)
                    );
                    
                    if (distance < 100) {
                        ctx.globalAlpha = (100 - distance) / 100 * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(neuron1.x, neuron1.y);
                        ctx.lineTo(neuron2.x, neuron2.y);
                        ctx.stroke();
                    }
                });
            });
            
            // Draw neurons
            ctx.globalAlpha = 1;
            neurons.forEach(neuron => {
                const pulseSize = Math.sin(neuron.pulsePhase) * 0.5 + 1.5;
                const gradient = ctx.createRadialGradient(
                    neuron.x, neuron.y, 0,
                    neuron.x, neuron.y, neuron.radius * pulseSize
                );
                gradient.addColorStop(0, 'rgba(0, 191, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(0, 191, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(neuron.x, neuron.y, neuron.radius * pulseSize, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(drawNeuralNetwork);
        };
        
        drawNeuralNetwork();
    }

    // Setup Quantum Animations for About Section
    setupQuantumAnimations() {
        // Enhanced scroll trigger for about section
        const aboutSection = document.querySelector('#about');
        const aboutContent = document.querySelector('.about-content-revolutionary');
        
        if (aboutSection && aboutContent) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Trigger all animations when section is visible
                        this.activateQuantumEffects();
                        
                        // Add typing effect to description
                        this.typewriterEffect();
                        
                        // Animate skill cubes
                        this.animateSkillCubes();
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(aboutSection);
        }
        
        // Mouse parallax effect for profile image
        this.setupProfileParallax();
    }

    activateQuantumEffects() {
        // Enhanced greeting effect without glitch
        const greeting = document.querySelector('.greeting-massive');
        if (greeting) {
            // Add subtle pulse effect
            greeting.style.animation = 'pulse 2s ease-in-out infinite';
        }
    }

    typewriterEffect() {
        // Usuwam animację pisania, tekst pojawia się od razu
        const description = document.querySelector('.about-description-pro');
        if (description && description.classList.contains('typed')) {
            description.classList.remove('typed');
        }
        if (description) {
            const text = description.getAttribute('data-fulltext');
            if (text) {
                description.innerHTML = `<h1 class='greeting-massive' data-text='Cześć!'>Cześć!</h1><span>${text}</span>`;
            }
        }
    }

    animateSkillCubes() {
        const infographics = document.querySelectorAll('.infographic-card');
        infographics.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                
                // Add hover effect
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-15px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            }, index * 300);
        });
    }

    setupProfileParallax() {
        const profileImage = document.querySelector('.profile-hologram');
        if (profileImage) {
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                
                profileImage.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
            });
        }
    }

    // Navigation functionality
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.nav-glass');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.9)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.1)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
        });
    }

    // Advanced animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special animations for specific elements
                    if (entry.target.classList.contains('hero-title')) {
                        this.animateHeroTitle();
                    }
                    if (entry.target.classList.contains('skills-grid')) {
                        this.animateSkills();
                    }
                    if (entry.target.classList.contains('projects-grid')) {
                        this.animateProjects();
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.fade-in, .hero-title, .skills-grid, .projects-grid').forEach(el => {
            observer.observe(el);
        });

        // Add fade-in classes to elements
        this.addFadeInClasses();
    }

    addFadeInClasses() {
        const elementsToAnimate = [
            '.section-header',
            '.about-content',
            '.project-card',
            '.film-item',
            '.contact-content'
        ];

        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('fade-in');
            });
        });
    }

    animateHeroTitle() {
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            line.style.animationDelay = `${index * 0.2}s`;
            line.style.animation = 'slideInUp 1s ease-out forwards';
        });
    }

    animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animation = 'slideInUp 0.6s ease-out forwards';
        });
    }

    animateProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            card.style.animation = 'slideInUp 0.8s ease-out forwards';
        });
    }

    // Portfolio filtering functionality
    setupPortfolioFiltering() {
        // USUWAMY generowanie i obsługę kategorii/filtrów portfolio
    }

    // Tab functionality - legacy (removed)
    setupTabs() {
        // This functionality has been replaced by portfolio filtering
    }

    // Liquid effects and interactions
    setupLiquidEffects() {
        // Mouse follow effect for liquid background
        this.setupMouseFollow();
        
        // Parallax effect for orbs
        this.setupParallax();
        
        // Liquid button hover effects
        this.setupLiquidButtons();
        
        // Card hover effects
        this.setupCardEffects();
    }

    setupMouseFollow() {
        const orbs = document.querySelectorAll('.gradient-orb');
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 50;
                const y = (mouseY - 0.5) * speed * 50;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.gradient-orb');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    setupLiquidButtons() {
        const buttons = document.querySelectorAll('.liquid-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const liquid = button.querySelector('.btn-liquid');
                if (liquid) {
                    liquid.style.left = '-100%';
                    setTimeout(() => {
                        liquid.style.left = '100%';
                    }, 300);
                }
            });
        });
    }

    setupCardEffects() {
        const cards = document.querySelectorAll('.glass-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                // Add glow effect
                this.addGlowEffect(card, x, y);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    addGlowEffect(card, x, y) {
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        glow.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(0, 191, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: glowPulse 1s ease-out;
        `;
        
        card.style.position = 'relative';
        card.appendChild(glow);
        
        setTimeout(() => {
            glow.remove();
        }, 1000);
    }

    // Scroll animations
    setupScrollAnimations() {
        // Custom scroll indicator
        this.createScrollIndicator();
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = `
            <div class="scroll-progress">
                <div class="scroll-thumb"></div>
            </div>
        `;
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 1001;
        `;
        
        const thumb = indicator.querySelector('.scroll-thumb');
        thumb.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.1s ease-out;
        `;
        
        document.body.appendChild(indicator);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            thumb.style.width = `${scrollPercent}%`;
        });
    }

    // Form handling
    setupFormHandling() {
        const form = document.querySelector('.contact-form form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Wysyłanie...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Wysłano! ✓</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    }

    // Interactive elements
    setupInteractiveElements() {
        // Project card interactions
        this.setupProjectInteractions();
        
        // Film item interactions
        this.setupFilmInteractions();
        
        // Skill item hover effects
        this.setupSkillEffects();
        
        // USUWAMY setupAudioToggle i wszelkie odwołania do audio-toggle
    }

    setupProjectInteractions() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                this.openProjectModal(title);
            });
        });
    }

    setupFilmInteractions() {
        const filmItems = document.querySelectorAll('.film-item');
        
        filmItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h4').textContent;
                this.openFilmModal(title);
            });
        });
    }

    setupSkillEffects() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Modal functionality (placeholder for future content)
    openProjectModal(title) {
        const modal = this.createModal('project', title);
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    openFilmModal(title) {
        const modal = this.createModal('film', title);
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    createModal(type, title) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <button class="modal-close">×</button>
                <h2>${title}</h2>
                <p>Ta funkcja zostanie uzupełniona rzeczywistą zawartością.</p>
                <div class="modal-placeholder">
                    <i class="fas fa-${type === 'project' ? 'laptop' : 'film'}"></i>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        `;
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        return modal;
    }
}

// Advanced CSS animations injection
const advancedStyles = `
    @keyframes glowPulse {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
    }
    
    .modal-overlay.active {
        opacity: 1;
    }
    
    .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 2rem;
        color: #ffffff;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .modal-close:hover {
        transform: rotate(90deg);
    }
    
    .modal-placeholder {
        text-align: center;
        padding: 40px;
        font-size: 4rem;
        color: var(--liquid-gold);
    }
    
    .audio-toggle:hover {
        transform: scale(1.1);
    }
    
    @media (max-width: 768px) {
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Inject advanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = advancedStyles;
document.head.appendChild(styleSheet);

// Scroll to contact function
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Nowoczesna obsługa hero video z innowacyjnym overlay i przyciskiem play
function toggleHeroVideo(overlay) {
    const video = overlay.previousElementSibling;
    if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.pointerEvents = 'none'; }, 400);
    } else {
        video.pause();
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    }
}

// Ulepszony event po załadowaniu DOM
window.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('hero-video');
    const overlay = document.querySelector('.play-overlay-innovative');
    const playBtn = document.querySelector('.play-button-innovative');

    if (heroVideo) {
        console.log('Hero video found:', heroVideo);
        console.log('Hero video src:', heroVideo.querySelector('source')?.src);
        
        // Ustawienia dla hero video
        heroVideo.muted = false;
        heroVideo.autoplay = false;
        heroVideo.loop = true;
        heroVideo.setAttribute('playsinline', '');
        heroVideo.controls = true; // Dodajemy kontrolki
        
        // Sprawdź czy plik istnieje
        const videoSrc = heroVideo.querySelector('source')?.src;
        if (videoSrc) {
            fetch(videoSrc, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        console.log('Hero video file exists and is accessible');
                    } else {
                        console.error('Hero video file not accessible:', response.status);
                    }
                })
                .catch(error => {
                    console.error('Hero video file error:', error);
                });
        }
        
        // Obsługa błędów ładowania
        heroVideo.addEventListener('error', (e) => {
            console.error('Hero video error:', e);
            console.error('Hero video error details:', heroVideo.error);
            // Pokaż placeholder jeśli film się nie ładuje
            const container = heroVideo.parentElement;
            if (container) {
                container.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; text-align: center; background: #000; border-radius: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: var(--liquid-gold);"></i>
                        <p style="margin-bottom: 0.5rem; font-weight: 600;">Film niedostępny</p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">Sprawdź ścieżkę do pliku</p>
                        <p style="font-size: 0.8rem; opacity: 0.6;">${videoSrc || 'Brak ścieżki'}</p>
                    </div>
                `;
            }
        });

        // Sprawdź czy film się ładuje
        heroVideo.addEventListener('loadstart', () => {
            console.log('Hero video loading started');
        });

        heroVideo.addEventListener('canplay', () => {
            console.log('Hero video can play');
        });

        heroVideo.addEventListener('loadeddata', () => {
            console.log('Hero video data loaded');
        });

        heroVideo.addEventListener('loadedmetadata', () => {
            console.log('Hero video metadata loaded');
        });

        // Ukryj overlay natychmiast po odtworzeniu
        heroVideo.addEventListener('play', () => {
            console.log('Hero video playing');
            if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            overlay.style.display = 'none';
            }
        });
        
        // Pokaż overlay po zatrzymaniu
        heroVideo.addEventListener('pause', () => {
            console.log('Hero video paused');
            if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
            overlay.style.display = 'flex';
            }
        });
        
        // Pokaż overlay po zakończeniu
        heroVideo.addEventListener('ended', () => {
            console.log('Hero video ended');
            if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
            overlay.style.display = 'flex';
            }
        });

        if (overlay) {
        overlay.addEventListener('click', () => {
                console.log('Overlay clicked');
            if (heroVideo.paused) {
                    heroVideo.play().catch(e => console.error('Play failed:', e));
            } else {
                heroVideo.pause();
            }
        });
        }

        if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
                console.log('Play button clicked');
            if (heroVideo.paused) {
                    heroVideo.play().catch(e => console.error('Play failed:', e));
            } else {
                heroVideo.pause();
            }
        });
        }

        // Fullscreen support
        heroVideo.addEventListener('dblclick', () => {
            if (heroVideo.requestFullscreen) {
                heroVideo.requestFullscreen();
            } else if (heroVideo.webkitRequestFullscreen) {
                heroVideo.webkitRequestFullscreen();
            } else if (heroVideo.msRequestFullscreen) {
                heroVideo.msRequestFullscreen();
            }
        });

        // Keyboard shortcuts
        heroVideo.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                if (heroVideo.requestFullscreen) {
                    heroVideo.requestFullscreen();
                } else if (heroVideo.webkitRequestFullscreen) {
                    heroVideo.webkitRequestFullscreen();
                } else if (heroVideo.msRequestFullscreen) {
                    heroVideo.msRequestFullscreen();
                }
            }
            
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                if (heroVideo.paused) {
                    heroVideo.play().catch(e => console.error('Play failed:', e));
                } else {
                    heroVideo.pause();
                }
            }
        });
    } else {
        console.error('Hero video element not found');
    }
});

// Enhanced video controls with fullscreen support
function enableFullscreenVideo(video) {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
}

// Add fullscreen functionality to all videos
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video');
    console.log(`Found ${videos.length} video elements`);
    
    videos.forEach((video, index) => {
        console.log(`Video ${index}:`, video);
        console.log(`Video ${index} src:`, video.querySelector('source')?.src);
        
        // Dodaj obsługę błędów dla wszystkich filmów
        video.addEventListener('error', (e) => {
            console.error(`Video ${index} error:`, e);
            console.error(`Video ${index} error details:`, video.error);
            const container = video.parentElement;
            if (container) {
                const placeholder = document.createElement('div');
                placeholder.className = 'video-placeholder';
                placeholder.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; text-align: center; background: #000; border-radius: 8px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--liquid-gold);"></i>
                        <p style="margin-bottom: 0.25rem; font-weight: 600; font-size: 0.9rem;">Film niedostępny</p>
                        <p style="font-size: 0.8rem; opacity: 0.8;">Sprawdź ścieżkę do pliku</p>
                        <p style="font-size: 0.7rem; opacity: 0.6;">${video.querySelector('source')?.src || 'Brak ścieżki'}</p>
                    </div>
                `;
                container.appendChild(placeholder);
                video.style.display = 'none';
            }
        });

        // Dodaj obsługę ładowania
        video.addEventListener('loadstart', () => {
            console.log(`Video ${index} loading started`);
        });

        video.addEventListener('canplay', () => {
            console.log(`Video ${index} can play`);
        });

        video.addEventListener('loadeddata', () => {
            console.log(`Video ${index} data loaded`);
        });

        video.addEventListener('loadedmetadata', () => {
            console.log(`Video ${index} metadata loaded`);
        });

        video.addEventListener('dblclick', () => {
            enableFullscreenVideo(video);
        });
        
        // Add keyboard shortcuts
        video.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                enableFullscreenVideo(video);
            }
        });
    });
});

// Modern video overlay effects
function createVideoOverlay(video) {
    const container = video.parentElement;
    const overlay = container.querySelector('.video-overlay');
    
    if (!overlay) return;
    
    // Show overlay on hover
    container.addEventListener('mouseenter', () => {
        if (video.paused) {
            overlay.style.opacity = '1';
        }
    });
    
    container.addEventListener('mouseleave', () => {
        if (!video.paused) {
            overlay.style.opacity = '0';
        }
    });
    
    // Keyboard navigation
    video.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                video.paused ? video.play() : video.pause();
                break;
            case 'ArrowRight':
                video.currentTime += 10;
                break;
            case 'ArrowLeft':
                video.currentTime -= 10;
                break;
        }
    });
}

// Enhanced video functionality for portfolio
function togglePortfolioVideo(overlay) {
    const video = overlay.previousElementSibling;
    if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
        
        // Add zoom effect
        const item = overlay.closest('.portfolio-item');
        item.style.transform = 'translateY(-10px) scale(1.05)';
        item.style.zIndex = '10';
    } else {
        video.pause();
        overlay.style.opacity = '1';
        
        // Remove zoom effect
        const item = overlay.closest('.portfolio-item');
        item.style.transform = 'translateY(0) scale(1)';
        item.style.zIndex = '1';
    }
}

// Scroll to portfolio function
function scrollToPortfolio() {
    document.getElementById('portfolio').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// React Portfolio Components for Ultra-Modern Portfolio Section
const portfolioData = [
    { src: 'videos/AI TELEDYSK.mp4', aspect: '9:16', title: 'AI Teledysk' },
    { src: 'videos/AIBRAINROT.mp4', aspect: '9:16', title: 'AI Brain Rot' },
    { src: 'videos/BRAINROTAI.mp4', aspect: '9:16', title: 'Brain Rot AI' },
    { src: 'videos/edit.mp4', aspect: '16:9', title: 'Edit' },
    { src: 'videos/ELONMUSKNEWS.mp4', aspect: '9:16', title: 'Elon Musk News' },
    { src: 'videos/Historia.mp4', aspect: '9:16', title: 'Historia' },
    { src: 'videos/Historyjka.mp4', aspect: '9:16', title: 'Historyjka' },
    { src: 'videos/MILOSC.mp4', aspect: '9:16', title: 'Miłość' },
    { src: 'videos/Motywacja.mp4', aspect: '9:16', title: 'Motywacja' },
    { src: 'videos/Motywacyjne.mp4', aspect: '9:16', title: 'Motywacyjne' },
    { src: 'videos/Pieswzruszajacy.mp4', aspect: '9:16', title: 'Pies Wzruszający' },
    { src: 'videos/StoryTelling.mp4', aspect: '9:16', title: 'Story Telling' },
    { src: 'videos/wojna-w-wietnamie.mp4', aspect: '9:16', title: 'Wojna w Wietnamie' },
    { src: 'videos/Wybierz.mp4', aspect: '9:16', title: 'Wybierz' }
];

// Custom Hook for Slider Management
const useSlider = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const sliderRef = React.useRef(null);

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsPlaying(false);
        if (sliderRef.current) {
            const slides = sliderRef.current.children;
            if (slides[index]) {
                slides[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
        }
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % portfolioData.length;
        goToSlide(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = currentIndex === 0 ? portfolioData.length - 1 : currentIndex - 1;
        goToSlide(prevIndex);
    };

    return {
        currentIndex,
        isPlaying,
        setIsPlaying,
        goToSlide,
        nextSlide,
        prevSlide,
        sliderRef
    };
};

// Portfolio Header Component with Animated Title
const PortfolioHeader = () => {
    const [letters, setLetters] = React.useState([]);
    
    React.useEffect(() => {
        const title = "PORTFOLIO";
        const letterElements = title.split('').map((letter, index) => ({
            letter,
            delay: index * 0.1,
            id: index
        }));
        setLetters(letterElements);
    }, []);

    return (
        <div className="text-center mb-12">
            <h2 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {letters.map(({ letter, delay, id }) => (
                    <span
                        key={id}
                        className="inline-block animate-letter-animation"
                        style={{
                            animationDelay: `${delay}s`,
                            animationFillMode: 'both'
                        }}
                    >
                        {letter}
                    </span>
                ))}
            </h2>
        </div>
    );
};

// Video Thumbnail Component with Glassmorphism
const VideoThumbnail = ({ video, index, isActive, isPlaying, onClick, onPlay }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    return (
        <div
            className={`relative group cursor-pointer transition-all duration-500 ${
                isActive ? 'scale-110 z-20' : 'scale-90 z-10'
            } ${isPlaying && !isActive ? 'blur-sm brightness-50' : ''}`}
            onClick={() => onClick(index)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`
                relative overflow-hidden rounded-2xl
                ${isActive ? 'shadow-2xl shadow-cyan-400/50' : 'shadow-lg'}
                transition-all duration-500
                ${isHovered ? 'transform -translate-y-2' : ''}
            `}>
                <video
                    src={video.src}
                    className={`w-full h-48 object-cover transition-all duration-500 ${
                        isActive ? 'aspect-9-16' : 'aspect-16-9'
                    }`}
                    muted
                    loop
                    playsInline
                />
                
                {/* Glassmorphism Overlay */}
                <div className={`
                    absolute inset-0 bg-gradient-to-br from-white/10 to-transparent
                    backdrop-blur-sm border border-white/20 rounded-2xl
                    transition-all duration-500
                    ${isHovered ? 'bg-white/20' : ''}
                `} />
                
                {/* Play Button */}
                <div className={`
                    absolute inset-0 flex items-center justify-center
                    transition-all duration-300
                    ${isActive && isPlaying ? 'opacity-0' : 'opacity-100'}
                `}>
                    <div className={`
                        w-16 h-16 rounded-full bg-white/20 backdrop-blur-md
                        flex items-center justify-center
                        transition-all duration-300
                        ${isHovered ? 'scale-110 bg-white/30' : ''}
                    `}>
                        <i className="fas fa-play text-white text-xl ml-1" />
                    </div>
                </div>
                
                {/* Video Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-semibold text-sm">{video.title}</h3>
                </div>
            </div>
        </div>
    );
};

// Main Video Player Component
const MainVideoPlayer = ({ video, isPlaying, onPlay, onPause }) => {
    const videoRef = React.useRef(null);
    
    React.useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(console.error);
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);
    
    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <div className={`
                relative overflow-hidden rounded-3xl
                transition-all duration-700
                ${isPlaying ? 'scale-105 shadow-2xl shadow-cyan-400/30' : 'scale-100'}
            `}>
                <video
                    ref={videoRef}
                    src={video.src}
                    className="w-full h-auto aspect-9-16 object-cover"
                    controls={false}
                    muted={false}
                    loop
                    playsInline
                    onPlay={onPlay}
                    onPause={onPause}
                />
                
                {/* Custom Controls Overlay */}
                <div className={`
                    absolute inset-0 flex items-center justify-center
                    transition-all duration-300
                    ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
                `}>
                    <button
                        onClick={() => isPlaying ? onPause() : onPlay()}
                        className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md
                                 flex items-center justify-center
                                 transition-all duration-300 hover:scale-110"
                    >
                        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-2xl ml-1`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Animated Navigation Arrows
const AnimatedArrows = ({ onPrev, onNext, canGoPrev, canGoNext }) => {
    return (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-30">
            <button
                onClick={onPrev}
                disabled={!canGoPrev}
                className={`
                    w-12 h-12 rounded-full bg-white/10 backdrop-blur-md
                    flex items-center justify-center
                    transition-all duration-300 pointer-events-auto
                    ${canGoPrev ? 'hover:bg-white/20 hover:scale-110' : 'opacity-50 cursor-not-allowed'}
                `}
            >
                <i className="fas fa-chevron-left text-white text-lg" />
            </button>
            
            <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`
                    w-12 h-12 rounded-full bg-white/10 backdrop-blur-md
                    flex items-center justify-center
                    transition-all duration-300 pointer-events-auto
                    ${canGoNext ? 'hover:bg-white/20 hover:scale-110' : 'opacity-50 cursor-not-allowed'}
                `}
            >
                <i className="fas fa-chevron-right text-white text-lg" />
            </button>
        </div>
    );
};

// Indicator Dots Component
const IndicatorDots = ({ currentIndex, totalSlides, onDotClick }) => {
    return (
        <div className="flex justify-center space-x-3 mt-8">
            {Array.from({ length: totalSlides }, (_, index) => (
                <button
                    key={index}
                    onClick={() => onDotClick(index)}
                    className={`
                        w-3 h-3 rounded-full transition-all duration-300
                        ${index === currentIndex 
                            ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50' 
                            : 'bg-white/30 hover:bg-white/50'
                        }
                    `}
                />
            ))}
        </div>
    );
};

// Video Slider Component
const VideoSlider = ({ videos, currentIndex, onVideoSelect, sliderRef }) => {
    return (
        <div 
            ref={sliderRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
        >
            {videos.map((video, index) => (
                <div
                    key={index}
                    className="flex-shrink-0 scroll-snap-align-center"
                    style={{ scrollSnapAlign: 'center' }}
                >
                    <VideoThumbnail
                        video={video}
                        index={index}
                        isActive={index === currentIndex}
                        isPlaying={false}
                        onClick={onVideoSelect}
                        onPlay={() => {}}
                    />
                </div>
            ))}
        </div>
    );
};

// Main Ultra-Modern Portfolio Component
const UltraModernPortfolio = () => {
    const { currentIndex, isPlaying, setIsPlaying, goToSlide, nextSlide, prevSlide, sliderRef } = useSlider();
    
    const handleVideoSelect = (index) => {
        goToSlide(index);
    };
    
    const handlePlay = () => {
        setIsPlaying(true);
    };
    
    const handlePause = () => {
        setIsPlaying(false);
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>
            
            <div className="relative z-10 container mx-auto px-4 py-16">
                {/* Portfolio Header */}
                <PortfolioHeader />
                
                {/* Main Video Player */}
                <div className="mb-12">
                    <MainVideoPlayer
                        video={portfolioData[currentIndex]}
                        isPlaying={isPlaying}
                        onPlay={handlePlay}
                        onPause={handlePause}
                    />
                </div>
                
                {/* Video Slider */}
                <div className="relative">
                    <VideoSlider
                        videos={portfolioData}
                        currentIndex={currentIndex}
                        onVideoSelect={handleVideoSelect}
                        sliderRef={sliderRef}
                    />
                    
                    {/* Navigation Arrows */}
                    <AnimatedArrows
                        onPrev={prevSlide}
                        onNext={nextSlide}
                        canGoPrev={currentIndex > 0}
                        canGoNext={currentIndex < portfolioData.length - 1}
                    />
                </div>
                
                {/* Indicator Dots */}
                <IndicatorDots
                    currentIndex={currentIndex}
                    totalSlides={portfolioData.length}
                    onDotClick={handleVideoSelect}
                />
            </div>
        </div>
    );
};

// Simple Test Component to verify React is working
const TestComponent = () => {
    return React.createElement('div', {
        style: {
            padding: '20px',
            backgroundColor: 'red',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center'
        }
    }, 'TEST REACT COMPONENT - IF YOU SEE THIS, REACT IS WORKING!');
};

// ===== NOWOCZESNE HERO VIDEO CONTROLS =====
class ModernHeroVideo {
    constructor() {
        this.video = document.querySelector('#hero-video');
        this.overlay = document.querySelector('.play-overlay-innovative');
        this.playButton = document.querySelector('.play-button-innovative');
        
        if (this.video) {
            this.init();
        }
    }
    
    init() {
        this.setupEventListeners();
        this.setupAdvancedControls();
    }
    
    setupEventListeners() {
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.togglePlay());
        }
        
        if (this.playButton) {
            this.playButton.addEventListener('click', () => this.togglePlay());
        }
        
        if (this.video) {
            this.video.addEventListener('play', () => {
                console.log('Hero video started playing');
                this.updateOverlay(true);
            });
            
            this.video.addEventListener('pause', () => {
                console.log('Hero video paused');
                this.updateOverlay(false);
            });
            
            this.video.addEventListener('ended', () => {
                console.log('Hero video ended');
                this.updateOverlay(false);
            });
            
            this.video.addEventListener('error', (e) => {
                console.error('Hero video error:', this.video.error);
            });
        }
    }
    
    setupAdvancedControls() {
        // Double-click for fullscreen
        if (this.video) {
            this.video.addEventListener('dblclick', () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    this.video.requestFullscreen().catch(e => {
                        console.log('Fullscreen failed:', e);
                    });
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === ' ' && this.video) {
                e.preventDefault();
                this.togglePlay();
            }
        });
    }
    
    togglePlay() {
        if (!this.video) return;
        
        if (this.video.paused) {
            this.video.play().catch(e => {
                console.log('Autoplay prevented:', e);
            });
        } else {
            this.video.pause();
        }
    }
    
    updateOverlay(isPlaying) {
        if (this.overlay) {
            this.overlay.style.opacity = isPlaying ? '0' : '1';
        }
        
        if (this.playButton) {
            this.playButton.classList.toggle('playing', isPlaying);
        }
    }
}

// ===== GLOBAL VIDEO ENHANCEMENTS =====
class GlobalVideoEnhancer {
    constructor() {
        this.videos = document.querySelectorAll('video');
        this.init();
    }
    
    init() {
        this.setupVideoEnhancements();
        this.setupIntersectionObserver();
    }
    
    setupVideoEnhancements() {
        this.videos.forEach((video, index) => {
            // Add custom controls
            video.controls = true;
            
            // Performance optimizations
            video.preload = 'metadata';
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            
            // Event listeners
            video.addEventListener('loadstart', () => {
                console.log(`Video ${index} loadstart`);
            });
            
            video.addEventListener('canplay', () => {
                console.log(`Video ${index} canplay`);
            });
            
            video.addEventListener('loadeddata', () => {
                console.log(`Video ${index} loadeddata`);
            });
            
            video.addEventListener('loadedmetadata', () => {
                console.log(`Video ${index} loadedmetadata`);
            });
            
            video.addEventListener('error', (e) => {
                console.error(`Video ${index} error:`, video.error);
                this.showVideoError(video);
            });
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // Video is visible - preload
                    video.preload = 'metadata';
                } else {
                    // Video is not visible - pause and reset
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        }, {
            threshold: 0.1
        });
        
        this.videos.forEach(video => {
            observer.observe(video);
        });
    }
    
    showVideoError(video) {
        const container = video.parentElement;
        if (container) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.8);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
                z-index: 10;
            `;
            errorDiv.innerHTML = `
                <div>❌ Błąd wideo</div>
                <div style="font-size: 0.8rem; margin-top: 0.5rem;">
                    ${video.error ? video.error.message : 'Nieznany błąd'}
                </div>
            `;
            container.style.position = 'relative';
            container.appendChild(errorDiv);
        }
    }
}

// Initialize React Portfolio
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing modern video portfolio...');
    
    // Debug: Check if React and ReactDOM are loaded
    console.log('React available:', typeof React !== 'undefined');
    console.log('ReactDOM available:', typeof ReactDOM !== 'undefined');
    
    if (typeof React === 'undefined') {
        console.error('❌ React is not loaded!');
        return;
    }
    
    if (typeof ReactDOM === 'undefined') {
        console.error('❌ ReactDOM is not loaded!');
        return;
    }
    
    // Debug: Check if portfolio-root exists
    const portfolioRoot = document.getElementById('portfolio-root');
    console.log('Portfolio root element:', portfolioRoot);
    
    if (portfolioRoot) {
        console.log('✅ Portfolio root found, rendering React app...');
        try {
            // First try the test component
            console.log('Testing with simple component...');
            ReactDOM.render(React.createElement(TestComponent), portfolioRoot);
            console.log('✅ Test component rendered successfully!');
            
            // Wait a bit then try the full component
            setTimeout(() => {
                console.log('Now trying full portfolio component...');
                ReactDOM.render(React.createElement(UltraModernPortfolio), portfolioRoot);
                console.log('✅ Full React app rendered successfully!');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error rendering React app:', error);
        }
    } else {
        console.error('❌ Portfolio root element not found!');
    }
    
    // Initialize hero video
    new ModernHeroVideo();
    
    // Initialize global video enhancer
    new GlobalVideoEnhancer();
    
    console.log('✅ Modern video portfolio initialized successfully!');
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy loading for videos
const lazyLoadVideos = () => {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.src = video.dataset.src;
                videoObserver.unobserve(video);
            }
        });
    });
    
    document.querySelectorAll('video[data-src]').forEach(video => {
        videoObserver.observe(video);
    });
};

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadVideos);

// INNOWACYJNE EFEKTY NA INFOKARTACH: glass, 3D tilt, dynamiczny glow, microinteractions
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.infographic-card').forEach(card => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s, background 0.5s';
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 12;
      const rotateY = (centerX - x) / 12;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.045)`;
      card.style.boxShadow = '0 12px 48px 0 #00f2fe44, 0 1.5px 8px 0 #00BFFF44';
      card.style.background = 'rgba(30,34,54,0.72)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.18)';
      card.style.background = 'rgba(30,34,54,0.55)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 20px 60px 0 #00BFFF55, 0 1.5px 8px 0 #00f2fe55';
      card.style.background = 'rgba(30,34,54,0.82)';
    });
  });
});

// HERO VIDEO: dynamiczne efekty tła (kosmos, AI, particles, parallax)
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-video-cosmos-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.offsetWidth, h = canvas.offsetHeight;
  function resize() {
    w = canvas.offsetWidth; h = canvas.offsetHeight;
    canvas.width = w; canvas.height = h;
  }
  resize();
  window.addEventListener('resize', resize);
  // Particles: kosmiczne, AI, subtelny parallax
  const particles = Array.from({length: 32}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    r: 8+Math.random()*24,
    dx: (Math.random()-0.5)*0.3,
    dy: (Math.random()-0.5)*0.3,
    color: Math.random()>0.5 ? '#00BFFF' : '#00f2fe',
    alpha: 0.18+Math.random()*0.22
  }));
  function draw() {
    ctx.clearRect(0,0,w,h);
    for(const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      let grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      grad.addColorStop(0,p.color);
      grad.addColorStop(1,'transparent');
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
      ctx.fillStyle = grad;
      ctx.filter = 'blur(8px)';
      ctx.fill();
      ctx.restore();
      p.x += p.dx; p.y += p.dy;
      if(p.x<-40||p.x>w+40) p.dx*=-1;
      if(p.y<-40||p.y>h+40) p.dy*=-1;
    }
    requestAnimationFrame(draw);
  }
  draw();
});// HERO VIDEO: animacja Apple-style podczas odtwarzania
window.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.getElementById('hero-video');
  if (!heroVideo) return;
  heroVideo.addEventListener('play', () => {
    heroVideo.classList.add('playing');
  });
  heroVideo.addEventListener('pause', () => {
    heroVideo.classList.remove('playing');
  });
  heroVideo.addEventListener('ended', () => {
    heroVideo.classList.remove('playing');
  });
});
