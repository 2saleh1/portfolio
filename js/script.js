(function () {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }

    // Force reflow for LinkedIn in-app browser
    if (window.innerWidth <= 768) {
        document.documentElement.style.setProperty('max-width', '100vw');
        document.body.style.setProperty('max-width', '100vw');
        document.body.style.setProperty('overflow-x', 'hidden');
    }
})();


// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function () {
    // Add smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
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

    // Enhanced typing animation for the tagline
    const tagline = document.querySelector('.tagline');
    let phrases = [
        'Welcome to my personal website',
        'Saudi Developer from Al-Qassim',
        'AI & Deep Learning Enthusiast',
        'Software Developer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    tagline.style.borderRight = '2px solid white';

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            tagline.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            tagline.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }

    setTimeout(typeEffect, 1000);

    // Language Toggle Functionality - FIXED VERSION
    const languageBtn = document.getElementById('language-btn');
    const langText = document.querySelector('.lang-text');
    const langFlag = document.querySelector('.lang-flag');
    const html = document.documentElement;

    let currentLang = 'en';

    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) {
        currentLang = savedLang;
        switchLanguage(currentLang);
    }

    // Function to update tagline phrases
    function updateTaglinePhrases(newPhrases) {
        phrases = newPhrases;
        phraseIndex = 0;
        charIndex = 0;
        isDeleting = false;
    }

    function switchLanguage(lang) {
        console.log('Switching to:', lang); // Debug log

        if (lang === 'ar') {
            // Switch to Arabic
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            langText.textContent = 'English';
            langFlag.textContent = '🇺🇸';

            // Update all elements with data-ar attributes
            document.querySelectorAll('[data-ar]').forEach(element => {
                // Only update text if element does NOT contain an <i> tag
                if (!element.querySelector('i')) {
                    const arabicText = element.getAttribute('data-ar');
                    if (arabicText) {
                        element.textContent = arabicText;
                    }
                }
            });

            // Update tagline phrases for Arabic
            updateTaglinePhrases([
                'نورت موقعي',
                'مطور سعودي من القصيم',
                'محب للذكاء الاصطناعي والتعلم العميق',
                'مطور تطبيقات '
            ]);

        } else {
            // Switch to English
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            langText.textContent = 'العربية';
            langFlag.textContent = '🇸🇦';

            // Update all elements with data-en attributes
            document.querySelectorAll('[data-en]').forEach(element => {
                if (!element.querySelector('i')) {
                    const englishText = element.getAttribute('data-en');
                    if (englishText) {
                        element.textContent = englishText;
                    }
                }
            });

            // Update tagline phrases for English
            updateTaglinePhrases([
                'Welcome to my personal website',
                'Saudi Developer from Al-Qassim',
                'AI & Deep Learning Enthusiast',
                'Mobile App Developer'
            ]);
        }

        // RECREATE SKILL PROGRESS BARS AFTER LANGUAGE CHANGE
        recreateSkillBars();
    }

    // FIXED LANGUAGE BUTTON EVENT LISTENER
    if (languageBtn) {
        languageBtn.addEventListener('click', function () {
            console.log('Button clicked, current lang:', currentLang); // Debug log
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            switchLanguage(currentLang);
            localStorage.setItem('preferred-language', currentLang);
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Add stagger animation to skill items (REMOVED PROGRESS BAR FILLING)
                if (entry.target.id === 'skills') {
                    const skillItems = entry.target.querySelectorAll('.skill-item');
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('skill-animate');
                        }, index * 100);
                    });
                }

                // ADD STAGGER ANIMATION TO CERTIFICATE ITEMS
                if (entry.target.id === 'certificates') {
                    const certificateItems = entry.target.querySelectorAll('.certificate-item');
                    certificateItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('certificate-animate');
                        }, index * 10);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });








    // NEW FUNCTION TO RECREATE SKILL 
    function recreateSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');

        skillItems.forEach((item) => {
            // Remove existing progress bar if any
            const existingProgress = item.querySelector('.skill-progress');
            if (existingProgress) {
                existingProgress.remove();
            }

            // Add hover effects (keep these if you want)
            item.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-10px) scale(1.05) rotateY(5deg)';
            });

            item.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
            });
        });
    }
    // Enhanced profile picture with 3D effect
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        profilePic.addEventListener('click', function () {
            this.style.transform = 'rotate(360deg) scale(1.2)';
            this.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg) scale(1)';
                this.style.filter = 'hue-rotate(0deg)';
            }, 1000);
        });

        // Mouse move effect
        profilePic.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `perspective(1000px) rotateY(${x * 0.1}deg) rotateX(${-y * 0.1}deg)`;
        });

        profilePic.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    }

    // Highlight nav link for current section
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('#top-nav .nav-link');
        let currentSectionId = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom > 80) { // 80px offset for nav height
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });


    // Dynamic background color change based on scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const sections = document.querySelectorAll('section');

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop - windowHeight / 2 &&
                scrollPosition < sectionTop + sectionHeight - windowHeight / 2) {
                // Add active class to current section
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
    });

    // Enhanced contact links with ripple effect
    const contactLinks = document.querySelectorAll('.contact-links a');
    contactLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add wave animation to interests
    const interests = document.querySelectorAll('#interests li');
    interests.forEach((interest, index) => {
        interest.style.animationDelay = `${index * 0.2}s`;
        interest.classList.add('wave-animation');

        // Add click effect
        interest.addEventListener('click', function () {
            this.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
                this.classList.add('wave-animation');
            }, 500);
        });
    });

    // Add matrix rain effect (toggle with 'M' key)
    document.addEventListener('keydown', function (e) {
        if (e.key.toLowerCase() === 'm') {
            e.preventDefault(); // Prevent default browser behavior
            toggleMatrixRain();
        }
    });

    // Add glitch effect (toggle with 'G' key)
    document.addEventListener('keydown', function (e) {
        if (e.key.toLowerCase() === 'g') {
            document.body.classList.toggle('glitch-effect');
            setTimeout(() => {
                document.body.classList.remove('glitch-effect');
            }, 3000);
        }
    });

    // Certificate Modal Functionality
    const certificateModal = document.getElementById('certificate-modal');
    const certificateFrame = document.getElementById('certificate-frame');
    const modalClose = document.getElementById('modal-close');
    const viewCertificateLinks = document.querySelectorAll('.view-certificate');
    let scrollPosition = 0;

    // Open modal when certificate link is clicked
    viewCertificateLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const certificatePath = this.getAttribute('data-certificate');
            if (certificatePath) {
                // Save current scroll position
                scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                document.body.style.top = `-${scrollPosition}px`;

                certificateFrame.src = certificatePath;
                certificateModal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });

    // Close modal when close button is clicked
    modalClose.addEventListener('click', function () {
        certificateModal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Restore scroll position
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);

        // Clear iframe after animation
        setTimeout(() => {
            certificateFrame.src = '';
        }, 300);
    });

    // Close modal when clicking outside the content
    certificateModal.addEventListener('click', function (e) {
        if (e.target === certificateModal) {
            modalClose.click();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
            modalClose.click();
        }
    });
});

// Matrix rain effect
let matrixActive = false;
function toggleMatrixRain() {
    console.log('Matrix toggle called, current state:', matrixActive); // Debug log

    if (matrixActive) {
        // Stop matrix effect
        document.querySelectorAll('.matrix-char').forEach(char => char.remove());
        document.body.classList.remove('matrix-active');
        matrixActive = false;
        console.log('Matrix effect stopped');
        return;
    }

    // Start matrix effect
    matrixActive = true;
    document.body.classList.add('matrix-active');
    console.log('Matrix effect started');

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const matrixInterval = setInterval(() => {
        if (!matrixActive) {
            clearInterval(matrixInterval);
            return;
        }

        // Create multiple characters at once
        for (let i = 0; i < 5; i++) {
            const matrixChar = document.createElement('div');
            matrixChar.className = 'matrix-char';
            matrixChar.textContent = chars[Math.floor(Math.random() * chars.length)];
            matrixChar.style.left = Math.random() * 100 + '%';
            matrixChar.style.animationDuration = (Math.random() * 3 + 2) + 's';
            matrixChar.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(matrixChar);

            // Remove character after animation
            setTimeout(() => {
                if (matrixChar.parentNode) {
                    matrixChar.remove();
                }
            }, 5000);
        }
    }, 100); // Create new characters every 100ms

    // Auto-stop after 10 seconds
    setTimeout(() => {
        if (matrixActive) {
            toggleMatrixRain();
        }
    }, 10000);
}
