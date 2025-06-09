// Main JavaScript for Fashion Sketch Organizer

// State management
let currentPage = 'home';
let designers = [];
let tags = [];
let sketches = [];

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
    setupEventListeners();
});

// Initialize application
async function initApp() {
    try {
        // Load initial data
        await Promise.all([
            loadSketches(),
            loadDesigners(),
            loadTags()
        ]);
        
        // Show home page by default
        showPage('home');
        
        // Update dashboard if we have data
        updateDashboard();
    } catch (error) {
        showAlert('Failed to initialize application', 'danger');
    }
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            showPage(page);
        });
    });

    // Modal forms
    document.getElementById('saveSketch')?.addEventListener('click', handleSaveSketch);
    document.getElementById('saveDesigner')?.addEventListener('click', handleSaveDesigner);
    document.getElementById('saveTag')?.addEventListener('click', handleSaveTag);

    // Feature cards click handlers
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const page = card.dataset.page;
            if (page) showPage(page);
        });
    });
}

// Show/Hide Pages
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.add('d-none');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.classList.remove('d-none');
        currentPage = pageName;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            }
        });
        
        // Refresh page data
        if (pageName === 'dashboard') {
            updateDashboard();
        } else if (pageName === 'sketches') {
            renderSketches();
        } else if (pageName === 'designers') {
            renderDesigners();
        } else if (pageName === 'tags') {
            renderTags();
        }
    }
}

// Load initial data
async function loadInitialData() {
    try {
        const [designersData, tagsData, sketchesData] = await Promise.all([
            api.designers.getAll(),
            api.tags.getAll(),
            api.sketches.getAll()
        ]);

        designers = designersData;
        tags = tagsData;
        sketches = sketchesData;

        updateDropdowns();
        renderCurrentPage();
    } catch (error) {
        showAlert('Failed to load initial data', 'danger');
    }
}

// Rendering Functions
function renderSketches() {
    const container = document.getElementById('sketches-list');
    container.innerHTML = sketches.map(sketch => {
        const designer = designers.find(d => d.id === sketch.designerId);
        const sketchTags = tags.filter(t => sketch.tags.includes(t.id));
        
        return `
            <div class="col">
                <div class="card sketch-card">
                    <img src="${sketch.imageUrl}" class="card-img-top" alt="${sketch.title}">
                    <div class="card-body">
                        <h5 class="card-title">${sketch.title}</h5>
                        <p class="card-text">${sketch.description}</p>
                        <p class="card-text"><small class="text-muted">By ${designer ? designer.name : 'Unknown'}</small></p>
                        <div class="sketch-tags mb-3">
                            ${sketchTags.map(tag => `
                                <span class="badge bg-secondary">${tag.name}</span>
                            `).join('')}
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-primary" onclick="editSketch(${sketch.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSketch(${sketch.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderDesigners() {
    const container = document.getElementById('designers-list');
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Sketches</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${designers.map(designer => {
                    const sketchCount = sketches.filter(s => s.designerId === designer.id).length;
                    return `
                        <tr>
                            <td>${designer.name}</td>
                            <td>${designer.email}</td>
                            <td>${sketchCount}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="editDesigner(${designer.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteDesigner(${designer.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderTags() {
    const container = document.getElementById('tags-list');
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tag Name</th>
                    <th>Sketch ID</th>
                    <th>Used In</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tags.map(tag => {
                    const sketchCount = sketches.filter(s => s.tags.includes(tag.id)).length;
                    return `
                        <tr>
                            <td>${tag.id}</td>
                            <td>${tag.TagName}</td>
                            <td>${tag.SketchId}</td>
                            <td><span class="badge bg-primary">${sketchCount} sketches</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="editTag(${tag.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteTag(${tag.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Form Handlers
async function handleSaveSketch() {
    try {
        const sketchData = {
            id: document.getElementById('sketchId').value || 0,
            title: document.getElementById('sketchTitle').value,
            description: document.getElementById('sketchDescription').value,
            imageUrl: document.getElementById('sketchImageUrl').value,
            designerId: parseInt(document.getElementById('sketchDesigner').value),
            tags: Array.from(document.getElementById('sketchTags').selectedOptions).map(opt => parseInt(opt.value))
        };
        
        if (sketchData.id) {
            await api.sketches.update(sketchData);
        } else {
            await api.sketches.create(sketchData);
        }
        
        await loadSketches();
        if (currentPage === 'dashboard') {
            updateDashboard();
        } else if (currentPage === 'sketches') {
            renderSketches();
        }
        closeModal('sketchModal');
        showAlert('Sketch saved successfully', 'success');
    } catch (error) {
        showAlert('Failed to save sketch', 'danger');
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
        
        await loadDesigners();
        if (currentPage === 'dashboard') {
            updateDashboard();
        } else if (currentPage === 'designers') {
            renderDesigners();
        }
        closeModal('designerModal');
        showAlert('Designer saved successfully', 'success');
    } catch (error) {
        showAlert('Failed to save designer', 'danger');
    }
}

async function handleSaveTag() {
    try {
        const tagData = {
            id: document.getElementById('tagId').value || 0,
            TagName: document.getElementById('tagName').value,
            SketchId: parseInt(document.getElementById('sketchId').value)
        };
        
        if (tagData.id) {
            await api.tags.update(tagData);
        } else {
            await api.tags.create(tagData);
        }
        
        await loadTags();
        if (currentPage === 'dashboard') {
            updateDashboard();
        } else if (currentPage === 'tags') {
            renderTags();
        }
        closeModal('tagModal');
        showAlert('Tag saved successfully', 'success');
    } catch (error) {
        showAlert('Failed to save tag', 'danger');
    }
}

// Edit Functions
function editSketch(id) {
    const sketch = sketches.find(s => s.id === id);
    if (sketch) {
        document.getElementById('sketchId').value = sketch.id;
        document.getElementById('sketchTitle').value = sketch.title;
        document.getElementById('sketchDescription').value = sketch.description;
        document.getElementById('sketchImageUrl').value = sketch.imageUrl;
        document.getElementById('sketchDesigner').value = sketch.designerId;
        
        const tagSelect = document.getElementById('sketchTags');
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

// Delete Functions
async function deleteSketch(id) {
    if (confirm('Are you sure you want to delete this sketch?')) {
        try {
            await api.sketches.delete(id);
            await loadSketches();
            if (currentPage === 'dashboard') {
                updateDashboard();
            } else if (currentPage === 'sketches') {
                renderSketches();
            }
            showAlert('Sketch deleted successfully', 'success');
        } catch (error) {
            showAlert('Failed to delete sketch', 'danger');
        }
    }
}

async function deleteDesigner(id) {
    if (confirm('Are you sure you want to delete this designer?')) {
        try {
            await api.designers.delete(id);
            await loadDesigners();
            if (currentPage === 'dashboard') {
                updateDashboard();
            } else if (currentPage === 'designers') {
                renderDesigners();
            }
            showAlert('Designer deleted successfully', 'success');
        } catch (error) {
            showAlert('Failed to delete designer', 'danger');
        }
    }
}

async function deleteTag(id) {
    if (confirm('Are you sure you want to delete this tag?')) {
        try {
            await api.tags.delete(id);
            await loadTags();
            if (currentPage === 'dashboard') {
                updateDashboard();
            } else if (currentPage === 'tags') {
                renderTags();
            }
            showAlert('Tag deleted successfully', 'success');
        } catch (error) {
            showAlert('Failed to delete tag', 'danger');
        }
    }
}

// Dashboard Functions
async function updateDashboard() {
    try {
        // Update statistics
        document.getElementById('totalSketches').textContent = sketches.length;
        document.getElementById('totalDesigners').textContent = designers.length;
        document.getElementById('totalTags').textContent = tags.length;
        
        // Update recent sketches
        updateRecentSketches();
        
        // Update top designers
        updateTopDesigners();
    } catch (error) {
        showAlert('Failed to update dashboard', 'danger');
    }
}

function updateRecentSketches() {
    const recentSketchesContainer = document.getElementById('recentSketches');
    const recentSketches = sketches.slice(-4); // Get 4 most recent sketches
    
    recentSketchesContainer.innerHTML = recentSketches.map(sketch => {
        const designer = designers.find(d => d.id === sketch.designerId);
        const sketchTags = tags.filter(t => sketch.tags.includes(t.id));
        
        return `
            <div class="col">
                <div class="card sketch-card h-100">
                    <img src="${sketch.imageUrl}" class="card-img-top" alt="${sketch.title}">
                    <div class="card-body">
                        <h5 class="card-title">${sketch.title}</h5>
                        <p class="card-text">${sketch.description}</p>
                        <p class="card-text"><small class="text-muted">By ${designer ? designer.name : 'Unknown'}</small></p>
                        <div class="sketch-tags">
                            ${sketchTags.map(tag => 
                                `<span class="badge bg-secondary">${tag.name}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateTopDesigners() {
    const topDesignersContainer = document.getElementById('topDesigners');
    const designerStats = designers.map(designer => {
        const sketchCount = sketches.filter(s => s.designerId === designer.id).length;
        return { ...designer, sketchCount };
    }).sort((a, b) => b.sketchCount - a.sketchCount).slice(0, 5);
    
    topDesignersContainer.innerHTML = designerStats.map(designer => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${designer.name}
            <span class="badge bg-primary rounded-pill">${designer.sketchCount} sketches</span>
        </li>
    `).join('');
}

// Data Loading Functions
async function loadSketches() {
    try {
        sketches = await api.sketches.getAll();
        return sketches;
    } catch (error) {
        showAlert('Failed to load sketches', 'danger');
        throw error;
    }
}

async function loadDesigners() {
    try {
        designers = await api.designers.getAll();
        return designers;
    } catch (error) {
        showAlert('Failed to load designers', 'danger');
        throw error;
    }
}

async function loadTags() {
    try {
        tags = await api.tags.getAll();
        return tags;
    } catch (error) {
        showAlert('Failed to load tags', 'danger');
        throw error;
    }
}

// Utility Functions
function showAlert(message, type = 'info') {
    const alertElement = document.getElementById('alert');
    alertElement.className = `alert alert-${type} fade show`;
    alertElement.textContent = message;
    alertElement.classList.remove('d-none');
    
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 3000);
}

function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance?.hide();
}
