document.addEventListener('DOMContentLoaded', () => {

    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Use translate3d with centering for smoother liquid feel
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        follower.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

        // Parallax for the hero grid
        const grid = document.querySelector('.hero-grid-bg');
        if (grid) {
            const moveX = (x - window.innerWidth / 2) * 0.05;
            const moveY = (y - window.innerHeight / 2) * 0.05;
            grid.style.transform = `perspective(1000px) rotateX(60deg) translateY(-200px) translate3d(${moveX}px, ${moveY}px, 0)`;
        }
    });

    // Cursor Interactions
    const interactables = document.querySelectorAll('a, button, .bento-card, .accordion-item summary, .portfolio-card, .archetype-card, .mentor-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '80px';
            cursor.style.height = '80px';
            follower.style.width = '120px';
            follower.style.height = '120px';
            follower.style.background = 'rgba(255,255,255,0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            follower.style.width = '60px';
            follower.style.height = '60px';
            follower.style.background = 'rgba(255,255,255,0.05)';
        });
    });

    // 3D Tilt & Spotlight Effect for Cards
    const cards = document.querySelectorAll('.bento-card, .archetype-card, .sector-card');
    cards.forEach(card => {
        const spotlight = card.querySelector('.spotlight');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Updated Spotlight position
            if (spotlight) {
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            }

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // Scroll handling for header & Parallax
    const header = document.querySelector('.header');
    const heroImage = document.querySelector('.hero-image-container');
    const heroShape = document.querySelector('.hero-shape');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Header visibility
        if (currentScroll <= 0) {
            header.style.boxShadow = 'none';
        } else {
            header.style.boxShadow = 'var(--shadow-md)';
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        // Active Nav Link Highlighting
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (currentScroll >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            // Remove active first
            link.classList.remove('active');

            // Re-add based on scroll (for same-page hashtag links)
            if (href.startsWith('#') && currentSection && href === `#${currentSection}`) {
                link.classList.add('active');
            }
            // Re-add based on current page (for cross-page links)
            else if (href === currentPage || (href === 'index.html' && currentPage === '')) {
                link.classList.add('active');
            }
            // Special case for FAQ page where the link might be #faq
            else if (currentPage === 'faq.html' && href === '#faq') {
                link.classList.add('active');
            }
        });

        // Subtle Parallax
        if (heroImage) {
            heroImage.style.transform = `translateY(${currentScroll * 0.08}px)`;
        }
        if (heroShape) {
            heroShape.style.transform = `translateY(${currentScroll * -0.12}px)`;
        }

        // Global Scroll Progress
        const scrollBar = document.querySelector('.scroll-progress');
        if (scrollBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progressRatio = (window.pageYOffset / totalHeight) * 100;
            scrollBar.style.width = `${progressRatio}%`;
        }

        lastScroll = currentScroll;
    });

    // Magnetic Button Effect
    const magneticBtn = document.querySelector('.btn-primary');
    const hero = document.querySelector('.hero');
    const glow = document.querySelector('.mouse-glow');

    if (hero && glow) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            glow.style.opacity = '1';
            glow.style.left = `${e.clientX - rect.left}px`;
            glow.style.top = `${e.clientY - rect.top}px`;
        });

        hero.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    }

    if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', (e) => {
            const rect = magneticBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            magneticBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });

        magneticBtn.addEventListener('mouseleave', () => {
            magneticBtn.style.transform = 'translate(0, 0)';
        });
    }

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // If it's the hero text, trigger it immediately
                if (entry.target.classList.contains('hero-text-wrapper')) {
                    entry.target.style.opacity = '1';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Track elements for reveal
    const revealElements = document.querySelectorAll('.bento-card, .spec-item, .stat-card, .apply-card, .hero-text-wrapper, .hero-image-container, .timeline-item, .portfolio-card, .timeline-wrapper, .fade-in, .fade-in-up');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }


    // Apply Card Spotlight
    const applyCard = document.querySelector('.apply-card');
    if (applyCard) {
        applyCard.addEventListener('mousemove', (e) => {
            const rect = applyCard.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            applyCard.style.setProperty('--x', `${x}%`);
            applyCard.style.setProperty('--y', `${y}%`);
        });
    }

    // Smooth scroll for internal anchor links on the same page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                const navLinks = document.querySelector('.nav-links');
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Archetype Card Expansion Logic
    const archetypeCards = document.querySelectorAll('.archetype-card');
    archetypeCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('expanded')) return;

            // Expand this card
            card.classList.add('expanded');

            // Hide other cards in the same grid
            const grid = card.closest('.archetype-grid');
            const otherCards = grid.querySelectorAll('.archetype-card');
            otherCards.forEach(other => {
                if (other !== card) {
                    other.classList.add('hidden-sibling');
                }
            });

            // Re-create icons for the close button
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        const closeBtn = card.querySelector('.close-details');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Collapse this card
                card.classList.remove('expanded');

                // Show other cards
                const grid = card.closest('.archetype-grid');
                const otherCards = grid.querySelectorAll('.archetype-card');
                otherCards.forEach(other => {
                    other.classList.remove('hidden-sibling');
                });
            });
        }
    });

});
