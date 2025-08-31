// Mobile Navigation Handler
console.log('Initializing mobile navigation...');

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const moreLink = document.querySelector('.more-item .nav-link');
    const moreDropdown = document.querySelector('.more-item .dropdown');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // Toggle mobile menu
    function toggleMenu(show = null) {
        const isOpen = typeof show === 'boolean' ? show : !navMenu.classList.contains('active');
        navMenu.classList.toggle('active', isOpen);
        overlay.style.display = isOpen ? 'block' : 'none';
        document.body.style.overflow = isOpen ? 'hidden' : '';
        
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            mobileMenuBtn.classList.toggle('active', isOpen);
        }
        
        // Close all dropdowns when menu closes
        if (!isOpen) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
        
        return isOpen;
    }
    
    // Mobile menu button
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', () => toggleMenu(false));
    
    // Handle More dropdown
    if (moreLink && moreDropdown) {
        moreLink.addEventListener('click', function(e) {
            // Only handle on mobile
            if (window.innerWidth > 992) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle the dropdown
            const isActive = moreDropdown.classList.toggle('active');
            this.classList.toggle('active', isActive);
            
            // Close any other open dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (dropdown !== moreDropdown) {
                    dropdown.classList.remove('active');
                    const parent = dropdown.closest('.nav-item');
                    if (parent) {
                        const link = parent.querySelector('.nav-link');
                        if (link) link.classList.remove('active');
                    }
                }
            });
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const parent = dropdown.closest('.nav-item');
                if (parent) {
                    const link = parent.querySelector('.nav-link');
                    if (link) link.classList.remove('active');
                }
            });
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 992) {
                toggleMenu(false);
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }, 250);
    });
    
    console.log('Mobile navigation initialized');
});
