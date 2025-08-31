// Make sure DOM is loaded before initializing navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing navigation...');
    
    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navContainer = document.querySelector('.nav-container');
    
    // Check if elements exist before proceeding
    if (!mobileMenuBtn || !navMenu || !navContainer) {
        console.warn('Required navigation elements not found');
        return;
    }
    
    const navItems = document.querySelectorAll('.nav-item');
    const navLinks = document.querySelectorAll('.nav-link');
    const moreItem = document.querySelector('.more-item');
    const moreLink = moreItem ? moreItem.querySelector('.nav-link') : null;
    const moreDropdown = moreItem ? moreItem.querySelector('.dropdown') : null;
    
    // Add mobile menu button if not already in the DOM
    if (!mobileMenuBtn || !mobileMenuBtn.parentNode) {
        const menuButton = document.createElement('button');
        menuButton.id = 'mobileMenuBtn';
        menuButton.className = 'mobile-menu-btn';
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Toggle menu');
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        navContainer.insertBefore(menuButton, navMenu);
        console.log('Mobile menu button added to DOM');
    }
    
    // Close menu when clicking on overlay (outside menu)
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
    
    // Toggle mobile menu function
    function toggleMenu(show = null) {
        const isMenuOpen = navMenu ? navMenu.classList.toggle('active', show) : false;
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
            mobileMenuBtn.classList.toggle('active', isMenuOpen);
        }
        if (overlay) {
            overlay.style.display = isMenuOpen ? 'block' : 'none';
        }
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    // Mobile menu button click handler
        if (navContainer && !navContainer.contains(event.target) && event.target !== mobileMenuBtn) {
            toggleMenu(false);
        }
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu(!navMenu.classList.contains('active'));
        });
    }
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        toggleMenu(false);
    });

    // Handle More dropdown specifically
    if (moreLink && moreDropdown) {
        console.log('Setting up More dropdown handler');
        
        moreLink.addEventListener('click', function(e) {
            // Only handle on mobile
            if (window.innerWidth > 992) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            console.log('More link clicked');
            
            // Toggle the dropdown
            const isActive = moreDropdown.classList.toggle('active');
            this.classList.toggle('active', isActive);
            
            console.log('More dropdown active:', isActive);
            
            // Close any other open dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (dropdown !== moreDropdown && dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                    const parent = dropdown.closest('.nav-item');
                    if (parent) {
                        const link = parent.querySelector('.nav-link');
                        if (link) link.classList.remove('active');
                    }
                }
            });
        });
    } else {
        console.error('More link or dropdown not found');
    }
    
    // Handle other navigation links
    const navLinks = document.querySelectorAll('.nav-link:not(.more-item .nav-link)');
    console.log('Setting up navigation links. Total links:', navLinks.length);
    
    navLinks.forEach(link => {
            // Close menu when clicking regular links on mobile
            if (window.innerWidth <= 992 && !link.classList.contains('has-dropdown')) {
                toggleMenu(false);
            }
            }
        });
    });

    // Handle More dropdown on mobile
    if (moreDropdown) {
        moreDropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    if (dropdown !== this.nextElementSibling) {
                        dropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                this.classList.toggle('active');
                const dropdown = this.nextElementSibling;
                if (dropdown) {
                    dropdown.classList.toggle('active');
                }
            }
        });
    }

    // Handle window resize with debounce
    function debounceResize() {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
            
            // Reset menu state on desktop
            if (window.innerWidth > 992) {
                toggleMenu(false);
                navItems.forEach(item => item.classList.remove('active'));
            }
        }, 400);
    }
    
    window.addEventListener('resize', debounceResize);

    // Make main nav items clickable on mobile
    navItems.forEach(item => {
        const link = item.querySelector('a[href]:not(.has-dropdown)');
        if (link) {
            link.style.pointerEvents = 'auto';
        }
    });

    // Toggle dropdown on mobile
    navItems.forEach(item => {
        const link = item.querySelector('.has-dropdown');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-item') && !e.target.closest('.mobile-menu-btn')) {
            navItems.forEach(item => {
                item.classList.remove('active');
            });
            if (window.innerWidth <= 1024) {
                navMenu.classList.remove('active');
            }
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);

        // Reset mobile menu on desktop
        if (window.innerWidth > 1024) {
            navMenu.classList.remove('active');
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            // Also highlight the parent nav-item if it's a dropdown
            const parentItem = link.closest('.nav-item');
            if (parentItem) {
                parentItem.classList.add('active');
            }
        }
    });
});
