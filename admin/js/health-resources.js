document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize Quill editor
    const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write your health resource content here...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image', 'video'],
                ['clean']
            ]
        }
    });

    // Initialize Select2 for multi-select categories
    $('#resourceCategories').select2({
        placeholder: 'Select categories',
        width: '100%',
        closeOnSelect: false
    });

    // Initialize DataTable
    const resourcesTable = $('#resourcesTable').DataTable({
        responsive: true,
        order: [[4, 'desc']], // Sort by publish date by default (newest first)
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        language: {
            search: "",
            searchPlaceholder: "Search resources...",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ resources",
            infoEmpty: "No resources found",
            infoFiltered: "(filtered from _MAX_ total resources)",
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
                data: 'title',
                render: function(data, type, row) {
                    return `
                        <div style="font-weight: 600;">${data}</div>
                        <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">
                            ${row.summary.length > 80 ? row.summary.substring(0, 80) + '...' : row.summary}
                        </div>
                    `;
                }
            },
            { 
                data: 'author',
                render: function(data) {
                    return data || 'N/A';
                }
            },
            { 
                data: 'categories',
                render: function(data) {
                    if (!data || data.length === 0) return 'N/A';
                    return data.map(cat => 
                        `<span class="category-tag">${formatCategory(cat)}</span>`
                    ).join(' ');
                }
            },
            { 
                data: 'publishDate',
                render: function(data) {
                    return data ? formatDate(data) : 'Draft';
                }
            },
            { 
                data: 'status',
                render: function(data) {
                    const statusMap = {
                        'published': { text: 'Published', class: 'status-completed' },
                        'draft': { text: 'Draft', class: 'status-warning' },
                        'archived': { text: 'Archived', class: 'status-cancelled' }
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
                            <button class="action-btn view-resource" data-id="${data}" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit-resource" data-id="${data}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete delete-resource" data-id="${data}" title="Delete">
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
        resourcesTable.draw();
    });

    // Custom filtering function
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            const category = $('#categoryFilter').val();
            const status = $('#statusFilter').val();
            const rowData = resourcesTable.row(dataIndex).data();
            
            let categoryMatch = true;
            let statusMatch = true;
            
            if (category) {
                categoryMatch = rowData.categories && rowData.categories.includes(category);
            }
            
            if (status) {
                statusMatch = rowData.status === status;
            }
            
            return categoryMatch && statusMatch;
        }
    );

    // Search functionality
    $('#searchInput').on('keyup', function() {
        resourcesTable.search(this.value).draw();
    });

    // Character counter for summary
    document.getElementById('resourceSummary').addEventListener('input', function() {
        document.getElementById('summaryCharCount').textContent = this.value.length;
    });

    // Featured image upload preview
    document.getElementById('featuredImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.getElementById('imagePreview');
                img.src = event.target.result;
                img.style.display = 'block';
                document.getElementById('fileName').textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    // Load sample data (in a real app, this would be an API call)
    loadSampleData();

    // Event Listeners
    document.getElementById('addResourceBtn').addEventListener('click', showAddResourceModal);
    document.getElementById('cancelResource').addEventListener('click', () => closeModal(document.getElementById('resourceModal')));
    document.getElementById('saveDraft').addEventListener('click', saveAsDraft);
    document.getElementById('publishResource').addEventListener('click', publishResource);
    document.getElementById('resourceForm').addEventListener('submit', handleResourceSubmit);

    // Close modal when clicking the X button or outside the modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Handle view/edit/delete buttons (delegated event listeners)
    document.addEventListener('click', function(e) {
        // View resource
        if (e.target.closest('.view-resource')) {
            const resourceId = e.target.closest('.view-resource').getAttribute('data-id');
            viewResource(resourceId);
        }
        
        // Edit resource
        if (e.target.closest('.edit-resource')) {
            const resourceId = e.target.closest('.edit-resource').getAttribute('data-id');
            editResource(resourceId);
        }
        
        // Delete resource
        if (e.target.closest('.delete-resource')) {
            const resourceId = e.target.closest('.delete-resource').getAttribute('data-id');
            confirmDeleteResource(resourceId);
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
    let resources = [];
    let authors = [];

    // Load sample data
    function loadSampleData() {
        // Sample authors (in a real app, this would come from an API)
        authors = [
            { id: 'AUTH001', name: 'Dr. Sarah Johnson', role: 'Chief Medical Officer' },
            { id: 'AUTH002', name: 'Dr. Michael Chen', role: 'Neurologist' },
            { id: 'AUTH003', name: 'Dr. Lisa Wong', role: 'Pediatrician' },
            { id: 'AUTH004', name: 'Admin User', role: 'Administrator' }
        ];

        // Sample resources
        resources = [
            {
                id: 'RES001',
                title: 'Understanding and Managing Stress',
                summary: 'Learn effective strategies to manage stress and improve your mental well-being.',
                content: '<h2>Understanding Stress</h2><p>Stress is a natural response to challenges or demands. While short-term stress can be beneficial, chronic stress can have negative effects on your health.</p><h3>Common Symptoms of Stress</h3><ul><li>Headaches</li><li>Muscle tension</li><li>Sleep problems</li><li>Anxiety</li><li>Irritability</li></ul>',
                author: 'Dr. Sarah Johnson',
                authorId: 'AUTH001',
                categories: ['mental-health', 'general'],
                tags: ['stress', 'mental health', 'wellness'],
                status: 'published',
                publishDate: '2023-10-15T09:30:00',
                lastUpdated: '2023-10-15T09:30:00',
                featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06ba85b0d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                views: 1245,
                likes: 89
            },
            {
                id: 'RES002',
                title: 'The Importance of Regular Exercise',
                summary: 'Discover the numerous health benefits of maintaining an active lifestyle.',
                content: '<h2>Benefits of Regular Exercise</h2><p>Regular physical activity is one of the most important things you can do for your health. It can help:</p><ul><li>Control your weight</li><li>Reduce your risk of heart disease</li><li>Strengthen your bones and muscles</li><li>Improve your mental health and mood</li><li>Increase your chances of living longer</li></ul>',
                author: 'Dr. Michael Chen',
                authorId: 'AUTH002',
                categories: ['fitness', 'preventive-care'],
                tags: ['exercise', 'fitness', 'health'],
                status: 'published',
                publishDate: '2023-10-10T14:15:00',
                lastUpdated: '2023-10-10T14:15:00',
                featuredImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f724?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                views: 982,
                likes: 76
            },
            {
                id: 'RES003',
                title: 'Nutrition Guide for a Healthy Heart',
                summary: 'Learn which foods can help improve your heart health and reduce the risk of heart disease.',
                content: '<h2>Heart-Healthy Foods</h2><p>Eating a healthy diet can help protect your heart, improve your blood pressure and cholesterol, and reduce your risk of type 2 diabetes.</p><h3>Top Heart-Healthy Foods</h3><ul><li>Leafy green vegetables</li><li>Whole grains</li><li>Berries</li><li>Avocados</li><li>Fatty fish and fish oil</li><li>Walnuts</li><li>Beans</li><li>Dark chocolate</li></ul>',
                author: 'Dr. Lisa Wong',
                authorId: 'AUTH003',
                categories: ['nutrition', 'preventive-care', 'chronic-conditions'],
                tags: ['nutrition', 'heart health', 'diet'],
                status: 'published',
                publishDate: '2023-10-05T11:20:00',
                lastUpdated: '2023-10-05T11:20:00',
                featuredImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                views: 1567,
                likes: 112
            },
            {
                id: 'RES004',
                title: 'First Aid: Choking in Adults',
                summary: 'Step-by-step guide on how to help someone who is choking.',
                content: '<h2>How to Help a Choking Adult</h2><p>If someone is choking, quick action can be life-saving. Follow these steps:</p><ol><li>Determine if the person can speak or cough. If they can, encourage them to cough.</li><li>If they cannot speak, cough, or breathe, perform abdominal thrusts (Heimlich maneuver).</li><li>Continue abdominal thrusts until the object is expelled or the person becomes unconscious.</li><li>If the person becomes unconscious, begin CPR.</li></ol>',
                author: 'Admin User',
                authorId: 'AUTH004',
                categories: ['first-aid'],
                tags: ['first aid', 'choking', 'emergency'],
                status: 'published',
                publishDate: '2023-09-28T16:45:00',
                lastUpdated: '2023-09-28T16:45:00',
                featuredImage: 'https://images.unsplash.com/photo-1584634731339-252c58fcf9e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                views: 2034,
                likes: 145
            },
            {
                id: 'RES005',
                title: 'Managing Diabetes: A Comprehensive Guide',
                summary: 'Understanding diabetes and how to manage it effectively for a better quality of life.',
                content: '<h2>Understanding Diabetes</h2><p>Diabetes is a chronic condition that affects how your body turns food into energy. There are three main types of diabetes: type 1, type 2, and gestational diabetes.</p><h3>Managing Your Diabetes</h3><p>Effective diabetes management includes:</p><ul><li>Monitoring your blood sugar</li><li>Eating a healthy diet</li><li>Getting regular physical activity</li><li>Taking medications as prescribed</li><li>Managing stress</li><li>Regular check-ups with your healthcare team</li></ul>',
                author: 'Dr. Sarah Johnson',
                authorId: 'AUTH001',
                categories: ['chronic-conditions', 'nutrition'],
                tags: ['diabetes', 'chronic disease', 'health management'],
                status: 'draft',
                publishDate: null,
                lastUpdated: '2023-10-16T10:15:00',
                featuredImage: 'https://images.unsplash.com/photo-1532938914889-a3aeec8a04e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                views: 0,
                likes: 0
            }
        ];

        // Populate the DataTable
        resourcesTable.clear().rows.add(resources).draw();

        // Populate author dropdown
        populateAuthorDropdown();
    }

    // Populate author dropdown
    function populateAuthorDropdown() {
        const authorSelect = document.getElementById('resourceAuthor');
        
        // Clear existing options except the first one
        while (authorSelect.options.length > 1) authorSelect.remove(1);

        // Add author options
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author.id;
            option.textContent = author.name;
            authorSelect.appendChild(option);
        });
    }

    // Show add resource modal
    function showAddResourceModal() {
        document.getElementById('modalTitle').textContent = 'New Resource';
        document.getElementById('resourceForm').reset();
        document.getElementById('resourceStatus').value = 'draft';
        document.getElementById('publishDate').value = new Date().toISOString().slice(0, 16);
        quill.root.innerHTML = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('fileName').textContent = 'No file chosen';
        document.getElementById('summaryCharCount').textContent = '0';
        
        // Reset Select2 dropdowns
        $('#resourceCategories').val(null).trigger('change');
        
        // Remove any stored resource ID
        document.getElementById('resourceForm').dataset.resourceId = '';
        
        openModal(document.getElementById('resourceModal'));
    }

    // View resource
    function viewResource(resourceId) {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return;

        const modal = document.getElementById('viewResourceModal');
        const preview = document.getElementById('resourcePreview');
        
        // Format date
        const publishDate = resource.publishDate ? 
            new Date(resource.publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Not published';
        
        // Create HTML for resource preview
        preview.innerHTML = `
            <article class="resource-preview">
                <h3>${resource.title}</h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <strong>Author:</strong> ${resource.author}<br>
                        <strong>Published:</strong> ${publishDate}
                    </div>
                    <span class="status-badge ${resource.status === 'published' ? 'status-completed' : 'status-warning'}">
                        ${resource.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                </div>
                
                ${resource.featuredImage ? `<img src="${resource.featuredImage}" alt="${resource.title}" style="width: 100%; max-height: 300px; object-fit: cover;">` : ''}
                
                <div class="resource-categories">
                    ${resource.categories.map(cat => 
                        `<span class="category-tag">${formatCategory(cat)}</span>`
                    ).join('')}
                </div>
                
                <div style="margin: 1.5rem 0;">
                    <h4>Summary</h4>
                    <p>${resource.summary}</p>
                </div>
                
                <div style="margin: 1.5rem 0;">
                    <h4>Content</h4>
                    <div class="resource-content">${resource.content}</div>
                </div>
                
                ${resource.tags && resource.tags.length > 0 ? `
                <div style="margin: 1.5rem 0;">
                    <strong>Tags:</strong> 
                    ${resource.tags.map(tag => `#${tag}`).join(' ')}
                </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                    <div>
                        <i class="fas fa-eye"></i> ${resource.views} views
                        <span style="margin-left: 1rem;">
                            <i class="fas fa-heart" style="color: #ef4444;"></i> ${resource.likes} likes
                        </span>
                    </div>
                    <div>
                        <button type="button" class="btn btn-outline close-modal" style="margin-right: 0.5rem;">
                            Close
                        </button>
                        <button type="button" class="btn btn-primary" onclick="editResource('${resource.id}')">
                            <i class="fas fa-edit"></i> Edit Resource
                        </button>
                    </div>
                </div>
            </article>
        `;
        
        // Add event listener to close button
        preview.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
        
        openModal(modal);
    }

    // Edit resource
    function editResource(resourceId) {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return;

        document.getElementById('modalTitle').textContent = 'Edit Resource';
        
        // Set form values
        document.getElementById('resourceTitle').value = resource.title || '';
        document.getElementById('resourceAuthor').value = resource.authorId || '';
        document.getElementById('resourceSummary').value = resource.summary || '';
        document.getElementById('summaryCharCount').textContent = resource.summary ? resource.summary.length : '0';
        document.getElementById('resourceStatus').value = resource.status || 'draft';
        document.getElementById('resourceTags').value = resource.tags ? resource.tags.join(', ') : '';
        
        // Set categories in Select2
        if (resource.categories && resource.categories.length > 0) {
            $('#resourceCategories').val(resource.categories).trigger('change');
        }
        
        // Set publish date
        if (resource.publishDate) {
            const date = new Date(resource.publishDate);
            const formattedDate = date.toISOString().slice(0, 16);
            document.getElementById('publishDate').value = formattedDate;
        } else {
            document.getElementById('publishDate').value = '';
        }
        
        // Set content in Quill editor
        quill.root.innerHTML = resource.content || '';
        
        // Set featured image preview if exists
        const imagePreview = document.getElementById('imagePreview');
        if (resource.featuredImage) {
            imagePreview.src = resource.featuredImage;
            imagePreview.style.display = 'block';
            document.getElementById('fileName').textContent = 'Current image';
        } else {
            imagePreview.style.display = 'none';
            document.getElementById('fileName').textContent = 'No file chosen';
        }
        
        // Store the resource ID in the form for reference
        document.getElementById('resourceForm').dataset.resourceId = resourceId;
        
        openModal(document.getElementById('resourceModal'));
    }

    // Save as draft
    function saveAsDraft(e) {
        e.preventDefault();
        saveResource('draft');
    }

    // Publish resource
    function publishResource(e) {
        e.preventDefault();
        saveResource('published');
    }

    // Handle form submission
    function handleResourceSubmit(e) {
        e.preventDefault();
        const status = document.getElementById('resourceStatus').value;
        saveResource(status);
    }

    // Save resource (shared between save as draft and publish)
    function saveResource(status) {
        const form = document.getElementById('resourceForm');
        const resourceId = form.dataset.resourceId || `RES${String(Math.floor(1000 + Math.random() * 9000))}`;
        const isEditMode = !!form.dataset.resourceId;
        
        // Get form values
        const title = document.getElementById('resourceTitle').value.trim();
        const authorId = document.getElementById('resourceAuthor').value;
        const summary = document.getElementById('resourceSummary').value.trim();
        const categories = $('#resourceCategories').val() || [];
        const tags = document.getElementById('resourceTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        const publishDate = status === 'published' ? 
            (document.getElementById('publishDate').value || new Date().toISOString()) : 
            null;
        
        // Get content from Quill editor
        const content = quill.root.innerHTML;
        
        // Get author info
        const author = authors.find(a => a.id === authorId);
        
        // Validate form
        if (!title || !authorId || !summary || categories.length === 0 || !content) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create or update resource
        const resource = {
            id: resourceId,
            title: title,
            summary: summary,
            content: content,
            author: author ? author.name : 'Unknown',
            authorId: authorId,
            categories: categories,
            tags: tags,
            status: status,
            publishDate: publishDate,
            lastUpdated: new Date().toISOString(),
            views: isEditMode ? resources.find(r => r.id === resourceId)?.views || 0 : 0,
            likes: isEditMode ? resources.find(r => r.id === resourceId)?.likes || 0 : 0
        };
        
        // Handle featured image (in a real app, this would upload the file)
        const imageInput = document.getElementById('featuredImage');
        if (imageInput.files.length > 0) {
            // In a real app, upload the file and get the URL
            // For now, we'll just store a placeholder
            resource.featuredImage = 'https://via.placeholder.com/800x450?text=Featured+Image';
        } else if (isEditMode) {
            // Keep existing image if not changed
            const existingResource = resources.find(r => r.id === resourceId);
            if (existingResource && existingResource.featuredImage) {
                resource.featuredImage = existingResource.featuredImage;
            }
        }
        
        if (isEditMode) {
            // Update existing resource
            const index = resources.findIndex(r => r.id === resourceId);
            if (index !== -1) {
                resources[index] = resource;
            }
            showNotification('Resource updated successfully', 'success');
        } else {
            // Add new resource
            resources.push(resource);
            showNotification('Resource saved successfully', 'success');
        }
        
        // Update the DataTable
        resourcesTable.clear().rows.add(resources).draw();
        
        // Close the modal if published, keep open if saved as draft
        if (status === 'published') {
            closeModal(document.getElementById('resourceModal'));
        } else {
            // Keep the modal open but show success message
            showNotification('Draft saved successfully', 'success');
        }
    }

    // Confirm delete resource
    function confirmDeleteResource(resourceId) {
        if (confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
            deleteResource(resourceId);
        }
    }

    // Delete resource
    function deleteResource(resourceId) {
        const index = resources.findIndex(r => r.id === resourceId);
        if (index !== -1) {
            resources.splice(index, 1);
            resourcesTable.clear().rows.add(resources).draw();
            showNotification('Resource deleted successfully', 'success');
        }
    }

    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Helper function to format category
    function formatCategory(category) {
        if (!category) return '';
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
    window.editResource = editResource;
});
