document.addEventListener("DOMContentLoaded", function () {
    const html = document.documentElement;
    const languageBtn = document.getElementById("language-btn");
    const langText = document.querySelector(".lang-text");
    const langFlag = document.querySelector(".lang-flag");
    const bgVideo = document.getElementById("bg-video");

    const navLinks = document.querySelectorAll("#top-nav .nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const revealSections = document.querySelectorAll(".reveal-section");

    const modal = document.getElementById("certificate-modal");
    const modalClose = document.getElementById("modal-close");
    const certificateFrame = document.getElementById("certificate-frame");
    const viewCertificateLinks = document.querySelectorAll(".view-certificate");
    const backToTopBtn = document.getElementById("back-to-top");

    let currentLang = localStorage.getItem("preferred-language") || "en";

    function applyLanguage(lang) {
        if (lang === "ar") {
            html.setAttribute("lang", "ar");
            html.setAttribute("dir", "rtl");
            document.body.classList.add("lang-ar");
            if (langText) langText.textContent = "English";
            if (langFlag) langFlag.textContent = "🇺🇸";

            document.querySelectorAll("[data-ar]").forEach((el) => {
                if (!el.querySelector("i")) {
                    const text = el.getAttribute("data-ar");
                    if (text) el.textContent = text;
                }
            });
        } else {
            html.setAttribute("lang", "en");
            html.setAttribute("dir", "ltr");
            document.body.classList.remove("lang-ar");
            if (langText) langText.textContent = "العربية";
            if (langFlag) langFlag.textContent = "🇸🇦";

            document.querySelectorAll("[data-en]").forEach((el) => {
                if (!el.querySelector("i")) {
                    const text = el.getAttribute("data-en");
                    if (text) el.textContent = text;
                }
            });
        }

        if (backToTopBtn) {
            const topLabel = lang === "ar" ? "العودة للأعلى" : "Back to top";
            backToTopBtn.setAttribute("aria-label", topLabel);
            backToTopBtn.setAttribute("title", topLabel);
        }
    }

    if (currentLang !== "ar" && currentLang !== "en") {
        currentLang = "en";
    }

    if (bgVideo) {
        bgVideo.muted = true;
        bgVideo.defaultMuted = true;
        bgVideo.setAttribute("muted", "");
        bgVideo.setAttribute("playsinline", "");

        const tryPlayVideo = function () {
            const playPromise = bgVideo.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {
                    // Ignore autoplay rejection on restricted browsers.
                });
            }
        };

        bgVideo.addEventListener("loadeddata", tryPlayVideo, { once: true });
        document.addEventListener("visibilitychange", function () {
            if (!document.hidden) {
                tryPlayVideo();
            }
        });
    }

    // Lock mobile hero height to prevent background video from expanding when scrolling down
    let lastClientWidth = window.innerWidth;
    function lockHeroHeight() {
        if (window.innerWidth <= 768) {
            const currentHeight = window.innerHeight;
            document.documentElement.style.setProperty("--hero-height", currentHeight + "px");
        } else {
            document.documentElement.style.removeProperty("--hero-height");
        }
    }

    lockHeroHeight();

    window.addEventListener("resize", function () {
        // ONLY update if horizontal width changed (e.g. rotation / orientation change)
        // This explicitly prevents expanding when mobile address bars collapse during vertical scroll!
        if (window.innerWidth !== lastClientWidth) {
            lastClientWidth = window.innerWidth;
            lockHeroHeight();
        }
    });

    window.addEventListener("orientationchange", function () {
        setTimeout(lockHeroHeight, 200);
    });

    const themeBtn = document.getElementById("theme-btn");
    let currentTheme = localStorage.getItem("portfolio-theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    function applyTheme(theme) {
        if (theme === "dark") {
            html.setAttribute("data-theme", "dark");
            if (themeBtn) {
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
                themeBtn.setAttribute("aria-label", currentLang === "ar" ? "تفعيل الوضع الفاتح" : "Switch to light mode");
            }
        } else {
            html.removeAttribute("data-theme");
            if (themeBtn) {
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                themeBtn.setAttribute("aria-label", currentLang === "ar" ? "تفعيل الوضع الداكن" : "Switch to dark mode");
            }
        }
    }

    applyTheme(currentTheme);

    if (themeBtn) {
        themeBtn.addEventListener("click", function () {
            currentTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(currentTheme);
            localStorage.setItem("portfolio-theme", currentTheme);
        });
    }

    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
            if (!localStorage.getItem("portfolio-theme")) {
                currentTheme = e.matches ? "dark" : "light";
                applyTheme(currentTheme);
            }
        });
    }

    applyLanguage(currentLang);

    if (languageBtn) {
        languageBtn.addEventListener("click", function () {
            currentLang = currentLang === "en" ? "ar" : "en";
            applyLanguage(currentLang);
            applyTheme(currentTheme);
            localStorage.setItem("preferred-language", currentLang);
        });
    }

    /* Category Filtering */
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const filterBar = this.closest(".filter-bar");
            if (!filterBar) return;

            const group = filterBar.getAttribute("data-filter-group");
            const filter = this.getAttribute("data-filter");

            filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            let items = [];
            if (group === "projects") {
                items = document.querySelectorAll(".project-card");
            } else if (group === "certificates") {
                items = document.querySelectorAll(".certificate-item");
            }

            items.forEach((item) => {
                const category = item.getAttribute("data-category") || "";
                const categories = category.split(/\s+/);
                if (filter === "all" || categories.includes(filter)) {
                    item.classList.remove("filter-item-hidden");
                } else {
                    item.classList.add("filter-item-hidden");
                }
            });
        });
    });

    /* Quick Copy & Toast Notification */
    const toastMsg = document.getElementById("toast-msg");
    const toastText = toastMsg ? toastMsg.querySelector(".toast-text") : null;
    let toastTimeout = null;

    function showToast(text) {
        if (!toastMsg || !toastText) return;
        toastText.textContent = text;
        toastMsg.classList.add("show");
        toastMsg.setAttribute("aria-hidden", "false");

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastMsg.classList.remove("show");
            toastMsg.setAttribute("aria-hidden", "true");
        }, 2200);
    }

    function fallbackCopy(text, callback) {
        const tempInput = document.createElement("textarea");
        tempInput.value = text;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand("copy");
            if (callback) callback();
        } catch (err) {
            console.error("Copy failed", err);
        }
        document.body.removeChild(tempInput);
    }

    const copyButtons = document.querySelectorAll(".contact-copy-btn");
    copyButtons.forEach((btn) => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const textToCopy = this.getAttribute("data-copy");
            if (!textToCopy) return;

            const originalIcon = this.innerHTML;

            const doSuccess = () => {
                this.classList.add("copied");
                this.innerHTML = '<i class="fa-solid fa-check"></i>';
                const msg = currentLang === "ar" ? "تم النسخ إلى الحافظة!" : "Copied to clipboard!";
                showToast(msg);

                setTimeout(() => {
                    this.classList.remove("copied");
                    this.innerHTML = originalIcon;
                }, 2000);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(doSuccess).catch(() => {
                    fallbackCopy(textToCopy, doSuccess);
                });
            } else {
                fallbackCopy(textToCopy, doSuccess);
            }
        });
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    revealSections.forEach((section) => revealObserver.observe(section));

    function updateActiveLink() {
        let currentSectionId = "";

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 140 && rect.bottom >= 140) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${currentSectionId}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    function handleScroll() {
        updateActiveLink();
        if (backToTopBtn) {
            if (window.pageYOffset > 380) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    let scrollPosition = 0;

    function closeModal() {
        if (!modal || !modalClose || !certificateFrame) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        window.scrollTo(0, scrollPosition);

        setTimeout(() => {
            certificateFrame.src = "";
        }, 180);
    }

    viewCertificateLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const certificatePath = this.getAttribute("data-certificate");
            if (!certificatePath || !modal || !certificateFrame) return;

            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            const isPdf = certificatePath.toLowerCase().endsWith(".pdf");
            const pdfUrl = isPdf ? `${certificatePath}#view=FitH&zoom=page-fit` : certificatePath;

            certificateFrame.src = pdfUrl;
            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal && modal.classList.contains("active")) {
            closeModal();
        }
    });
});
