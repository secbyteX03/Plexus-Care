document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize DataTable
    const patientsTable = $('#patientsTable').DataTable({
        responsive: true,
        order: [[0, 'desc']],
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        language: {
            search: "",
            searchPlaceholder: "Search patients...",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ patients",
            infoEmpty: "No patients found",
            infoFiltered: "(filtered from _MAX_ total patients)",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        },
        dom: '<"table-top"lf>rt<"table-bottom"ip><"clear">',
        initComplete: function() {
            // Add search icon to search input
            $('.dataTables_filter input').addClass('search-input');
            $('.dataTables_filter').prepend('<i class="fas fa-search"></i>');
        }
    });

    // Search functionality
    $('#searchInput').on('keyup', function() {
        patientsTable.search(this.value).draw();
    });

    // Modal elements
    const modal = document.getElementById('patientModal');
    const viewModal = document.getElementById('viewPatientModal');
    const confirmModal = document.getElementById('confirmModal');
    const addPatientBtn = document.getElementById('addPatientBtn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelPatientBtn = document.getElementById('cancelPatient');
    const patientForm = document.getElementById('patientForm');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    let currentPatientId = null;
    let isEditMode = false;

    // Sample patient data (in a real app, this would come from an API)
    const patients = {
        'PAT001': {
            id: 'PAT001',
            firstName: 'John',
            lastName: 'Doe',
            dob: '1988-03-15',
            gender: 'male',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            bloodType: 'O+',
            height: '175',
            weight: '75',
            bloodPressure: '120/80',
            allergies: 'Penicillin, Peanuts',
            conditions: 'Hypertension',
            medications: 'Lisinopril 10mg daily',
            notes: 'Patient prefers email communication',
            emergencyName: 'Jane Doe',
            emergencyRelation: 'Spouse',
            emergencyPhone: '+1 (555) 987-6543',
            emergencyEmail: 'jane.doe@example.com',
            emergencyAddress: '123 Main St, New York, NY 10001',
            status: 'active',
            lastVisit: '2023-05-15',
            nextAppointment: '2023-06-15'
        },
        'PAT002': {
            id: 'PAT002',
            firstName: 'Jane',
            lastName: 'Smith',
            dob: '1995-07-22',
            gender: 'female',
            email: 'jane.smith@example.com',
            phone: '+1 (555) 234-5678',
            address: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
            country: 'USA',
            bloodType: 'A-',
            height: '165',
            weight: '62',
            bloodPressure: '118/75',
            allergies: 'None',
            conditions: 'Asthma',
            medications: 'Albuterol as needed',
            notes: 'Prefers morning appointments',
            emergencyName: 'John Smith',
            emergencyRelation: 'Husband',
            emergencyPhone: '+1 (555) 876-5432',
            emergencyEmail: 'john.smith@example.com',
            emergencyAddress: '456 Oak Ave, Los Angeles, CA 90001',
            status: 'active',
            lastVisit: '2023-05-10',
            nextAppointment: '2023-06-20'
        },
        'PAT003': {
            id: 'PAT003',
            firstName: 'Robert',
            lastName: 'Brown',
            dob: '1978-11-03',
            gender: 'male',
            email: 'robert.brown@example.com',
            phone: '+1 (555) 345-6789',
            address: '789 Pine St',
            city: 'Chicago',
            state: 'IL',
            postalCode: '60601',
            country: 'USA',
            bloodType: 'B+',
            height: '180',
            weight: '85',
            bloodPressure: '130/85',
            allergies: 'Shellfish',
            conditions: 'Type 2 Diabetes, High Cholesterol',
            medications: 'Metformin 1000mg BID, Atorvastatin 20mg daily',
            notes: 'Needs regular A1C monitoring',
            emergencyName: 'Mary Brown',
            emergencyRelation: 'Wife',
            emergencyPhone: '+1 (555) 765-4321',
            emergencyEmail: 'mary.brown@example.com',
            emergencyAddress: '789 Pine St, Chicago, IL 60601',
            status: 'inactive',
            lastVisit: '2023-01-15',
            nextAppointment: ''
        },
        'PAT004': {
            id: 'PAT004',
            firstName: 'Emily',
            lastName: 'Anderson',
            dob: '1992-05-18',
            gender: 'female',
            email: 'emily.anderson@example.com',
            phone: '+1 (555) 456-7890',
            address: '321 Elm St',
            city: 'Houston',
            state: 'TX',
            postalCode: '77001',
            country: 'USA',
            bloodType: 'AB+',
            height: '170',
            weight: '68',
            bloodPressure: '115/70',
            allergies: 'Latex',
            conditions: 'Migraine',
            medications: 'Sumatriptan 50mg as needed',
            notes: 'Prefers telemedicine when possible',
            emergencyName: 'David Anderson',
            emergencyRelation: 'Husband',
            emergencyPhone: '+1 (555) 654-3210',
            emergencyEmail: 'david.anderson@example.com',
            emergencyAddress: '321 Elm St, Houston, TX 77001',
            status: 'active',
            lastVisit: '2023-05-20',
            nextAppointment: '2023-06-25'
        },
        'PAT005': {
            id: 'PAT005',
            firstName: 'Michael',
            lastName: 'Wilson',
            dob: '1971-09-29',
            gender: 'male',
            email: 'michael.wilson@example.com',
            phone: '+1 (555) 567-8901',
            address: '654 Maple Dr',
            city: 'Phoenix',
            state: 'AZ',
            postalCode: '85001',
            country: 'USA',
            bloodType: 'A+',
            height: '178',
            weight: '82',
            bloodPressure: '125/80',
            allergies: 'None',
            conditions: 'Osteoarthritis',
            medications: 'Ibuprofen 400mg as needed',
            notes: 'New patient, needs initial evaluation',
            emergencyName: 'Sarah Wilson',
            emergencyRelation: 'Wife',
            emergencyPhone: '+1 (555) 543-2109',
            emergencyEmail: 'sarah.wilson@example.com',
            emergencyAddress: '654 Maple Dr, Phoenix, AZ 85001',
            status: 'pending',
            lastVisit: '',
            nextAppointment: '2023-06-05'
        }
    };

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Open Add Patient Modal
    addPatientBtn.addEventListener('click', () => {
        isEditMode = false;
        currentPatientId = null;
        document.getElementById('modalTitle').textContent = 'Add New Patient';
        patientForm.reset();
        openModal(modal);
    });

    // Close Modal
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Open Modal
    function openModal(modalElement) {
        modalElement.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modals when clicking the X button
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Cancel button in patient form
    cancelPatientBtn.addEventListener('click', () => {
        closeModal(modal);
    });

    // View Patient
    window.viewPatient = function(patientId) {
        const patient = patients[patientId];
        if (!patient) return;

        const patientDetails = document.getElementById('patientDetails');
        const fullName = `${patient.firstName} ${patient.lastName}`;
        const initials = patient.firstName[0] + patient.lastName[0];
        
        // Format date
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        // Get status badge
        const getStatusBadge = (status) => {
            const statusText = status.charAt(0).toUpperCase() + status.slice(1);
            return `<span class="status-badge status-${status}">${statusText}</span>`;
        };

        // Create HTML for patient details
        patientDetails.innerHTML = `
            <div class="patient-details">
                <div class="patient-avatar-lg" style="background: ${getRandomColor()}">${initials}</div>
                <div class="patient-info">
                    <h3>${fullName} ${getStatusBadge(patient.status)}</h3>
                    <div class="patient-meta">
                        <span><i class="fas fa-birthday-cake"></i> ${formatDate(patient.dob)} (${calculateAge(patient.dob)} years)</span>
                        <span><i class="fas fa-venus-mars"></i> ${patient.gender === 'male' ? 'Male' : 'Female'}</span>
                        <span><i class="fas fa-tint"></i> Blood Type: ${patient.bloodType || 'N/A'}</span>
                    </div>
                    <div class="patient-contact">
                        <p><i class="fas fa-phone"></i> ${patient.phone}</p>
                        <p><i class="fas fa-envelope"></i> ${patient.email}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${patient.address}, ${patient.city}, ${patient.state} ${patient.postalCode}, ${patient.country}</p>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h4>Medical Information</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Height</div>
                        <div class="info-value">${patient.height || 'N/A'} cm</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Weight</div>
                        <div class="info-value">${patient.weight || 'N/A'} kg</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Blood Pressure</div>
                        <div class="info-value">${patient.bloodPressure || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Allergies</div>
                        <div class="info-value">${patient.allergies || 'None'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Conditions</div>
                        <div class="info-value">${patient.conditions || 'None'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Medications</div>
                        <div class="info-value">${patient.medications || 'None'}</div>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h4>Emergency Contact</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Name</div>
                        <div class="info-value">${patient.emergencyName || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Relationship</div>
                        <div class="info-value">${patient.emergencyRelation || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value">${patient.emergencyPhone || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">${patient.emergencyEmail || 'N/A'}</div>
                    </div>
                    <div class="info-item" style="grid-column: 1 / -1">
                        <div class="info-label">Address</div>
                        <div class="info-value">${patient.emergencyAddress || 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h4>Appointments</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Last Visit</div>
                        <div class="info-value">${patient.lastVisit ? formatDate(patient.lastVisit) : 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Next Appointment</div>
                        <div class="info-value">${patient.nextAppointment ? formatDate(patient.nextAppointment) : 'Not scheduled'}</div>
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-outline close-modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="editPatient('${patientId}')">
                    <i class="fas fa-edit"></i> Edit Patient
                </button>
            </div>
        `;

        // Add event listener to close button in the modal
        patientDetails.querySelector('.close-modal').addEventListener('click', () => {
            closeModal(viewModal);
        });

        openModal(viewModal);
    };

    // Edit Patient
    window.editPatient = function(patientId) {
        const patient = patients[patientId];
        if (!patient) return;

        isEditMode = true;
        currentPatientId = patientId;
        document.getElementById('modalTitle').textContent = 'Edit Patient';
        
        // Fill the form with patient data
        document.getElementById('firstName').value = patient.firstName || '';
        document.getElementById('lastName').value = patient.lastName || '';
        document.getElementById('dob').value = patient.dob || '';
        document.getElementById('gender').value = patient.gender || '';
        document.getElementById('email').value = patient.email || '';
        document.getElementById('phone').value = patient.phone || '';
        document.getElementById('address').value = patient.address || '';
        document.getElementById('city').value = patient.city || '';
        document.getElementById('state').value = patient.state || '';
        document.getElementById('postalCode').value = patient.postalCode || '';
        document.getElementById('country').value = patient.country || '';
        document.getElementById('bloodType').value = patient.bloodType || '';
        document.getElementById('height').value = patient.height || '';
        document.getElementById('weight').value = patient.weight || '';
        document.getElementById('bloodPressure').value = patient.bloodPressure || '';
        document.getElementById('allergies').value = patient.allergies || '';
        document.getElementById('conditions').value = patient.conditions || '';
        document.getElementById('medications').value = patient.medications || '';
        document.getElementById('notes').value = patient.notes || '';
        document.getElementById('emergencyName').value = patient.emergencyName || '';
        document.getElementById('emergencyRelation').value = patient.emergencyRelation || '';
        document.getElementById('emergencyPhone').value = patient.emergencyPhone || '';
        document.getElementById('emergencyEmail').value = patient.emergencyEmail || '';
        document.getElementById('emergencyAddress').value = patient.emergencyAddress || '';
        
        closeModal(viewModal);
        openModal(modal);
    };

    // Confirm Delete
    window.confirmDelete = function(patientId) {
        currentPatientId = patientId;
        openModal(confirmModal);
    };

    // Cancel Delete
    cancelDeleteBtn.addEventListener('click', () => {
        closeModal(confirmModal);
    });

    // Confirm Delete Action
    confirmDeleteBtn.addEventListener('click', () => {
        // In a real app, you would make an API call to delete the patient
        console.log(`Deleting patient with ID: ${currentPatientId}`);
        
        // Show success message
        showNotification('Patient deleted successfully', 'success');
        
        // Close the modal
        closeModal(confirmModal);
        
        // Refresh the table (in a real app, this would be handled by the API response)
        patientsTable.ajax.reload();
    });

    // Form Submission
    patientForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            id: isEditMode ? currentPatientId : `PAT${String(Math.floor(1000 + Math.random() * 9000))}`,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            postalCode: document.getElementById('postalCode').value,
            country: document.getElementById('country').value,
            bloodType: document.getElementById('bloodType').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            bloodPressure: document.getElementById('bloodPressure').value,
            allergies: document.getElementById('allergies').value,
            conditions: document.getElementById('conditions').value,
            medications: document.getElementById('medications').value,
            notes: document.getElementById('notes').value,
            emergencyName: document.getElementById('emergencyName').value,
            emergencyRelation: document.getElementById('emergencyRelation').value,
            emergencyPhone: document.getElementById('emergencyPhone').value,
            emergencyEmail: document.getElementById('emergencyEmail').value,
            emergencyAddress: document.getElementById('emergencyAddress').value,
            status: isEditMode ? patients[currentPatientId]?.status || 'active' : 'active',
            lastVisit: isEditMode ? patients[currentPatientId]?.lastVisit || '' : '',
            nextAppointment: isEditMode ? patients[currentPatientId]?.nextAppointment || '' : ''
        };

        // In a real app, you would make an API call to save the patient
        console.log('Saving patient:', formData);
        
        if (isEditMode) {
            // Update existing patient
            patients[formData.id] = formData;
            showNotification('Patient updated successfully', 'success');
        } else {
            // Add new patient
            patients[formData.id] = formData;
            showNotification('Patient added successfully', 'success');
        }
        
        // Close the modal
        closeModal(modal);
        
        // Refresh the table (in a real app, this would be handled by the API response)
        patientsTable.ajax.reload();
    });

    // Helper function to show notifications
    function showNotification(message, type = 'success') {
        // In a real app, you would use a proper notification system
        alert(`${type.toUpperCase()}: ${message}`);
    }

    // Helper function to generate a random color for avatars
    function getRandomColor() {
        const colors = ['#97b8f7', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Helper function to calculate age from date of birth
    function calculateAge(dobString) {
        if (!dobString) return 'N/A';
        const dob = new Date(dobString);
        const diff = Date.now() - dob.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('isAuthenticated');
            window.location.href = 'login.html';
        });
    }
});
