// Import Supabase and config
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase
let supabase;
let tabButtons;
let errorMessage;      // container for the whole error box
let errorText;         // inner span for error text
let successModal;
let closeModalBtn;
let closeErrorBtn;

function initSupabase() {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Initialize DOM elements and event listeners
function initElements() {
    // Get tab buttons and forms
    tabButtons = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    errorMessage = document.getElementById('error-message');
    errorText = document.getElementById('error-text');
    successModal = document.getElementById('success-modal');

    // Close buttons
    closeModalBtn = document.querySelector('.close-modal');
    closeErrorBtn = document.querySelector('.close-error');

    // Add tab switching functionality
    if (tabButtons && tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.target.closest('.tab-btn');
                if (tab && tab.dataset.tab) {
                    switchTab(tab.dataset.tab);
                }
            });
        });
    }

    // Add click handlers for show-register and show-login links
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('register');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('login');
        });
    }

    // Add form submission handlers
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Close modal handler
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeSuccessModal);
    }

    // Close error button handler
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', () => {
            if (errorMessage) errorMessage.style.display = 'none';
        });
    }

    // Close modal when clicking outside modal content
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }

    // Enable password toggle functionality for all toggle buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-password')) {
            e.preventDefault();
            const btn = e.target.closest('.toggle-password');
            const targetId = btn.getAttribute('data-password');
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');

            if (!input) {
                console.warn('toggle-password: no input found for id', targetId);
                return;
            }

            // Toggle password visibility
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                input.type = 'password';
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }

            // Keep focus on the input
            input.focus();
        }
    });
}

// Show error message
function showError(message) {
    if (!errorMessage || !errorText) {
        console.warn('Error container not found in DOM.');
        return;
    }

    errorText.textContent = message;
    errorMessage.style.display = 'flex';

    // Hide error after 5 seconds
    setTimeout(() => {
        if (errorMessage) errorMessage.style.display = 'none';
    }, 5000);
}

// Switch between login and register forms
function switchTab(tabName) {
    // Update active tab buttons
    tabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabName);
    });

    // Get form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Toggle forms using the correct class names
    if (tabName === 'login') {
        if (loginForm) {
            loginForm.classList.add('active');
            loginForm.style.display = 'block';
        }
        if (registerForm) {
            registerForm.classList.remove('active');
            registerForm.style.display = 'none';
        }
    } else {
        if (loginForm) {
            loginForm.classList.remove('active');
            loginForm.style.display = 'none';
        }
        if (registerForm) {
            registerForm.classList.add('active');
            registerForm.style.display = 'block';
        }
    }
}

// Show success modal (duration in ms, default 6000ms)
function showSuccessModal(title, message, duration = 6000) {
    if (!successModal) {
        console.warn('Success modal not found in DOM.');
        return;
    }

    const modalTitle = document.querySelector('.modal h3');
    const modalMessage = document.querySelector('.modal p');

    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;

    successModal.style.display = 'flex';

    // Auto-hide after duration
    setTimeout(closeSuccessModal, duration);
}

// Close modal
function closeSuccessModal() {
    if (successModal) successModal.style.display = 'none';
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginBtn = document.getElementById('login-btn');
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.classList.add('btn-loading');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        // Redirect to dashboard on successful login
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Invalid email or password');
    } finally {
        // Reset button state
        loginBtn.disabled = false;
        loginBtn.classList.remove('btn-loading');
    }
}

// Handle registration form submission
async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const fullName = document.getElementById('register-name').value;
    const registerBtn = document.getElementById('register-btn');
    
    // Basic validation
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    // Show loading state
    registerBtn.disabled = true;
    registerBtn.classList.add('btn-loading');
    
    try {
        // 1. Create user in Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
                },
                emailRedirectTo: window.location.origin
            }
        });
        
        if (signUpError) throw signUpError;
        
        // 2. Create user profile in the public.users table
        const firstName = fullName.split(' ')[0];
        const lastName = fullName.split(' ').slice(1).join(' ') || '';
        
        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .insert([
                { 
                    id: authData.user.id,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    created_at: new Date().toISOString()
                }
            ]);

        if (profileError) throw profileError;

        // ✅ Show success message
        showSuccessModal(
            'Registration Successful!',
            'Please check your email to verify your account before logging in.',
            6000
        );

        // Reset form and switch to login after a short delay
        const registerForm = document.getElementById('register-form');
        if (registerForm) registerForm.reset();

        setTimeout(() => {
            switchTab('login');
        }, 3200);

    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message || 'Failed to create account. Please try again.');
    } finally {
        // Reset button state
        if (registerBtn) {
            registerBtn.disabled = false;
            registerBtn.classList.remove('btn-loading');
        }
    }
}

// Initialize the application
async function init() {
    try {
        // Initialize Supabase
        supabase = initSupabase();

        // Initialize DOM elements and event listeners
        initElements();

        // Show login form by default
        switchTab('login');

        // Check if user is already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize the application. Please refresh the page.');
    }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export for use in other scripts
window.PlexusCareAuth = {
    supabase,
    handleLogout: async function() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.href = 'auth.html';
        } catch (error) {
            console.error('Logout error:', error);
            showError('Failed to logout. Please try again.');
        }
    },
    checkAuth: async function() {
        const { data: { session } } = await supabase.auth.getSession();
        return !!session;
    }
};
