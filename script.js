/* ==========================================================================
   RenderLogic Interactive Actions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Copy Email to Clipboard
    const emailAddressElement = document.getElementById('email-address');
    const copyButton = document.getElementById('btn-copy-email');
    const copyStatus = document.getElementById('copy-status');
    
    if (copyButton && emailAddressElement && copyStatus) {
        copyButton.addEventListener('click', () => {
            const emailText = emailAddressElement.textContent.trim();
            
            navigator.clipboard.writeText(emailText)
                .then(() => {
                    // Show indicator
                    copyStatus.classList.add('show');
                    
                    // Hide indicator after 2 seconds
                    setTimeout(() => {
                        copyStatus.classList.remove('show');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy email: ', err);
                });
        });
    }

    // 2. Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;

    function highlightNavigation() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - headerHeight - 50;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('gradient-text');
                    link.style.color = ''; // Reset styling
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--primary)';
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);

    // 3. Simple Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements we want to reveal on scroll
    const serviceCards = document.querySelectorAll('.service-card');
    const productLayout = document.querySelector('.products-layout');
    const aboutCard = document.querySelector('.about-card');
    const contactBox = document.querySelector('.contact-box');

    // Add styles for the reveal animation dynamically
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .service-card, .products-layout, .about-card, .contact-box {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .active-reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(revealStyle);

    // Observe elements
    serviceCards.forEach((card, idx) => {
        // Add a slight stagger effect
        card.style.transitionDelay = `${idx * 0.1}s`;
        revealObserver.observe(card);
    });
    
    if (productLayout) revealObserver.observe(productLayout);
    if (aboutCard) revealObserver.observe(aboutCard);
    if (contactBox) revealObserver.observe(contactBox);
});
