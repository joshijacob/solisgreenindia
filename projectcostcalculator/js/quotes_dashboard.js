// js/quotes_dashboard.js

let quotesCache = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Wait a brief moment to ensure Firebase is initialized
    setTimeout(() => {
        if (typeof dbFirestore !== 'undefined') {
            loadQuotes();
        } else {
            document.getElementById('quotesTableBody').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-danger fw-bold">
                        <i class="fa-solid fa-triangle-exclamation me-2"></i> Firebase not initialized.
                    </td>
                </tr>
            `;
        }
    }, 500);
});

async function loadQuotes() {
    const tbody = document.getElementById('quotesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4 text-muted">
                <i class="fa-solid fa-spinner fa-spin me-2"></i> Loading quotes...
            </td>
        </tr>
    `;

    try {
        const snapshot = await dbFirestore.collection('solis-quotes').orderBy('createdAt', 'desc').get();
        quotesCache = [];
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        No quotes have been saved yet.
                    </td>
                </tr>
            `;
            return;
        }

        const userRole = sessionStorage.getItem('solis_user_role');
        const userEmail = sessionStorage.getItem('solis_user_email');

        let html = '';
        let visibleCount = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // If the user is a sales executive, skip quotes that don't belong to them
            if (userRole !== 'admin' && data.createdByEmail !== userEmail) {
                return;
            }

            visibleCount++;
            data.id = doc.id;
            quotesCache.push(data);

            let dateStr = 'Just now';
            if (data.createdAt) {
                if (typeof data.createdAt.toDate === 'function') {
                    dateStr = data.createdAt.toDate().toLocaleString();
                } else if (typeof data.createdAt.toMillis === 'function') {
                    dateStr = new Date(data.createdAt.toMillis()).toLocaleString();
                } else {
                    dateStr = new Date(data.createdAt).toLocaleString();
                }
            }
            
            const customerName = data.parameters?.customerName || 'N/A';
            const contact = data.parameters?.contactNumber || 'N/A';
            const capacity = data.parameters?.capacity || 'N/A';
            const exec = data.createdByEmail || 'Unknown';
            
            const total = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0
            }).format(data.summary?.totalLanding || 0);

            html += `
                <tr>
                    <td class="ps-4 text-muted small">${dateStr}</td>
                    <td class="fw-bold">${customerName}</td>
                    <td>${contact}</td>
                    <td><span class="badge bg-primary">${capacity}</span></td>
                    <td class="small text-muted">${exec}</td>
                    <td class="text-end fw-bold text-success">${total}</td>
                    <td class="text-center pe-4">
                        <button class="btn btn-sm btn-outline-warning" onclick="loadQuoteForEditing('${doc.id}')" title="Edit Quote">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary ms-1" onclick="viewQuote('${doc.id}')" title="View Details">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${sessionStorage.getItem('solis_user_role') === 'admin' ? `
                        <button class="btn btn-sm btn-outline-danger ms-1" onclick="deleteQuote('${doc.id}')" title="Delete Quote">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        });
        
        if (visibleCount === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        You have not saved any quotes yet.
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = html;
        }
    } catch (error) {
        console.error("Error loading quotes:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-danger fw-bold">
                    <i class="fa-solid fa-triangle-exclamation me-2"></i> Error loading quotes: ${error.message || error}
                </td>
            </tr>
        `;
    }
}

function viewQuote(id) {
    const quote = quotesCache.find(q => q.id === id);
    if (!quote) return;

    const modalBody = document.getElementById('quoteDetailsContent');
    
    const p = quote.parameters || {};
    const s = quote.summary || {};
    
    const fmt = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(val);

    modalBody.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <h6 class="text-muted fw-bold small text-uppercase mb-1">Customer Details</h6>
                <div class="p-3 bg-light rounded">
                    <strong>Name:</strong> ${p.customerName || 'N/A'}<br>
                    <strong>Contact:</strong> ${p.contactNumber || 'N/A'}<br>
                    <strong>District:</strong> ${p.district || 'N/A'}<br>
                    <strong>Notes:</strong> ${p.specialNotes || 'None'}
                </div>
            </div>
            <div class="col-md-6">
                <h6 class="text-muted fw-bold small text-uppercase mb-1">Project Details</h6>
                <div class="p-3 bg-light rounded">
                    <strong>Capacity:</strong> ${p.capacity || 'N/A'}<br>
                    <strong>Roof Type:</strong> ${p.roofType || 'N/A'}<br>
                    <strong>Phase:</strong> ${p.phase || 'N/A'}<br>
                    <strong>Net Meter Scope:</strong> ${p.netMeterScope || 'N/A'}
                </div>
            </div>
            <div class="col-12 mt-4">
                <h6 class="text-muted fw-bold small text-uppercase mb-1">Financial Summary</h6>
                <table class="table table-bordered mb-0">
                    <tbody class="bg-light">
                        <tr>
                            <td>Total Base Price</td>
                            <td class="text-end fw-bold">${fmt(s.totalBase || 0)}</td>
                        </tr>
                        <tr>
                            <td>Total GST</td>
                            <td class="text-end text-danger">${fmt(s.totalGst || 0)}</td>
                        </tr>
                        <tr class="table-success">
                            <td class="fw-bold">Total Landing Price</td>
                            <td class="text-end fw-bold text-success fs-5">${fmt(s.totalLanding || 0)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ${(quote.detailedBOM && quote.detailedBOM.length > 0 && sessionStorage.getItem('solis_user_role') === 'admin') ? `
            <div class="col-12 mt-4">
                <h6 class="text-muted fw-bold small text-uppercase mb-1">Detailed BOM</h6>
                <div class="table-responsive">
                    <table class="table table-bordered table-sm mb-0 small">
                        <thead class="table-light">
                            <tr>
                                <th>Component Name</th>
                                <th class="text-center">Category</th>
                                <th class="text-center">Qty</th>
                                <th class="text-end">Base (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${quote.detailedBOM.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td class="text-center"><span class="badge bg-secondary">${item.category}</span></td>
                                <td class="text-center">${item.qty}</td>
                                <td class="text-end">${fmt(item.base)}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : (sessionStorage.getItem('solis_user_role') !== 'admin' ? '' : `
            <div class="col-12 mt-4 text-center text-muted small">
                <em>Detailed BOM not saved for this quote.</em>
            </div>
            `)}
        </div>
    `;

    const myModal = new bootstrap.Modal(document.getElementById('quoteDetailsModal'));
    myModal.show();
}

async function deleteQuote(id) {
    if (confirm("Are you sure you want to permanently delete this quote?")) {
        try {
            await dbFirestore.collection('solis-quotes').doc(id).delete();
            loadQuotes(); // Refresh table
        } catch (error) {
            console.error("Error deleting quote:", error);
            alert("Failed to delete quote: " + error.message);
        }
    }
}

function loadQuoteForEditing(id) {
    const quote = quotesCache.find(q => q.id === id);
    if (!quote || !quote.parameters) {
        alert("Cannot edit this quote: Parameter data is missing.");
        return;
    }
    
    // Store quote ID and parameters in session storage
    sessionStorage.setItem('solis_edit_quote_id', id);
    sessionStorage.setItem('solis_edit_quote_params', JSON.stringify(quote.parameters));
    
    // Redirect to index page
    window.location.href = 'index.html';
}
