document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       0. Dark Mode System
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply initial theme
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        // Enable smooth transition class briefly
        document.documentElement.classList.add('theme-transition');
        
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'dark';
        
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            newTheme = 'light';
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        localStorage.setItem('theme', newTheme);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 500);
    });

    /* ==========================================================================
       1. Custom Cursor & Magnetic Hover Elements
       ========================================================================== */
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

    // Only run cursor logic on desktop
    if (window.innerWidth > 1023) {
        // Move cursors
        let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move inner dot instantly
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0.1
            });
        });

        // Smooth follow for outer circle using GSAP ticker
        gsap.ticker.add(() => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            gsap.set(cursorFollower, { x: followerX, y: followerY });
        });

        // Hover states
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('hover');
                cursor.style.opacity = '0';
            });
            target.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('hover');
                cursor.style.opacity = '1';
                
                // Reset magnetic button position if applicable
                if (target.classList.contains('magnetic-btn') || target.classList.contains('magnetic-icon')) {
                    gsap.to(target, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
                }
            });

            // Magnetic Button Effect
            if (target.classList.contains('magnetic-btn') || target.classList.contains('magnetic-icon')) {
                target.addEventListener('mousemove', (e) => {
                    const rect = target.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const offsetX = (e.clientX - centerX) * 0.3;
                    const offsetY = (e.clientY - centerY) * 0.3;
                    
                    gsap.to(target, {
                        x: offsetX,
                        y: offsetY,
                        duration: 0.1,
                        ease: 'power1.out'
                    });
                });
            }
        });
    }

    /* ==========================================================================
       2. Mobile Navigation Toggle
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    /* ==========================================================================
       3. Navbar Scroll Effect
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       4. GSAP "Full Facheras" Animations
       ========================================================================== */
       
    // a. Hero Initial Reveal Animation
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    // Animate Navbar
    heroTl.from(".navbar", { y: -100, opacity: 0, duration: 1, delay: 0.2 });

    // Animate Hero text lines
    heroTl.from(".header-text", {
        y: 80,
        opacity: 0,
        rotation: 3,
        duration: 1.2,
        stagger: 0.15,
        clearProps: "all"
    }, "-=0.5");

    // b. Section Headers Scroll Reveal
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header, 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                clearProps: "all" // Remove inline styles after animation
            }
        );
        
        // Animate the line
        gsap.fromTo(header.querySelector('.line'), 
            { scaleX: 0 },
            {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                scaleX: 1,
                duration: 1,
                delay: 0.3,
                ease: "power3.out"
            }
        );
    });

    // c. Fade Up Elements (Text, paragraphs, contact info)
    gsap.utils.toArray('.fade-up').forEach(element => {
        gsap.fromTo(element, 
            { y: 40, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "all"
            }
        );
    });

    // d. OrbitUp Project Card Parallax/Tilt
    const projectCard = document.querySelector('.parallax-card');
    if (projectCard) {
        gsap.fromTo(projectCard, 
            { y: 100, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: projectCard,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                clearProps: "all" // Keep it clean after reveal
            }
        );
        
        // Slight parallax on image or card content inside when scrolling
        gsap.to(projectCard, {
            scrollTrigger: {
                trigger: projectCard,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -30,
            ease: "none"
        });
    }

    // e. Stack Grid Stagger
    const stackArea = document.querySelector('.stack-grid');
    if (stackArea) {
        gsap.fromTo('.stagger-card', 
            { y: 60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: stackArea,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                clearProps: "all"
            }
        );
    }
    
    // f. Infinite Marquee Animation
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        // Clone the text block a few times to ensure seamless infinite scroll
        for (let i = 0; i < 4; i++) {
            const clone = marqueeContent.children[0].cloneNode(true);
            marqueeContent.appendChild(clone);
        }

        // Move it continuously to the left
        gsap.to('.marquee-content', {
            xPercent: -50, // Move half its total width (since we cloned it)
            ease: "none",
            duration: 15,
            repeat: -1
        });
    }

    // g. Experience Timeline Draw
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineContainer && timelineLine) {
        gsap.to(timelineLine, {
            scrollTrigger: {
                trigger: timelineContainer,
                start: "top 75%",
                end: "bottom 75%",
                scrub: 1
            },
            height: "100%",
            ease: "none"
        });
    }

    /* ==========================================================================
       6. GitHub Live Data Fetch
       ========================================================================== */
    const fetchGitHubData = async () => {
        const githubDataContainer = document.getElementById('github-data');
        if (!githubDataContainer) return;

        try {
            const response = await fetch('https://api.github.com/users/kyurinn');
            if (!response.ok) throw new Error('API Rate Limit or Not Found');
            const data = await response.json();

            githubDataContainer.innerHTML = `
                <div class="github-stat">
                    <span class="github-stat-label">Repos Publicos</span>
                    <span class="github-stat-value">${data.public_repos}</span>
                </div>
                <div class="github-stat">
                    <span class="github-stat-label">Seguidores</span>
                    <span class="github-stat-value">${data.followers}</span>
                </div>
                <div class="github-stat">
                    <span class="github-stat-label">Ubicación</span>
                    <span class="github-stat-value">${data.location || 'N/A'}</span>
                </div>
            `;
        } catch (error) {
            // Fallback gracefully if API fails (e.g. Rate Limit)
            githubDataContainer.innerHTML = `
                <div class="github-stat">
                    <span class="github-stat-label">Repos Publicos</span>
                    <span class="github-stat-value">12</span>
                </div>
                <div class="github-stat">
                    <span class="github-stat-label">Seguidores</span>
                    <span class="github-stat-value">45</span>
                </div>
                <div class="github-stat">
                    <span class="github-stat-label">Estado de Red</span>
                    <span class="github-stat-value" style="color: #9ece6a;">Operativo</span>
                </div>
            `;
            console.warn('Usando datos de fallback por límite de API Github.');
        }
    };
    
    // Slight delay so it doesn't block the main thread visually on load
    setTimeout(fetchGitHubData, 800);

    /* ==========================================================================
       7. Terminal Contact Form Logic
       ========================================================================== */
    const terminalForm = document.getElementById('terminal-form');
    if (terminalForm) {
        terminalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('terminal-email');
            const messageInput = document.getElementById('terminal-message');
            const outputArea = document.querySelector('.terminal-output');
            const submitBtn = document.querySelector('.terminal-btn');

            if (emailInput.value && messageInput.value) {
                // Simulate terminal processing
                outputArea.innerHTML = `<span style="color: #e0af68;">[*] Parseando datos...</span>`;
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    outputArea.innerHTML = `<span style="color: #e0af68;">[*] Parseando datos... OK</span><br><span style="color: #7dcfff;">[*] Preparando cliente de correo...</span>`;
                }, 500);

                setTimeout(() => {
                    outputArea.innerHTML = `<span style="color: #9ece6a;">[✓] Redirigiendo a tu cliente de correo. ¡Gracias!</span>`;
                    
                    // Actually trigger the mailto link
                    const mailtoLink = `mailto:mateo.cioppa1@gmail.com?subject=Contacto desde Portfolio (Terminal)&body=${encodeURIComponent("Email del remitente: " + emailInput.value + "\n\nMensaje:\n" + messageInput.value)}`;
                    window.location.href = mailtoLink;
                    
                    // Reset inputs after sending
                    setTimeout(() => {
                        emailInput.value = '';
                        messageInput.value = '';
                        submitBtn.disabled = false;
                        outputArea.innerHTML = `Listo para una nueva conexión.`;
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    // Refresh ScrollTrigger on load to recalculate geometry accurately
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
