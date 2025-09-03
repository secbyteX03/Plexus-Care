/**
 * Configuration for Plexus Care
 * Rename this file to `config.js` and fill in your actual credentials
 */

// Payment Gateway Configuration
const PAYMENT_CONFIG = {
    // IntaPay Configuration (test mode)
    intaPay: {
        publicKey: 'YOUR_INTA_PAY_PUBLIC_KEY', // Replace with your actual public key
        live: false // Set to true in production
    },
    
    // Test user details (in production, get these from user input or auth)
    testUser: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '+254700000000'
    },
    
    // API endpoints
    endpoints: {
        webhook: '/api/payment-webhook',
        success: '/payment-callback.html',
        failure: '/payment-failed.html'
    }
};

// Make sure the config is properly scoped
if (typeof window !== 'undefined') {
    window.APP_CONFIG = window.APP_CONFIG || {};
    window.APP_CONFIG.payment = PAYMENT_CONFIG;
}

export default PAYMENT_CONFIG;
