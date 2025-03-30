
document.addEventListener('DOMContentLoaded', function () {
    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;


    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    // Function to animate skill bars
    function animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        if (skillBars.length > 0) {
            skillBars.forEach(bar => {
                const percentage = bar.getAttribute('data-percent');
                bar.style.width = percentage + '%';
            });
        }
    }

    // Theme toggle event listener
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }

        // Re-animate skill bars after theme change
        setTimeout(animateSkills, 50);
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }


    const typewriterText = document.getElementById('typewriter-text');
    if (typewriterText) {
        const phrases = [
            'Web Developer',
            'Problem Solver',
            'PCB Designer',
            'Creative Thinker'
        ];

        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeWriter() {
            const currentPhrase = phrases[currentPhraseIndex];

            if (isDeleting) {
                typewriterText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50;
            } else {
                typewriterText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 1000; // Pause at the end
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before starting new phrase
            }

            setTimeout(typeWriter, typingSpeed);
        }

        setTimeout(typeWriter, 1000);
    }

    // Animate skill bars on scroll for about/skills page
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length > 0) {

        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkills();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(skillsSection);
        } else {

            animateSkills();
        }
    }

    // Run animation immediately on page load for visible skills
    if (document.querySelector('.skills') &&
        document.querySelector('.skills').getBoundingClientRect().top < window.innerHeight) {
        animateSkills();
    }

    // Dynamically load projects for the home page
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid && window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        // Featured projects data
        const featuredProjects = [
            {
                title: 'Featured Project',
                description: 'IoT Based Energy Meter Including Voltage Protection & Power Factor Correction',
                image: 'IMG_2178.JPG',
                demoLink: '#',
                codeLink: '#'
            }
        ];

        // Load only the single featured project on home page
        const project = featuredProjects[0];
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card featured-project-card';

        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-img">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    }

    // Page transitions
    document.querySelectorAll('a').forEach(link => {
        // Only apply to internal links that lead to our pages
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#') || href === '') return; // Skip anchor links

                e.preventDefault();

                document.body.classList.add('page-transition-out');

                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        }
    });

    // Add page transition-in class to animate the page entry
    document.body.classList.add('page-transition-in');

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});


function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Call the function when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

// Form submission handling for contact page
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();


        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const formStatus = document.getElementById('form-status');

        if (!name || !email || !message) {
            formStatus.textContent = 'Please fill in all fields';
            formStatus.className = 'error';
            return;
        }


        formStatus.textContent = 'Sending message...';
        formStatus.className = 'sending';


        setTimeout(() => {
            formStatus.textContent = 'Message sent successfully!';
            formStatus.className = 'success';
            contactForm.reset();
        }, 1500);
    });
} 