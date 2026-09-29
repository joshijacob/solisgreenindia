let createBomModal;
let editBomModal;
let activeSystemType = 'On-Grid';

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof syncFirebaseToLocal === 'function') await syncFirebaseToLocal();

    // Tab Listeners
    document.getElementById('ongrid-tab').addEventListener('shown.bs.tab', () => switchTab('On-Grid'));
    document.getElementById('hybrid-tab').addEventListener('shown.bs.tab', () => switchTab('Hybrid'));
    document.getElementById('micro-tab').addEventListener('shown.bs.tab', () => switchTab('Micro Inverter'));

    renderBOMViewer();

    createBomModal = new bootstrap.Modal(document.getElementById('createBomModal'));
    editBomModal = new bootstrap.Modal(document.getElementById('editBomModal'));

    document.getElementById('btn-create-bom').addEventListener('click', () => {
        document.getElementById('newBomCap').value = '';
        document.getElementById('newBomSysType').value = activeSystemType;
        createBomModal.show();
    });

    document.getElementById('btn-save-new-bom').addEventListener('click', createNewTemplate);
    document.getElementById('btn-save-edit-bom').addEventListener('click', saveEditedTemplate);
});

function switchTab(sysType) {
    activeSystemType = sysType;
    renderBOMViewer();
}

function renderBOMViewer() {
    const tbody = document.getElementById('bom-table-body');
    try {
        const allBoms = getBOMTemplates();
        const db = getMasterData();
        if (!allBoms) throw new Error("getBOMTemplates() returned null");
        if (!db) throw new Error("getMasterData() returned null");
        
        const boms = allBoms[activeSystemType] || {};
        const margins = db.profitMargins && db.profitMargins[activeSystemType] ? db.profitMargins[activeSystemType] : {};
        
        let html = '';
        
        for (const capacity in boms) {
            const bom = boms[capacity];
            const margin = margins[capacity] !== undefined ? margins[capacity] : 15;
            const compCount = Object.keys(bom).length;
            
            html += `
            <tr>
                <td class="fw-bold text-dark fs-6">${capacity}</td>
                <td>
                    <div class="input-group input-group-sm w-50">
                        <input type="number" class="form-control fw-bold border-success text-success margin-input" data-cap="${capacity}" value="${margin}">
                        <span class="input-group-text bg-success text-white border-success">%</span>
                    </div>
                </td>
                <td><span class="text-muted">${compCount} Items configured</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary btn-edit-bom" data-cap="${capacity}">
                        <i class="fa-solid fa-pen"></i> Edit BOM
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-bom" data-cap="${capacity}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        }
        
        tbody.innerHTML = html;
        if (html === '') tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No BOM templates found for ${activeSystemType}.</td></tr>`;
        
        document.querySelectorAll('.btn-edit-bom').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cap = e.target.closest('.btn-edit-bom').dataset.cap;
                openEditModal(cap);
            });
        });

        document.querySelectorAll('.btn-delete-bom').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cap = e.target.closest('.btn-delete-bom').dataset.cap;
                if(confirm(`Delete ${cap} template for ${activeSystemType}?`)) {
                    deleteTemplate(cap);
                }
            });
        });

        // Auto-save profit margins when changed
        document.querySelectorAll('.margin-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const cap = e.target.dataset.cap;
                const val = parseFloat(e.target.value) || 0;
                saveProfitMargin(cap, val);
            });
        });
        
    } catch (e) {
        console.error("BOM render error:", e);
        if (tbody) tbody.innerHTML = `<tr><td colspan="4" class="text-danger text-center fw-bold">Error loading BOM data: ${e.message}</td></tr>`;
    }
}

function saveProfitMargin(cap, val) {
    const db = getMasterData();
    if (!db.profitMargins) db.profitMargins = {};
    if (!db.profitMargins[activeSystemType]) db.profitMargins[activeSystemType] = {};
    
    db.profitMargins[activeSystemType][cap] = val;
    saveMasterData(db);
}

function openEditModal(cap) {
    const allBoms = getBOMTemplates();
    const bom = allBoms[activeSystemType][cap];
    if (!bom) return;
    
    document.getElementById('editBomTitle').innerHTML = `<i class="fa-solid fa-pen-to-square me-2"></i> Edit ${activeSystemType} - ${cap}`;
    document.getElementById('editBomCap').value = cap;
    
    let html = '';
    for (const item in bom) {
        html += `
        <div class="col-md-6">
            <label class="form-label text-truncate d-block fw-bold small text-muted mb-1" title="${item}">${item}</label>
            <input type="number" step="0.1" class="form-control form-control-sm fw-bold edit-bom-input" 
                   data-item="${item}" value="${bom[item]}">
        </div>`;
    }
    
    document.getElementById('editBomForm').innerHTML = html;
    editBomModal.show();
}

function saveEditedTemplate() {
    const cap = document.getElementById('editBomCap').value;
    if (!cap) return;
    
    const allBoms = getBOMTemplates();
    if (!allBoms[activeSystemType] || !allBoms[activeSystemType][cap]) return;
    
    const inputs = document.querySelectorAll('.edit-bom-input');
    inputs.forEach(input => {
        const item = input.dataset.item;
        allBoms[activeSystemType][cap][item] = parseFloat(input.value) || 0;
    });
    
    saveBOMTemplates(allBoms);
    
    editBomModal.hide();
    renderBOMViewer();
}

function createNewTemplate() {
    const cap = document.getElementById('newBomCap').value;
    const sysType = document.getElementById('newBomSysType').value;
    if (!cap) return alert("Please enter capacity");

    const allBoms = getBOMTemplates();
    if (!allBoms[sysType]) allBoms[sysType] = {};
    
    // Create an empty template by looking at all items in DEFAULT_BOM_TEMPLATES for On-Grid (as a base for materials)
    const baseItems = {
        'Middle Clamp': 0, 'End Clamp': 0, 'Aluminium Rail': 0, 'Alen Bolt': 0, 'Spring Nut': 0,
        'MC-4 Connector': 0, 'Cable Tie': 0, 'DC Cable Red': 0, 'DC Cable Blk': 0, 'GND BUS BAR': 0,
        'DCDB': 0, 'PVC Trunk': 0, 'ACDB': 0, '2P MCB': 0, '4P MCB': 0, 'AC Cable Red 4 SQ MM': 0, 
        'AC Cable Black 4 SQ MM': 0, 'GND Cable Green 6 Sqmm': 0, '50 Al Down Conductor': 0, 
        '1 PH NET Energy Meter': 0, 'Meter Box': 0, 'DBL': 0, 'Earth ROD': 0, 'Drain Box': 0, 
        'Earth Compound 10 KG': 0, 'LA Single Spike': 0, 'PVC Condute 20mm': 0, 'PVC Elbow 20mm': 0, 
        'PVC Bend 20mm': 0, 'PVC Tee 20mm': 0, 'PVC Coupling 20mm': 0, 'Saddles': 0, 
        'Structure Materials': 0, 'Structur Labour': 0, 'Electrical Labour': 0, 'Electricity': 0,
        'KSEB Fees': 0, 'Transportation': 0
    };

    if (sysType === 'Hybrid') {
        Object.assign(baseItems, { 'Changeover Switch (63A)': 0, 'Heavy DC Cable for Battery (35 sqmm)': 0, 'Battery Rack (4 Battery)': 0 });
    } else if (sysType === 'Micro Inverter') {
        Object.assign(baseItems, { 'AC Trunk Cable (Micro Inverter)': 0, 'Trunk End Cap': 0, 'Disconnect Tool': 0 });
    }

    allBoms[sysType][cap] = baseItems;
    saveBOMTemplates(allBoms);
    
    createBomModal.hide();
    
    // Switch to the tab where they created it
    if(sysType === 'On-Grid') document.getElementById('ongrid-tab').click();
    else if(sysType === 'Hybrid') document.getElementById('hybrid-tab').click();
    else if(sysType === 'Micro Inverter') document.getElementById('micro-tab').click();
    
    openEditModal(cap);
}

function deleteTemplate(cap) {
    const allBoms = getBOMTemplates();
    if (allBoms[activeSystemType] && allBoms[activeSystemType][cap]) {
        delete allBoms[activeSystemType][cap];
        saveBOMTemplates(allBoms);
        renderBOMViewer();
    }
}
