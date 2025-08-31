import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Middleware to check if user is authenticated
 * Redirects to auth page if not authenticated
 */
async function requireAuth(redirectTo = 'auth.html') {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
            // Store the current URL to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = redirectTo;
            return null;
        }
        
        return user;
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = redirectTo;
        return null;
    }
}

/**
 * Middleware to check if user's profile is complete
 * Redirects to profile completion page if profile is incomplete
 */
async function requireProfileComplete(redirectTo = 'profile-completion.html') {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
            window.location.href = 'auth.html';
            return null;
        }
        
        // Check if profile is complete
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('profile_completed')
            .eq('id', user.id)
            .single();
            
        if (profileError) throw profileError;
        
        // If profile is not completed, redirect to profile completion
        if (!profile?.profile_completed) {
            // Don't redirect if we're already on the profile completion page
            if (!window.location.pathname.includes(redirectTo)) {
                window.location.href = redirectTo;
            }
            return null;
        }
        
        return user;
        
    } catch (error) {
        console.error('Profile check error:', error);
        // If there's an error checking the profile, log the user out for security
        await supabase.auth.signOut();
        window.location.href = 'auth.html';
        return null;
    }
}

/**
 * Middleware for public routes (like auth pages)
 * Redirects to dashboard if user is already authenticated
 */
async function redirectIfAuthenticated(redirectTo = 'dashboard.html') {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (user && !error) {
            // Check if profile is complete
            const { data: profile } = await supabase
                .from('users')
                .select('profile_completed')
                .eq('id', user.id)
                .single();
                
            // If profile is complete, redirect to dashboard
            // Otherwise, redirect to profile completion
            const redirectPath = profile?.profile_completed ? redirectTo : 'profile-completion.html';
            
            // Don't redirect if we're already on the target page
            if (!window.location.pathname.includes(redirectPath)) {
                window.location.href = redirectPath;
            }
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

/**
 * Get the current authenticated user
 * @returns {Promise<Object|null>} The current user or null if not authenticated
 */
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        return !error ? user : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Check if current user has a specific role
 * @param {string} role - The role to check for
 * @returns {Promise<boolean>} True if user has the role, false otherwise
 */
async function hasRole(role) {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        
        // Get user's roles from the database
        const { data: userData, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);
            
        if (error) throw error;
        
        return userData.some(userRole => userRole.role === role);
    } catch (error) {
        console.error('Role check error:', error);
        return false;
    }
}

export { 
    requireAuth, 
    requireProfileComplete, 
    redirectIfAuthenticated, 
    getCurrentUser, 
    hasRole 
};
