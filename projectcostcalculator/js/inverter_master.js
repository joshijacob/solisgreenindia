// inverter_master.js - ERP Inverter Master Logic

let currentMode = 'list';
let editingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof syncFirebaseToLocal === 'function') await syncFirebaseToLocal();

    renderList();

    // UI Switching
    document.getElementById('btn-create').addEventListener('click', () => {
        openForm();
    });
    
    document.getElementById('btn-cancel').addEventListener('click', () => {
        closeForm();
    });

    document.getElementById('btn-save').addEventListener('click', saveProduct);
    document.getElementById('search-bar').addEventListener('input', renderList);
    document.getElementById('csv-file').addEventListener('change', handleCSVImport);
});

function renderList() {
    const tbody = document.getElementById('inverter-table-body');
    try {
        const db = getMasterData();
        if (!db) throw new Error("getMasterData() returned null");
        if (!db.inverterProducts) throw new Error("db.inverterProducts is undefined");
        
        const searchInput = document.getElementById('search-bar');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Group by Brand
    const grouped = {};
    
    db.inverterProducts.forEach(product => {
        // Search Filter
        const searchStr = `${product.id} ${product.brand} ${product.capacity} ${product.phase}`.toLowerCase();
        if (searchTerm && !searchStr.includes(searchTerm)) return;

        if (!grouped[product.brand]) grouped[product.brand] = [];
        grouped[product.brand].push(product);
    });

    let html = '';
    
    for (const brand in grouped) {
        const products = grouped[brand];
        const safeBrand = brand.replace(/[^a-zA-Z0-9]/g, '-');
        
        // Brand Header Row
        html += `
        <tr class="table-light border-bottom border-top" onclick="toggleBrand('${safeBrand}')" style="cursor:pointer;">
            <td colspan="10" class="fw-bold text-dark py-3">
                <i class="fa-solid fa-chevron-right me-2 text-primary" id="icon-${safeBrand}"></i> 
                ${brand} 
                <span class="badge bg-secondary rounded-pill ms-2">${products.length} Inverters</span>
            </td>
        </tr>`;

        // Product Rows
        products.forEach(product => {
            const statusBadge = product.status === 'Active' 
                ? '<span class="badge bg-success">Active</span>' 
                : '<span class="badge bg-danger">Inactive</span>';

            html += `
            <tr class="brand-row-${safeBrand}" style="display:none;">
                <td class="fw-bold text-primary" style="cursor:pointer;" onclick="editProduct('${product.id}')">${product.id}</td>
                <td class="fw-medium">${product.brand}</td>
                <td class="fw-bold">${product.capacity}</td>
                <td><span class="badge bg-info text-dark">${product.systemType || 'On-Grid'}</span></td>
                <td>${product.phase}</td>
                <td>₹${product.price}</td>
                <td class="small text-muted">${product.supplier || '-'}</td>
                <td>${product.warranty || 0} Yrs</td>
                <td>${statusBadge}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border" onclick="editProduct('${product.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="cloneProduct('${product.id}')" title="Clone"><i class="fa-solid fa-copy"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
    }
    
        
        tbody.innerHTML = html;
        if (html === '') tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No inverters found.</td></tr>';
    } catch (e) {
        console.error("Render error:", e);
        if (tbody) tbody.innerHTML = `<tr><td colspan="10" class="text-danger text-center fw-bold">Error loading data: ${e.message}</td></tr>`;
    }
}

// Global function to toggle rows
window.toggleBrand = function(brandId) {
    const rows = document.querySelectorAll(`.brand-row-${brandId}`);
    const icon = document.getElementById(`icon-${brandId}`);
    let isHidden = false;
    
    rows.forEach(row => {
        if (row.style.display === 'none') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
            isHidden = true;
        }
    });
    
    if (isHidden) {
        icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
    } else {
        icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
    }
};

function openForm(product = null) {
    document.getElementById('list-view').classList.add('d-none');
    document.getElementById('form-view').classList.remove('d-none');
    
    if (product) {
        editingId = product.id;
        document.getElementById('f-id').value = product.id;
        document.getElementById('f-brand').value = product.brand || '';
        document.getElementById('f-cap').value = product.capacity || '';
        document.getElementById('f-phase').value = product.phase || 'Single Phase';
        document.getElementById('f-price').value = product.price || '';
        document.getElementById('f-gst').value = product.gst || 18;
        document.getElementById('f-supplier').value = product.supplier || '';
        document.getElementById('f-warranty').value = product.warranty || 5;
        document.getElementById('f-status').value = product.status || 'Active';
        document.getElementById('f-systemType').value = product.systemType || 'On-Grid';
    } else {
        editingId = null;
        document.getElementById('f-id').value = `INV-${Math.floor(Math.random()*10000)}`;
        document.getElementById('f-brand').value = '';
        document.getElementById('f-cap').value = '';
        document.getElementById('f-phase').value = 'Single Phase';
        document.getElementById('f-price').value = '';
        document.getElementById('f-gst').value = 18;
        document.getElementById('f-supplier').value = '';
        document.getElementById('f-warranty').value = 5;
        document.getElementById('f-status').value = 'Active';
        document.getElementById('f-systemType').value = 'On-Grid';
    }
}

function closeForm() {
    document.getElementById('form-view').classList.add('d-none');
    document.getElementById('list-view').classList.remove('d-none');
    renderList();
}

function saveProduct() {
    const db = getMasterData();
    
    const newProduct = {
        id: document.getElementById('f-id').value,
        brand: document.getElementById('f-brand').value,
        capacity: document.getElementById('f-cap').value,
        phase: document.getElementById('f-phase').value,
        systemType: document.getElementById('f-systemType').value,
        price: parseFloat(document.getElementById('f-price').value) || 0,
        gst: parseFloat(document.getElementById('f-gst').value) || 18,
        supplier: document.getElementById('f-supplier').value,
        warranty: parseInt(document.getElementById('f-warranty').value) || 0,
        status: document.getElementById('f-status').value
    };

    if (editingId) {
        const idx = db.inverterProducts.findIndex(p => p.id === editingId);
        if (idx !== -1) db.inverterProducts[idx] = newProduct;
    } else {
        db.inverterProducts.unshift(newProduct);
    }
    
    saveMasterData(db);
    closeForm();
}

function editProduct(id) {
    const db = getMasterData();
    const product = db.inverterProducts.find(p => p.id === id);
    if (product) openForm(product);
}

function deleteProduct(id) {
    if(confirm(`Are you sure you want to delete ${id}?`)) {
        const db = getMasterData();
        db.inverterProducts = db.inverterProducts.filter(p => p.id !== id);
        saveMasterData(db);
        renderList();
    }
}

function cloneProduct(id) {
    const db = getMasterData();
    const product = db.inverterProducts.find(p => p.id === id);
    if (product) {
        const clone = { ...product, id: product.id + '-COPY' };
        openForm(clone);
    }
}

function handleCSVImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        
        if (rows.length < 2) {
            alert('Invalid CSV format. Needs a header row and data.');
            return;
        }

        // Basic CSV Parser: Code,Brand,Capacity,Phase,Price,Supplier
        const db = getMasterData();
        let imported = 0;

        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;
            const cols = rows[i].split(',');
            if (cols.length >= 5) {
                db.inverterProducts.push({
                    id: cols[0].trim(),
                    brand: cols[1].trim(),
                    capacity: cols[2].trim(),
                    phase: cols[3].trim(),
                    price: parseFloat(cols[4].trim()) || 0,
                    supplier: cols[5] ? cols[5].trim() : '',
                    gst: 18, warranty: 5, status: 'Active'
                });
                imported++;
            }
        }
        saveMasterData(db);
        alert(`Successfully imported ${imported} inverters!`);
        renderList();
        // Reset file input
        event.target.value = '';
    };
    reader.readAsText(file);
}
