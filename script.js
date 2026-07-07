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
    let currentScreenshotIndex = 0;
    let autoplayInterval = null;
    
    const screenshotLabels = [
        "Home Dashboard",
        "Parayu History Logs",
        "Custom Personal Dictionary",
        "Snippets & Templates",
        "System Settings & Brain Switch"
    ];
    
    function update3DDeck() {
        if (!slideDeckItems || slideDeckItems.length === 0) return;
        const totalSlides = slideDeckItems.length;
        
        slideDeckItems.forEach((slide, i) => {
            // Calculate relative offset (diff) from active slide
            let diff = i - currentScreenshotIndex;
            if (diff < -2) diff += totalSlides;
            if (diff > 2) diff -= totalSlides;
            
            const sheen = slide.querySelector('.glossy-sheen');
            
            if (diff === 0) {
                slide.style.cursor = 'default';
                slide.style.pointerEvents = 'auto';
                
                // Active Slide: center stage, fully focused, normal size
                slide.style.transform = 'translate3d(0, 0, 0) rotateY(0deg) scale(1)';
                slide.style.opacity = '1';
                slide.style.zIndex = '10';
                slide.style.filter = 'brightness(1) blur(0px)';
                slide.classList.add('active');
                
                // Sweep sheen shine effect across screen!
                if (sheen) {
                    sheen.style.transition = 'none';
                    sheen.style.left = '-150%';
                    sheen.offsetHeight; // trigger reflow
                    sheen.style.transition = 'left 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    sheen.style.left = '150%';
                }
            } else if (diff === 1 || diff === -4) {
                slide.style.cursor = 'pointer';
                slide.style.pointerEvents = 'auto';
                
                // Next Slide: stacked slightly right behind center
                slide.style.transform = 'translate3d(15%, 0, -120px) rotateY(-20deg) scale(0.92)';
                slide.style.opacity = '0.55';
                slide.style.zIndex = '5';
                slide.style.filter = 'brightness(0.65) blur(1.5px)';
                slide.classList.remove('active');
                if (sheen) {
                    sheen.style.transition = 'none';
                    sheen.style.left = '-150%';
                }
            } else if (diff === -1 || diff === 4) {
                slide.style.cursor = 'pointer';
                slide.style.pointerEvents = 'auto';
                
                // Previous Slide: stacked slightly left behind center
                slide.style.transform = 'translate3d(-15%, 0, -120px) rotateY(20deg) scale(0.92)';
                slide.style.opacity = '0.55';
                slide.style.zIndex = '5';
                slide.style.filter = 'brightness(0.65) blur(1.5px)';
                slide.classList.remove('active');
                if (sheen) {
                    sheen.style.transition = 'none';
                    sheen.style.left = '-150%';
                }
            } else {
                slide.style.cursor = 'default';
                slide.style.pointerEvents = 'none';
                
                // Far slides: pushed further back, invisible
                const xOffset = diff > 0 ? '60%' : '-60%';
                const yRotation = diff > 0 ? '-35deg' : '35deg';
                slide.style.transform = `translate3d(${xOffset}, 0, -250px) rotateY(${yRotation}) scale(0.85)`;
                slide.style.opacity = '0';
                slide.style.zIndex = '2';
                slide.style.filter = 'brightness(0.4) blur(3px)';
                slide.classList.remove('active');
                if (sheen) {
                    sheen.style.transition = 'none';
                    sheen.style.left = '-150%';
                }
            }
            
            // Sync dots
            if (sliderDots[i]) {
                const isSelected = i === currentScreenshotIndex;
                sliderDots[i].style.opacity = isSelected ? '1' : '0.4';
                sliderDots[i].style.transform = isSelected ? 'scale(1.2)' : 'scale(1)';
            }
        });
        
        // Update label
        if (screenshotLabel) {
            screenshotLabel.textContent = `View: ${screenshotLabels[currentScreenshotIndex]}`;
            screenshotLabel.style.transform = 'scale(1.05)';
            setTimeout(() => {
                screenshotLabel.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        autoplayInterval = setInterval(() => {
            currentScreenshotIndex = (currentScreenshotIndex + 1) % slideDeckItems.length;
            update3DDeck();
        }, 3200); // 3.2 seconds autoplay when idle
    }
    
    // Add Click Listeners directly to cards
    slideDeckItems.forEach((slide, i) => {
        slide.addEventListener('click', () => {
            if (currentScreenshotIndex !== i) {
                currentScreenshotIndex = i;
                update3DDeck();
                resetAutoplay(); // Reset timer so user can explore
            }
        });
    });
    
    // Add Click Listeners to navigation dots
    sliderDots.forEach((dot, i) => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', () => {
            if (currentScreenshotIndex !== i) {
                currentScreenshotIndex = i;
                update3DDeck();
                resetAutoplay();
            }
        });
    });
    
    // Initialize
    if (slideDeckItems.length > 0) {
        update3DDeck();
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
