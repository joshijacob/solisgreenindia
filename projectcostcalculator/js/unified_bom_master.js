// unified_bom_master.js - Unified ERP Engineering & BOM Master Controller
// Consolidates: 1. BOM Rules & Packages, 2. Solar Panels Master, 3. Inverters Master, 4. General Supply & GST Pricing

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize all 5 modules immediately with zero latency from local cache / defaults
    initBomRulesTab();
    initPanelsMasterTab();
    initInvertersMasterTab();
    initGeneralPricingTab();
    initFormOptionsTab();

    // Check URL parameter for active tab (?tab=panels, ?tab=inverters, ?tab=general, ?tab=bom, ?tab=form-options)
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab');
    if (activeTab === 'panels') {
        const tabEl = document.getElementById('tab-btn-panels');
        if (tabEl) bootstrap.Tab.getOrCreateInstance(tabEl).show();
    } else if (activeTab === 'inverters') {
        const tabEl = document.getElementById('tab-btn-inverters');
        if (tabEl) bootstrap.Tab.getOrCreateInstance(tabEl).show();
    } else if (activeTab === 'general' || activeTab === 'pricing') {
        const tabEl = document.getElementById('tab-btn-general');
        if (tabEl) bootstrap.Tab.getOrCreateInstance(tabEl).show();
    } else if (activeTab === 'form-options' || activeTab === 'dropdowns') {
        const tabEl = document.getElementById('tab-btn-form-options');
        if (tabEl) bootstrap.Tab.getOrCreateInstance(tabEl).show();
    } else {
        const tabEl = document.getElementById('tab-btn-bom-rules');
        if (tabEl) bootstrap.Tab.getOrCreateInstance(tabEl).show();
    }

    // 2. Non-blocking background sync from Cloud Firestore
    if (typeof syncFirebaseToLocal === 'function') {
        syncFirebaseToLocal().then(updated => {
            if (updated) {
                console.log("Cloud master data updated, re-rendering master tabs...");
                initBomRulesTab();
                initPanelsMasterTab();
                initInvertersMasterTab();
                initGeneralPricingTab();
                initFormOptionsTab();
            }
        }).catch(e => console.warn("Background cloud sync note:", e));
    }
});

// =========================================================================
// MODULE 1: BOM RULES & PACKAGE TEMPLATES
// =========================================================================
let currentBomSystemType = 'On-Grid';
let editBomCap = null;

function initBomRulesTab() {
    renderBomTemplateList();

    // System type tab pills (On-Grid, Hybrid, Micro Inverter)
    document.querySelectorAll('#bomTypePills .nav-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#bomTypePills .nav-link').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBomSystemType = btn.getAttribute('data-type') || 'On-Grid';
            renderBomTemplateList();
        });
    });

    // Create BOM button
    const createBtn = document.getElementById('btn-create-bom-modal');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('createBomModal'));
            modal.show();
        });
    }

    // Save New BOM
    const saveNewBtn = document.getElementById('btn-save-new-bom');
    if (saveNewBtn) {
        saveNewBtn.addEventListener('click', () => {
            const sysType = document.getElementById('newBomSysType').value;
            let cap = document.getElementById('newBomCap').value.trim();
            if (!cap) return alert("Please enter capacity (e.g. 15kW)");
            if (!cap.toLowerCase().endsWith('kw')) cap += 'kW';

            const templates = getBOMTemplates();
            if (!templates[sysType]) templates[sysType] = {};

            if (templates[sysType][cap]) {
                return alert("A template for " + cap + " already exists in " + sysType + "!");
            }

            // Clone default base items from 5kW or empty
            const sample = templates['On-Grid']['5kW'] || {};
            templates[sysType][cap] = JSON.parse(JSON.stringify(sample));
            saveBOMTemplates(templates);

            bootstrap.Modal.getInstance(document.getElementById('createBomModal')).hide();
            document.getElementById('newBomCap').value = '';
            currentBomSystemType = sysType;

            // Activate matching sub-tab
            document.querySelectorAll('#bomTypePills .nav-link').forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-type') === sysType);
            });

            renderBomTemplateList();
        });
    }

    // Save Edited BOM
    const saveEditBtn = document.getElementById('btn-save-edit-bom');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', () => {
            const templates = getBOMTemplates();
            const cap = document.getElementById('editBomCap').value;
            if (!templates[currentBomSystemType] || !templates[currentBomSystemType][cap]) return;

            const inputs = document.querySelectorAll('.bom-item-input');
            const newObj = {};
            inputs.forEach(input => {
                const item = input.dataset.item;
                const val = parseFloat(input.value) || 0;
                if (val > 0) newObj[item] = val;
            });

            templates[currentBomSystemType][cap] = newObj;
            saveBOMTemplates(templates);
            bootstrap.Modal.getInstance(document.getElementById('editBomModal')).hide();
            renderBomTemplateList();
        });
    }
}

function renderBomTemplateList() {
    const tbody = document.getElementById('bom-table-body');
    if (!tbody) return;

    try {
        const templates = getBOMTemplates();
        const db = getMasterData();
        if (!templates || !templates[currentBomSystemType]) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No templates found for ' + currentBomSystemType + '</td></tr>';
            return;
        }

        const typeTemplates = templates[currentBomSystemType];
        const caps = Object.keys(typeTemplates).sort((a,b) => parseInt(a) - parseInt(b));

        let html = '';
        caps.forEach(cap => {
            const count = Object.keys(typeTemplates[cap]).length;
            const margin = (db && db.profitMargins && db.profitMargins[currentBomSystemType] && db.profitMargins[currentBomSystemType][cap]) || 15;

            html += `
                <tr>
                    <td class="fw-bold text-dark">
                        <span class="badge bg-light text-dark border px-2 py-1 me-2 font-mono">${cap}</span>
                        ${currentBomSystemType} System
                    </td>
                    <td>
                        <span class="badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1">${margin}% Target Margin</span>
                    </td>
                    <td><span class="badge bg-secondary font-mono">${count} Components</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold me-1" onclick="openEditBomModal('${cap}')">
                            <i class="fa-solid fa-pen-to-square me-1"></i> Edit Rules
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill px-2" onclick="deleteBomTemplate('${cap}')" title="Delete Template">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    } catch (e) {
        console.error("renderBomTemplateList error:", e);
    }
}

function openEditBomModal(cap) {
    const templates = getBOMTemplates();
    const db = getMasterData();
    const template = templates[currentBomSystemType][cap];
    if (!template) return;

    document.getElementById('editBomTitle').innerHTML = `<i class="fa-solid fa-pen-to-square me-2"></i> Edit Rules: ${currentBomSystemType} - ${cap}`;
    document.getElementById('editBomCap').value = cap;

    const container = document.getElementById('editBomForm');
    let html = '';

    const supplyItems = db ? Object.keys(db.supply || {}) : [];
    const serviceItems = db ? Object.keys(db.service || {}) : [];
    const allAvailable = Array.from(new Set([...supplyItems, ...serviceItems, ...Object.keys(template)])).sort();

    allAvailable.forEach(item => {
        const val = template[item] !== undefined ? template[item] : 0;
        const isPresent = val > 0;

        html += `
            <div class="col-md-6">
                <div class="card p-2 border ${isPresent ? 'border-primary-subtle bg-light-subtle' : 'border-light bg-light'}">
                    <label class="form-label small fw-bold mb-1 text-truncate d-block" title="${item}">
                        ${isPresent ? '<i class="fa-solid fa-check text-success me-1"></i>' : ''}${item}
                    </label>
                    <div class="input-group input-group-sm">
                        <input type="number" step="any" min="0" class="form-control bom-item-input" data-item="${item}" value="${val}">
                        <span class="input-group-text">Units</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    const modal = new bootstrap.Modal(document.getElementById('editBomModal'));
    modal.show();
}

function deleteBomTemplate(cap) {
    if (!confirm(`Are you sure you want to delete the ${currentBomSystemType} - ${cap} BOM template?`)) return;
    const templates = getBOMTemplates();
    if (templates[currentBomSystemType] && templates[currentBomSystemType][cap]) {
        delete templates[currentBomSystemType][cap];
        saveBOMTemplates(templates);
        renderBomTemplateList();
    }
}

// =========================================================================
// MODULE 2: SOLAR PANELS MASTER
// =========================================================================
let editingPanelId = null;

function initPanelsMasterTab() {
    renderPanelsList();

    const searchInput = document.getElementById('panel-search-bar');
    if (searchInput) searchInput.addEventListener('input', renderPanelsList);

    const filterBrand = document.getElementById('panel-filter-brand');
    if (filterBrand) filterBrand.addEventListener('change', renderPanelsList);

    const filterCert = document.getElementById('panel-filter-cert');
    if (filterCert) filterCert.addEventListener('change', renderPanelsList);

    const createBtn = document.getElementById('btn-create-panel-modal');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            openPanelForm();
        });
    }

    const saveBtn = document.getElementById('btn-save-panel');
    if (saveBtn) {
        saveBtn.addEventListener('click', savePanelProduct);
    }
}

function renderPanelsList() {
    const tbody = document.getElementById('panel-table-body');
    if (!tbody) return;

    try {
        const db = getMasterData();
        if (!db || !db.panelProducts) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No panels found in database</td></tr>';
            return;
        }

        const searchVal = (document.getElementById('panel-search-bar')?.value || '').toLowerCase();
        const brandFilter = document.getElementById('panel-filter-brand')?.value || 'all';
        const certFilter = document.getElementById('panel-filter-cert')?.value || 'all';

        // Update stats
        const activeCount = db.panelProducts.filter(p => p.status === 'Active').length;
        const dcrCount = db.panelProducts.filter(p => p.certification === 'DCR').length;
        document.getElementById('stat-total-panels').textContent = db.panelProducts.length;
        document.getElementById('stat-active-panels').textContent = activeCount;
        document.getElementById('stat-dcr-panels').textContent = dcrCount;

        const filtered = db.panelProducts.filter(p => {
            const matchesSearch = !searchVal || `${p.id} ${p.brand} ${p.technology} ${p.wattage}`.toLowerCase().includes(searchVal);
            const matchesBrand = (brandFilter === 'all') || (p.brand === brandFilter);
            const matchesCert = (certFilter === 'all') || (p.certification === certFilter);
            return matchesSearch && matchesBrand && matchesCert;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No panels match the selected criteria.</td></tr>';
            return;
        }

        let html = '';
        filtered.forEach((p, idx) => {
            const isDcr = p.certification === 'DCR';
            const isActive = p.status === 'Active';

            html += `
                <tr>
                    <td class="text-muted small fw-bold">${idx + 1}</td>
                    <td>
                        <div class="fw-bold text-dark">${p.brand}</div>
                        <small class="text-muted font-mono" style="font-size: 0.75rem;">${p.id}</small>
                    </td>
                    <td>
                        <span class="badge bg-warning text-dark fw-bold font-mono fs-6">${p.wattage}W</span>
                    </td>
                    <td>
                        <span class="badge ${isDcr ? 'bg-success' : 'bg-secondary'} me-1">${p.certification || 'NDCR'}</span>
                        <span class="badge bg-light text-dark border">${p.technology}</span>
                    </td>
                    <td class="text-end font-mono fw-bold text-primary">₹${p.price.toFixed(2)}/W</td>
                    <td>
                        <span class="badge ${isActive ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}">
                            ${p.status}
                        </span>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1" onclick="openEditPanelModal('${p.id}')">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-${isActive ? 'warning' : 'success'} rounded-pill px-2 me-1" onclick="togglePanelStatus('${p.id}')" title="Toggle Status">
                            <i class="fa-solid fa-${isActive ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill px-2" onclick="deletePanelProduct('${p.id}')" title="Delete">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    } catch (e) {
        console.error("renderPanelsList error:", e);
    }
}

function openPanelForm() {
    editingPanelId = null;
    document.getElementById('panelModalTitle').textContent = "Add New PV Module";
    document.getElementById('panel-form').reset();
    document.getElementById('p-id').readOnly = false;
    document.getElementById('p-status').value = "Active";
    const modal = new bootstrap.Modal(document.getElementById('panelModal'));
    modal.show();
}

function openEditPanelModal(id) {
    const db = getMasterData();
    const product = db.panelProducts.find(p => p.id === id);
    if (!product) return;

    editingPanelId = id;
    document.getElementById('panelModalTitle').textContent = `Edit Panel: ${product.brand} ${product.wattage}W`;
    document.getElementById('p-id').value = product.id;
    document.getElementById('p-id').readOnly = true;
    document.getElementById('p-brand').value = product.brand;
    document.getElementById('p-tech').value = product.technology;
    document.getElementById('p-cert').value = product.certification || 'DCR';
    document.getElementById('p-wattage').value = product.wattage;
    document.getElementById('p-price').value = product.price;
    document.getElementById('p-status').value = product.status;
    document.getElementById('p-supplier').value = product.supplier || '';
    document.getElementById('p-warranty').value = product.warranty || 12;

    const modal = new bootstrap.Modal(document.getElementById('panelModal'));
    modal.show();
}

function savePanelProduct() {
    const id = document.getElementById('p-id').value.trim();
    const brand = document.getElementById('p-brand').value.trim();
    const tech = document.getElementById('p-tech').value;
    const cert = document.getElementById('p-cert').value;
    const wattage = parseInt(document.getElementById('p-wattage').value);
    const price = parseFloat(document.getElementById('p-price').value);
    const status = document.getElementById('p-status').value;
    const supplier = document.getElementById('p-supplier').value.trim();
    const warranty = parseInt(document.getElementById('p-warranty').value) || 12;

    if (!id || !brand || isNaN(wattage) || isNaN(price)) {
        return alert("Please fill in all mandatory fields.");
    }

    const db = getMasterData();
    const productData = {
        id, brand, technology: tech, certification: cert, wattage, price, gst: 12,
        supplier, warranty, status
    };

    if (editingPanelId) {
        const idx = db.panelProducts.findIndex(p => p.id === editingPanelId);
        if (idx !== -1) db.panelProducts[idx] = productData;
    } else {
        if (db.panelProducts.some(p => p.id === id)) {
            return alert("A panel with ID " + id + " already exists!");
        }
        db.panelProducts.push(productData);
    }

    saveMasterData(db);
    bootstrap.Modal.getInstance(document.getElementById('panelModal')).hide();
    renderPanelsList();
}

function togglePanelStatus(id) {
    const db = getMasterData();
    const p = db.panelProducts.find(x => x.id === id);
    if (!p) return;
    p.status = p.status === 'Active' ? 'Inactive' : 'Active';
    saveMasterData(db);
    renderPanelsList();
}

function deletePanelProduct(id) {
    if (!confirm(`Are you sure you want to delete panel ${id}?`)) return;
    const db = getMasterData();
    db.panelProducts = db.panelProducts.filter(p => p.id !== id);
    saveMasterData(db);
    renderPanelsList();
}

// =========================================================================
// MODULE 3: SOLAR INVERTERS MASTER
// =========================================================================
let editingInverterId = null;

function initInvertersMasterTab() {
    renderInvertersList();

    const searchInput = document.getElementById('inverter-search-bar');
    if (searchInput) searchInput.addEventListener('input', renderInvertersList);

    const filterBrand = document.getElementById('inverter-filter-brand');
    if (filterBrand) filterBrand.addEventListener('change', renderInvertersList);

    const filterPhase = document.getElementById('inverter-filter-phase');
    if (filterPhase) filterPhase.addEventListener('change', renderInvertersList);

    const createBtn = document.getElementById('btn-create-inverter-modal');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            openInverterForm();
        });
    }

    const saveBtn = document.getElementById('btn-save-inverter');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveInverterProduct);
    }
}

function renderInvertersList() {
    const tbody = document.getElementById('inverter-table-body');
    if (!tbody) return;

    try {
        const db = getMasterData();
        if (!db || !db.inverterProducts) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No inverters found in database</td></tr>';
            return;
        }

        const searchVal = (document.getElementById('inverter-search-bar')?.value || '').toLowerCase();
        const brandFilter = document.getElementById('inverter-filter-brand')?.value || 'all';
        const phaseFilter = document.getElementById('inverter-filter-phase')?.value || 'all';

        // Update stats
        const activeCount = db.inverterProducts.filter(i => i.status === 'Active').length;
        const singlePhaseCount = db.inverterProducts.filter(i => i.phase === 'Single Phase').length;
        document.getElementById('stat-total-inverters').textContent = db.inverterProducts.length;
        document.getElementById('stat-active-inverters').textContent = activeCount;
        document.getElementById('stat-single-phase-inverters').textContent = singlePhaseCount;

        const filtered = db.inverterProducts.filter(inv => {
            const matchesSearch = !searchVal || `${inv.id} ${inv.brand} ${inv.capacity} ${inv.phase} ${inv.type}`.toLowerCase().includes(searchVal);
            const matchesBrand = (brandFilter === 'all') || (inv.brand === brandFilter);
            const matchesPhase = (phaseFilter === 'all') || (inv.phase === phaseFilter);
            return matchesSearch && matchesBrand && matchesPhase;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No inverters match the selected criteria.</td></tr>';
            return;
        }

        let html = '';
        filtered.forEach((inv, idx) => {
            const isActive = inv.status === 'Active';

            html += `
                <tr>
                    <td class="text-muted small fw-bold">${idx + 1}</td>
                    <td>
                        <div class="fw-bold text-dark">${inv.brand}</div>
                        <small class="text-muted font-mono" style="font-size: 0.75rem;">${inv.id}</small>
                    </td>
                    <td>
                        <span class="badge bg-primary fw-bold font-mono fs-6">${inv.capacity}</span>
                    </td>
                    <td>
                        <span class="badge bg-light text-dark border">${inv.phase}</span>
                        <span class="badge bg-secondary-subtle text-secondary border">${inv.type}</span>
                    </td>
                    <td class="text-end font-mono fw-bold text-primary">₹${inv.price.toLocaleString('en-IN')}</td>
                    <td>
                        <span class="badge ${isActive ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}">
                            ${inv.status}
                        </span>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1" onclick="openEditInverterModal('${inv.id}')">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-${isActive ? 'warning' : 'success'} rounded-pill px-2 me-1" onclick="toggleInverterStatus('${inv.id}')" title="Toggle Status">
                            <i class="fa-solid fa-${isActive ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill px-2" onclick="deleteInverterProduct('${inv.id}')" title="Delete">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    } catch (e) {
        console.error("renderInvertersList error:", e);
    }
}

function openInverterForm() {
    editingInverterId = null;
    document.getElementById('inverterModalTitle').textContent = "Add New Inverter Model";
    document.getElementById('inverter-form').reset();
    document.getElementById('inv-id').readOnly = false;
    document.getElementById('inv-status').value = "Active";
    const modal = new bootstrap.Modal(document.getElementById('inverterModal'));
    modal.show();
}

function openEditInverterModal(id) {
    const db = getMasterData();
    const product = db.inverterProducts.find(i => i.id === id);
    if (!product) return;

    editingInverterId = id;
    document.getElementById('inverterModalTitle').textContent = `Edit Inverter: ${product.brand} ${product.capacity}`;
    document.getElementById('inv-id').value = product.id;
    document.getElementById('inv-id').readOnly = true;
    document.getElementById('inv-brand').value = product.brand;
    document.getElementById('inv-capacity').value = product.capacity;
    document.getElementById('inv-phase').value = product.phase;
    document.getElementById('inv-type').value = product.type;
    document.getElementById('inv-price').value = product.price;
    document.getElementById('inv-status').value = product.status;
    document.getElementById('inv-warranty').value = product.warranty || 5;

    const modal = new bootstrap.Modal(document.getElementById('inverterModal'));
    modal.show();
}

function saveInverterProduct() {
    const id = document.getElementById('inv-id').value.trim();
    const brand = document.getElementById('inv-brand').value.trim();
    const capacity = document.getElementById('inv-capacity').value.trim();
    const phase = document.getElementById('inv-phase').value;
    const type = document.getElementById('inv-type').value;
    const price = parseFloat(document.getElementById('inv-price').value) || 0;
    const status = document.getElementById('inv-status').value;
    const warranty = parseInt(document.getElementById('inv-warranty').value) || 5;

    if (!id || !brand || !capacity) {
        return alert("Please fill in all mandatory fields.");
    }

    const db = getMasterData();
    const productData = {
        id, brand, capacity, phase, type, price, gst: 18, warranty, status
    };

    if (editingInverterId) {
        const idx = db.inverterProducts.findIndex(i => i.id === editingInverterId);
        if (idx !== -1) db.inverterProducts[idx] = productData;
    } else {
        if (db.inverterProducts.some(i => i.id === id)) {
            return alert("An inverter with ID " + id + " already exists!");
        }
        db.inverterProducts.push(productData);
    }

    saveMasterData(db);
    bootstrap.Modal.getInstance(document.getElementById('inverterModal')).hide();
    renderInvertersList();
}

function toggleInverterStatus(id) {
    const db = getMasterData();
    const inv = db.inverterProducts.find(x => x.id === id);
    if (!inv) return;
    inv.status = inv.status === 'Active' ? 'Inactive' : 'Active';
    saveMasterData(db);
    renderInvertersList();
}

function deleteInverterProduct(id) {
    if (!confirm(`Are you sure you want to delete inverter ${id}?`)) return;
    const db = getMasterData();
    db.inverterProducts = db.inverterProducts.filter(i => i.id !== id);
    saveMasterData(db);
    renderInvertersList();
}

// =========================================================================
// MODULE 4: GENERAL SUPPLY, LABOR & 70:30 GST PRICING
// =========================================================================
function initGeneralPricingTab() {
    renderGeneralMasterData();

    const saveMasterBtn = document.getElementById('btn-save-master-general');
    if (saveMasterBtn) {
        saveMasterBtn.addEventListener('click', saveGeneralMasterData);
    }
}

function renderGeneralMasterData() {
    const container = document.getElementById('generalMasterAccordion');
    if (!container) return;

    try {
        const db = getMasterData();
        if (!db) return;

        let html = '';
        let index = 0;

        for (const category in db) {
            if (category === 'panelProducts' || category === 'inverterProducts' || category === 'inverters' || category === 'batteryProducts') continue;

            index++;
            const categoryData = db[category];
            const isSupply = category === 'supply';
            const isService = category === 'service';

            html += `
                <div class="accordion-item border mb-2 rounded-2 overflow-hidden shadow-sm">
                    <h2 class="accordion-header d-flex align-items-center">
                        <button class="accordion-button ${index === 1 ? '' : 'collapsed'} fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGen${index}">
                            <i class="fa-solid fa-${category === 'supply' ? 'boxes-stacked' : category === 'service' ? 'screwdriver-wrench' : category === 'profitMargins' ? 'chart-pie' : 'sliders'} text-primary me-2"></i>
                            ${category === 'supply' ? 'BALANCE OF SYSTEM (BOS) MATERIALS' : category === 'service' ? 'LABOR & STATUTORY CHARGES' : category === 'profitMargins' ? 'TARGET PROFIT MARGINS' : 'SYSTEM SETTINGS'}
                        </button>
                    </h2>
                    <div id="collapseGen${index}" class="accordion-collapse collapse ${index === 1 ? 'show' : ''}" data-bs-parent="#generalMasterAccordion">
                        <div class="accordion-body p-3 bg-light">
                            ${renderCategoryItems(category, categoryData, db)}
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;

    } catch (e) {
        console.error("renderGeneralMasterData error:", e);
    }
}

function renderCategoryItems(category, data, db) {
    if (category === 'profitMargins') {
        let html = '<div class="row g-3">';
        for (const sysType in data) {
            html += `
                <div class="col-md-4">
                    <div class="card p-3 border-0 shadow-sm">
                        <h6 class="fw-bold text-dark border-bottom pb-2">${sysType} Margin (%)</h6>
            `;
            for (const cap in data[sysType]) {
                html += `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="small fw-semibold">${cap}:</span>
                        <div class="input-group input-group-sm" style="width: 100px;">
                            <input type="number" class="form-control text-end margin-input" data-systype="${sysType}" data-cap="${cap}" value="${data[sysType][cap]}">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                `;
            }
            html += `</div></div>`;
        }
        html += '</div>';
        return html;
    }

    if (category === 'supply' || category === 'service') {
        let html = '<div class="row g-2">';
        for (const item in data) {
            const price = data[item].price;
            const gst = data[item].gst !== undefined ? data[item].gst : 18;
            const cat = data[item].category || 'General';

            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card p-2 bg-white border">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold text-truncate small text-dark" title="${item}">${item}</span>
                            <span class="badge bg-light text-muted border" style="font-size: 0.65rem;">${cat}</span>
                        </div>
                        <div class="row g-1">
                            <div class="col-8">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text">₹</span>
                                    <input type="number" step="any" class="form-control text-end item-price-input" data-cat="${category}" data-item="${item}" value="${price}">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="input-group input-group-sm">
                                    <input type="number" class="form-control text-end item-gst-input" data-cat="${category}" data-item="${item}" value="${gst}">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        return html;
    }

    return `<pre class="bg-white p-2 small">${JSON.stringify(data, null, 2)}</pre>`;
}

function saveGeneralMasterData() {
    const db = getMasterData();
    if (!db) return;

    // Save prices & gst
    document.querySelectorAll('.item-price-input').forEach(inp => {
        const cat = inp.dataset.cat;
        const item = inp.dataset.item;
        const val = parseFloat(inp.value) || 0;
        if (db[cat] && db[cat][item]) db[cat][item].price = val;
    });

    document.querySelectorAll('.item-gst-input').forEach(inp => {
        const cat = inp.dataset.cat;
        const item = inp.dataset.item;
        const val = parseFloat(inp.value) || 0;
        if (db[cat] && db[cat][item]) db[cat][item].gst = val;
    });

    // Save margins
    document.querySelectorAll('.margin-input').forEach(inp => {
        const sysType = inp.dataset.systype;
        const cap = inp.dataset.cap;
        const val = parseFloat(inp.value) || 0;
        if (db.profitMargins && db.profitMargins[sysType]) {
            db.profitMargins[sysType][cap] = val;
        }
    });

    saveMasterData(db);
    alert("Master pricing & GST configurations saved successfully to Cloud Firestore!");
    renderGeneralMasterData();
}

// Global window exposure
window.openEditBomModal = openEditBomModal;
window.deleteBomTemplate = deleteBomTemplate;
window.openEditPanelModal = openEditPanelModal;
window.togglePanelStatus = togglePanelStatus;
window.deletePanelProduct = deletePanelProduct;
window.openEditInverterModal = openEditInverterModal;
window.toggleInverterStatus = toggleInverterStatus;
window.deleteInverterProduct = deleteInverterProduct;


// =========================================================================
// MODULE 5: CENTRALIZED FORM DROPDOWNS CONFIG
// =========================================================================
let liveFormConfig = null;

function initFormOptionsTab() {
    // Clone form configuration into working copy
    const sourceConfig = (typeof getFormConfig === 'function' ? getFormConfig() : null) || window.DEFAULT_FORM_CONFIG;
    liveFormConfig = JSON.parse(JSON.stringify(sourceConfig || {}));

    if (!Array.isArray(liveFormConfig.districts)) liveFormConfig.districts = [];
    if (!Array.isArray(liveFormConfig.roofTypes)) liveFormConfig.roofTypes = [];
    if (!Array.isArray(liveFormConfig.inverterPhases)) liveFormConfig.inverterPhases = [];
    if (!Array.isArray(liveFormConfig.ksebPhases)) liveFormConfig.ksebPhases = [];
    if (!Array.isArray(liveFormConfig.netMeterScopes)) liveFormConfig.netMeterScopes = [];
    if (!Array.isArray(liveFormConfig.ksebPaymentScopes)) liveFormConfig.ksebPaymentScopes = [];
    if (!Array.isArray(liveFormConfig.customDropdowns)) liveFormConfig.customDropdowns = [];

    renderAllFormOptionCards();

    // Helper to bind Add button + Enter key
    function bindAddControl(inputId, btnId, targetArray, renderFunc) {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if (!input || !btn) return;

        const handleAdd = () => {
            const val = input.value.trim();
            if (!val) return;
            if (targetArray.some(item => item.toLowerCase() === val.toLowerCase())) {
                alert(`"${val}" already exists in the list.`);
                return;
            }
            targetArray.push(val);
            input.value = '';
            renderFunc();
        };

        btn.onclick = handleAdd;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
            }
        };
    }

    // Bind controls
    bindAddControl('new-district-input', 'btn-add-district', liveFormConfig.districts, renderDistrictTags);
    bindAddControl('new-roof-input', 'btn-add-roof', liveFormConfig.roofTypes, renderRoofTags);
    bindAddControl('new-inv-phase-input', 'btn-add-inv-phase', liveFormConfig.inverterPhases, renderInvPhaseTags);
    bindAddControl('new-kseb-phase-input', 'btn-add-kseb-phase', liveFormConfig.ksebPhases, renderKsebPhaseTags);
    bindAddControl('new-netmeter-scope-input', 'btn-add-netmeter-scope', liveFormConfig.netMeterScopes, renderNetMeterScopeTags);
    bindAddControl('new-kseb-scope-input', 'btn-add-kseb-scope', liveFormConfig.ksebPaymentScopes, renderKsebScopeTags);

    // Add Custom Dropdown row button
    const addCustomBtn = document.getElementById('btn-add-custom-dropdown-row');
    if (addCustomBtn) {
        addCustomBtn.onclick = () => {
            const id = prompt('Enter Form Element ID (e.g., buildingFloors, subsidyScheme):');
            if (!id || !id.trim()) return;
            const cleanId = id.trim().replace(/[^a-zA-Z0-9_-]/g, '');
            if (liveFormConfig.customDropdowns.some(cd => cd.id === cleanId)) {
                alert(`A dropdown with ID "${cleanId}" already exists.`);
                return;
            }
            const label = prompt('Enter Display Label for this field (e.g., Building Floors):') || cleanId;
            const optionsStr = prompt('Enter comma-separated options (e.g., Ground Floor, 1-2 Floors, 3+ Floors):');
            const options = optionsStr ? optionsStr.split(',').map(s => s.trim()).filter(Boolean) : ['Option 1', 'Option 2'];

            liveFormConfig.customDropdowns.push({
                id: cleanId,
                label: label.trim(),
                options: options,
                placeholder: 'Select...'
            });
            renderCustomDropdowns();
        };
    }

    // Save All Dropdowns
    const saveBtn = document.getElementById('btn-save-form-options');
    if (saveBtn) {
        saveBtn.onclick = async () => {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Saving...';
            try {
                if (typeof saveFormConfig === 'function') {
                    await saveFormConfig(liveFormConfig);
                } else {
                    localStorage.setItem('solis-form-config', JSON.stringify(liveFormConfig));
                    if (typeof pushFormConfigToFirebase === 'function') {
                        await pushFormConfigToFirebase(liveFormConfig);
                    }
                }

                showFormOptionsAlert('success', '<i class="fa-solid fa-circle-check me-2"></i> Form dropdown configurations saved successfully to Cloud Firestore & Calculator!');
            } catch (err) {
                console.error('Error saving form config:', err);
                showFormOptionsAlert('danger', '<i class="fa-solid fa-triangle-exclamation me-2"></i> Error saving configurations: ' + err.message);
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i> Save All Dropdowns';
            }
        };
    }

    // Reset Defaults
    const resetBtn = document.getElementById('btn-reset-form-options');
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (!confirm('Are you sure you want to reset all dropdown options to factory defaults?')) return;
            const defaults = window.DEFAULT_FORM_CONFIG;
            if (defaults) {
                liveFormConfig = JSON.parse(JSON.stringify(defaults));
                renderAllFormOptionCards();
                showFormOptionsAlert('warning', '<i class="fa-solid fa-rotate-left me-2"></i> Reset to factory defaults. Click "Save All Dropdowns" to push these defaults to Cloud Firestore.');
            }
        };
    }
}

function renderAllFormOptionCards() {
    renderDistrictTags();
    renderRoofTags();
    renderInvPhaseTags();
    renderKsebPhaseTags();
    renderNetMeterScopeTags();
    renderKsebScopeTags();
    renderCustomDropdowns();
}

function showFormOptionsAlert(type, messageHtml) {
    const el = document.getElementById('form-options-alert');
    if (!el) return;
    el.className = `alert alert-${type} shadow-sm mb-4 rounded-3 d-flex align-items-center justify-content-between`;
    el.innerHTML = `<div>${messageHtml}</div><button type="button" class="btn-close" onclick="this.parentElement.classList.add('d-none')"></button>`;
    el.classList.remove('d-none');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Render Tag helpers
function renderPillList(containerId, countBadgeId, itemsArray, badgeColorClass, removeCallback) {
    const container = document.getElementById(containerId);
    const countBadge = countBadgeId ? document.getElementById(countBadgeId) : null;
    if (!container) return;

    if (countBadge) countBadge.textContent = `${itemsArray.length} items`;
    container.innerHTML = '';

    if (itemsArray.length === 0) {
        container.innerHTML = '<span class="text-muted small fst-italic">No options defined yet. Add one above.</span>';
        return;
    }

    itemsArray.forEach((item, idx) => {
        const pill = document.createElement('span');
        pill.className = `badge ${badgeColorClass} border py-2 px-3 rounded-pill fw-semibold d-inline-flex align-items-center gap-2 shadow-xs`;
        pill.innerHTML = `<span>${item}</span><button type="button" class="btn-close btn-close-sm" style="font-size: 0.65rem;" title="Remove option"></button>`;
        pill.querySelector('button').onclick = () => {
            removeCallback(idx);
        };
        container.appendChild(pill);
    });
}

function renderDistrictTags() {
    renderPillList('district-tags-container', 'district-count-badge', liveFormConfig.districts, 'bg-white text-dark border-primary-subtle', (idx) => {
        liveFormConfig.districts.splice(idx, 1);
        renderDistrictTags();
    });
}

function renderRoofTags() {
    renderPillList('roof-tags-container', 'roof-count-badge', liveFormConfig.roofTypes, 'bg-white text-dark border-warning-subtle', (idx) => {
        liveFormConfig.roofTypes.splice(idx, 1);
        renderRoofTags();
    });
}

function renderInvPhaseTags() {
    renderPillList('inv-phase-tags-container', null, liveFormConfig.inverterPhases, 'bg-white text-dark border-danger-subtle', (idx) => {
        liveFormConfig.inverterPhases.splice(idx, 1);
        renderInvPhaseTags();
    });
}

function renderKsebPhaseTags() {
    renderPillList('kseb-phase-tags-container', null, liveFormConfig.ksebPhases, 'bg-white text-dark border-danger-subtle', (idx) => {
        liveFormConfig.ksebPhases.splice(idx, 1);
        renderKsebPhaseTags();
    });
}

function renderNetMeterScopeTags() {
    renderPillList('netmeter-scope-tags-container', null, liveFormConfig.netMeterScopes, 'bg-white text-dark border-success-subtle', (idx) => {
        liveFormConfig.netMeterScopes.splice(idx, 1);
        renderNetMeterScopeTags();
    });
}

function renderKsebScopeTags() {
    renderPillList('kseb-scope-tags-container', null, liveFormConfig.ksebPaymentScopes, 'bg-white text-dark border-success-subtle', (idx) => {
        liveFormConfig.ksebPaymentScopes.splice(idx, 1);
        renderKsebScopeTags();
    });
}

function renderCustomDropdowns() {
    const container = document.getElementById('custom-dropdowns-container');
    if (!container) return;
    container.innerHTML = '';

    if (!liveFormConfig.customDropdowns || liveFormConfig.customDropdowns.length === 0) {
        container.innerHTML = `
            <div class="text-center p-4 bg-light rounded-3 border border-dashed">
                <i class="fa-solid fa-cube text-muted fs-3 mb-2"></i>
                <div class="text-muted small">No custom form dropdowns registered yet. Click <strong>"+ Add Custom Dropdown"</strong> above if you add a new field to the form in the future.</div>
            </div>
        `;
        return;
    }

    liveFormConfig.customDropdowns.forEach((cd, cIndex) => {
        const row = document.createElement('div');
        row.className = 'p-3 bg-light rounded-3 border d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between';
        row.innerHTML = `
            <div class="d-flex flex-column gap-1 flex-grow-1">
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-info-subtle text-info border border-info-subtle font-mono">${cd.id}</span>
                    <strong class="text-dark">${cd.label}</strong>
                </div>
                <div class="d-flex flex-wrap gap-1 mt-1">
                    ${cd.options.map(opt => `<span class="badge bg-white text-dark border small">${opt}</span>`).join('')}
                </div>
            </div>
            <div class="d-flex gap-2 align-items-center">
                <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" data-action="edit-options">
                    <i class="fa-solid fa-pen me-1"></i> Edit Options
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm rounded-pill px-3" data-action="delete">
                    <i class="fa-solid fa-trash me-1"></i> Remove
                </button>
            </div>
        `;

        row.querySelector('[data-action="edit-options"]').onclick = () => {
            const currentStr = cd.options.join(', ');
            const newStr = prompt(`Edit comma-separated options for "${cd.label}" (ID: ${cd.id}):`, currentStr);
            if (newStr !== null) {
                cd.options = newStr.split(',').map(s => s.trim()).filter(Boolean);
                renderCustomDropdowns();
            }
        };

        row.querySelector('[data-action="delete"]').onclick = () => {
            if (confirm(`Remove custom dropdown configuration for "${cd.label}" (${cd.id})?`)) {
                liveFormConfig.customDropdowns.splice(cIndex, 1);
                renderCustomDropdowns();
            }
        };

        container.appendChild(row);
    });
}
