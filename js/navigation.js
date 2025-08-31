document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navItems = document.querySelectorAll('.nav-item');
    const navLinks = document.querySelectorAll('.nav-link');
    const moreDropdown = document.querySelector('.nav-item:last-child .has-dropdown');
    const viewAllButtons = document.querySelectorAll('.view-all-button');

    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        if (!link.classList.contains('has-dropdown')) {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    navMenu.classList.remove('active');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Handle dropdown toggles - only for the More menu on mobile
    if (moreDropdown) {
        moreDropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = this.nextElementSibling;
                if (dropdown) {
                    dropdown.style.display = dropdown.style.display === 'grid' ? 'none' : 'grid';
                }
            }
        });
    }

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

    // Handle View All functionality
    viewAllButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            const dropdown = this.closest('.mega-menu');
            
            if (dropdown) {
                // Check if we've already loaded all items
                if (this.classList.contains('expanded')) {
                    // Collapse back to initial view
                    const initialItems = dropdown.querySelectorAll('.initial-items');
                    initialItems.forEach(item => item.style.display = 'none');
                    this.textContent = 'View All';
                    this.classList.remove('expanded');
                } else {
                    // Expand to show all items
                    const allItems = conditionsData[category];
                    const itemsContainer = document.createElement('div');
                    itemsContainer.className = 'all-conditions';
                    
                    // Create a grid for all items
                    itemsContainer.style.display = 'grid';
                    itemsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
                    itemsContainer.style.gap = '1rem';
                    itemsContainer.style.padding = '1rem';
                    
                    // Add all items
                    allItems.forEach(item => {
                        const link = document.createElement('a');
                        link.href = '#';
                        link.textContent = item;
                        link.style.display = 'block';
                        link.style.padding = '0.5rem 0';
                        link.style.color = 'inherit';
                        link.style.textDecoration = 'none';
                        link.style.transition = 'color 0.2s';
                        link.addEventListener('mouseover', () => link.style.color = 'var(--primary)');
                        link.addEventListener('mouseout', () => link.style.color = 'inherit');
                        itemsContainer.appendChild(link);
                    });
                    
                    // Hide initial items
                    const initialItems = dropdown.querySelectorAll('.mega-menu-section');
                    initialItems.forEach(item => item.style.display = 'none');
                    
                    // Add all items container
                    dropdown.appendChild(itemsContainer);
                    this.textContent = 'Show Less';
                    this.classList.add('expanded');
                }
                
                // Scroll to the top of the dropdown
                dropdown.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
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
