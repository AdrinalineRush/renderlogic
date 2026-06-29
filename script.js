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
    const parayuPhrases = [
        "Speak naturally, and watch it transcribe in real-time...",
        "Parayu dictation works fully offline using local AI model weights.",
        "Your private voice logs never leave this physical computer.",
        "Fast, offline dictation optimized for Indian languages."
    ];
    let parayuPhraseIndex = 0;
    const parayuTranscriptionBox = document.getElementById('parayu-transcription-box');
    const parayuWaveBars = document.querySelectorAll('.wave-bar');
    let parayuTypingInterval = null;

    function simulateParayuTranscription() {
        const phrase = parayuPhrases[parayuPhraseIndex];
        let charIndex = 0;
        
        if (parayuTranscriptionBox) {
            parayuTranscriptionBox.textContent = '"';
        }
        
        // Active audio wave pulses
        parayuWaveBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
            bar.style.opacity = '1';
        });
        
        parayuTypingInterval = setInterval(() => {
            if (charIndex < phrase.length) {
                parayuTranscriptionBox.textContent += phrase[charIndex];
                charIndex++;
            } else {
                parayuTranscriptionBox.textContent += '"';
                clearInterval(parayuTypingInterval);
                
                // Slow down audio waves on finish
                parayuWaveBars.forEach(bar => {
                    bar.style.animationPlayState = 'paused';
                    bar.style.opacity = '0.5';
                });
                
                setTimeout(() => {
                    parayuPhraseIndex = (parayuPhraseIndex + 1) % parayuPhrases.length;
                    simulateParayuTranscription();
                }, 4000);
            }
        }, 55);
    }
    simulateParayuTranscription();


    // ==========================================
    // 6. RenderMagic Generation Simulator
    // ==========================================
    const btnGenerate = document.getElementById('btn-generate-magic');
    const displayIdle = document.getElementById('magic-display-idle');
    const displayRendering = document.getElementById('magic-display-rendering');
    const displayPlayer = document.getElementById('magic-display-player');
    const progressBar = document.getElementById('magic-progress-bar');
    const inputSubject = document.getElementById('magic-subject');

    // Rendering steps selectors
    const stepScript = document.getElementById('step-script');
    const stepVoice = document.getElementById('step-voice');
    const stepClips = document.getElementById('step-clips');
    const stepCompositing = document.getElementById('step-compositing');

    if (btnGenerate && inputSubject) {
        btnGenerate.addEventListener('click', () => {
            const subjectText = inputSubject.value.trim();
            if (!subjectText) {
                alert('Please enter a video topic or subject first!');
                return;
            }

            // Disable generate button during process
            btnGenerate.disabled = true;
            btnGenerate.textContent = "Processing...";

            // Shift states: Idle -> Rendering
            if (displayIdle) displayIdle.style.display = 'none';
            if (displayPlayer) displayPlayer.style.display = 'none';
            if (displayRendering) displayRendering.style.display = 'block';

            // Reset rendering indicators
            if (progressBar) progressBar.style.width = '0%';
            const steps = [stepScript, stepVoice, stepClips, stepCompositing];
            steps.forEach(s => {
                if (s) {
                    s.classList.remove('active', 'done');
                }
            });

            // Simulate Multi-step progress timeline
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 2;
                if (progressBar) progressBar.style.width = `${progress}%`;

                // step 1: Writing Script (0% to 25%)
                if (progress >= 0 && progress < 25) {
                    if (stepScript) stepScript.classList.add('active');
                }
                // step 2: Synthesizing TTS (25% to 50%)
                else if (progress >= 25 && progress < 50) {
                    if (stepScript) {
                        stepScript.classList.remove('active');
                        stepScript.classList.add('done');
                    }
                    if (stepVoice) stepVoice.classList.add('active');
                }
                // step 3: Media clips (50% to 75%)
                else if (progress >= 50 && progress < 75) {
                    if (stepVoice) {
                        stepVoice.classList.remove('active');
                        stepVoice.classList.add('done');
                    }
                    if (stepClips) stepClips.classList.add('active');
                }
                // step 4: Compositing (75% to 99%)
                else if (progress >= 75 && progress < 100) {
                    if (stepClips) {
                        stepClips.classList.remove('active');
                        stepClips.classList.add('done');
                    }
                    if (stepCompositing) stepCompositing.classList.add('active');
                }

                // Render Complete (100%)
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    if (stepCompositing) {
                        stepCompositing.classList.remove('active');
                        stepCompositing.classList.add('done');
                    }
                    
                    // Delay slightly and swap: Rendering -> Player Output
                    setTimeout(() => {
                        if (displayRendering) displayRendering.style.display = 'none';
                        if (displayPlayer) displayPlayer.style.display = 'block';
                        
                        btnGenerate.disabled = false;
                        btnGenerate.textContent = "Generate Magic Video";
                        
                        // Boot output player loop
                        startMockPlayerPlayback(subjectText);
                    }, 500);
                }
            }, 100); // Fills in ~5 seconds
        });
    }

    // Output Player Playback parameters
    let playerTimerId = null;
    let playerTimeProgress = 0;
    let isPlayerPlaying = true;
    let currentSubtitleIndex = 0;

    const btnPlayerPlay = document.getElementById('btn-player-play-toggle');
    const playerTimelineFill = document.getElementById('player-timeline-fill');
    const playerTimeDisplay = document.getElementById('player-time-display');
    const playerSubtitles = document.getElementById('player-subtitles');
    const playerScreen = document.getElementById('player-screen-visual');

    const playerPhrases = [
        "In the early days of cinema, pacing was physically crafted strip by strip.",
        "Today, RenderMagic compiles and sequences audio-visual assets locally.",
        "Synthesizing high-fidelity outputs directly on consumer GPUs.",
        "Crafting private local tools with flawless post-production logic."
    ];

    function startMockPlayerPlayback(subjectText) {
        // Reset player parameters
        playerTimeProgress = 0;
        currentSubtitleIndex = 0;
        isPlayerPlaying = true;
        if (btnPlayerPlay) btnPlayerPlay.textContent = "Pause";
        
        // Custom color shift on player screen visual matching subject text to feel "generated"
        if (playerScreen) {
            const hueShift = Math.floor(Math.random() * 360);
            playerScreen.style.filter = `hue-rotate(${hueShift}deg)`;
        }

        // Initialize first subtitle phrase
        if (playerSubtitles) {
            playerSubtitles.textContent = `"${playerPhrases[0]}"`;
        }

        if (playerTimerId) clearInterval(playerTimerId);
        
        playerTimerId = setInterval(() => {
            if (!isPlayerPlaying) return;

            playerTimeProgress += 1;
            
            // Progress width (video duration ~ 15 seconds)
            const percent = (playerTimeProgress / 150) * 100;
            if (playerTimelineFill) {
                playerTimelineFill.style.width = `${percent}%`;
            }

            // Update Time stamps
            const seconds = Math.floor(playerTimeProgress / 10);
            const stampSec = seconds < 10 ? `0${seconds}` : seconds;
            if (playerTimeDisplay) {
                playerTimeDisplay.textContent = `00:${stampSec} / 00:15`;
            }

            // Shuffle Subtitle phrases every 3.5 seconds
            const phraseIdx = Math.min(Math.floor(playerTimeProgress / 38), playerPhrases.length - 1);
            if (phraseIdx !== currentSubtitleIndex) {
                currentSubtitleIndex = phraseIdx;
                if (playerSubtitles) {
                    playerSubtitles.textContent = `"${playerPhrases[currentSubtitleIndex]}"`;
                }
            }

            // Finish playback loop
            if (playerTimeProgress >= 150) {
                clearInterval(playerTimerId);
                if (btnPlayerPlay) btnPlayerPlay.textContent = "Replay";
                isPlayerPlaying = false;
            }
        }, 100);
    }

    if (btnPlayerPlay) {
        btnPlayerPlay.addEventListener('click', () => {
            if (btnPlayerPlay.textContent === "Replay") {
                startMockPlayerPlayback(inputSubject.value || "RenderMagic Preview");
                return;
            }

            isPlayerPlaying = !isPlayerPlaying;
            if (isPlayerPlaying) {
                btnPlayerPlay.textContent = "Pause";
            } else {
                btnPlayerPlay.textContent = "Play";
            }
        });
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
