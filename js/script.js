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

    applyLanguage(currentLang);

    if (languageBtn) {
        languageBtn.addEventListener("click", function () {
            currentLang = currentLang === "en" ? "ar" : "en";
            applyLanguage(currentLang);
            localStorage.setItem("preferred-language", currentLang);
        });
    }

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

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });

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
            const pdfUrl = `${certificatePath}#view=FitH&zoom=page-fit`;

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
