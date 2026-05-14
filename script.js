document.addEventListener('DOMContentLoaded', () => {
    
    // 1. NAVBAR SCROLL & MOBILE MENU
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 2. SCROLL REVEAL ANIMATION (IntersectionObserver)
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                // Trigger stats counter if visible
                if (entry.target.classList.contains('stats-container')) {
                    startStatsCounter();
                }
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll(
        '.reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-pop, .reveal-card, .stats-container'
    );
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. STATS COUNTER LOGIC
    function startStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            if (stat.classList.contains('counted')) return;
            const target = +stat.getAttribute('data-target');
            const increment = target / 50;
            let count = 0;

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    stat.innerText = Math.ceil(count);
                    setTimeout(updateCount, 30);
                } else {
                    stat.innerText = target;
                    stat.classList.add('counted');
                }
            };
            updateCount();
        });
    }

    // 4. ANIMATED TYPING EFFECT
    const typingElement = document.getElementById('typing-text');
    const words = ["Tempat Nongkrong", "Tempat Kerja", "Tempat Belajar"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const displayText = isDeleting 
            ? currentWord.substring(0, charIndex--) 
            : currentWord.substring(0, charIndex++);

        typingElement.textContent = displayText;

        if (!isDeleting && charIndex === currentWord.length + 1) {
            isDeleting = true;
            setTimeout(type, 1500); // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    if (typingElement) type();

    // 5. OPENING HOURS REAL-TIME LOGIC
    function updateOpeningStatus() {
        const statusBadge = document.getElementById('status-indicator');
        const timeDot = document.getElementById('time-dot');
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTimeDecimal = hours + minutes / 60;

        const openTime = 8;
        const closeTime = 23;

        if (currentTimeDecimal >= openTime && currentTimeDecimal < closeTime) {
            statusBadge.textContent = "BUKA SEKARANG";
            statusBadge.className = "status-badge status-open";
            
            // Calculate dot position (percentage between 8 and 23)
            const percentage = ((currentTimeDecimal - openTime) / (closeTime - openTime)) * 100;
            timeDot.style.left = `${percentage}%`;
        } else {
            statusBadge.textContent = "TUTUP";
            statusBadge.className = "status-badge status-closed";
            timeDot.style.left = "0%";
        }
    }
    updateOpeningStatus();
    setInterval(updateOpeningStatus, 60000); // Update every minute

    // 6. MENU FILTER TABS
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // 7. PARALLAX BLOBS
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.1;
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // 8. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

});
