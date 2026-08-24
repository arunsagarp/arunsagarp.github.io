document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Sticky nav background + back-to-top visibility
    const nav = document.getElementById('siteNav');
    const toTop = document.getElementById('toTop');
    const onScroll = () => {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', y > 8);
        if (toTop) toTop.classList.toggle('visible', y > 700);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    // Scroll-spy for nav links
    const sections = document.querySelectorAll('main section[id]');
    const spyLinks = document.querySelectorAll('.nav-links a');
    if (sections.length && spyLinks.length && 'IntersectionObserver' in window) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                spyLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        sections.forEach((section) => spyObserver.observe(section));
    }

    // Scroll-reveal
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in-view'));
    }

    // Hero typewriter
    const heroRole = document.getElementById('heroRole');
    if (heroRole) {
        const phrases = [
            'Building cloud-native platforms on AWS & GCP',
            'Scaling Kubernetes clusters at HCL Software',
            'Shipping infrastructure from POC to GA',
            'Building agentic workflows with Claude Code'
        ];
        if (reduceMotion) {
            heroRole.textContent = phrases[0];
        } else {
            let phraseIndex = 0;
            let charIndex = phrases[0].length;
            let deleting = false;
            heroRole.textContent = phrases[0];

            const tick = () => {
                const current = phrases[phraseIndex];
                if (!deleting) {
                    charIndex++;
                    if (charIndex > current.length) {
                        deleting = true;
                        setTimeout(tick, 1800);
                        return;
                    }
                } else {
                    charIndex--;
                    if (charIndex < 0) {
                        deleting = false;
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                        charIndex = 0;
                    }
                }
                heroRole.textContent = phrases[phraseIndex].slice(0, charIndex);
                setTimeout(tick, deleting ? 30 : 55);
            };
            setTimeout(tick, 1800);
        }
    }

    // Project slideshows
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('modalImg');
    const modalClose = document.getElementById('modalClose');

    const openModal = (src, alt) => {
        if (!modal || !modalImg) return;
        modalImg.src = src;
        modalImg.alt = alt || 'Enlarged project image';
        modal.classList.add('active');
    };
    const closeModal = () => {
        if (!modal || !modalImg) return;
        modal.classList.remove('active');
        modalImg.src = '';
    };
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    document.querySelectorAll('.slideshow').forEach((slideshow) => {
        const slides = Array.from(slideshow.querySelectorAll('.slide'));
        const dotsWrap = slideshow.querySelector('.slide-dots');
        const zoomBtn = slideshow.querySelector('.slide-zoom');
        let index = Math.max(0, slides.findIndex((s) => s.classList.contains('active')));
        let timer = null;

        const goTo = (n) => {
            slides[index].classList.remove('active');
            if (dotsWrap) dotsWrap.children[index]?.classList.remove('active');
            index = n;
            slides[index].classList.add('active');
            if (dotsWrap) dotsWrap.children[index]?.classList.add('active');
        };

        if (slides.length > 1 && dotsWrap) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'slide-dot' + (i === index ? ' active' : '');
                dot.type = 'button';
                dot.setAttribute('aria-label', `Show image ${i + 1} of ${slides.length}`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            });

            if (!reduceMotion) {
                timer = setInterval(() => goTo((index + 1) % slides.length), 3200);
            }
        }

        if (zoomBtn) {
            zoomBtn.addEventListener('click', () => openModal(slides[index].src, slides[index].alt));
        }
    });
});
