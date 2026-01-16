// Scroll Spy for Active Navigation Links
class ScrollSpy {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        this.allLinks = document.querySelectorAll('a[href^="#"], button[href^="#"]');
        this.isScrolling = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.highlightActiveLink());
        // Handle click on all internal links (nav links, CTA buttons, etc.)
        this.allLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        // Initial highlight
        this.highlightActiveLink();
    }

    highlightActiveLink() {
        let activeSection = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                activeSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        
        const href = e.currentTarget.getAttribute('href');
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Add click animation feedback
            const originalTransform = e.currentTarget.style.transform;
            e.currentTarget.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.currentTarget.style.transform = originalTransform || 'translateY(-2px)';
            }, 100);

            // Smooth scroll to target with easing
            this.smoothScrollTo(targetSection.offsetTop - 80, 800);
        }
    }

    smoothScrollTo(targetScroll, duration = 800) {
        if (this.isScrolling) return;
        this.isScrolling = true;

        const startScroll = window.scrollY;
        const distance = targetScroll - startScroll;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const scroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startScroll + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(scroll);
            } else {
                this.isScrolling = false;
                this.highlightActiveLink();
            }
        };

        requestAnimationFrame(scroll);
    }
}
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('stech-language') || 'en';
        this.init();
    }

    init() {
        // Set up the language switcher button
        const langBtn = document.getElementById('lang-btn');
        if (langBtn) {
            langBtn.addEventListener('click', () => this.toggleLanguage());
            this.updateButtonText();
        }

        // Apply the saved language on page load
        this.applyLanguage(this.currentLang);
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'pl' : 'en';
        localStorage.setItem('stech-language', this.currentLang);
        this.applyLanguage(this.currentLang);
        this.updateButtonText();
    }

    applyLanguage(lang) {
        // Update document language
        document.documentElement.lang = lang;

        // Update all elements with data-en and data-pl attributes
        document.querySelectorAll('[data-en][data-pl]').forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            
            // Check if it's an input or textarea
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });

        // Update page title
        const title = this.currentLang === 'en' 
            ? 'S-TECH Industry - CAD & 3D Scanning Solutions'
            : 'S-TECH Industry - Rozwiązania CAD i skanowania 3D';
        document.title = title;
    }

    updateButtonText() {
        const langBtn = document.getElementById('lang-btn');
        if (langBtn) {
            langBtn.textContent = this.currentLang === 'en' ? 'PL' : 'EN';
        }
    }
}

// Dark Mode Management System
class ThemeManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('stech-theme') === 'dark';
        this.init();
    }

    init() {
        // Set up the theme switcher button
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
            this.updateThemeIcon();
        }

        // Apply the saved theme on page load
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('stech-theme', this.isDarkMode ? 'dark' : 'light');
        
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (this.isDarkMode) {
                icon.className = 'fi fi-rr-sun';
                themeBtn.title = 'Switch to Light Mode';
            } else {
                icon.className = 'fi fi-rr-moon';
                themeBtn.title = 'Switch to Dark Mode';
            }
        }
    }
}

// Scroll Effects Management System
class ScrollEffects {
    constructor() {
        this.statsAnimated = false;
        this.init();
    }

    init() {
        // Scroll progress bar
        window.addEventListener('scroll', () => this.updateScrollProgress());
        
        // Scroll to top button
        window.addEventListener('scroll', () => this.toggleScrollTopButton());
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => this.scrollToTop());
        }

        // Intersection observer for fade-in animations
        this.observeElements();
        
        this.observeStats();
        this.applyStoredStats();
        this.applyStoredContact();
    }

    updateScrollProgress() {
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }
    }

    toggleScrollTopButton() {
        const btn = document.getElementById('scroll-top-btn');
        if (btn) {
            if (window.scrollY > 300) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe service cards, project cards, feature items
        document.querySelectorAll('.service-card, .project-card, .features li, .stat-card, .testimonial-card, .process-step, .tech-item').forEach(el => {
            observer.observe(el);
        });
    }

    observeStats() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.statsAnimated = true;
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(statNumber => {
            const finalNumber = parseInt(statNumber.textContent);
            let currentNumber = 0;
            const increment = finalNumber / 30;
            const duration = 30;

            const counter = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    statNumber.textContent = statNumber.getAttribute('data-value');
                    clearInterval(counter);
                } else {
                    statNumber.textContent = Math.floor(currentNumber) + (finalNumber > 100 ? '' : (currentNumber % 1).toFixed(0) === '1' ? '%' : '');
                }
            }, duration);
        });
    }
    applyStoredStats() {
        try {
            const stats = JSON.parse(localStorage.getItem('stech_stats'));
            if (!stats) return;
            const statCards = document.querySelectorAll('.stats .stat-card .stat-number');
            if (statCards.length >= 4) {
                // Projects
                statCards[0].setAttribute('data-value', `${stats.projects}+`);
                statCards[0].textContent = '0';
                // Years
                statCards[1].setAttribute('data-value', `${stats.years}+`);
                statCards[1].textContent = '0';
                // Satisfaction
                statCards[2].setAttribute('data-value', `${stats.satisfaction}%`);
                statCards[2].textContent = '0';
                // Support - keep display as '24/7'
                statCards[3].setAttribute('data-value', `${stats.support}/7`);
                statCards[3].textContent = `${stats.support}/7`;
            }
        } catch(e) {}
    }

    applyStoredContact() {
        try {
            const contact = JSON.parse(localStorage.getItem('stech_contact'));
            if (!contact) return;
            const emailEl = document.getElementById('footerEmail');
            const phoneEl = document.getElementById('footerPhone');
            if (emailEl) emailEl.textContent = `Email: ${contact.email}`;
            if (phoneEl) phoneEl.textContent = `Phone: ${contact.phone}`;
        } catch(e) {}
    }
}

// Service Cards Dropdown Manager
class ServiceDropdown {
    constructor() {
        this.serviceCards = document.querySelectorAll('.service-card');
        this.init();
    }

    init() {
        this.serviceCards.forEach(card => {
            const header = card.querySelector('.service-header');
            const toggle = card.querySelector('.dropdown-toggle');
            
            if (header && toggle) {
                header.addEventListener('click', () => this.toggleDropdown(card));
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown(card);
                });
            }
        });
    }

    toggleDropdown(card) {
        // Close all other cards
        this.serviceCards.forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('active')) {
                otherCard.classList.remove('active');
            }
        });
        
        // Toggle current card
        card.classList.toggle('active');
    }
}

// FAQ Accordion Manager
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggle(item));
            }
        });
    }

    toggle(item) {
        const isActive = item.classList.contains('active');
        
        // Close all items
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// Newsletter Form Handler
class NewsletterHandler {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const input = this.form.querySelector('input[type="email"]');
        
        if (input.value) {
            // Check for admin access
            if (input.value === 'tpiros@op.pl') {
                window.location.href = 'admin.html';
                return;
            }
            
            // Simple success feedback
            const originalText = this.form.querySelector('button').textContent;
            this.form.querySelector('button').textContent = '✓ Subscribed!';
            this.form.querySelector('button').style.background = '#00cc00';
            
            // Reset after 2 seconds
            setTimeout(() => {
                input.value = '';
                this.form.querySelector('button').textContent = originalText;
                this.form.querySelector('button').style.background = '';
            }, 2000);
        }
    }
}

// Testimonials Carousel Manager
class TestimonialsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.reviewsPerPage = 3;
        this.reviews = [];
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isTransitioning = false;
        this.wheelTimeout = null;
        this.lastWheelTime = 0;
        this.init();
    }

    init() {
        this.loadReviews();
        this.renderReviews();
        this.setupIndicators();
        this.setupSwipeGestures();
    }

    loadReviews() {
        this.reviews = JSON.parse(localStorage.getItem('stech_reviews')) || [];
        
        // Initialize with default reviews if none exist
        if (this.reviews.length === 0) {
            const defaultReviews = [
                {
                    id: 1,
                    name: 'John Mitchell',
                    company: 'TechManufacturing Inc.',
                    text: 'Exceptional CAD design services! The team delivered our complex machinery designs on time with incredible precision. Highly recommended!',
                    textPL: 'Wyjątkowe usługi projektowania CAD! Zespół dostarczył nasze złożone projekty maszyn na czas z niesamowitą dokładnością. Gorąco polecam!',
                    rating: 5,
                    date: '2025-12-15'
                },
                {
                    id: 2,
                    name: 'Sarah Anderson',
                    company: 'Precision Engineering Ltd.',
                    text: 'The 3D scanning service transformed our reverse engineering process. Their accuracy is unmatched in the industry.',
                    textPL: 'Usługa skanowania 3D zmieniła nasz proces inżynierii wstecznej. Ich dokładność nie ma sobie równych w branży.',
                    rating: 5,
                    date: '2025-11-22'
                },
                {
                    id: 3,
                    name: 'Mark Henderson',
                    company: 'Advanced Manufacturing Co.',
                    text: 'Outstanding support and quality. S-TECH delivered our 3D printing project beyond expectations. Professional team!',
                    textPL: 'Doskonałe wsparcie i jakość. S-TECH dostarczył nasz projekt druku 3D ponad oczekiwania. Profesjonalny zespół!',
                    rating: 5,
                    date: '2025-10-18'
                },
                {
                    id: 4,
                    name: 'Emma Taylor',
                    company: 'Global Design Solutions',
                    text: 'Worked with them on multiple CAD projects. Consistent quality, fast turnaround, and great communication throughout.',
                    textPL: 'Pracowałem z nimi nad wieloma projektami CAD. Konsekwentna jakość, szybki czas realizacji i świetna komunikacja.',
                    rating: 5,
                    date: '2025-09-30'
                },
                {
                    id: 5,
                    name: 'Robert Chen',
                    company: 'Innovation Labs Asia',
                    text: 'The 3D scanning accuracy is incredible. We\'ve used their services for complex heritage preservation projects.',
                    textPL: 'Dokładność skanowania 3D jest niesamowita. Korzystaliśmy z ich usług do złożonych projektów ochrony dziedzictwa.',
                    rating: 5,
                    date: '2025-09-12'
                },
                {
                    id: 6,
                    name: 'Lisa Martinez',
                    company: 'Design & Innovation Hub',
                    text: 'Exceptional team that understands our needs. The reverse engineering capabilities are top-notch!',
                    textPL: 'Wyjątkowy zespół, który rozumie nasze potrzeby. Możliwości inżynierii wstecznej są pierwszoklasowe!',
                    rating: 5,
                    date: '2025-08-25'
                },
                {
                    id: 7,
                    name: 'Thomas Weber',
                    company: 'Munich Engineering Systems',
                    text: 'S-TECH handled our complex automotive CAD project flawlessly. Their attention to detail is remarkable and delivery was ahead of schedule.',
                    textPL: 'S-TECH bezfałdowo obsługiwał nasz złożony projekt CAD dla motoryzacji. Ich dbałość o szczegóły jest godna uwagi, a dostawa była wcześniej niż planowano.',
                    rating: 5,
                    date: '2025-08-10'
                },
                {
                    id: 8,
                    name: 'Jessica Wong',
                    company: 'AsiaProto Manufacturing',
                    text: 'Best investment we made this year! Their 3D printing services helped us prototype our new product line in record time.',
                    textPL: 'Najlepsza inwestycja, jaką dokonaliśmy w tym roku! Ich usługi druku 3D pomogły nam prototypować nową linię produktów w rekordowym czasie.',
                    rating: 5,
                    date: '2025-07-28'
                },
                {
                    id: 9,
                    name: 'David Novak',
                    company: 'Eastern European Tech Solutions',
                    text: 'Reliable, professional, and cost-effective. S-TECH consistently delivers exceptional quality for our reverse engineering needs.',
                    textPL: 'Niezawodny, profesjonalny i ekonomiczny. S-TECH konsekwentnie dostarcza wyjątkową jakość dla naszych potrzeb inżynierii wstecznej.',
                    rating: 5,
                    date: '2025-07-15'
                },
                {
                    id: 10,
                    name: 'Victoria Romano',
                    company: 'Italian Design Collective',
                    text: 'Their CAD team brought our artistic vision to life with technical precision. A perfect blend of creativity and engineering excellence!',
                    textPL: 'Ich zespół CAD wcielił naszą artystyczną wizję w życie z techniczną precyzją. Idealna mieszanina kreatywności i doskonałości inżynierskiej!',
                    rating: 5,
                    date: '2025-07-02'
                },
                {
                    id: 11,
                    name: 'Klaus Hoffmann',
                    company: 'Hoffmann Precision AG',
                    text: 'We\'ve been working with S-TECH for 3 years. Their 3D scanning technology helps us maintain quality control across all our products.',
                    textPL: 'Współpracujemy z S-TECH od 3 lat. Ich technologia skanowania 3D pomaga nam utrzymać kontrolę jakości na wszystkich naszych produktach.',
                    rating: 5,
                    date: '2025-06-20'
                },
                {
                    id: 12,
                    name: 'Sophie Dupont',
                    company: 'Dupont Aerospace Technologies',
                    text: 'Complex aerospace components require precision we thought was impossible. S-TECH proved us wrong with their incredible accuracy!',
                    textPL: 'Złożone komponenty lotnicze wymagają precyzji, którą uważaliśmy za niemożliwą. S-TECH udowodnił nam, że się mylimy dzięki niesamowitej dokładności!',
                    rating: 5,
                    date: '2025-06-08'
                },
                {
                    id: 13,
                    name: 'Michael O\'Brien',
                    company: 'O\'Brien Industrial Solutions',
                    text: 'From initial consultation to final delivery, S-TECH exceeded expectations. Their 24/7 support team is phenomenal!',
                    textPL: 'Od początkowej konsultacji do ostatecznej dostawy, S-TECH przekroczył oczekiwania. Ich zespół wsparcia 24/7 jest fenomenalny!',
                    rating: 5,
                    date: '2025-05-25'
                },
                {
                    id: 14,
                    name: 'Yuki Tanaka',
                    company: 'Tanaka Manufacturing Japan',
                    text: 'Partnering with S-TECH was the best decision for our CAD outsourcing needs. Fast, reliable, and incredibly professional.',
                    textPL: 'Partnerstwo z S-TECH było najlepszą decyzją dla naszych potrzeb outsourcingu CAD. Szybkie, niezawodne i niesamowicie profesjonalne.',
                    rating: 5,
                    date: '2025-05-12'
                },
                {
                    id: 15,
                    name: 'Angela Foster',
                    company: 'Foster Automotive Group',
                    text: 'The reverse engineering project they completed for us saved us months of development time. Truly exceptional service!',
                    textPL: 'Projekt inżynierii wstecznej, który dla nas ukończyli, zaoszczędził nam miesiące czasu rozwoju. Naprawdę wyjątkowa usługa!',
                    rating: 5,
                    date: '2025-04-30'
                }
            ];
            this.reviews = defaultReviews;
            localStorage.setItem('stech_reviews', JSON.stringify(defaultReviews));
        }
    }

    renderReviews() {
        const container = document.getElementById('testimonialsContainer');
        if (!container) return;

        const startIdx = this.currentSlide * this.reviewsPerPage;
        const endIdx = startIdx + this.reviewsPerPage;
        const visibleReviews = this.reviews.slice(startIdx, endIdx);

        container.innerHTML = visibleReviews.map(review => `
            <div class="testimonial-card">
                <div class="stars">${'★'.repeat(review.rating)}</div>
                <p class="testimonial-text" data-en="${review.text}" data-pl="${review.textPL}">${this.getLocalizedText(review.text, review.textPL)}</p>
                <div class="testimonial-author">
                    <div class="author-avatar">${review.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
                    <div class="author-info">
                        <h4>${review.name}</h4>
                        <p>${review.company || 'Client'}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getLocalizedText(enText, plText) {
        const lang = document.documentElement.lang || 'en';
        return lang === 'pl' ? plText : enText;
    }

    setupIndicators() {
        const indicatorsContainer = document.getElementById('carouselIndicators');
        if (!indicatorsContainer) return;

        const numSlides = Math.ceil(this.reviews.length / this.reviewsPerPage);
        indicatorsContainer.innerHTML = Array(numSlides).fill(0).map((_, idx) => `
            <div class="carousel-indicator ${idx === this.currentSlide ? 'active' : ''}" onclick="testimonialsCarousel.goToSlide(${idx})"></div>
        `).join('');
    }

    setupSwipeGestures() {
        const container = document.getElementById('testimonialsContainer');
        if (!container) return;

        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, false);

        container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);

        // Touchpad wheel events for laptop with throttling
        const testimonialCarousel = document.querySelector('.testimonials-carousel');
        if (testimonialCarousel) {
            testimonialCarousel.addEventListener('wheel', (e) => {
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    e.preventDefault();
                    
                    // Throttle wheel events - only allow one scroll per 500ms
                    const now = Date.now();
                    if (now - this.lastWheelTime > 500) {
                        this.lastWheelTime = now;
                        if (e.deltaX > 0) {
                            slideTestimonials(1); // Scroll right = next
                        } else {
                            slideTestimonials(-1); // Scroll left = previous
                        }
                    }
                }
            }, { passive: false });
        }

        // Also support mouse drag swipe
        let isMouseDown = false;
        let mouseStartX = 0;

        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseStartX = e.clientX;
        });

        container.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });

        container.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                this.touchStartX = mouseStartX;
                this.touchEndX = e.clientX;
                // Increased threshold from 50 to 80 for less sensitivity
                if (Math.abs(this.touchStartX - this.touchEndX) > 80) {
                    this.handleSwipe();
                }
            }
            isMouseDown = false;
        });
    }

    handleSwipe() {
        // Increased threshold from 50 to 80 for less sensitivity on touch
        const swipeThreshold = 80;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold && !this.isTransitioning) {
            if (diff > 0) {
                // Swiped left, go to next
                slideTestimonials(1);
            } else {
                // Swiped right, go to previous
                slideTestimonials(-1);
            }
        }
    }

    goToSlide(slideNum) {
        const maxSlides = Math.ceil(this.reviews.length / this.reviewsPerPage);
        if (slideNum >= 0 && slideNum < maxSlides) {
            this.currentSlide = slideNum;
            this.renderReviews();
            this.setupIndicators();
        }
    }
}

let testimonialsCarousel;

// Slide testimonials function
function slideTestimonials(direction) {
    if (testimonialsCarousel) {
        const maxSlides = Math.ceil(testimonialsCarousel.reviews.length / testimonialsCarousel.reviewsPerPage);
        let newSlide = testimonialsCarousel.currentSlide + direction;
        
        if (newSlide >= maxSlides) {
            newSlide = 0;
        } else if (newSlide < 0) {
            newSlide = maxSlides - 1;
        }
        
        testimonialsCarousel.goToSlide(newSlide);
    }
}

// Gallery Carousel Manager
class GalleryCarousel {
    constructor() {
        this.currentSlide = 0;
        this.itemsPerPage = 3;
        this.items = [];
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.lastWheelTime = 0;
        this.init();
    }

    init() {
        this.loadItems();
        this.renderItems();
        this.setupIndicators();
        this.setupSwipeGestures();
    }

    loadItems() {
        const storedRaw = localStorage.getItem('stech_gallery');
        if (storedRaw !== null) {
            // Gallery has been set by admin (even if empty)
            const stored = JSON.parse(storedRaw);
            if (stored.length > 0) {
                this.items = stored.map((g, i) => ({ id: i + 1, src: g.src || null, title: g.title || `Image ${i + 1}` }));
            } else {
                // Admin saved an empty gallery
                this.items = [];
            }
        } else {
            // No gallery set yet - show placeholders
            this.items = [];
            for (let i = 1; i <= 12; i++) {
                this.items.push({
                    id: i,
                    src: null,
                    title: `Image ${i}`
                });
            }
        }
    }

    renderItems() {
        const container = document.getElementById('galleryContainer');
        if (!container) return;

        const startIdx = this.currentSlide * this.itemsPerPage;
        const endIdx = startIdx + this.itemsPerPage;
        const visibleItems = this.items.slice(startIdx, endIdx);

        // Smooth fade and slide transition
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        container.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        setTimeout(() => {
            container.innerHTML = visibleItems.map((item, idx) => `
                <div class="gallery-item" data-index="${startIdx + idx}" onclick="openGalleryLightbox(${startIdx + idx})" style="animation: slideInGallery 0.6s ease-out backwards; animation-delay: ${idx * 0.1}s;">
                    ${item.src ? `<img src="${item.src}" alt="${item.title}">` : `
                        <div class="gallery-item-placeholder">
                            <i class="fi fi-rr-image"></i>
                            <p>${item.title}</p>
                        </div>
                    `}
                </div>
            `).join('');
            
            // Fade and slide back in
            requestAnimationFrame(() => {
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            });
        }, 200);
    }

    setupIndicators() {
        const indicatorsContainer = document.getElementById('galleryIndicators');
        if (!indicatorsContainer) return;

        const numSlides = Math.ceil(this.items.length / this.itemsPerPage);
        indicatorsContainer.innerHTML = Array(numSlides).fill(0).map((_, idx) => `
            <div class="carousel-indicator ${idx === this.currentSlide ? 'active' : ''}" onclick="galleryCarousel.goToSlide(${idx})"></div>
        `).join('');
    }

    setupSwipeGestures() {
        const container = document.getElementById('galleryContainer');
        if (!container) return;

        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, false);

        container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);

        // Touchpad wheel events with throttling
        const galleryCarousel = document.querySelector('.gallery-carousel');
        if (galleryCarousel) {
            galleryCarousel.addEventListener('wheel', (e) => {
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    e.preventDefault();
                    
                    const now = Date.now();
                    if (now - this.lastWheelTime > 500) {
                        this.lastWheelTime = now;
                        if (e.deltaX > 0) {
                            slideGallery(1);
                        } else {
                            slideGallery(-1);
                        }
                    }
                }
            }, { passive: false });
        }

        // Mouse drag swipe
        let isMouseDown = false;
        let mouseStartX = 0;

        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseStartX = e.clientX;
        });

        container.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });

        container.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                this.touchStartX = mouseStartX;
                this.touchEndX = e.clientX;
                if (Math.abs(this.touchStartX - this.touchEndX) > 80) {
                    this.handleSwipe();
                }
            }
            isMouseDown = false;
        });
    }

    handleSwipe() {
        const swipeThreshold = 80;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                slideGallery(1);
            } else {
                slideGallery(-1);
            }
        }
    }

    goToSlide(slideNum) {
        const maxSlides = Math.ceil(this.items.length / this.itemsPerPage);
        if (slideNum >= 0 && slideNum < maxSlides) {
            this.currentSlide = slideNum;
            this.renderItems();
            this.setupIndicators();
        }
    }
}

let galleryCarousel;

// Slide gallery function
function slideGallery(direction) {
    if (galleryCarousel) {
        const maxSlides = Math.ceil(galleryCarousel.items.length / galleryCarousel.itemsPerPage);
        let newSlide = galleryCarousel.currentSlide + direction;
        
        if (newSlide >= maxSlides) {
            newSlide = 0;
        } else if (newSlide < 0) {
            newSlide = maxSlides - 1;
        }
        
        galleryCarousel.goToSlide(newSlide);
    }
}

// Lightbox controls
let galleryLightboxIndex = null;
let lightboxLastWheelTime = 0;
let lightboxTouchStartX = 0;
let lightboxTouchEndX = 0;

function openGalleryLightbox(index) {
    galleryLightboxIndex = index;
    const overlay = document.getElementById('galleryLightbox');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateLightboxImage();
}

function closeGalleryLightbox() {
    const overlay = document.getElementById('galleryLightbox');
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const imgEl = document.getElementById('lightboxImage');
    const placeholderEl = document.getElementById('lightboxPlaceholder');
    const wrapperEl = document.querySelector('.lightbox-image-wrapper');
    if (!imgEl || !placeholderEl || !galleryCarousel) return;

    // Animate out
    if (wrapperEl) {
        wrapperEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        wrapperEl.style.opacity = '0';
        wrapperEl.style.transform = 'scale(0.98)';
    }

    const item = galleryCarousel.items[galleryLightboxIndex];
    setTimeout(() => {
        if (item && item.src) {
            imgEl.src = item.src;
            imgEl.style.display = 'block';
            placeholderEl.style.display = 'none';
        } else {
            imgEl.removeAttribute('src');
            imgEl.style.display = 'none';
            placeholderEl.style.display = 'flex';
        }

        // Animate in
        requestAnimationFrame(() => {
            if (wrapperEl) {
                wrapperEl.style.opacity = '1';
                wrapperEl.style.transform = 'scale(1)';
            }
        });
    }, 150);
}

function lightboxNext() {
    if (galleryCarousel && galleryCarousel.items.length) {
        galleryLightboxIndex = (galleryLightboxIndex + 1) % galleryCarousel.items.length;
        updateLightboxImage();
    }
}

function lightboxPrev() {
    if (galleryCarousel && galleryCarousel.items.length) {
        galleryLightboxIndex = (galleryLightboxIndex - 1 + galleryCarousel.items.length) % galleryCarousel.items.length;
        updateLightboxImage();
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('galleryLightbox');
    const isOpen = overlay && !overlay.classList.contains('hidden');
    if (!isOpen) return;
    if (e.key === 'Escape') {
        closeGalleryLightbox();
    } else if (e.key === 'ArrowRight') {
        lightboxNext();
    } else if (e.key === 'ArrowLeft') {
        lightboxPrev();
    }
});

// Lightbox gesture support (touchpad, touch, mouse drag)
function initLightboxGestures() {
    const wrapper = document.querySelector('.lightbox-image-wrapper');
    if (!wrapper) return;

    // Touchpad horizontal wheel with throttling
    wrapper.addEventListener('wheel', (e) => {
        const overlay = document.getElementById('galleryLightbox');
        const isOpen = overlay && !overlay.classList.contains('hidden');
        if (!isOpen) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            const now = Date.now();
            if (now - lightboxLastWheelTime > 500) {
                lightboxLastWheelTime = now;
                if (e.deltaX > 0) {
                    lightboxNext();
                } else {
                    lightboxPrev();
                }
            }
        }
    }, { passive: false });

    // Touch swipe
    wrapper.addEventListener('touchstart', (e) => {
        lightboxTouchStartX = e.changedTouches[0].screenX;
    }, false);
    wrapper.addEventListener('touchend', (e) => {
        lightboxTouchEndX = e.changedTouches[0].screenX;
        const diff = lightboxTouchStartX - lightboxTouchEndX;
        if (Math.abs(diff) > 80) {
            if (diff > 0) {
                lightboxNext();
            } else {
                lightboxPrev();
            }
        }
    }, false);

    // Mouse drag swipe
    let isMouseDown = false;
    let mouseStartX = 0;
    wrapper.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouseStartX = e.clientX;
    });
    wrapper.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });
    wrapper.addEventListener('mouseup', (e) => {
        if (isMouseDown) {
            const diff = mouseStartX - e.clientX;
            if (Math.abs(diff) > 80) {
                if (diff > 0) {
                    lightboxNext();
                } else {
                    lightboxPrev();
                }
            }
        }
        isMouseDown = false;
    });
}

// Initialize all managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
    new ThemeManager();
    new ScrollEffects();
    new ScrollSpy();
    new ServiceDropdown();
    new FAQAccordion();
    new NewsletterHandler();
    testimonialsCarousel = new TestimonialsCarousel();
    galleryCarousel = new GalleryCarousel();

    // Bind backdrop click once
    const overlay = document.getElementById('galleryLightbox');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (!e.target.closest('.lightbox-content')) {
                closeGalleryLightbox();
            }
        });
    }

    // Initialize lightbox gestures once
    initLightboxGestures();
});


