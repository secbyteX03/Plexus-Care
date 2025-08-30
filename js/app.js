// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize chat widget
    const chatWidget = document.getElementById('chatWidget');
    const openChatBtn = document.getElementById('openChat');
    const closeChatBtn = document.getElementById('closeChat');
    
    if (openChatBtn && chatWidget) {
        openChatBtn.addEventListener('click', function() {
            chatWidget.classList.add('active');
            document.getElementById('userMessage').focus();
        });
    }
    
    if (closeChatBtn && chatWidget) {
        closeChatBtn.addEventListener('click', function() {
            chatWidget.classList.remove('active');
        });
    }
    
    // Close chat when clicking outside
    document.addEventListener('click', function(event) {
        if (!chatWidget.contains(event.target) && event.target !== openChatBtn) {
            chatWidget.classList.remove('active');
        }
    });
    
    // Initialize login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // This will be handled by auth.js
            console.log('Login button clicked');
        });
    }
    
    // Initialize start chat button
    const startChatBtn = document.getElementById('startChatBtn');
    if (startChatBtn && chatWidget) {
        startChatBtn.addEventListener('click', function() {
            chatWidget.classList.add('active');
            document.getElementById('userMessage').focus();
        });
    }
    
    // Initialize book appointment button
    const bookAppointmentBtn = document.getElementById('bookAppointmentBtn');
    if (bookAppointmentBtn) {
        bookAppointmentBtn.addEventListener('click', function() {
            // This will be implemented later
            alert('Appointment booking feature coming soon!');
        });
    }
});
