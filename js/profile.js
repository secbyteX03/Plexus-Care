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

    // DOM Elements
    const profileForm = document.getElementById('profile-form');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    const closeErrorBtn = document.querySelector('.close-error');
    const closeModalBtn = document.querySelector('.close-modal');
    const successModal = document.getElementById('success-modal');
    const submitBtn = document.getElementById('update-profile');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');

    // Show error message
    function showError(message) {
        if (errorMessage && errorText) {
            errorText.textContent = message;
            errorMessage.style.display = 'flex';
            setTimeout(() => {
                errorMessage.style.opacity = '1';
            }, 10);
        }
    }

    // Hide error message
    function hideError() {
        if (errorMessage) {
            errorMessage.style.opacity = '0';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 300);
        }
    }

    // Show success message
    function showSuccess(message) {
        if (successMessage && successText) {
            successText.textContent = message;
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.opacity = '1';
            }, 10);
            
            // Hide after 5 seconds
            setTimeout(() => {
                successMessage.style.opacity = '0';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 300);
            }, 5000);
        }
    }

    // Show loading state
    function setLoading(isLoading) {
        if (submitBtn && btnText && btnLoading) {
            if (isLoading) {
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-block';
            } else {
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
            }
        }
    }

    // Close modal
    function closeModal() {
        if (successModal) {
            successModal.classList.remove('active');
        }
    }

    // Close error message when clicking the close button
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', hideError);
    }

    // Close modal when clicking the close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the modal content
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }

    // Load user profile data
    async function loadProfile() {
        try {
            setLoading(true);
            hideError();

            const { data: profile, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) throw error;

            // Populate form fields
            if (profile) {
                document.getElementById('first-name').value = profile.first_name || '';
                document.getElementById('last-name').value = profile.last_name || '';
                document.getElementById('email').value = session.user.email || '';
                document.getElementById('phone').value = profile.phone || '';
                
                if (profile.date_of_birth) {
                    // Format date for input[type="date"]
                    const dob = new Date(profile.date_of_birth);
                    const formattedDob = dob.toISOString().split('T')[0];
                    document.getElementById('dob').value = formattedDob;
                }
                
                if (profile.gender) {
                    document.getElementById('gender').value = profile.gender;
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            showError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Handle form submission
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const dob = document.getElementById('dob').value;
            const gender = document.getElementById('gender').value;

            // Basic validation
            if (!firstName || !lastName) {
                showError('First name and last name are required');
                return;
            }

            try {
                setLoading(true);
                hideError();

                const { error } = await supabaseClient
                    .from('users')
                    .update({
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone || null,
                        date_of_birth: dob || null,
                        gender: gender || null,
                        updated_at: new Date().toISOString(),
                        profile_completed: true
                    })
                    .eq('id', session.user.id);

                if (error) throw error;

                // Show success message
                if (successModal) {
                    successModal.classList.add('active');
                }

                // Show success message
                showSuccess('Profile updated successfully!');

                // Update auth user metadata
                const { error: updateError } = await supabaseClient.auth.updateUser({
                    data: { 
                        first_name: firstName,
                        last_name: lastName
                    }
                });

                if (updateError) throw updateError;

            } catch (error) {
                console.error('Error updating profile:', error);
                showError(error.message || 'Failed to update profile. Please try again.');
            } finally {
                setLoading(false);
            }
        });
    }

    // Load profile data when page loads
    loadProfile();
});
