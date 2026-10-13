/* ==========================================================================
   RenderLogic Interactive Actions (SPA Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const analyticsId = 'G-XNH281S53R';

    function trackEvent(eventName, parameters = {}) {
        if (typeof window.gtag !== 'function') return;
        window.gtag('event', eventName, {
            send_to: analyticsId,
            ...parameters
        });
    }

    const pageMetadata = {
        'tab-home': { title: 'RenderLogic: Film Post-Production & Offline AI Software', section: 'home' },
        'tab-creative': { title: 'Film Editing, Color Grading & AI Filmmaking | RenderLogic', section: 'film-making' },
        'tab-software': { title: 'Offline AI Software Lab & Lipi | RenderLogic', section: 'software-lab' },
        'tab-collaborators': { title: 'Achu Vijayan & RenderLogic Team', section: 'about' },
        'tab-documentation': { title: 'Product Documentation | RenderLogic', section: 'documentation' },
        'tab-support': { title: 'Software Support | RenderLogic', section: 'support' },
        'tab-blogs': { title: 'Film & Offline AI Articles | RenderLogic', section: 'blog' },
        'tab-affiliate': { title: 'Affiliate Program | RenderLogic', section: 'affiliate' },
        'tab-mediakit': { title: 'Media Kit | RenderLogic', section: 'media-kit' },
        'tab-contact': { title: 'Contact RenderLogic', section: 'contact' }
    };
    
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
                if (trigger.classList.contains('nav-link')) trigger.setAttribute('aria-current', 'page');
            } else {
                trigger.classList.remove('active');
                trigger.removeAttribute('aria-current');
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
            resourcesTrigger?.setAttribute('aria-expanded', 'false');
        }

        // Toggle active tab content panels
        tabContents.forEach(content => {
            if (content.id === targetTabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        const metadata = pageMetadata[targetTabId];
        if (metadata) {
            document.title = metadata.title;
            trackEvent('view_section', {
                section_name: metadata.section,
                page_location: `${window.location.origin}/#${metadata.section}`,
                page_title: metadata.title
            });
        }

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
            history.pushState({ tab: targetTabId }, '', `#${cleanHash}`);
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
            history.pushState({ tab: targetTabId }, '', `#${cleanHash}`);
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
                resourcesTrigger.setAttribute('aria-expanded', resourcesDropdown.classList.contains('mobile-open') ? 'true' : 'false');
            }
        });
        resourcesTrigger.addEventListener('focus', () => resourcesTrigger.setAttribute('aria-expanded', 'true'));
        resourcesDropdown.addEventListener('focusout', (event) => {
            if (!resourcesDropdown.contains(event.relatedTarget)) {
                resourcesTrigger.setAttribute('aria-expanded', 'false');
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

    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        const targetTabId = `tab-${hash}`;
        switchTab(document.getElementById(targetTabId) ? targetTabId : 'tab-home');
    });


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
                    trackEvent('contact_copy', { contact_method: 'email' });
                    setTimeout(() => {
                        copyStatus.classList.remove('show');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy email: ', err);
                });
        });
    }

    const colorCopyButton = document.getElementById('btn-copy-brand-colors');
    colorCopyButton?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(colorCopyButton.dataset.copyText || '');
            const originalLabel = colorCopyButton.textContent;
            colorCopyButton.textContent = 'Copied';
            trackEvent('media_kit_action', { action: 'copy_brand_colors' });
            window.setTimeout(() => { colorCopyButton.textContent = originalLabel; }, 1800);
        } catch (error) {
            console.error('Unable to copy brand colors.', error);
        }
    });

    const contactForm = document.getElementById('main-contact-form');
    const contactFormStatus = document.getElementById('contact-form-status');
    contactForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);
        const interest = String(formData.get('interest') || 'project');
        const subject = `RenderLogic ${interest} inquiry from ${formData.get('name') || 'website visitor'}`;
        const body = [
            `Name: ${formData.get('name') || ''}`,
            `Email: ${formData.get('email') || ''}`,
            `Inquiry type: ${interest}`,
            '',
            String(formData.get('message') || '')
        ].join('\n');

        trackEvent('generate_lead', { inquiry_type: interest, contact_method: 'email' });
        if (contactFormStatus) contactFormStatus.textContent = 'Opening your email app with this inquiry…';
        window.location.href = `mailto:contact@renderlogic.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });


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

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href') || '';

        if (href.startsWith('mailto:')) {
            trackEvent('contact_click', { contact_method: 'email' });
        } else if (href.startsWith('tel:')) {
            trackEvent('contact_click', { contact_method: 'phone' });
        } else if (link.origin && link.origin !== window.location.origin) {
            trackEvent('outbound_click', {
                link_url: link.href,
                link_domain: link.hostname,
                link_text: (link.textContent || '').trim().slice(0, 100)
            });
        }
    });
});
