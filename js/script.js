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
    const modalBackdrop = modal ? modal.querySelector(".modal-backdrop") : null;
    const modalClose = document.getElementById("modal-close");
    const modalDocTitle = document.getElementById("modal-doc-title");
    const modalPdfDownload = document.getElementById("modal-pdf-download");
    const certificateViewer = document.getElementById("certificate-viewer");
    const docImageContainer = document.getElementById("doc-image-container");
    const modalDocImg = document.getElementById("modal-doc-img");
    const certificateFrame = document.getElementById("certificate-frame");
    const viewCertificateLinks = document.querySelectorAll(".view-certificate");
    const backToTopBtn = document.getElementById("back-to-top");

    let currentLang = localStorage.getItem("preferred-language") || "en";
    let activeProjectData = null;
    let activeDocData = null;
    let lockedScrollY = 0;
    let isScrollLocked = false;

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

        const currentImageModalTitle = document.getElementById("image-modal-title");
        if (activeProjectData && currentImageModalTitle) {
            currentImageModalTitle.textContent = lang === "ar" ? (activeProjectData.titleAr || activeProjectData.titleEn || "") : (activeProjectData.titleEn || activeProjectData.titleAr || "");
        }

        const currentDocModalTitle = document.getElementById("modal-doc-title");
        if (activeDocData && currentDocModalTitle) {
            currentDocModalTitle.textContent = lang === "ar" ? (activeDocData.titleAr || activeDocData.titleEn || "") : (activeDocData.titleEn || activeDocData.titleAr || "");
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
    let currentTheme = localStorage.getItem("portfolio-theme") || "light";

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
            this.blur();
            navLinks.forEach((l) => l.classList.remove("active"));
            this.classList.add("active");
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

        const viewAnchor = Math.min(window.innerHeight * 0.38, 260);
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= viewAnchor && rect.bottom >= 80) {
                currentSectionId = section.id;
            }
        });

        // On mobile, map sub-sections to their primary flagship tab
        let targetId = currentSectionId;
        if (window.innerWidth <= 768) {
            if (["cv", "about", "education", "experience"].includes(currentSectionId)) {
                targetId = "cv";
            } else if (["interests", "skills"].includes(currentSectionId)) {
                targetId = "skills";
            }
        }

        let hasActive = false;
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (targetId && href === `#${targetId}` && !hasActive) {
                link.classList.add("active");
                hasActive = true;
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

    let isScrollTicking = false;
    function onThrottledScroll() {
        if (isScrollLocked) return;
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }

    handleScroll();
    window.addEventListener("scroll", onThrottledScroll, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* Scroll Lock Utilities */
    function lockScroll() {
        if (isScrollLocked) return;
        lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            const topNav = document.getElementById("top-nav");
            if (topNav) topNav.style.paddingRight = `${scrollbarWidth}px`;
        }

        document.body.style.position = "fixed";
        document.body.style.top = `-${lockedScrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        document.documentElement.classList.add("modal-locked");
        document.body.classList.add("modal-locked");
        isScrollLocked = true;

        if (bgVideo && typeof bgVideo.pause === "function") {
            try {
                bgVideo.pause();
            } catch (e) {}
        }
    }

    function unlockScroll() {
        if (!isScrollLocked) return;

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.paddingRight = "";
        const topNav = document.getElementById("top-nav");
        if (topNav) topNav.style.paddingRight = "";

        document.documentElement.classList.remove("modal-locked");
        document.body.classList.remove("modal-locked");
        isScrollLocked = false;

        window.scrollTo(0, lockedScrollY);

        if (bgVideo && typeof bgVideo.play === "function" && !document.hidden) {
            const playPromise = bgVideo.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
            }
        }
    }

    /* Document & Certificate Modal Logic */
    function openDocModal(docPath, previewImg, titleEn, titleAr) {
        if (!modal) return;

        activeDocData = { docPath, previewImg, titleEn, titleAr };

        if (modalDocTitle) {
            const displayTitle = currentLang === "ar" ? (titleAr || titleEn || "") : (titleEn || titleAr || "");
            modalDocTitle.textContent = displayTitle;
        }

        if (modalPdfDownload) {
            if (docPath) {
                modalPdfDownload.href = docPath;
                modalPdfDownload.style.display = "inline-flex";
            } else {
                modalPdfDownload.style.display = "none";
            }
        }

        if (previewImg) {
            if (modalDocImg) {
                modalDocImg.src = previewImg;
                modalDocImg.alt = currentLang === "ar" ? (titleAr || titleEn || "معاينة المستند") : (titleEn || titleAr || "Document Preview");
            }
            if (docImageContainer) docImageContainer.style.display = "flex";
            if (certificateFrame) {
                certificateFrame.style.display = "none";
                certificateFrame.src = "";
            }
        } else if (docPath) {
            if (docImageContainer) docImageContainer.style.display = "none";
            if (modalDocImg) modalDocImg.src = "";
            if (certificateFrame) {
                certificateFrame.style.display = "block";
                const isPdf = docPath.toLowerCase().endsWith(".pdf");
                certificateFrame.src = isPdf ? `${docPath}#view=FitH&zoom=page-fit` : docPath;
            }
        }

        if (certificateViewer) {
            certificateViewer.scrollTop = 0;
        }

        lockScroll();
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeDocModal() {
        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        activeDocData = null;

        unlockScroll();

        setTimeout(() => {
            if (certificateFrame) certificateFrame.src = "";
            if (modalDocImg) modalDocImg.src = "";
            if (modalDocTitle) modalDocTitle.textContent = "";
        }, 180);
    }

    viewCertificateLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const docPath = this.getAttribute("data-certificate") || "";
            const cardItem = this.closest(".certificate-item");
            const previewImg = this.getAttribute("data-preview-img") || (cardItem ? cardItem.querySelector("img")?.getAttribute("src") : "");

            const cardH3 = cardItem ? cardItem.querySelector("h3") : null;
            const titleEn = this.getAttribute("data-title-en") || (cardH3 ? cardH3.getAttribute("data-en") || cardH3.textContent.trim() : "");
            const titleAr = this.getAttribute("data-title-ar") || (cardH3 ? cardH3.getAttribute("data-ar") || cardH3.textContent.trim() : "");

            openDocModal(docPath, previewImg, titleEn, titleAr);
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeDocModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", closeDocModal);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeDocModal();
            }
        });
    }

    /* Project Image Lightbox Modal */
    const imageModal = document.getElementById("image-modal");
    const imageModalImg = document.getElementById("image-modal-img");
    const imageModalTitle = document.getElementById("image-modal-title");
    const imageModalClose = document.getElementById("image-modal-close");
    const imageModalBackdrop = imageModal ? imageModal.querySelector(".image-modal-backdrop") : null;
    const viewProjectMediaElements = document.querySelectorAll(".view-project-media");

    function openImageModal(imgSrc, titleEn, titleAr) {
        if (!imageModal || !imageModalImg) return;

        activeProjectData = { imgSrc, titleEn, titleAr };

        imageModalImg.src = imgSrc;
        const currentTitle = currentLang === "ar" ? (titleAr || titleEn || "") : (titleEn || titleAr || "");
        if (imageModalTitle) {
            imageModalTitle.textContent = currentTitle;
        }
        imageModalImg.alt = currentTitle;

        lockScroll();
        imageModal.classList.add("active");
        imageModal.setAttribute("aria-hidden", "false");
    }

    function closeImageModal() {
        if (!imageModal) return;

        imageModal.classList.remove("active");
        imageModal.setAttribute("aria-hidden", "true");
        activeProjectData = null;

        unlockScroll();

        setTimeout(() => {
            if (imageModalImg) imageModalImg.src = "";
            if (imageModalTitle) imageModalTitle.textContent = "";
        }, 180);
    }

    viewProjectMediaElements.forEach((el) => {
        el.addEventListener("click", function (event) {
            event.preventDefault();
            const imgSrc = this.getAttribute("data-image") || (this.querySelector("img") ? this.querySelector("img").getAttribute("src") : "");
            const titleEn = this.getAttribute("data-title-en") || "";
            const titleAr = this.getAttribute("data-title-ar") || "";
            if (imgSrc) {
                openImageModal(imgSrc, titleEn, titleAr);
            }
        });

        el.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.click();
            }
        });
    });

    if (imageModalClose) {
        imageModalClose.addEventListener("click", closeImageModal);
    }

    if (imageModalBackdrop) {
        imageModalBackdrop.addEventListener("click", closeImageModal);
    }

    if (imageModal) {
        imageModal.addEventListener("click", function (event) {
            if (event.target === imageModal) {
                closeImageModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            if (imageModal && imageModal.classList.contains("active")) {
                closeImageModal();
            } else if (modal && modal.classList.contains("active")) {
                closeDocModal();
            }
        }
    });
});
