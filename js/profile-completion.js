import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const profileForm = document.getElementById('profile-form');
const saveProfileBtn = document.getElementById('save-profile-btn');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const closeErrorBtn = document.getElementById('close-error');
const successModal = document.getElementById('success-modal');
const closeModalBtn = document.getElementById('close-modal');
const successMessage = document.getElementById('success-message');

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Close error message
closeErrorBtn.addEventListener('click', () => {
    errorMessage.classList.remove('show');
});

// Close success modal
closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
});

// Show success modal
function showSuccess(message) {
    successMessage.textContent = message;
    successModal.classList.add('active');
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// Handle form submission
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(profileForm);
    const profileData = {
        first_name: formData.get('first_name').trim(),
        last_name: formData.get('last_name').trim(),
        phone: formData.get('phone').trim(),
        date_of_birth: formData.get('date_of_birth'),
        gender: formData.get('gender'),
        updated_at: new Date().toISOString(),
        profile_completed: true
    };
    
    // Validate form data
    if (!profileData.first_name || !profileData.last_name) {
        showError('First name and last name are required');
        return;
    }
    
    if (profileData.phone && !/^\+?[0-9\s-]{10,}$/.test(profileData.phone)) {
        showError('Please enter a valid phone number');
        return;
    }
    
    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) throw new Error('User not authenticated');
        
        // Update user profile in the database
        const { data, error } = await supabase
            .from('users')
            .update(profileData)
            .eq('id', user.id)
            .select();
            
        if (error) throw error;
        
        // Show success message and redirect
        showSuccess('Profile updated successfully! Redirecting to dashboard...');
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showError(error.message || 'An error occurred while updating your profile');
    }
});

// Check if user is authenticated and profile is complete
async function checkAuthAndProfile() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (!user) {
            window.location.href = 'auth.html';
            return;
        }
        
        // Check if profile is already completed
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('profile_completed')
            .eq('id', user.id)
            .single();
            
        if (profileError) throw profileError;
        
        // If profile is already completed, redirect to dashboard
        if (profile?.profile_completed) {
            window.location.href = 'dashboard.html';
        }
        
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = 'auth.html';
    }
}

// Initialize the page
checkAuthAndProfile();
