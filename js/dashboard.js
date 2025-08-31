document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Check if user is logged in
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'auth.html';
        return;
    }

    // Check if profile is complete
    const checkProfileCompletion = async () => {
        const { data: profile, error } = await supabaseClient
            .from('users')
            .select('profile_completed')
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('Error checking profile completion:', error);
            return false;
        }

        return profile?.profile_completed === true;
    };

    // If profile is not complete, redirect to profile completion
    const isProfileComplete = await checkProfileCompletion();
    if (!isProfileComplete) {
        // Store current path to redirect back after profile completion
        sessionStorage.setItem('postProfileRedirect', window.location.pathname);
        window.location.href = 'profile-completion.html';
        return;
    }

    // Load dashboard content if profile is complete
    loadDashboardContent();
});

async function loadDashboardContent() {
    // Your existing dashboard loading logic here
    console.log('Loading dashboard content...');
    
    // Example: Load user data
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            document.getElementById('welcome-message').textContent = `Welcome, ${user.user_metadata.first_name || 'User'}!`;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
    
    // Add more dashboard loading logic here
}
