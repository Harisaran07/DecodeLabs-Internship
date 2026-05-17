document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect (Sticky Nav)
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    // 2. Booking Form Tabs State Management
    const tabBtns = document.querySelectorAll('.tab-btn');
    const formGroups = document.querySelectorAll('.form-group');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(t => t.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
            
            // Basic animation effect for form change (simulating state change)
            const form = document.querySelector('.booking-form');
            form.style.opacity = '0';
            
            setTimeout(() => {
                // Change placeholder text based on tab to simulate switching contexts
                const tabType = btn.getAttribute('data-tab');
                const firstInput = form.querySelector('input');
                
                if(tabType === 'flights') {
                    firstInput.placeholder = "Flying to?";
                } else if(tabType === 'cars') {
                    firstInput.placeholder = "Pick-up location";
                } else {
                    firstInput.placeholder = "Where are you going?";
                }
                
                form.style.opacity = '1';
                form.style.transition = 'opacity 0.4s ease';
            }, 200);
        });
    });

    // 3. Award-Winning Entrance Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply optional delay
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}s`;
                }
                
                // Add visible class
                entry.target.classList.add('is-visible');
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target all elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Dark Mode Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        
        // Check local storage for theme
        const currentTheme = localStorage.getItem('wanderlust_theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            
            localStorage.setItem('wanderlust_theme', theme);
        });
    }

    // 6. Interactive Destination Background on Hover (Crossfade)
    const destSection = document.getElementById('destinations');
    const bgA = document.getElementById('dest-bg-a');
    const bgB = document.getElementById('dest-bg-b');
    const hoverCards = document.querySelectorAll('.dest-card[data-bg-url]');

    let currentActive = 'a'; // which layer is currently shown
    let leaveTimer = null;

    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            clearTimeout(leaveTimer);
            const bgUrl = this.getAttribute('data-bg-url');

            if (currentActive === 'a') {
                // Load new image in B, fade B in, fade A out
                bgB.style.backgroundImage = `url('${bgUrl}')`;
                bgB.classList.add('active');
                bgA.classList.remove('active');
                currentActive = 'b';
            } else {
                // Load new image in A, fade A in, fade B out
                bgA.style.backgroundImage = `url('${bgUrl}')`;
                bgA.classList.add('active');
                bgB.classList.remove('active');
                currentActive = 'a';
            }

            destSection.classList.add('bg-active');
        });

        card.addEventListener('mouseleave', function() {
            leaveTimer = setTimeout(() => {
                bgA.classList.remove('active');
                bgB.classList.remove('active');
                destSection.classList.remove('bg-active');
            }, 200);
        });

        // Add Click Animation
        card.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() === 'button') return;
            this.classList.add('anim-active');
            setTimeout(() => {
                this.classList.remove('anim-active');
            }, 800);
        });
    });

    // 7. Navbar Item 3D Calendar Page Flip on Click
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            this.classList.add('nav-flip-active');
            setTimeout(() => {
                this.classList.remove('nav-flip-active');
            }, 600);
        });
    });
});
