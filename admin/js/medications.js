document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize DataTable
    const medicationsTable = $('#medicationsTable').DataTable({
        responsive: true,
        order: [[1, 'asc']], // Sort by medication name by default
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        language: {
            search: "",
            searchPlaceholder: "Search medications...",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ medications",
            infoEmpty: "No medications found",
            infoFiltered: "(filtered from _MAX_ total medications)",
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
                data: 'name',
                render: function(data, type, row) {
                    return `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="medication-icon" style="background: ${getCategoryColor(row.category)};">
                                <i class="${getCategoryIcon(row.category)}"></i>
                            </div>
                            <div>
                                <div style="font-weight: 600;">${data}</div>
                                <div style="font-size: 0.75rem; color: #6b7280;">${row.manufacturer || 'N/A'}</div>
                            </div>
                        </div>
                    `;
                }
            },
            { data: 'genericName' },
            { 
                data: 'category',
                render: function(data) {
                    return data ? data.charAt(0).toUpperCase() + data.slice(1) : 'N/A';
                }
            },
            { 
                data: 'dosage',
                render: function(data, type, row) {
                    return `${data || 'N/A'} ${row.form ? `(${row.form})` : ''}`;
                }
            },
            { 
                data: 'quantity',
                className: 'text-center'
            },
            { 
                data: 'status',
                render: function(data) {
                    const statusMap = {
                        'in-stock': { text: 'In Stock', class: 'status-completed' },
                        'low-stock': { text: 'Low Stock', class: 'status-warning' },
                        'out-of-stock': { text: 'Out of Stock', class: 'status-cancelled' }
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
                            <button class="action-btn view-medication" data-id="${data}" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit-medication" data-id="${data}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete delete-medication" data-id="${data}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ]
    });

    // Apply filters
    $('#categoryFilter, #statusFilter').on('change', function() {
        medicationsTable.draw();
    });

    // Custom filtering function
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            const category = $('#categoryFilter').val();
            const status = $('#statusFilter').val();
            const rowData = medicationsTable.row(dataIndex).data();
            
            let categoryMatch = true;
            let statusMatch = true;
            
            if (category) {
                categoryMatch = rowData.category === category;
            }
            
            if (status) {
                statusMatch = rowData.status === status;
            }
            
            return categoryMatch && statusMatch;
        }
    );

    // Search functionality
    $('#searchInput').on('keyup', function() {
        medicationsTable.search(this.value).draw();
    });

    // Load sample data (in a real app, this would be an API call)
    loadSampleData();

    // Event Listeners
    document.getElementById('addMedicationBtn').addEventListener('click', showAddMedicationModal);
    document.getElementById('cancelMedication').addEventListener('click', () => closeModal(document.getElementById('medicationModal')));
    document.getElementById('medicationForm').addEventListener('submit', handleMedicationSubmit);

    // Close modal when clicking the X button or outside the modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Handle view/edit/delete buttons (delegated event listeners)
    document.addEventListener('click', function(e) {
        // View medication
        if (e.target.closest('.view-medication')) {
            const medicationId = e.target.closest('.view-medication').getAttribute('data-id');
            viewMedication(medicationId);
        }
        
        // Edit medication
        if (e.target.closest('.edit-medication')) {
            const medicationId = e.target.closest('.edit-medication').getAttribute('data-id');
            editMedication(medicationId);
        }
        
        // Delete medication
        if (e.target.closest('.delete-medication')) {
            const medicationId = e.target.closest('.delete-medication').getAttribute('data-id');
            confirmDeleteMedication(medicationId);
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
    let medications = [];

    // Load sample data
    function loadSampleData() {
        // Sample medications data
        medications = [
            {
                id: 'MED001',
                name: 'Amoxicillin',
                genericName: 'Amoxicillin Trihydrate',
                category: 'antibiotic',
                manufacturer: 'Pfizer',
                dosage: '500mg',
                form: 'capsule',
                quantity: 125,
                reorderLevel: 30,
                unitPrice: 0.75,
                expiryDate: '2024-12-31',
                description: 'Broad-spectrum antibiotic used to treat various bacterial infections.',
                sideEffects: 'Nausea, diarrhea, rash',
                status: 'in-stock',
                createdAt: new Date('2023-01-15')
            },
            {
                id: 'MED002',
                name: 'Ibuprofen',
                genericName: 'Ibuprofen',
                category: 'analgesic',
                manufacturer: 'Johnson & Johnson',
                dosage: '200mg',
                form: 'tablet',
                quantity: 28,
                reorderLevel: 50,
                unitPrice: 0.25,
                expiryDate: '2025-06-30',
                description: 'Nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and lower fever.',
                sideEffects: 'Stomach pain, heartburn, dizziness',
                status: 'low-stock',
                createdAt: new Date('2023-02-20')
            },
            {
                id: 'MED003',
                name: 'Loratadine',
                genericName: 'Loratadine',
                category: 'antihistamine',
                manufacturer: 'Bayer',
                dosage: '10mg',
                form: 'tablet',
                quantity: 0,
                reorderLevel: 20,
                unitPrice: 0.35,
                expiryDate: '2024-09-15',
                description: 'Antihistamine used to treat allergy symptoms.',
                sideEffects: 'Headache, dry mouth, fatigue',
                status: 'out-of-stock',
                createdAt: new Date('2023-03-10')
            },
            {
                id: 'MED004',
                name: 'Sertraline',
                genericName: 'Sertraline Hydrochloride',
                category: 'antidepressant',
                manufacturer: 'Pfizer',
                dosage: '50mg',
                form: 'tablet',
                quantity: 42,
                reorderLevel: 25,
                unitPrice: 1.20,
                expiryDate: '2025-03-31',
                description: 'Selective serotonin reuptake inhibitor (SSRI) used to treat depression and anxiety disorders.',
                sideEffects: 'Nausea, insomnia, dizziness',
                status: 'in-stock',
                createdAt: new Date('2023-01-30')
            },
            {
                id: 'MED005',
                name: 'Vitamin D3',
                genericName: 'Cholecalciferol',
                category: 'vitamin',
                manufacturer: 'Nature Made',
                dosage: '1000 IU',
                form: 'softgel',
                quantity: 87,
                reorderLevel: 40,
                unitPrice: 0.15,
                expiryDate: '2024-11-30',
                description: 'Dietary supplement to prevent or treat vitamin D deficiency.',
                sideEffects: 'Rare at recommended doses',
                status: 'in-stock',
                createdAt: new Date('2023-04-05')
            }
        ];

        // Update status based on quantity and reorder level
        medications.forEach(med => {
            if (med.quantity === 0) {
                med.status = 'out-of-stock';
            } else if (med.quantity <= (med.reorderLevel || 0)) {
                med.status = 'low-stock';
            } else {
                med.status = 'in-stock';
            }
        });

        // Populate the DataTable
        medicationsTable.clear().rows.add(medications).draw();
    }

    // Show add medication modal
    function showAddMedicationModal() {
        document.getElementById('modalTitle').textContent = 'New Medication';
        document.getElementById('medicationForm').reset();
        
        // Set default reorder level if not set
        if (!document.getElementById('reorderLevel').value) {
            document.getElementById('reorderLevel').value = '10'; // Default reorder level
        }
        
        // Set default status to in-stock
        document.getElementById('status').value = 'in-stock';
        
        // Remove any stored medication ID
        document.getElementById('medicationForm').dataset.medicationId = '';
        
        openModal(document.getElementById('medicationModal'));
    }

    // View medication details
    function viewMedication(medicationId) {
        const medication = medications.find(m => m.id === medicationId);
        if (!medication) return;

        const modal = document.getElementById('viewMedicationModal');
        const details = document.getElementById('medicationDetails');
        
        // Format expiration date
        const expiryDate = medication.expiryDate ? 
            new Date(medication.expiryDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }) : 'Not specified';
        
        // Format price
        const price = medication.unitPrice ? 
            `$${parseFloat(medication.unitPrice).toFixed(2)}` : 'Not specified';
        
        // Get status display
        const statusMap = {
            'in-stock': { text: 'In Stock', class: 'status-completed' },
            'low-stock': { text: 'Low Stock', class: 'status-warning' },
            'out-of-stock': { text: 'Out of Stock', class: 'status-cancelled' }
        };
        const status = statusMap[medication.status] || { text: medication.status, class: 'status-default' };
        
        // Create HTML for medication details
        details.innerHTML = `
            <div class="medication-detail">
                <div class="medication-header">
                    <div class="medication-icon large" style="background: ${getCategoryColor(medication.category)};">
                        <i class="${getCategoryIcon(medication.category)}"></i>
                    </div>
                    <div class="medication-title">
                        <h3>${medication.name}</h3>
                        <p class="generic-name">${medication.genericName}</p>
                        <span class="status-badge ${status.class}">${status.text}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Basic Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">Category</div>
                            <div class="detail-value">${medication.category ? medication.category.charAt(0).toUpperCase() + medication.category.slice(1) : 'N/A'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Manufacturer</div>
                            <div class="detail-value">${medication.manufacturer || 'N/A'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Dosage</div>
                            <div class="detail-value">${medication.dosage || 'N/A'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Form</div>
                            <div class="detail-value">${medication.form ? medication.form.charAt(0).toUpperCase() + medication.form.slice(1) : 'N/A'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Quantity in Stock</div>
                            <div class="detail-value">${medication.quantity}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Reorder Level</div>
                            <div class="detail-value">${medication.reorderLevel || 'Not set'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Unit Price</div>
                            <div class="detail-value">${price}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Expiry Date</div>
                            <div class="detail-value">${expiryDate}</div>
                        </div>
                    </div>
                </div>
                
                ${medication.description ? `
                <div class="detail-section">
                    <h4>Description</h4>
                    <p>${medication.description}</p>
                </div>
                ` : ''}
                
                ${medication.sideEffects ? `
                <div class="detail-section">
                    <h4>Side Effects</h4>
                    <p>${medication.sideEffects}</p>
                </div>
                ` : ''}
                
                <div class="detail-actions">
                    <button type="button" class="btn btn-outline close-modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="editMedication('${medication.id}')">
                        <i class="fas fa-edit"></i> Edit Medication
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener to close button
        details.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
        
        openModal(modal);
    }

    // Edit medication
    function editMedication(medicationId) {
        const medication = medications.find(m => m.id === medicationId);
        if (!medication) return;

        document.getElementById('modalTitle').textContent = 'Edit Medication';
        
        // Set form values
        document.getElementById('medicationName').value = medication.name || '';
        document.getElementById('genericName').value = medication.genericName || '';
        document.getElementById('medicationCategory').value = medication.category || '';
        document.getElementById('manufacturer').value = medication.manufacturer || '';
        document.getElementById('dosage').value = medication.dosage || '';
        document.getElementById('form').value = medication.form || '';
        document.getElementById('quantity').value = medication.quantity || '';
        document.getElementById('reorderLevel').value = medication.reorderLevel || '';
        document.getElementById('unitPrice').value = medication.unitPrice || '';
        document.getElementById('expiryDate').value = medication.expiryDate || '';
        document.getElementById('description').value = medication.description || '';
        document.getElementById('sideEffects').value = medication.sideEffects || '';
        
        // Store the medication ID in the form for reference
        document.getElementById('medicationForm').dataset.medicationId = medicationId;
        
        openModal(document.getElementById('medicationModal'));
    }

    // Handle form submission
    function handleMedicationSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const medicationId = form.dataset.medicationId || `MED${String(Math.floor(1000 + Math.random() * 9000))}`;
        const isEditMode = !!form.dataset.medicationId;
        
        // Get form values
        const medicationData = {
            id: medicationId,
            name: document.getElementById('medicationName').value.trim(),
            genericName: document.getElementById('genericName').value.trim(),
            category: document.getElementById('medicationCategory').value,
            manufacturer: document.getElementById('manufacturer').value.trim(),
            dosage: document.getElementById('dosage').value.trim(),
            form: document.getElementById('form').value,
            quantity: parseInt(document.getElementById('quantity').value) || 0,
            reorderLevel: parseInt(document.getElementById('reorderLevel').value) || 0,
            unitPrice: parseFloat(document.getElementById('unitPrice').value) || 0,
            expiryDate: document.getElementById('expiryDate').value,
            description: document.getElementById('description').value.trim(),
            sideEffects: document.getElementById('sideEffects').value.trim(),
            createdAt: isEditMode ? medications.find(m => m.id === medicationId).createdAt : new Date()
        };
        
        // Validate form
        if (!medicationData.name || !medicationData.genericName || !medicationData.category || 
            !medicationData.dosage || !medicationData.form) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Determine status based on quantity and reorder level
        if (medicationData.quantity === 0) {
            medicationData.status = 'out-of-stock';
        } else if (medicationData.quantity <= medicationData.reorderLevel) {
            medicationData.status = 'low-stock';
        } else {
            medicationData.status = 'in-stock';
        }
        
        if (isEditMode) {
            // Update existing medication
            const index = medications.findIndex(m => m.id === medicationId);
            if (index !== -1) {
                medications[index] = medicationData;
            }
            showNotification('Medication updated successfully', 'success');
        } else {
            // Add new medication
            medications.push(medicationData);
            showNotification('Medication added successfully', 'success');
        }
        
        // Update the DataTable
        medicationsTable.clear().rows.add(medications).draw();
        
        // Close the modal
        closeModal(document.getElementById('medicationModal'));
    }

    // Confirm delete medication
    function confirmDeleteMedication(medicationId) {
        if (confirm('Are you sure you want to delete this medication? This action cannot be undone.')) {
            deleteMedication(medicationId);
        }
    }

    // Delete medication
    function deleteMedication(medicationId) {
        const index = medications.findIndex(m => m.id === medicationId);
        if (index !== -1) {
            medications.splice(index, 1);
            medicationsTable.clear().rows.add(medications).draw();
            showNotification('Medication deleted successfully', 'success');
        }
    }

    // Helper function to get category color
    function getCategoryColor(category) {
        const colors = {
            'antibiotic': '#d1fae5',
            'analgesic': '#dbeafe',
            'antihistamine': '#fef3c7',
            'antidepressant': '#ede9fe',
            'vitamin': '#fce7f3',
            'other': '#e5e7eb'
        };
        return colors[category] || '#e5e7eb';
    }

    // Helper function to get category icon
    function getCategoryIcon(category) {
        const icons = {
            'antibiotic': 'fas fa-bacteria',
            'analgesic': 'fas fa-pain-relief',
            'antihistamine': 'fas fa-allergies',
            'antidepressant': 'fas fa-brain',
            'vitamin': 'fas fa-apple-alt',
            'other': 'fas fa-pills'
        };
        return icons[category] || 'fas fa-pills';
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

    // Make functions available globally for inline event handlers
    window.editMedication = editMedication;
});
