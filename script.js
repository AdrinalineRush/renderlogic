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
    // 5. Parayu Typist simulator (Software Lab Tab)
    // ==========================================
    const parayuTranscriptionBox = document.getElementById('parayu-transcription-box');
    const parayuWaveBars = document.querySelectorAll('.wave-bar');
    let parayuCycleTimeout = null;
    let parayuTypingInterval = null;

    const parayuCycles = [
        {
            // Cycle 1: Malayalam translation demo
            steps: [
                { type: "idle", text: "[⌥Space to start speaking...]" },
                { type: "speaking", text: "ഇന്നലെ ഞാൻ അയച്ച ഇമെയിൽ വായിച്ചുനോക്കിയോ..." },
                { type: "processing", text: "[Whisper AI translating: Malayalam ➜ English...]" },
                { type: "completed", text: "\"Did you read the email I sent yesterday?\"" }
            ]
        },
        {
            // Cycle 2: Stutter & grammar correction demo
            steps: [
                { type: "idle", text: "[⌥Space to start speaking...]" },
                { type: "speaking", text: "We need... we need to deploy... deploy the models... models offline..." },
                { type: "processing", text: "[On-device AI cleaning up stutters & grammar...]" },
                { type: "completed", text: "\"We need to deploy the models offline.\"" }
            ]
        },
        {
            // Cycle 3: Dictionary rewrite demo
            steps: [
                { type: "idle", text: "[⌥Space to start speaking...]" },
                { type: "speaking", text: "Welcome to parayoo..." },
                { type: "processing", text: "[Dictionary mapping: parayoo ➜ Parayu...]" },
                { type: "completed", text: "\"Welcome to Parayu.\"" }
            ]
        }
    ];

    let currentCycleIndex = 0;
    let currentStepIndex = 0;

    function runParayuSimulation() {
        if (!parayuTranscriptionBox) return;

        // Clear any running intervals/timeouts
        clearInterval(parayuTypingInterval);
        clearTimeout(parayuCycleTimeout);

        const cycle = parayuCycles[currentCycleIndex];
        const step = cycle.steps[currentStepIndex];

        // Format transcription container styling
        if (step.type === "idle" || step.type === "processing") {
            parayuTranscriptionBox.style.fontStyle = "italic";
            parayuTranscriptionBox.style.opacity = "0.6";
            parayuTranscriptionBox.textContent = step.text;
        } else {
            parayuTranscriptionBox.style.fontStyle = "normal";
            parayuTranscriptionBox.style.opacity = "1";
        }

        // Configure audio waves animation states
        if (step.type === "speaking") {
            parayuWaveBars.forEach(bar => {
                bar.style.animationPlayState = 'running';
                bar.style.opacity = '1';
                bar.style.background = 'var(--gradient-brand)';
            });
        } else if (step.type === "processing") {
            parayuWaveBars.forEach(bar => {
                bar.style.animationPlayState = 'running';
                bar.style.opacity = '0.7';
                bar.style.background = 'var(--primary)';
            });
        } else {
            parayuWaveBars.forEach(bar => {
                bar.style.animationPlayState = 'paused';
                bar.style.opacity = '0.3';
            });
        }

        // Animate simulated typist workflow
        if (step.type === "speaking" || step.type === "completed") {
            parayuTranscriptionBox.textContent = "";
            let charIndex = 0;
            const textToType = step.text;

            parayuTypingInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    parayuTranscriptionBox.textContent += textToType[charIndex];
                    charIndex++;
                } else {
                    clearInterval(parayuTypingInterval);
                    
                    // Show success system-wide indicator
                    if (step.type === "completed") {
                        parayuTranscriptionBox.innerHTML += '<div style="font-size: 0.72rem; color: var(--accent); font-weight: 700; margin-top: 8px; font-family: var(--font-body); display: flex; align-items: center; justify-content: center; gap: 4px;">✓ Pasted system-wide</div>';
                    }
                    
                    proceedToNextStep(4500);
                }
            }, step.type === "speaking" ? 65 : 40);
        } else {
            // Idle and processing steps show static info boxes
            const delay = step.type === "idle" ? 2200 : 1800;
            proceedToNextStep(delay);
        }
    }

    function proceedToNextStep(delay) {
        parayuCycleTimeout = setTimeout(() => {
            currentStepIndex++;
            if (currentStepIndex >= parayuCycles[currentCycleIndex].steps.length) {
                currentStepIndex = 0;
                currentCycleIndex = (currentCycleIndex + 1) % parayuCycles.length;
            }
            runParayuSimulation();
        }, delay);
    }

    runParayuSimulation();





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
