// Main JavaScript for Fashion Sketch Organizer

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initializeApp();
    
    // Load initial data
    loadSketches();
    
    // Set up event listeners
    setupEventListeners();
});

// Global state
let currentPage = 'sketches';
let designers = [];
let tags = [];

// Initialize application
async function initializeApp() {
    try {
        // Load designers and tags for dropdowns
        designers = await api.designers.getAll();
        tags = await api.tags.getAll();
        
        // Populate dropdowns
        populateDesignerDropdown();
        populateTagDropdown();
    } catch (error) {
        showError('Failed to initialize application');
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            navigateToPage(page);
        });
    });

    // Sketch form
    document.getElementById('saveSketch').addEventListener('click', handleSaveSketch);
    
    // Designer form
    document.getElementById('saveDesigner').addEventListener('click', handleSaveDesigner);
    
    // Tag form
    document.getElementById('saveTag').addEventListener('click', handleSaveTag);
}

// Navigation
function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(element => {
        element.classList.add('d-none');
    });
    
    // Show selected page
    document.getElementById(`${page}-page`).classList.remove('d-none');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Load page data
    currentPage = page;
    switch (page) {
        case 'sketches':
            loadSketches();
            break;
        case 'designers':
            loadDesigners();
            break;
        case 'tags':
            loadTags();
            break;
    }
}

// Sketches
async function loadSketches() {
    try {
        const sketches = await api.sketches.getAll();
        const sketchesGrid = document.getElementById('sketches-grid');
        sketchesGrid.innerHTML = '';
        
        sketches.forEach(sketch => {
            const designer = designers.find(d => d.id === sketch.designerId);
            const sketchTags = tags.filter(t => sketch.tags.includes(t.id));
            
            const card = document.createElement('div');
            card.className = 'col';
            card.innerHTML = `
                <div class="card sketch-card">
                    <img src="${sketch.imageUrl}" class="card-img-top" alt="${sketch.title}">
                    <div class="card-body">
                        <h5 class="card-title">${sketch.title}</h5>
                        <p class="card-text">${sketch.description}</p>
                        <p class="card-text"><small class="text-muted">Designer: ${designer ? designer.name : 'Unknown'}</small></p>
                        <div class="sketch-tags">
                            ${sketchTags.map(tag => `
                                <span class="badge bg-secondary tag-badge">${tag.name}</span>
                            `).join('')}
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-primary" onclick="editSketch(${sketch.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSketch(${sketch.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            sketchesGrid.appendChild(card);
        });
    } catch (error) {
        showError('Failed to load sketches');
    }
}

// Designers
async function loadDesigners() {
    try {
        designers = await api.designers.getAll();
        const tbody = document.getElementById('designers-table-body');
        tbody.innerHTML = '';
        
        designers.forEach(designer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${designer.name}</td>
                <td>${designer.email}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editDesigner(${designer.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDesigner(${designer.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Update designer dropdowns
        populateDesignerDropdown();
    } catch (error) {
        showError('Failed to load designers');
    }
}

// Tags
async function loadTags() {
    try {
        tags = await api.tags.getAll();
        const container = document.getElementById('tags-container');
        container.innerHTML = '';
        
        tags.forEach(tag => {
            const col = document.createElement('div');
            col.className = 'col-md-3 col-sm-6 mb-3';
            col.innerHTML = `
                <div class="card tag-pill">
                    <div class="card-body">
                        <h5 class="card-title">${tag.name}</h5>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-primary" onclick="editTag(${tag.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteTag(${tag.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
        
        // Update tag dropdowns
        populateTagDropdown();
    } catch (error) {
        showError('Failed to load tags');
    }
}

// Form Handlers
async function handleSaveSketch() {
    try {
        const sketchData = {
            id: document.getElementById('sketchId').value || 0,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            imageUrl: document.getElementById('imageUrl').value,
            designerId: parseInt(document.getElementById('designerId').value),
            tags: Array.from(document.getElementById('tags').selectedOptions).map(option => parseInt(option.value))
        };
        
        if (sketchData.id) {
            await api.sketches.update(sketchData);
        } else {
            await api.sketches.create(sketchData);
        }
        
        // Close modal and reload sketches
        bootstrap.Modal.getInstance(document.getElementById('sketchModal')).hide();
        loadSketches();
        showSuccess('Sketch saved successfully');
    } catch (error) {
        showError('Failed to save sketch');
    }
}

async function handleSaveDesigner() {
    try {
        const designerData = {
            id: document.getElementById('designerId').value || 0,
            name: document.getElementById('designerName').value,
            email: document.getElementById('designerEmail').value
        };
        
        if (designerData.id) {
            await api.designers.update(designerData);
        } else {
            await api.designers.create(designerData);
        }
        
        // Close modal and reload designers
        bootstrap.Modal.getInstance(document.getElementById('designerModal')).hide();
        loadDesigners();
        showSuccess('Designer saved successfully');
    } catch (error) {
        showError('Failed to save designer');
    }
}

async function handleSaveTag() {
    try {
        const tagData = {
            id: document.getElementById('tagId').value || 0,
            name: document.getElementById('tagName').value
        };
        
        if (tagData.id) {
            await api.tags.update(tagData);
        } else {
            await api.tags.create(tagData);
        }
        
        // Close modal and reload tags
        bootstrap.Modal.getInstance(document.getElementById('tagModal')).hide();
        loadTags();
        showSuccess('Tag saved successfully');
    } catch (error) {
        showError('Failed to save tag');
    }
}

// Helper Functions
function populateDesignerDropdown() {
    const select = document.getElementById('designerId');
    select.innerHTML = '<option value="">Select Designer</option>';
    designers.forEach(designer => {
        select.innerHTML += `<option value="${designer.id}">${designer.name}</option>`;
    });
}

function populateTagDropdown() {
    const select = document.getElementById('tags');
    select.innerHTML = '';
    tags.forEach(tag => {
        select.innerHTML += `<option value="${tag.id}">${tag.name}</option>`;
    });
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').prepend(alert);
    setTimeout(() => alert.remove(), 5000);
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').prepend(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Edit Functions
function editSketch(id) {
    const sketch = sketches.find(s => s.id === id);
    if (sketch) {
        document.getElementById('sketchId').value = sketch.id;
        document.getElementById('title').value = sketch.title;
        document.getElementById('description').value = sketch.description;
        document.getElementById('imageUrl').value = sketch.imageUrl;
        document.getElementById('designerId').value = sketch.designerId;
        
        const tagSelect = document.getElementById('tags');
        Array.from(tagSelect.options).forEach(option => {
            option.selected = sketch.tags.includes(parseInt(option.value));
        });
        
        new bootstrap.Modal(document.getElementById('sketchModal')).show();
    }
}

function editDesigner(id) {
    const designer = designers.find(d => d.id === id);
    if (designer) {
        document.getElementById('designerId').value = designer.id;
        document.getElementById('designerName').value = designer.name;
        document.getElementById('designerEmail').value = designer.email;
        
        new bootstrap.Modal(document.getElementById('designerModal')).show();
    }
}

function editTag(id) {
    const tag = tags.find(t => t.id === id);
    if (tag) {
        document.getElementById('tagId').value = tag.id;
        document.getElementById('tagName').value = tag.name;
        
        new bootstrap.Modal(document.getElementById('tagModal')).show();
    }
}
