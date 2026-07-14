/* ==========================================================================
   RenderLogic Interactive Actions (SPA Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Tab Navigation Routing System
    // ==========================================
    const tabTriggers = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('.tab-content');
    const headerLogo = document.getElementById('header-logo');

    function switchTab(targetTabId) {
        // Find the target section
        const targetTab = document.getElementById(targetTabId);
        if (!targetTab) return;

        // Reset scroll position
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update active nav links (both in header and footer)
        tabTriggers.forEach(trigger => {
            const isTarget = trigger.getAttribute('data-tab-target') === targetTabId;
            if (isTarget) {
                trigger.classList.add('active');
            } else {
                trigger.classList.remove('active');
            }
        });

        // Toggle parent Resources trigger highlighting
        const resourceSubTabs = ['tab-documentation', 'tab-support', 'tab-blogs', 'tab-affiliate', 'tab-mediakit'];
        const isResourceSubTab = resourceSubTabs.includes(targetTabId);
        const resourcesTrigger = document.getElementById('nav-resources-trigger');
        const resourcesDropdown = document.getElementById('resources-dropdown');
        
        if (resourcesTrigger) {
            if (isResourceSubTab) {
                resourcesTrigger.classList.add('active');
            } else {
                resourcesTrigger.classList.remove('active');
            }
        }

        // Close mobile dropdown drawer on select
        if (resourcesDropdown) {
            resourcesDropdown.classList.remove('mobile-open');
        }

        // Toggle active tab content panels
        tabContents.forEach(content => {
            if (content.id === targetTabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Close mobile nav drawer if active
        const nav = document.getElementById('navigation-bar');
        const menuToggle = document.getElementById('menu-toggle');
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            document.body.classList.remove('mobile-nav-active');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTabId = trigger.getAttribute('data-tab-target');
            switchTab(targetTabId);
            
            // Push hash state silently (optional)
            const cleanHash = targetTabId.replace('tab-', '');
            history.pushState(null, null, `#${cleanHash}`);
        });
    });

    // Split showcase cards click triggers
    const splitCards = document.querySelectorAll('.split-card');
    splitCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If the user clicked the actual button inside, let its own listener handle it
            if (e.target.tagName === 'BUTTON') return;
            
            const targetTabId = card.getAttribute('data-tab-link');
            switchTab(targetTabId);
            const cleanHash = targetTabId.replace('tab-', '');
            history.pushState(null, null, `#${cleanHash}`);
        });
    });

    // Mobile resources dropdown click toggle handler
    const resourcesTrigger = document.getElementById('nav-resources-trigger');
    const resourcesDropdown = document.getElementById('resources-dropdown');
    
    if (resourcesTrigger && resourcesDropdown) {
        resourcesTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                resourcesDropdown.classList.toggle('mobile-open');
            }
        });
    }

    // Handle initial direct page load with hash tags
    if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        const potentialTabId = `tab-${hash}`;
        const targetTab = document.getElementById(potentialTabId);
        if (targetTab) {
            switchTab(potentialTabId);
        }
    }


    // ==========================================
    // 2. Mobile Navigation Drawer Toggle
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('navigation-bar');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            document.body.classList.toggle('mobile-nav-active');
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
        });
    }


    // ==========================================
    // 2.5 Light / Dark Theme Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            try {
                localStorage.setItem('rl-theme', isDark ? 'dark' : 'light');
            } catch (e) {}
        });
    }




    // ==========================================
    // 3. Email Clipboard Copy Action
    // ==========================================
    const emailAddressElement = document.getElementById('email-address');
    const copyButton = document.getElementById('btn-copy-email');
    const copyStatus = document.getElementById('copy-status');
    
    if (copyButton && emailAddressElement && copyStatus) {
        copyButton.addEventListener('click', () => {
            const emailText = emailAddressElement.textContent.trim();
            
            navigator.clipboard.writeText(emailText)
                .then(() => {
                    copyStatus.classList.add('show');
                    setTimeout(() => {
                        copyStatus.classList.remove('show');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy email: ', err);
                });
        });
    }


    // ==========================================
    // 4. Creative Studio Timeline Scanner
    // ==========================================
    const playhead = document.getElementById('timeline-playhead');
    let playheadPosition = 0;
    let playheadActive = true;
    let playheadAnimationId = null;

    function animatePlayhead() {
        if (!playheadActive) return;
        playheadPosition += 0.15;
        if (playheadPosition > 100) {
            playheadPosition = 0;
        }
        if (playhead) {
            playhead.style.left = `${playheadPosition}%`;
        }
        playheadAnimationId = requestAnimationFrame(animatePlayhead);
    }
    animatePlayhead();

    // Horizontal audio DB level bouncing
    const meterL = document.getElementById('meter-fill-l');
    const meterR = document.getElementById('meter-fill-r');
    function animateAudioMeters() {
        if (playheadActive) {
            const lVal = Math.floor(Math.random() * 45) + 40; // 40% to 85%
            const rVal = Math.floor(Math.random() * 50) + 35; // 35% to 85%
            if (meterL) meterL.style.width = `${lVal}%`;
            if (meterR) meterR.style.width = `${rVal}%`;
        } else {
            if (meterL) meterL.style.width = '4%';
            if (meterR) meterR.style.width = '4%';
        }
    }
    setInterval(animateAudioMeters, 120);

    // Play/Pause transport control
    const playBtn = document.getElementById('btn-timeline-play');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playheadActive = !playheadActive;
            if (playheadActive) {
                playBtn.classList.add('play-active');
                animatePlayhead();
            } else {
                playBtn.classList.remove('play-active');
                if (playheadAnimationId) cancelAnimationFrame(playheadAnimationId);
            }
        });
    }

    // Timeline clip select highlighting
    const clips = document.querySelectorAll('.clip');
    const assetInfoLabel = document.getElementById('timeline-asset-info');
    clips.forEach(clip => {
        clip.addEventListener('click', () => {
            playheadActive = false;
            if (playBtn) playBtn.classList.remove('play-active');
            
            clips.forEach(c => {
                c.style.transform = '';
                c.style.boxShadow = '';
            });
            clip.style.transform = 'scale(1.04) translateY(-2px)';
            clip.style.boxShadow = '0 0 15px var(--border-hover)';
            
            const clipName = clip.textContent;
            const isAudio = clip.classList.contains('c-green') || clip.classList.contains('c-teal');
            const formatInfo = isAudio ? '48kHz Stereo' : '24 fps ProRes';
            
            if (assetInfoLabel) {
                assetInfoLabel.textContent = `Active Preview: ${clipName} (${formatInfo})`;
            }

            setTimeout(() => {
                if (!playheadActive) {
                    playheadActive = true;
                    if (playBtn) playBtn.classList.add('play-active');
                    animatePlayhead();
                }
            }, 1800);
        });
    });


    // ==========================================
    // 5. Parayu Screenshot 3D Spatial Deck (Software Lab Tab)
    // ==========================================
    const slideDeckItems = document.querySelectorAll('.slide-deck-item');
    const screenshotLabel = document.getElementById('screenshot-tab-label');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const deckRoot = document.querySelector('.cinematic-deck');
    const deckFrame = deckRoot?.querySelector('.mockup-frame');
    const deckProgress = deckRoot?.querySelector('.deck-progress');
    const prevDeckButton = deckRoot?.querySelector('.deck-arrow-prev');
    const nextDeckButton = deckRoot?.querySelector('.deck-arrow-next');
    let currentScreenshotIndex = 0;
    let autoplayInterval = null;
    let dragStartX = null;
    let lastDirection = 1;
    
    const screenshotLabels = [
        "Home Dashboard",
        "Parayu History Logs",
        "Custom Personal Dictionary",
        "Snippets & Templates",
        "System Settings & Brain Switch",
        "Your Voice Insights"
    ];
    
    function animateDeckProgress() {
        if (!deckProgress) return;
        deckProgress.classList.remove('is-running');
        deckProgress.offsetWidth;
        deckProgress.classList.add('is-running');
    }

    function updateDeckUI() {
        const totalSlides = slideDeckItems.length;
        slideDeckItems.forEach((slide, i) => {
            slide.style.transform = '';
            slide.style.opacity = '';
            slide.style.filter = '';
            slide.style.zIndex = '';
            slide.style.pointerEvents = '';
            slide.classList.toggle('active', i === currentScreenshotIndex);
            if (sliderDots[i]) {
                const isSelected = i === currentScreenshotIndex;
                sliderDots[i].style.opacity = isSelected ? '1' : '0.4';
                sliderDots[i].classList.toggle('active', isSelected);
                sliderDots[i].setAttribute('aria-current', isSelected ? 'true' : 'false');
            }
        });
        
        if (screenshotLabel) {
            const count = screenshotLabel.querySelector('.deck-label-count');
            const text = screenshotLabel.querySelector('.deck-label-text');
            if (count) count.textContent = `${String(currentScreenshotIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
            if (text) text.textContent = screenshotLabels[currentScreenshotIndex];
            screenshotLabel.animate(
                [
                    { opacity: 0, transform: `translateY(${lastDirection * 8}px)` },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }
            );
        }
        animateDeckProgress();
    }

    function goToScreenshot(index, userInitiated = false) {
        const total = slideDeckItems.length;
        const next = (index + total) % total;
        if (next === currentScreenshotIndex) return;
        const previous = currentScreenshotIndex;
        const rawDiff = next - currentScreenshotIndex;
        lastDirection = Math.abs(rawDiff) > total / 2 ? -Math.sign(rawDiff) : Math.sign(rawDiff);
        const outgoing = slideDeckItems[previous];
        const incoming = slideDeckItems[next];
        slideDeckItems.forEach((slide) => slide.getAnimations().forEach((animation) => animation.cancel()));
        currentScreenshotIndex = next;
        updateDeckUI();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (userInitiated) resetAutoplay();
            return;
        }

        // Contemporary editorial transition: split the outgoing interface into
        // staggered slices while the next product view resolves underneath.
        if (deckFrame) {
            const transitionLayer = document.createElement('div');
            transitionLayer.className = 'deck-transition-layer';
            const sourceImage = outgoing.querySelector('img');
            const shardCount = window.innerWidth < 640 ? 4 : 7;

            if (sourceImage) {
                for (let shardIndex = 0; shardIndex < shardCount; shardIndex += 1) {
                    const shard = document.createElement('div');
                    const shardImage = sourceImage.cloneNode(true);
                    const left = (shardIndex / shardCount) * 100;
                    const right = 100 - ((shardIndex + 1) / shardCount) * 100;
                    shard.className = 'deck-shard';
                    shard.style.clipPath = `inset(0 ${right}% 0 ${left}%)`;
                    shard.appendChild(shardImage);
                    transitionLayer.appendChild(shard);

                    const verticalDrift = (shardIndex % 2 === 0 ? -1 : 1) * (10 + shardIndex * 1.5);
                    shard.animate([
                        { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
                        { transform: `translate3d(${-lastDirection * (2.5 + shardIndex * .35)}%, ${verticalDrift}%, 0) scale(.985)`, opacity: 0 }
                    ], {
                        duration: 580 + shardIndex * 38,
                        delay: shardIndex * 24,
                        easing: 'cubic-bezier(.65,0,.35,1)',
                        fill: 'forwards'
                    });
                }
            }

            const scan = document.createElement('span');
            scan.className = 'deck-scan';
            transitionLayer.appendChild(scan);
            deckFrame.appendChild(transitionLayer);
            window.setTimeout(() => transitionLayer.remove(), 980);
        }

        incoming.animate([
            { transform: `translate3d(${lastDirection * 2.2}%, 0, 0) scale(1.045)`, filter: 'blur(7px) saturate(.8)', opacity: .35 },
            { transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0) saturate(1)', opacity: 1 }
        ], { duration: 820, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });

        if (userInitiated) resetAutoplay();
    }

    function resetAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        animateDeckProgress();
        autoplayInterval = setInterval(() => {
            goToScreenshot(currentScreenshotIndex + 1);
        }, 6400);
    }

    slideDeckItems.forEach((slide, i) => {
        slide.addEventListener('click', () => goToScreenshot(i, true));
    });

    sliderDots.forEach((dot, i) => {
        dot.style.cursor = 'pointer';
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Show ${screenshotLabels[i]}`);
        dot.tabIndex = 0;
        dot.addEventListener('click', () => goToScreenshot(i, true));
        dot.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToScreenshot(i, true);
            }
        });
    });

    prevDeckButton?.addEventListener('click', () => goToScreenshot(currentScreenshotIndex - 1, true));
    nextDeckButton?.addEventListener('click', () => goToScreenshot(currentScreenshotIndex + 1, true));

    if (deckFrame) {
        deckFrame.addEventListener('pointerdown', (event) => { dragStartX = event.clientX; });
        deckFrame.addEventListener('pointerup', (event) => {
            if (dragStartX === null) return;
            const distance = event.clientX - dragStartX;
            dragStartX = null;
            if (Math.abs(distance) > 42) goToScreenshot(currentScreenshotIndex + (distance < 0 ? 1 : -1), true);
        });
    }

    deckRoot?.addEventListener('mouseenter', () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
        deckProgress?.classList.remove('is-running');
    });
    deckRoot?.addEventListener('mouseleave', resetAutoplay);

    document.addEventListener('keydown', (event) => {
        if (!deckRoot?.matches(':hover')) return;
        if (event.key === 'ArrowLeft') goToScreenshot(currentScreenshotIndex - 1, true);
        if (event.key === 'ArrowRight') goToScreenshot(currentScreenshotIndex + 1, true);
    });

    if (slideDeckItems.length > 0) {
        updateDeckUI();
        resetAutoplay();
    }





    // ==========================================
    // 7. Dynamic Spotlight Flashlight Hover Effect
    // ==========================================
    const serviceCards = document.querySelectorAll('.service-card, .portfolio-card, .collab-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
});
