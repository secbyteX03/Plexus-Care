document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize DataTable
    const appointmentsTable = $('#appointmentsTable').DataTable({
        responsive: true,
        order: [[3, 'asc']], // Sort by date by default
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        language: {
            search: "",
            searchPlaceholder: "Search appointments...",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ appointments",
            infoEmpty: "No appointments found",
            infoFiltered: "(filtered from _MAX_ total appointments)",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        },
        dom: '<"table-top"lf>rt<"table-bottom"ip><"clear">',
        columns: [
            { data: 'id' },
            { 
                data: 'patient',
                render: function(data) {
                    return `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="patient-avatar" style="background: ${data.avatarColor};">
                                ${data.initials}
                            </div>
                            <div>
                                <div style="font-weight: 600;">${data.name}</div>
                                <div style="font-size: 0.75rem; color: #6b7280;">${data.id}</div>
                            </div>
                        </div>
                    `;
                }
            },
            { 
                data: 'doctor',
                render: function(data) {
                    return data || 'N/A';
                }
            },
            { 
                data: 'dateTime',
                render: function(data) {
                    return formatDateTime(data);
                }
            },
            { 
                data: 'type',
                render: function(data) {
                    return data.charAt(0).toUpperCase() + data.slice(1).replace('-', ' ');
                }
            },
            { 
                data: 'status',
                render: function(data) {
                    const statusMap = {
                        'scheduled': { text: 'Scheduled', class: 'status-scheduled' },
                        'completed': { text: 'Completed', class: 'status-completed' },
                        'cancelled': { text: 'Cancelled', class: 'status-cancelled' },
                        'no-show': { text: 'No Show', class: 'status-no-show' }
                    };
                    const status = statusMap[data] || { text: data, class: 'status-default' };
                    return `<span class="status-badge ${status.class}">${status.text}</span>`;
                }
            },
            {
                data: 'id',
                orderable: false,
                render: function(data, type, row) {
                    return `
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="action-btn view-appointment" data-id="${data}" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit-appointment" data-id="${data}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete delete-appointment" data-id="${data}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ]
    });

    // Initialize date picker for date range filter
    flatpickr("#dateFilter", {
        mode: "range",
        dateFormat: "Y-m-d",
        onClose: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                const startDate = formatDate(selectedDates[0]);
                const endDate = formatDate(selectedDates[1]);
                appointmentsTable.draw();
            }
        }
    });

    // Initialize date and time pickers for appointment form
    flatpickr("#appointmentDate", {
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    flatpickr("#appointmentTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true
    });

    // Initialize Select2 for patient and doctor dropdowns
    $('.select2').select2({
        width: '100%',
        placeholder: 'Select an option',
        allowClear: true
    });

    // Load sample data (in a real app, this would be an API call)
    loadSampleData();

    // Event Listeners
    document.getElementById('addAppointmentBtn').addEventListener('click', showAddAppointmentModal);
    document.getElementById('cancelAppointment').addEventListener('click', () => closeModal(document.getElementById('appointmentModal')));
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointmentSubmit);
    document.getElementById('searchInput').addEventListener('keyup', function() {
        appointmentsTable.search(this.value).draw();
    });
    document.getElementById('statusFilter').addEventListener('change', function() {
        appointmentsTable.column(5).search(this.value).draw();
    });

    // Close modal when clicking the X button or outside the modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Handle view/edit/delete buttons (delegated event listeners)
    document.addEventListener('click', function(e) {
        // View appointment
        if (e.target.closest('.view-appointment')) {
            const appointmentId = e.target.closest('.view-appointment').getAttribute('data-id');
            viewAppointment(appointmentId);
        }
        
        // Edit appointment
        if (e.target.closest('.edit-appointment')) {
            const appointmentId = e.target.closest('.edit-appointment').getAttribute('data-id');
            editAppointment(appointmentId);
        }
        
        // Delete appointment
        if (e.target.closest('.delete-appointment')) {
            const appointmentId = e.target.closest('.delete-appointment').getAttribute('data-id');
            confirmDeleteAppointment(appointmentId);
        }
    });

    // Logout functionality
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('isAuthenticated');
            window.location.href = 'login.html';
        });
    }

    // Sample Data (in a real app, this would come from an API)
    let appointments = [];
    let patients = [];
    let doctors = [];

    // Load sample data
    function loadSampleData() {
        // Sample patients
        patients = [
            { id: 'PAT001', name: 'John Doe', initials: 'JD', avatarColor: '#97b8f7' },
            { id: 'PAT002', name: 'Jane Smith', initials: 'JS', avatarColor: '#f59e0b' },
            { id: 'PAT003', name: 'Robert Brown', initials: 'RB', avatarColor: '#10b981' },
            { id: 'PAT004', name: 'Emily Anderson', initials: 'EA', avatarColor: '#8b5cf6' },
            { id: 'PAT005', name: 'Michael Wilson', initials: 'MW', avatarColor: '#ec4899' }
        ];

        // Sample doctors
        doctors = [
            { id: 'DOC001', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
            { id: 'DOC002', name: 'Dr. Michael Chen', specialty: 'Neurology' },
            { id: 'DOC003', name: 'Dr. Lisa Wong', specialty: 'Pediatrics' },
            { id: 'DOC004', name: 'Dr. David Kim', specialty: 'Orthopedics' },
            { id: 'DOC005', name: 'Dr. Maria Garcia', specialty: 'Dermatology' }
        ];

        // Sample appointments
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        appointments = [
            {
                id: 'APT001',
                patient: patients[0],
                doctor: 'Dr. Sarah Johnson',
                dateTime: new Date(today.getTime() + (24 * 60 * 60 * 1000) + (9 * 60 * 60 * 1000)), // Tomorrow 9:00 AM
                type: 'consultation',
                status: 'scheduled',
                notes: 'Initial consultation for chest pain'
            },
            {
                id: 'APT002',
                patient: patients[1],
                doctor: 'Dr. Michael Chen',
                dateTime: new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000)), // 2 days from now 2:00 PM
                type: 'follow-up',
                status: 'scheduled',
                notes: 'Follow-up for migraine treatment'
            },
            {
                id: 'APT003',
                patient: patients[2],
                doctor: 'Dr. Lisa Wong',
                dateTime: new Date(today.getTime() - (3 * 24 * 60 * 60 * 1000) + (11 * 60 * 60 * 1000)), // 3 days ago 11:00 AM
                type: 'check-up',
                status: 'completed',
                notes: 'Annual physical examination'
            },
            {
                id: 'APT004',
                patient: patients[3],
                doctor: 'Dr. David Kim',
                dateTime: new Date(today.getTime() - (24 * 60 * 60 * 1000) + (15 * 60 * 60 * 1000)), // Yesterday 3:00 PM
                type: 'consultation',
                status: 'no-show',
                notes: 'Missed appointment - left voicemail'
            },
            {
                id: 'APT005',
                patient: patients[4],
                doctor: 'Dr. Maria Garcia',
                dateTime: new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000) + (10 * 60 * 60 * 1000)), // Next week 10:00 AM
                type: 'surgery',
                status: 'scheduled',
                notes: 'Minor dermatological procedure'
            }
        ];

        // Populate the DataTable
        appointmentsTable.clear().rows.add(appointments).draw();

        // Populate patient and doctor dropdowns
        populateDropdowns();
    }

    // Populate patient and doctor dropdowns
    function populateDropdowns() {
        const patientSelect = document.getElementById('patientSelect');
        const doctorSelect = document.getElementById('doctorSelect');

        // Clear existing options except the first one
        while (patientSelect.options.length > 1) patientSelect.remove(1);
        while (doctorSelect.options.length > 1) doctorSelect.remove(1);

        // Add patient options
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.name} (${patient.id})`;
            patientSelect.appendChild(option);
        });

        // Add doctor options
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }

    // Show add appointment modal
    function showAddAppointmentModal() {
        document.getElementById('modalTitle').textContent = 'New Appointment';
        document.getElementById('appointmentForm').reset();
        document.getElementById('appointmentStatus').value = 'scheduled';
        
        // Reset Select2 dropdowns
        $('.select2').val(null).trigger('change');
        
        // Set default date to now
        const now = new Date();
        flatpickr("#appointmentDate").setDate(now, false);
        
        // Set default time to next hour
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        flatpickr("#appointmentTime").setDate(nextHour, false);
        
        openModal(document.getElementById('appointmentModal'));
    }

    // View appointment details
    function viewAppointment(appointmentId) {
        const appointment = appointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        const modal = document.getElementById('viewAppointmentModal');
        const details = document.getElementById('appointmentDetails');
        
        const formattedDate = formatDateTime(appointment.dateTime);
        const statusMap = {
            'scheduled': { text: 'Scheduled', class: 'status-scheduled' },
            'completed': { text: 'Completed', class: 'status-completed' },
            'cancelled': { text: 'Cancelled', class: 'status-cancelled' },
            'no-show': { text: 'No Show', class: 'status-no-show' }
        };
        
        const status = statusMap[appointment.status] || { text: appointment.status, class: 'status-default' };
        
        details.innerHTML = `
            <div class="appointment-detail">
                <div class="detail-row">
                    <div class="detail-label">Appointment ID:</div>
                    <div class="detail-value">${appointment.id}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Patient:</div>
                    <div class="detail-value">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="patient-avatar" style="background: ${appointment.patient.avatarColor};">
                                ${appointment.patient.initials}
                            </div>
                            <div>
                                <div>${appointment.patient.name}</div>
                                <div style="font-size: 0.875rem; color: #6b7280;">${appointment.patient.id}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Doctor:</div>
                    <div class="detail-value">${appointment.doctor}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Date & Time:</div>
                    <div class="detail-value">${formattedDate}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Type:</div>
                    <div class="detail-value">${appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1).replace('-', ' ')}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status:</div>
                    <div class="detail-value"><span class="status-badge ${status.class}">${status.text}</span></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Notes:</div>
                    <div class="detail-value">${appointment.notes || 'No additional notes'}</div>
                </div>
                <div class="detail-actions">
                    <button type="button" class="btn btn-outline close-modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="editAppointment('${appointment.id}')">
                        <i class="fas fa-edit"></i> Edit Appointment
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener to close button
        details.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
        
        openModal(modal);
    }

    // Edit appointment
    function editAppointment(appointmentId) {
        const appointment = appointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        document.getElementById('modalTitle').textContent = 'Edit Appointment';
        
        // Set form values
        document.getElementById('patientSelect').value = appointment.patient.id;
        document.getElementById('doctorSelect').value = doctors.find(d => d.name === appointment.doctor)?.id || '';
        document.getElementById('appointmentDate')._flatpickr.setDate(appointment.dateTime, false);
        document.getElementById('appointmentTime')._flatpickr.setDate(appointment.dateTime, false);
        document.getElementById('appointmentType').value = appointment.type;
        document.getElementById('appointmentStatus').value = appointment.status;
        document.getElementById('appointmentNotes').value = appointment.notes || '';
        
        // Update Select2 dropdowns
        $('.select2').trigger('change');
        
        // Store the appointment ID in the form for reference
        document.getElementById('appointmentForm').dataset.appointmentId = appointmentId;
        
        openModal(document.getElementById('appointmentModal'));
    }

    // Handle form submission
    function handleAppointmentSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const appointmentId = form.dataset.appointmentId || `APT${String(Math.floor(1000 + Math.random() * 9000))}`;
        const isEditMode = !!form.dataset.appointmentId;
        
        // Get form values
        const patientId = document.getElementById('patientSelect').value;
        const doctorId = document.getElementById('doctorSelect').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const type = document.getElementById('appointmentType').value;
        const status = document.getElementById('appointmentStatus').value;
        const notes = document.getElementById('appointmentNotes').value;
        
        // Validate form
        if (!patientId || !doctorId || !date || !time || !type || !status) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Combine date and time
        const dateTime = new Date(`${date}T${time}`);
        
        // Find patient and doctor
        const patient = patients.find(p => p.id === patientId);
        const doctor = doctors.find(d => d.id === doctorId);
        
        if (!patient || !doctor) {
            alert('Invalid patient or doctor selected');
            return;
        }
        
        // Create or update appointment
        const appointment = {
            id: appointmentId,
            patient: patient,
            doctor: doctor.name,
            dateTime: dateTime,
            type: type,
            status: status,
            notes: notes
        };
        
        if (isEditMode) {
            // Update existing appointment
            const index = appointments.findIndex(a => a.id === appointmentId);
            if (index !== -1) {
                appointments[index] = appointment;
            }
            showNotification('Appointment updated successfully', 'success');
        } else {
            // Add new appointment
            appointments.push(appointment);
            showNotification('Appointment created successfully', 'success');
        }
        
        // Update the DataTable
        appointmentsTable.clear().rows.add(appointments).draw();
        
        // Close the modal
        closeModal(document.getElementById('appointmentModal'));
    }

    // Confirm delete appointment
    function confirmDeleteAppointment(appointmentId) {
        if (confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
            deleteAppointment(appointmentId);
        }
    }

    // Delete appointment
    function deleteAppointment(appointmentId) {
        const index = appointments.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
            appointments.splice(index, 1);
            appointmentsTable.clear().rows.add(appointments).draw();
            showNotification('Appointment deleted successfully', 'success');
        }
    }

    // Helper function to format date and time
    function formatDateTime(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        return date.toLocaleDateString('en-US', options);
    }

    // Helper function to format date (YYYY-MM-DD)
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Helper function to show notification
    function showNotification(message, type = 'success') {
        // In a real app, you would use a proper notification system
        alert(`${type.toUpperCase()}: ${message}`);
    }

    // Helper function to open modal
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Helper function to close modal
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
