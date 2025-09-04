// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize settings page
    initSettingsPage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load the default tab (General)
    loadSettingsTab('general');
});

// Check if user is authenticated
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
}

// Initialize the settings page
function initSettingsPage() {
    // Initialize Select2 for select elements
    $('select').select2({
        minimumResultsForSearch: Infinity, // Disable search for better UX on mobile
        width: '100%'
    });
    
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.settings-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            loadSettingsTab(tabId);
            
            // Update active state
            document.querySelectorAll('.settings-nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Save settings button
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
    
    // Logout button
    document.querySelector('.logout')?.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('isAuthenticated');
        window.location.href = 'login.html';
    });
    
    // Test email checkbox
    document.getElementById('mailTest')?.addEventListener('change', function() {
        const testEmailFields = document.getElementById('testEmailFields');
        if (this.checked) {
            testEmailFields.style.display = 'block';
        } else {
            testEmailFields.style.display = 'none';
        }
    });
    
    // Send test email button
    document.getElementById('sendTestEmail')?.addEventListener('click', sendTestEmail);
    
    // Color scheme selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            applyColorScheme(color);
            
            // Update active state
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Logo upload
    document.getElementById('uploadLogo')?.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = handleLogoUpload;
        input.click();
    });
    
    // Remove logo
    document.getElementById('removeLogo')?.addEventListener('click', removeLogo);
    
    // Create backup button
    document.getElementById('createBackup')?.addEventListener('click', createBackup);
    
    // Restore backup button
    document.getElementById('restoreBackup')?.addEventListener('click', restoreBackup);
    
    // Generate API key button
    document.getElementById('generateApiKey')?.addEventListener('click', generateApiKey);
    
    // Copy to clipboard buttons
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-clipboard-target');
            const textToCopy = document.querySelector(targetId).textContent;
            copyToClipboard(textToCopy);
            
            // Show tooltip or feedback
            const originalTitle = this.getAttribute('title') || 'Copy to clipboard';
            this.setAttribute('title', 'Copied!');
            this._tippy?.setContent('Copied!');
            
            setTimeout(() => {
                this.setAttribute('title', originalTitle);
                this._tippy?.setContent(originalTitle);
            }, 2000);
        });
    });
    
    // Enable/disable auto backup options
    document.getElementById('enableAutoBackup')?.addEventListener('change', function() {
        const autoBackupOptions = document.getElementById('autoBackupOptions');
        if (this.checked) {
            autoBackupOptions.style.display = 'block';
        } else {
            autoBackupOptions.style.display = 'none';
        }
    });
}

// Load settings tab content
function loadSettingsTab(tabId) {
    // Show loading state
    const settingsContent = document.querySelector('.settings-content');
    settingsContent.innerHTML = `
        <div id="settings-loading">
            <div class="loading-spinner"></div>
            <p>Loading settings...</p>
        </div>
    `;
    
    // Simulate API call to load tab content
    setTimeout(() => {
        let tabContent = '';
        
        switch(tabId) {
            case 'general':
                tabContent = getGeneralSettingsContent();
                break;
            case 'appearance':
                tabContent = getAppearanceSettingsContent();
                break;
            case 'email':
                tabContent = getEmailSettingsContent();
                break;
            case 'notifications':
                tabContent = getNotificationSettingsContent();
                break;
            case 'backup':
                tabContent = getBackupSettingsContent();
                break;
            case 'api':
                tabContent = getApiSettingsContent();
                break;
            case 'audit-log':
                tabContent = getAuditLogContent();
                break;
            case 'about':
                tabContent = getAboutContent();
                break;
            default:
                tabContent = '<p>Settings not found.</p>';
        }
        
        settingsContent.innerHTML = tabContent;
        
        // Re-initialize any plugins or event listeners for the loaded content
        initSettingsPage();
        setupEventListeners();
        
    }, 500); // Simulate network delay
}

// Save settings
function saveSettings() {
    // Show loading state
    const saveBtn = document.getElementById('saveSettings');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    // In a real app, this would be an API call to save the settings
    setTimeout(() => {
        // Show success message
        showAlert('Settings saved successfully!', 'success');
        
        // Reset button state
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }, 1000);
}

// Send test email
function sendTestEmail() {
    const email = document.getElementById('testEmailAddress').value;
    
    if (!email) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    const btn = document.getElementById('sendTestEmail');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // In a real app, this would be an API call to send a test email
    setTimeout(() => {
        showAlert(`Test email sent to ${email}`, 'success');
        btn.disabled = false;
        btn.innerHTML = originalText;
    }, 1500);
}

// Apply color scheme
function applyColorScheme(color) {
    // In a real app, this would update the CSS variables or theme
    const root = document.documentElement;
    
    // Define color schemes
    const schemes = {
        blue: { primary: '#3b82f6', primaryDark: '#1e40af' },
        green: { primary: '#10b981', primaryDark: '#047857' },
        purple: { primary: '#8b5cf6', primaryDark: '#6d28d9' },
        pink: { primary: '#ec4899', primaryDark: '#be185d' },
        orange: { primary: '#f59e0b', primaryDark: '#b45309' },
        red: { primary: '#ef4444', primaryDark: '#b91c1c' }
    };
    
    const scheme = schemes[color] || schemes.blue;
    
    // Update CSS variables
    root.style.setProperty('--primary-color', scheme.primary);
    root.style.setProperty('--primary-dark', scheme.primaryDark);
    
    // Update theme preview
    document.querySelector('.theme-header')?.style.backgroundColor = scheme.primary;
    document.querySelector('.theme-sidebar')?.style.backgroundColor = scheme.primaryDark;
}

// Handle logo upload
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
        showAlert('Please select a valid image file', 'error');
        return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showAlert('Image size should be less than 2MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoPreview = document.getElementById('logoPreview');
        const logoImg = document.getElementById('logoPreviewImg');
        const removeBtn = document.getElementById('removeLogo');
        
        logoImg.src = e.target.result;
        logoImg.style.display = 'block';
        logoPreview.querySelector('span').style.display = 'none';
        removeBtn.style.display = 'block';
        
        // In a real app, upload the image to the server
        // uploadLogoToServer(file);
    };
    
    reader.readAsDataURL(file);
}

// Remove logo
function removeLogo() {
    const logoPreview = document.getElementById('logoPreview');
    const logoImg = document.getElementById('logoPreviewImg');
    const removeBtn = document.getElementById('removeLogo');
    
    logoImg.src = '';
    logoImg.style.display = 'none';
    logoPreview.querySelector('span').style.display = 'block';
    removeBtn.style.display = 'none';
    
    // In a real app, remove the logo from the server
    // removeLogoFromServer();
}

// Create backup
function createBackup() {
    const backupType = document.getElementById('backupType').value;
    const download = document.getElementById('backupDownload').checked;
    
    const btn = document.getElementById('createBackup');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Backup...';
    
    // In a real app, this would be an API call to create a backup
    setTimeout(() => {
        showAlert(`Backup created successfully! ${download ? 'Download will start shortly.' : ''}`, 'success');
        
        if (download) {
            // In a real app, this would trigger a file download
            // window.location.href = '/api/backup/download?type=' + backupType;
        }
        
        btn.disabled = false;
        btn.innerHTML = originalText;
    }, 2000);
}

// Restore backup
function restoreBackup() {
    const fileInput = document.getElementById('backupFile');
    const replace = document.getElementById('backupReplace').checked;
    
    if (!fileInput.files.length) {
        showAlert('Please select a backup file', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to restore from this backup? This action cannot be undone.')) {
        return;
    }
    
    const btn = document.getElementById('restoreBackup');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Restoring...';
    
    // In a real app, this would be an API call to restore a backup
    setTimeout(() => {
        showAlert('Backup restored successfully!', 'success');
        btn.disabled = false;
        btn.innerHTML = originalText;
    }, 3000);
}

// Generate API key
function generateApiKey() {
    if (!confirm('Generating a new API key will invalidate the current key. Are you sure?')) {
        return;
    }
    
    const btn = document.getElementById('generateApiKey');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    // In a real app, this would be an API call to generate a new API key
    setTimeout(() => {
        const newApiKey = 'sk_test_' + Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30);
        document.getElementById('apiKey').textContent = newApiKey;
        showAlert('New API key generated successfully!', 'success');
        
        btn.disabled = false;
        btn.innerHTML = originalText;
    }, 1500);
}

// Copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Show alert message
function showAlert(message, type = 'info') {
    // In a real app, you might use a toast or alert library
    alert(`${type.toUpperCase()}: ${message}`);
}
