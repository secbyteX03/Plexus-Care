// Initialize Supabase
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const userMenu = document.getElementById('userMenu');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

// Check if user is logged in
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    updateUI(user);
    return user;
}

// Update UI based on auth state
function updateUI(user) {
    if (user) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName) userName.textContent = user.email || 'User';
        
        // Set user avatar if available
        if (userAvatar) {
            userAvatar.src = user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email || 'U') + '&background=f4a5a5&color=fff';
            userAvatar.alt = user.email || 'User';
        }
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Handle login
async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    
    if (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

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
