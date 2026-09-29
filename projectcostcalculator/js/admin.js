// admin.js - Admin Dashboard Interactions

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof syncFirebaseToLocal === 'function') await syncFirebaseToLocal();

    renderMasterDataEditor();

    document.getElementById('btn-save-master').addEventListener('click', saveChanges);
});

function renderMasterDataEditor() {
    const container = document.getElementById('masterAccordion');
    try {
        const db = getMasterData();
        if (!db) throw new Error("getMasterData() returned null");
        
        let html = '';
        let index = 0;

    for (const category in db) {
        if (category === 'panelProducts' || category === 'inverterProducts' || category === 'inverters' || category === 'profitMargins') continue; 
        
        index++;
        const categoryData = db[category];
        
        const isSupplyOrService = category === 'supply' || category === 'service';
        const addBtnHtml = isSupplyOrService ? 
            `<button class="btn btn-sm btn-outline-primary ms-3 btn-add-comp" data-cat="${category}">
                <i class="fa-solid fa-plus"></i> Add New Item
            </button>` : '';        
        
        html += `
        <div class="accordion-item border-0 border-bottom">
            <h2 class="accordion-header d-flex align-items-center">
                <button class="accordion-button ${index === 1 ? '' : 'collapsed'} bg-transparent fw-bold flex-grow-1" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                    ${category === 'ratioLimits' ? 'SYSTEM SETTINGS (RATIOS)' : category === 'profitMargins' ? 'PROFIT MARGINS MASTER' : category.toUpperCase() + ' MASTER'}
                </button>
                ${addBtnHtml}
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse ${index === 1 ? 'show' : ''}" data-bs-parent="#masterAccordion">
                <div class="accordion-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-borderless align-middle mb-0" style="font-size: 0.85rem;">
                            <thead class="table-light text-muted small">
                                <tr>
                                    <th>${category === 'ratioLimits' ? 'Parameter' : 'Component'}</th>
                                    <th style="width: 200px;">${category === 'ratioLimits' ? 'Value' : 'Base Price'}</th>
                                    ${category !== 'ratioLimits' ? '<th style="width: 150px;">GST %</th>' : ''}
                                    ${category === 'supply' ? '<th style="width: 250px;">Category</th>' : ''}
                                    ${category !== 'ratioLimits' ? '<th style="width: 80px;"></th>' : ''}
                                </tr>
                            </thead>
                            <tbody>
        `;

        if (category === 'supply') {
            const groups = {};
            for (const item in categoryData) {
                const c = categoryData[item].category || 'Uncategorized';
                if (!groups[c]) groups[c] = [];
                groups[c].push(item);
            }
            
            // Sort categories for consistent display
            const validCats = DEFAULT_MASTER_DATA.SUPPLY_CATEGORIES || [];
            const sortedCategories = validCats.length > 0 ? validCats : Object.keys(groups).sort();
            
            sortedCategories.forEach(c => {
                if (groups[c] && groups[c].length > 0) {
                    const cSafe = c.replace(/[^a-zA-Z0-9]/g, '-');
                    html += `
                        <tr onclick="toggleCategory('${cSafe}')" style="cursor: pointer;">
                            <td colspan="5" class="fw-bold bg-light text-primary border-bottom border-top py-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span><i class="fa-solid fa-layer-group me-2"></i>${c}</span>
                                    <i id="icon-${cSafe}" class="fa-solid fa-chevron-down text-muted small"></i>
                                </div>
                            </td>
                        </tr>
                    `;
                    groups[c].forEach(item => {
                        const rowHtml = generateAdminRow(category, item, categoryData[item], validCats);
                        html += rowHtml.replace('<tr', `<tr class="cat-row-${cSafe}" style="display: none;"`);
                    });
                }
            });
        } else {
            for (const item in categoryData) {
                html += generateAdminRow(category, item, categoryData[item], []);
            }
        }

        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
    }

    container.innerHTML = html;
    
    // Attach listeners dynamically
    document.querySelectorAll('.admin-input').forEach(el => {
        el.addEventListener('change', saveChanges);
    });
} catch (e) {
    console.error("Admin render error:", e);
    if (container) container.innerHTML = `<div class="alert alert-danger m-3"><b>Error loading data:</b> ${e.message}</div>`;
}
}

window.toggleCategory = function(catId) {
    const rows = document.querySelectorAll(`.cat-row-${catId}`);
    const icon = document.getElementById(`icon-${catId}`);
    let isHidden = false;
    rows.forEach(row => {
        if (row.style.display === 'none') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
            isHidden = true;
        }
    });
    if (icon) {
        icon.className = isHidden ? 'fa-solid fa-chevron-down text-muted small' : 'fa-solid fa-chevron-up text-muted small';
    }
};

function generateAdminRow(category, item, data, supplyCategories) {
    if (category === 'ratioLimits') {
        return `
            <tr>
                <td class="fw-medium text-dark">${item}</td>
                <td>
                    <div class="input-group input-group-sm">
                        <input type="number" step="0.01" class="form-control fw-bold admin-input" 
                            value="${data}" 
                            data-cat="${category}" data-item="${item}">
                    </div>
                </td>
            </tr>`;
    }

    const gst = data.gst !== undefined ? data.gst : 0;
    
    let catSelectHtml = '';
    if (category === 'supply') {
        const optionsHtml = supplyCategories.map(c => 
            `<option value="${c}" ${data.category === c ? 'selected' : ''}>${c}</option>`
        ).join('');
        
        catSelectHtml = `
        <td>
            <select class="form-select form-select-sm admin-input-select" data-cat="${category}" data-item="${item}" data-prop="category">
                ${optionsHtml}
            </select>
        </td>`;
    }

    return `
            <tr>
                <td class="fw-medium text-dark">${item}</td>
                <td>
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-white border-end-0 text-muted">₹</span>
                        <input type="number" class="form-control border-start-0 fw-bold admin-input" 
                            value="${data.price}" 
                            data-cat="${category}" data-item="${item}" data-prop="price">
                    </div>
                </td>
                <td>
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control admin-input" 
                            value="${gst}" 
                            data-cat="${category}" data-item="${item}" data-prop="gst">
                        <span class="input-group-text bg-light text-muted">%</span>
                    </div>
                </td>
                ${catSelectHtml}
                <td>
                    <div class="d-flex gap-1 justify-content-end">
                        <button class="btn btn-sm btn-outline-primary border-0" onclick="editComponent('${category}', '${item}')" title="Rename Component">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteComponent('${category}', '${item}')" title="Delete Component">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
}

function saveChanges() {
    const db = getMasterData();
    const inputs = document.querySelectorAll('.admin-input');
    
    inputs.forEach(input => {
        const cat = input.dataset.cat;
        const item = input.dataset.item;
        const prop = input.dataset.prop;
        const val = input.tagName === 'SELECT' ? input.value : parseFloat(input.value) || 0;
        
        if (cat === 'ratioLimits' || cat === 'profitMargins') {
            db[cat][item] = val;
        } else if (prop) {
            if (!db[cat][item]) db[cat][item] = {};
            db[cat][item][prop] = val;
        }
    });

    document.querySelectorAll('.admin-input-select').forEach(input => {
        const cat = input.dataset.cat;
        const item = input.dataset.item;
        const prop = input.dataset.prop;
        const val = input.value;
        if (prop) {
            if (!db[cat][item]) db[cat][item] = {};
            db[cat][item][prop] = val;
        }
    });

    saveMasterData(db);
    
    const btn = document.getElementById('btn-save-master');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
    btn.classList.replace('btn-success', 'btn-dark');
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';
        btn.classList.replace('btn-dark', 'btn-success');
    }, 2000);
}

// Delete Component
window.deleteComponent = function(cat, item) {
    if (confirm(`Are you sure you want to permanently delete "${item}"? This will also remove it from any associated BOMs.`)) {
        const db = getMasterData();
        if (db[cat] && db[cat][item]) {
            delete db[cat][item];
            saveMasterData(db);
            renderMasterDataEditor(); // Refresh UI
        }
    }
};

// Edit Component Name
window.editComponent = function(cat, oldItem) {
    const newItem = prompt(`Enter new name for "${oldItem}":`, oldItem);
    if (newItem && newItem.trim() !== '' && newItem !== oldItem) {
        const trimmedNew = newItem.trim();
        const db = getMasterData();
        
        if (db[cat][trimmedNew]) {
            alert(`A component named "${trimmedNew}" already exists!`);
            return;
        }

        // 1. Rename in Master DB
        db[cat][trimmedNew] = db[cat][oldItem];
        delete db[cat][oldItem];
        saveMasterData(db);

        // 2. Rename in all BOM Templates
        const boms = getBOMTemplates();
        let bomsChanged = false;
        for (const cap in boms) {
            if (boms[cap][oldItem] !== undefined) {
                boms[cap][trimmedNew] = boms[cap][oldItem];
                delete boms[cap][oldItem];
                bomsChanged = true;
            }
        }
        if (bomsChanged) saveBOMTemplates(boms);

        renderMasterDataEditor(); // Refresh UI
    }
};

    // Removed BOM logic to standalone tab
    
    // Add Component Logic
let addCompModal = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof syncFirebaseToLocal === 'function') await syncFirebaseToLocal();

    addCompModal = new bootstrap.Modal(document.getElementById('addComponentModal'));
    
    // Delegate click for dynamic Add New Item buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add-comp');
        if (btn) {
            const cat = btn.dataset.cat;
            const masterSelect = document.getElementById('newCompCategory');
            masterSelect.value = cat;
            document.getElementById('addComponentForm').reset();
            masterSelect.value = cat; // restore after reset
            
            const subCategoryContainer = document.getElementById('subCategoryContainer');
            if (cat === 'supply') {
                subCategoryContainer.style.display = 'block';
                const supplyCategories = DEFAULT_MASTER_DATA.SUPPLY_CATEGORIES || [];
                const subCatSelect = document.getElementById('newCompSubCategory');
                subCatSelect.innerHTML = supplyCategories.map(c => `<option value="${c}">${c}</option>`).join('');
            } else {
                subCategoryContainer.style.display = 'none';
            }

            // Also attach listener so if user changes Master in modal, we toggle subcategory
            masterSelect.onchange = (e) => {
                if (e.target.value === 'supply') {
                    subCategoryContainer.style.display = 'block';
                    const supplyCategories = DEFAULT_MASTER_DATA.SUPPLY_CATEGORIES || [];
                    document.getElementById('newCompSubCategory').innerHTML = supplyCategories.map(c => `<option value="${c}">${c}</option>`).join('');
                } else {
                    subCategoryContainer.style.display = 'none';
                }
            };
            
            // Dynamically build capacity inputs for BOM
            const boms = getBOMTemplates();
            let inputsHtml = '';
            for (const cap in boms) {
                inputsHtml += `
                <div class="col-md-3">
                    <label class="form-label text-muted small fw-bold">${cap} System</label>
                    <input type="number" step="0.01" class="form-control new-comp-qty-input" data-cap="${cap}" value="0" required>
                </div>`;
            }
            document.getElementById('dynamicBOMInputs').innerHTML = inputsHtml;
            
            addCompModal.show();
        }
    });

    // Save New Component
    document.getElementById('btn-save-new-comp').addEventListener('click', () => {
        const name = document.getElementById('newCompName').value.trim();
        const cat = document.getElementById('newCompCategory').value;
        const price = parseFloat(document.getElementById('newCompPrice').value) || 0;
        const gst = parseFloat(document.getElementById('newCompGst').value) || 0;
        
        if (!name) return alert('Component Name is required!');

        // Update Master Data
        const db = getMasterData();
        const newData = { price, gst };
        if (cat === 'supply') {
            newData.category = document.getElementById('newCompSubCategory').value || 'Uncategorized';
        }
        db[cat][name] = newData;
        saveMasterData(db);

        // Update BOM Templates Dynamically
        const boms = getBOMTemplates();
        document.querySelectorAll('.new-comp-qty-input').forEach(input => {
            const cap = input.dataset.cap;
            boms[cap][name] = parseFloat(input.value) || 0;
        });
        localStorage.setItem('solis-bom-templates', JSON.stringify(boms));

        // Refresh UI
        renderMasterDataEditor();
        addCompModal.hide();
    });
});
