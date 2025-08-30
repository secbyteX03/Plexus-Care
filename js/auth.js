// Initialize Supabase
const supabaseUrl = 'https://vkfntjnhanpaiuhpkroh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZm50am5oYW5wYWl1aHBrcm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjY0NzMsImV4cCI6MjA3MjE0MjQ3M30.aGURsdU6nVv6XDUioeGOvVnApBnNcMTiORrkl1N5KlI';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const loginErrorMessage = document.getElementById('loginErrorMessage');
const registerErrorMessage = document.getElementById('registerErrorMessage');
const successModal = document.getElementById('successModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');

// Toggle between login and register forms
function showRegister() {
    loginCard.style.opacity = '0';
    loginCard.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
        
        // Trigger reflow
        registerCard.offsetHeight;
        
        registerCard.style.opacity = '1';
        registerCard.style.transform = 'translate(-50%, -50%)';
    }, 300);
}

function showLogin() {
    registerCard.style.opacity = '0';
    registerCard.style.transform = 'translate(50%, -50%)';
    
    setTimeout(() => {
        registerCard.style.display = 'none';
        loginCard.style.display = 'block';
        
        // Trigger reflow
        loginCard.offsetHeight;
        
        loginCard.style.opacity = '1';
        loginCard.style.transform = 'translateX(0)';
    }, 300);
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.querySelector('#loginBtn span');
    const originalBtnText = loginBtn.textContent;
    
    // Show loading state
    loginBtn.textContent = 'Signing in...';
    loginBtn.parentElement.classList.add('btn-loading');
    
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
        loginErrorMessage.textContent = error.message || 'Invalid email or password';
        loginError.style.display = 'flex';
    } finally {
        // Reset button state
        loginBtn.textContent = originalBtnText;
        loginBtn.parentElement.classList.remove('btn-loading');
    }
}

// Handle registration form submission
async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const registerBtn = document.querySelector('#registerBtn span');
    const originalBtnText = registerBtn.textContent;
    
    // Show loading state
    registerBtn.textContent = 'Creating account...';
    registerBtn.parentElement.classList.add('btn-loading');
    
    try {
        // 1. Sign up the user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`
                },
                emailRedirectTo: window.location.origin
            }
        });
        
        if (signUpError) throw signUpError;
        
        // 2. Create user profile in the public.users table
        const { data: userData, error: profileError } = await supabase
            .from('users')
            .insert([
                { 
                    id: authData.user.id,
                    email,
                    first_name: firstName,
                    last_name: lastName
                }
            ]);
            
        if (profileError) throw profileError;
        
        // Show success message
        successModal.style.display = 'flex';
        
    } catch (error) {
        console.error('Registration error:', error);
        registerErrorMessage.textContent = error.message || 'Error creating account';
        registerError.style.display = 'flex';
    } finally {
        // Reset button state
        registerBtn.textContent = originalBtnText;
        registerBtn.parentElement.classList.remove('btn-loading');
    }
}

// Initialize event listeners
function initEventListeners() {
    // Toggle between login and register forms
    if (showRegisterBtn) showRegisterBtn.addEventListener('click', showRegister);
    if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
    });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });
    
    // Form submissions
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    // Close success modal
    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', () => {
            successModal.style.display = 'none';
            showLogin();
        });
    }
}

// Check if user is already logged in
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        window.location.href = 'dashboard.html';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initEventListeners();
});

// Handle logout
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    } else {
        window.location.href = '/';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Check auth state on page load
    await checkAuth();
    
    // Set up login button
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Set up logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        // User just signed in
        updateUI(session.user);
    } else if (event === 'SIGNED_OUT') {
        // User just signed out
        updateUI(null);
    }
});

export { supabase, checkAuth };
