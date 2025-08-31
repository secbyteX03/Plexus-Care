import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Makes a safe API call to Supabase with error handling
 * @param {Function} apiCall - The Supabase API call to make (e.g., supabase.from('table').select())
 * @param {string} successMessage - Message to log on success
 * @param {boolean} showToast - Whether to show a toast notification on success
 * @returns {Promise<{data: any, error: Error | null}>} The result of the API call
 */
async function safeApiCall(apiCall, successMessage = '', showToast = false) {
    try {
        const { data, error } = await apiCall;
        
        if (error) {
            console.error('API Error:', error);
            throw new Error(error.message || 'An error occurred');
        }
        
        if (successMessage) {
            console.log(successMessage, data);
            if (showToast) {
                showToastNotification(successMessage, 'success');
            }
        }
        
        return { data, error: null };
    } catch (error) {
        console.error('API Call Error:', error);
        showToastNotification(
            error.message || 'An unexpected error occurred', 
            'error'
        );
        return { data: null, error };
    }
}

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {'success'|'error'|'info'} type - The type of notification
 */
function showToastNotification(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '1000';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.marginBottom = '10px';
    toast.style.color = 'white';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    toast.style.transform = 'translateX(120%)';
    toast.style.transition = 'transform 0.3s ease-in-out';
    
    // Set background color based on type
    switch (type) {
        case 'success':
            toast.style.backgroundColor = '#4caf50';
            break;
        case 'error':
            toast.style.backgroundColor = '#f44336';
            break;
        case 'info':
        default:
            toast.style.backgroundColor = '#2196f3';
    }
    
    toast.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.marginLeft = '15px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.padding = '0';
    closeBtn.style.lineHeight = '1';
    closeBtn.onclick = () => {
        hideToast(toast);
    };
    
    toast.appendChild(closeBtn);
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-hide after 5 seconds
    const timeoutId = setTimeout(() => {
        hideToast(toast);
    }, 5000);
    
    // Pause auto-hide on hover
    toast.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
    });
    
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => {
            hideToast(toast);
        }, 2000);
    });
}

/**
 * Hides a toast notification
 * @param {HTMLElement} toast - The toast element to hide
 */
function hideToast(toast) {
    if (!toast) return;
    
    toast.style.transform = 'translateX(120%)';
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Handles API errors consistently
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message if none is provided
 * @returns {string} User-friendly error message
 */
function handleApiError(error, defaultMessage = 'An error occurred') {
    console.error('API Error:', error);
    
    // Handle Supabase errors
    if (error.message) {
        // Handle common Supabase error messages
        if (error.message.includes('Invalid login credentials')) {
            return 'Invalid email or password. Please try again.';
        }
        
        if (error.message.includes('Email not confirmed')) {
            return 'Please confirm your email before signing in.';
        }
        
        if (error.message.includes('User already registered')) {
            return 'An account with this email already exists.';
        }
        
        if (error.message.includes('NetworkError')) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        
        return error.message;
    }
    
    return defaultMessage;
}

// Export the safe API call function and other utilities
export { 
    safeApiCall, 
    showToastNotification, 
    handleApiError,
    supabase 
};
