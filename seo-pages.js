document.addEventListener('DOMContentLoaded', () => {
    const analyticsId = 'G-XNH281S53R';
    const trackEvent = (name, parameters = {}) => {
        if (typeof window.gtag !== 'function') return;
        window.gtag('event', name, { send_to: analyticsId, ...parameters });
    };

    const themeToggle = document.getElementById('theme-toggle-btn');
    themeToggle?.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        try {
            localStorage.setItem('rl-theme', isDark ? 'dark' : 'light');
        } catch (error) {}
    });

    const menuToggle = document.getElementById('menu-toggle');
    const navigation = document.getElementById('navigation-bar');
    menuToggle?.addEventListener('click', () => {
        const isOpen = navigation?.classList.toggle('active') || false;
        document.body.classList.toggle('mobile-nav-active', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    const contactForm = document.getElementById('seo-contact-form');
    const contactStatus = document.getElementById('seo-contact-status');
    contactForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;
        const data = new FormData(contactForm);
        const interest = String(data.get('interest') || 'project');
        const subject = `RenderLogic ${interest} inquiry from ${data.get('name') || 'website visitor'}`;
        const body = [`Name: ${data.get('name') || ''}`, `Email: ${data.get('email') || ''}`, `Inquiry type: ${interest}`, '', String(data.get('message') || '')].join('\n');
        trackEvent('generate_lead', { inquiry_type: interest, contact_method: 'email' });
        if (contactStatus) contactStatus.textContent = 'Opening your email app with this inquiry…';
        window.location.href = `mailto:contact@renderlogic.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
        } else if (link.dataset.cta) {
            trackEvent('cta_click', { cta_name: link.dataset.cta });
        }
    });
});
