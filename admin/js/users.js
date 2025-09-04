document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize Select2
    $('#roles').select2({
        placeholder: 'Select roles',
        width: '100%',
        closeOnSelect: false
    });

    // Password strength meter
    const passwordInput = document.getElementById('newPassword');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }

    // Generate strong password
    const generatePasswordBtn = document.getElementById('generatePassword');
    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', generateStrongPassword);
    }

    // Initialize DataTable
    const usersTable = $('#usersTable').DataTable({
        responsive: true,
        order: [[0, 'desc']], // Sort by ID by default (newest first)
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        language: {
            search: "",
            searchPlaceholder: "Search users...",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ users",
            infoEmpty: "No users found",
            infoFiltered: "(filtered from _MAX_ total users)",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        },
        dom: '<"table-top"lf>rt<"table-bottom"ip><"clear">',
        columns: [
            { data: 'id', visible: false },
            { 
                data: null,
                render: function(data) {
                    return `
                        <div class="user-details">
                            <img src="${data.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.name) + '&background=random'}" 
                                 alt="${data.name}" class="user-avatar">
                            <div class="user-info">
                                <span class="user-name">${data.name}</span>
                                <span class="user-email">${data.email}</span>
                            </div>
                        </div>
                    `;
                }
            },
            { 
                data: 'email',
                visible: false // Hide as it's shown in the name column
            },
            { 
                data: 'roles',
                render: function(data) {
                    if (!data || data.length === 0) return 'No roles assigned';
                    return data.map(role => 
                        `<span class="role-tag">${formatRole(role)}</span>`
                    ).join('');
                }
            },
            { 
                data: 'status',
                render: function(data) {
                    const statusMap = {
                        'active': { text: 'Active', class: 'status-active' },
                        'inactive': { text: 'Inactive', class: 'status-inactive' },
                        'suspended': { text: 'Suspended', class: 'status-danger' },
                        'pending': { text: 'Pending', class: 'status-pending' }
                    };
                    const status = statusMap[data] || { text: data, class: 'status-default' };
                    return `<span class="status-badge ${status.class}">${status.text}</span>`;
                }
            },
            { 
                data: 'lastLogin',
                render: function(data) {
                    if (!data) return 'Never';
                    const date = new Date(data);
                    return `
                        <div>${date.toLocaleDateString()}</div>
                        <div class="last-login">${date.toLocaleTimeString()}</div>
                    `;
                }
            },
            {
                data: 'id',
                orderable: false,
                render: function(data, type, row) {
                    return `
                        <div class="action-buttons">
                            <button class="action-btn view" data-id="${data}" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" data-id="${data}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn reset-password" data-id="${data}" title="Reset Password">
                                <i class="fas fa-key"></i>
                            </button>
                            <button class="action-btn suspend" data-id="${data}" title="${row.status === 'suspended' ? 'Unsuspend' : 'Suspend'}">
                                <i class="fas ${row.status === 'suspended' ? 'fa-unlock' : 'fa-lock'}"></i>
                            </button>
                            <button class="action-btn delete" data-id="${data}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ]
    });

    // Apply filters
    $('#roleFilter, #statusFilter').on('change', function() {
        usersTable.draw();
    });

    // Custom filtering function
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            const role = $('#roleFilter').val();
            const status = $('#statusFilter').val();
            const rowData = usersTable.row(dataIndex).data();
            
            let roleMatch = true;
            let statusMatch = true;
            
            if (role) {
                roleMatch = rowData.roles && rowData.roles.includes(role);
            }
            
            if (status) {
                statusMatch = rowData.status === status;
            }
            
            return roleMatch && statusMatch;
        }
    );

    // Search functionality
    $('#searchInput').on('keyup', function() {
        usersTable.search(this.value).draw();
    });

    // Load sample data (in a real app, this would be an API call)
    loadSampleData();

    // Event Listeners
    document.getElementById('addUserBtn')?.addEventListener('click', showAddUserModal);
    document.getElementById('cancelUser')?.addEventListener('click', () => closeModal(document.getElementById('userModal')));
    document.getElementById('saveUser')?.addEventListener('click', handleUserSubmit);
    document.getElementById('userForm')?.addEventListener('submit', handleUserSubmit);
    document.getElementById('changePasswordForm')?.addEventListener('submit', handlePasswordChange);
    document.getElementById('savePermissions')?.addEventListener('click', savePermissions);
    document.getElementById('permissionRole')?.addEventListener('change', loadRolePermissions);

    // Close modal when clicking the X button or outside the modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Handle view/edit/delete buttons (delegated event listeners)
    document.addEventListener('click', function(e) {
        // View user
        if (e.target.closest('.view')) {
            const userId = e.target.closest('.view').getAttribute('data-id');
            viewUser(userId);
        }
        
        // Edit user
        if (e.target.closest('.edit')) {
            const userId = e.target.closest('.edit').getAttribute('data-id');
            editUser(userId);
        }
        
        // Reset password
        if (e.target.closest('.reset-password')) {
            const userId = e.target.closest('.reset-password').getAttribute('data-id');
            showChangePasswordModal(userId);
        }
        
        // Suspend/unsuspend user
        if (e.target.closest('.suspend')) {
            const userId = e.target.closest('.suspend').getAttribute('data-id');
            toggleUserStatus(userId);
        }
        
        // Delete user
        if (e.target.closest('.delete')) {
            const userId = e.target.closest('.delete').getAttribute('data-id');
            confirmDeleteUser(userId);
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
    let users = [];
    let permissions = {};

    // Load sample data
    function loadSampleData() {
        // Sample users
        users = [
            {
                id: 'USR001',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '(555) 123-4567',
                username: 'johndoe',
                roles: ['admin'],
                department: 'administration',
                status: 'active',
                lastLogin: '2023-10-15T14:30:00Z',
                twoFactorEnabled: true,
                createdAt: '2023-01-10T09:15:00Z',
                lastActive: '2023-10-16T08:45:00Z',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            {
                id: 'USR002',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                phone: '(555) 987-6543',
                username: 'janesmith',
                roles: ['doctor'],
                department: 'cardiology',
                status: 'active',
                lastLogin: '2023-10-16T10:20:00Z',
                twoFactorEnabled: false,
                createdAt: '2023-02-15T11:30:00Z',
                lastActive: '2023-10-16T10:25:00Z',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            {
                id: 'USR003',
                firstName: 'Robert',
                lastName: 'Johnson',
                email: 'robert.j@example.com',
                phone: '(555) 456-7890',
                username: 'rjohnson',
                roles: ['nurse'],
                department: 'emergency',
                status: 'active',
                lastLogin: '2023-10-14T16:45:00Z',
                twoFactorEnabled: true,
                createdAt: '2023-03-20T14:20:00Z',
                lastActive: '2023-10-15T09:10:00Z',
                avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
            },
            {
                id: 'USR004',
                firstName: 'Emily',
                lastName: 'Williams',
                email: 'emily.w@example.com',
                phone: '(555) 234-5678',
                username: 'emilyw',
                roles: ['staff'],
                department: 'reception',
                status: 'active',
                lastLogin: '2023-10-16T09:05:00Z',
                twoFactorEnabled: false,
                createdAt: '2023-04-05T10:45:00Z',
                lastActive: '2023-10-16T11:30:00Z',
                avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
            },
            {
                id: 'USR005',
                firstName: 'Michael',
                lastName: 'Brown',
                email: 'michael.b@example.com',
                phone: '(555) 876-5432',
                username: 'michaelb',
                roles: ['patient'],
                department: '',
                status: 'active',
                lastLogin: '2023-10-12T13:20:00Z',
                twoFactorEnabled: false,
                createdAt: '2023-05-15T08:30:00Z',
                lastActive: '2023-10-12T13:25:00Z',
                avatar: 'https://randomuser.me/api/portraits/men/52.jpg'
            },
            {
                id: 'USR006',
                firstName: 'Sarah',
                lastName: 'Miller',
                email: 'sarah.m@example.com',
                phone: '(555) 345-6789',
                username: 'sarahm',
                roles: ['doctor'],
                department: 'pediatrics',
                status: 'inactive',
                lastLogin: '2023-09-28T11:15:00Z',
                twoFactorEnabled: true,
                createdAt: '2023-06-10T13:45:00Z',
                lastActive: '2023-09-28T11:20:00Z',
                avatar: 'https://randomuser.me/api/portraits/women/36.jpg'
            },
            {
                id: 'USR007',
                firstName: 'David',
                lastName: 'Wilson',
                email: 'david.w@example.com',
                phone: '(555) 765-4321',
                username: 'davidw',
                roles: ['nurse'],
                department: 'surgery',
                status: 'suspended',
                lastLogin: '2023-08-20T14:50:00Z',
                twoFactorEnabled: false,
                createdAt: '2023-07-05T16:20:00Z',
                lastActive: '2023-08-20T14:55:00Z',
                avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
            },
            {
                id: 'USR008',
                firstName: 'Lisa',
                lastName: 'Taylor',
                email: 'lisa.t@example.com',
                phone: '(555) 123-9876',
                username: 'lisat',
                roles: ['staff', 'nurse'],
                department: 'radiology',
                status: 'pending',
                lastLogin: null,
                twoFactorEnabled: false,
                createdAt: '2023-10-10T10:00:00Z',
                lastActive: null,
                avatar: 'https://randomuser.me/api/portraits/women/51.jpg'
            }
        ];

        // Add fullName and name properties for display
        users.forEach(user => {
            user.fullName = `${user.firstName} ${user.lastName}`;
            user.name = user.fullName; // For DataTables compatibility
        });

        // Sample permissions (in a real app, this would come from an API)
        permissions = {
            admin: {
                dashboard: { view: true, edit: true, delete: true },
                users: { view: true, create: true, edit: true, delete: true },
                patients: { view: true, create: true, edit: true, delete: true },
                doctors: { view: true, create: true, edit: true, delete: true },
                appointments: { view: true, create: true, edit: true, delete: true },
                medications: { view: true, create: true, edit: true, delete: true },
                health_resources: { view: true, create: true, edit: true, delete: true },
                settings: { view: true, edit: true }
            },
            doctor: {
                dashboard: { view: true, edit: false, delete: false },
                patients: { view: true, create: true, edit: true, delete: false },
                appointments: { view: true, create: true, edit: true, delete: false },
                medications: { view: true, create: true, edit: false, delete: false }
            },
            nurse: {
                dashboard: { view: true, edit: false, delete: false },
                patients: { view: true, create: true, edit: true, delete: false },
                appointments: { view: true, create: true, edit: true, delete: false },
                medications: { view: true, create: true, edit: true, delete: false }
            },
            staff: {
                dashboard: { view: true, edit: false, delete: false },
                patients: { view: true, create: true, edit: true, delete: false },
                appointments: { view: true, create: true, edit: true, delete: false }
            },
            patient: {
                dashboard: { view: true, edit: false, delete: false },
                appointments: { view: true, create: true, edit: false, delete: false },
                medications: { view: true, create: false, edit: false, delete: false }
            }
        };

        // Populate the DataTable
        usersTable.clear().rows.add(users).draw();
    }
