// Helper to resolve clean Sales Executive display name (never showing raw email)
function getSalesExecutiveDisplayName(data) {
    if (!data) return 'Sales Executive';
    
    // 1. Direct salesExecutive field (clean name, not email)
    if (data.salesExecutive && typeof data.salesExecutive === 'string' && !data.salesExecutive.includes('@')) {
        return data.salesExecutive.trim();
    }
    // 2. Direct createdByName field
    if (data.createdByName && typeof data.createdByName === 'string' && !data.createdByName.includes('@')) {
        return data.createdByName.trim();
    }
    // 3. From parameters object
    if (data.parameters?.salesExecutive && typeof data.parameters.salesExecutive === 'string' && !data.parameters.salesExecutive.includes('@')) {
        return data.parameters.salesExecutive.trim();
    }

    // 4. Resolve from createdByEmail or userEmail
    const email = data.createdByEmail || data.userEmail || '';
    if (typeof window.resolveSalesExecutiveName === 'function') {
        return window.resolveSalesExecutiveName(email);
    }
    
    const norm = email.toLowerCase().trim();
    if (norm === 'solisgreenenergysolutions@gmail.com' || norm.includes('solisgreenenergy')) return 'Solis Super Admin';
    if (norm === 'joshijacob@gmail.com') return 'Joshi Jacob';
    
    try {
        const dbUsers = JSON.parse(localStorage.getItem('solis_users_db') || '[]');
        const matched = dbUsers.find(u => u.email && u.email.toLowerCase() === norm);
        if (matched && matched.name) return matched.name;
    } catch(e) {}
    
    if (norm) {
        const prefix = norm.split('@')[0];
        return prefix.split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    }
    return 'Sales Executive';
}
window.getSalesExecutiveDisplayName = getSalesExecutiveDisplayName;

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

        const userRole = (sessionStorage.getItem('solis_user_role') || localStorage.getItem('solis_user_role') || '').toLowerCase();
        const userEmail = (sessionStorage.getItem('solis_user_email') || localStorage.getItem('solis_user_email') || '').toLowerCase();
        const isAdmin = (userRole === 'admin' || userRole === 'super_admin' || userEmail === 'solisgreenenergysolutions@gmail.com');

        let html = '';
        let visibleCount = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // If the user is a sales executive, skip quotes that don't belong to them
            if (!isAdmin && data.createdByEmail !== userEmail) {
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
            const execName = getSalesExecutiveDisplayName(data);
            
            const total = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0
            }).format(data.summary?.totalLanding || 0);

            const revNum = (typeof data.revision === 'number') ? data.revision : (parseInt(data.revision) || 0);
            const revLabel = data.revisionLabel || (revNum > 0 ? `Rev-${String(revNum).padStart(2, '0')}` : 'Rev-00');
            const isRevZero = revNum === 0;
            const nextRevLabel = isRevZero ? 'Rev-01' : `Rev-${String(revNum + 1).padStart(2, '0')}`;

            const revBadgeHtml = isRevZero
                ? `<span class="badge bg-secondary-subtle text-secondary border font-mono">Rev-00</span>`
                : `<span class="badge bg-success-subtle text-success border border-success-subtle fw-bold font-mono">${revLabel}</span>`;

            html += `
                <tr>
                    <td class="ps-4 text-muted small">${dateStr}</td>
                    <td class="fw-bold">
                        ${customerName}
                        ${data.parameters?.ksebConsumerNo ? `<div class="text-muted font-mono" style="font-size: 0.68rem;" title="KSEB Consumer No"><i class="fa-solid fa-bolt text-warning me-1"></i>${data.parameters.ksebConsumerNo}</div>` : ''}
                    </td>
                    <td>${contact}</td>
                    <td><span class="badge bg-primary">${capacity}</span></td>
                    <td class="text-center">
                        ${revBadgeHtml}
                        ${data.parentQuoteId ? `<div class="text-muted font-mono" style="font-size: 0.65rem;" title="Child of earlier quote"><i class="fa-solid fa-code-branch me-1"></i>Chld</div>` : ''}
                    </td>
                    <td class="small fw-semibold text-dark">
                        <div class="d-flex align-items-center gap-1">
                            <i class="fa-solid fa-user-tie text-primary opacity-75"></i>
                            <span>${execName}</span>
                        </div>
                    </td>
                    <td class="text-end fw-bold text-success">${total}</td>
                    <td class="text-center pe-3">
                        <div class="dropdown">
                            <button class="btn btn-sm btn-light border rounded-circle shadow-sm p-0 d-inline-flex align-items-center justify-content-center"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    data-bs-popper-config='{"strategy":"fixed"}'
                                    aria-expanded="false"
                                    style="width: 32px; height: 32px;"
                                    title="Quote Actions">
                                <i class="fa-solid fa-ellipsis-vertical text-secondary"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 py-1 rounded-3" style="font-size: 0.85rem; min-width: 195px; z-index: 1060;">
                                <li>
                                    <a class="dropdown-item py-2 d-flex align-items-center" href="javascript:void(0)" onclick="viewQuote('${doc.id}')">
                                        <i class="fa-solid fa-eye text-primary me-2" style="width: 18px;"></i>
                                        <span>View Proposal</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item py-2 d-flex align-items-center" href="javascript:void(0)" onclick="reviseQuote('${doc.id}')">
                                        <i class="fa-solid fa-arrows-rotate text-success me-2" style="width: 18px;"></i>
                                        <span>Revise Quote <small class="text-muted ms-1">(${nextRevLabel})</small></span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item py-2 d-flex align-items-center" href="javascript:void(0)" onclick="loadQuoteForEditing('${doc.id}')">
                                        <i class="fa-solid fa-pen-to-square text-secondary me-2" style="width: 18px;"></i>
                                        <span>Quick Edit Info</span>
                                    </a>
                                </li>
                                <li><hr class="dropdown-divider my-1"></li>
                                <li>
                                    <a class="dropdown-item py-2 d-flex align-items-center text-danger fw-semibold" href="javascript:void(0)" onclick="deleteQuote('${doc.id}')">
                                        <i class="fa-solid fa-trash me-2" style="width: 18px;"></i>
                                        <span>Delete Quote</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        if (visibleCount === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">
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
                <td colspan="8" class="text-center py-4 text-danger fw-bold">
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

    const revNum = (typeof quote.revision === 'number') ? quote.revision : (parseInt(quote.revision) || 0);
    const revLabel = quote.revisionLabel || (revNum > 0 ? `Rev-${String(revNum).padStart(2, '0')}` : 'Rev-00');
    const isRevZero = revNum === 0;
    const nextRevLabel = `Rev-${String(revNum + 1).padStart(2, '0')}`;

    let dateStr = 'Just now';
    if (quote.createdAt) {
        if (typeof quote.createdAt.toDate === 'function') dateStr = quote.createdAt.toDate().toLocaleString();
        else if (typeof quote.createdAt.toMillis === 'function') dateStr = new Date(quote.createdAt.toMillis()).toLocaleString();
        else dateStr = new Date(quote.createdAt).toLocaleString();
    }

    modalBody.innerHTML = `
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center bg-light p-3 rounded border mb-3 gap-2">
            <div>
                <span class="badge ${isRevZero ? 'bg-secondary' : 'bg-success'} fs-6 font-mono me-2">${revLabel}</span>
                <span class="text-muted small">Generated on ${dateStr}</span>
                ${quote.parentQuoteId ? `<div class="small text-muted mt-1"><i class="fa-solid fa-code-branch text-primary me-1"></i> Revision of earlier quote (Doc: ${quote.parentQuoteId})</div>` : ''}
            </div>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-sm btn-success rounded-pill fw-bold px-3 shadow-sm" onclick="bootstrap.Modal.getInstance(document.getElementById('quoteDetailsModal')).hide(); reviseQuote('${quote.id}');">
                    <i class="fa-solid fa-arrows-rotate me-1"></i> Re-calculate as ${nextRevLabel}
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger rounded-pill fw-bold px-3" onclick="deleteQuote('${quote.id}')" title="Delete this quote">
                    <i class="fa-solid fa-trash me-1"></i> Delete Quote
                </button>
            </div>
        </div>

        <div class="row g-3">
            <div class="col-md-6">
                <h6 class="text-muted fw-bold small text-uppercase mb-1">Customer & Representative</h6>
                <div class="p-3 bg-light rounded">
                    <strong>Sales Executive:</strong> <span class="fw-bold text-primary"><i class="fa-solid fa-user-tie me-1"></i>${getSalesExecutiveDisplayName(quote)}</span><br>
                    <strong>Name:</strong> ${p.customerName || 'N/A'}<br>
                    <strong>Contact:</strong> ${p.contactNumber || 'N/A'}<br>
                    <strong>District:</strong> ${p.district || 'N/A'}<br>
                    ${p.ksebConsumerNo ? `<strong>KSEB Consumer No:</strong> <span class="font-mono fw-bold text-dark">${p.ksebConsumerNo}</span><br>` : ''}
                    ${p.ksebFeasibilityStatus && p.ksebFeasibilityStatus !== 'Not Checked' ? `<strong>KSEB Feasibility:</strong> <span class="badge ${p.ksebFeasibilityStatus === 'Approved' ? 'bg-success' : (p.ksebFeasibilityStatus === 'Transformer Overloaded' ? 'bg-danger' : 'bg-secondary')}">${p.ksebFeasibilityStatus}</span> ${p.dtrBalanceCap ? `(${p.dtrBalanceCap} kW balance)` : ''}<br>` : ''}
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
                            <td>Total GST <small class="text-muted">(70% Goods @ 5% + 30% Services @ 18% &bull; 8.9% Eff.)</small></td>
                            <td class="text-end text-danger">${fmt(s.totalGst || 0)}</td>
                        </tr>
                        <tr class="table-success">
                            <td class="fw-bold">Total Landing Price</td>
                            <td class="text-end fw-bold text-success fs-5">${fmt(s.totalLanding || 0)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ${(quote.detailedBOM && quote.detailedBOM.length > 0 && isAdmin) ? `
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
            ` : (!isAdmin ? '' : `
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
    const quote = quotesCache.find(q => q.id === id);
    const custName = quote?.parameters?.customerName || 'this quote';
    const capacity = quote?.parameters?.capacity || '';
    const capInfo = capacity ? ` (${capacity})` : '';

    if (confirm(`Are you sure you want to permanently delete the quote for "${custName}"${capInfo}?`)) {
        try {
            // Close details modal if open
            const modalEl = document.getElementById('quoteDetailsModal');
            if (modalEl) {
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();
            }

            await dbFirestore.collection('solis-quotes').doc(id).delete();
            console.log("Successfully deleted quote ID:", id);
            await loadQuotes(); // Refresh table
        } catch (error) {
            console.error("Error deleting quote:", error);
            alert("Failed to delete quote: " + error.message);
        }
    }
}
window.deleteQuote = deleteQuote;
window.viewQuote = viewQuote;

function reviseQuote(id) {
    const quote = quotesCache.find(q => q.id === id);
    if (!quote || !quote.parameters) {
        alert("Cannot revise this quote: Parameter data is missing.");
        return;
    }

    const currentRev = (typeof quote.revision === 'number') ? quote.revision : (parseInt(quote.revision) || 0);
    const nextRev = currentRev + 1;
    const nextRevLabel = `Rev-${String(nextRev).padStart(2, '0')}`;
    const custName = quote.parameters.customerName || 'Customer';

    sessionStorage.setItem('solis_quote_mode', 'revise');
    sessionStorage.setItem('solis_parent_quote_id', id);
    sessionStorage.setItem('solis_root_quote_id', quote.rootQuoteId || id);
    sessionStorage.setItem('solis_parent_rev', String(currentRev));
    sessionStorage.setItem('solis_next_rev', String(nextRev));
    sessionStorage.setItem('solis_next_rev_label', nextRevLabel);
    sessionStorage.setItem('solis_customer_name', custName);
    if (!quote.parameters.salesExecutive) {
        quote.parameters.salesExecutive = getSalesExecutiveDisplayName(quote);
    }
    sessionStorage.setItem('solis_edit_quote_params', JSON.stringify(quote.parameters));

    // Clear in-place edit ID so this NEVER overwrites the old quote
    sessionStorage.removeItem('solis_edit_quote_id');

    window.location.href = 'index.html';
}

function loadQuoteForEditing(id) {
    const quote = quotesCache.find(q => q.id === id);
    if (!quote || !quote.parameters) {
        alert("Cannot edit this quote: Parameter data is missing.");
        return;
    }
    
    sessionStorage.setItem('solis_quote_mode', 'edit');
    sessionStorage.setItem('solis_edit_quote_id', id);
    sessionStorage.setItem('solis_edit_quote_params', JSON.stringify(quote.parameters));
    sessionStorage.removeItem('solis_parent_quote_id');
    sessionStorage.removeItem('solis_next_rev');
    sessionStorage.removeItem('solis_next_rev_label');
    
    window.location.href = 'index.html';
}

window.reviseQuote = reviseQuote;
window.loadQuoteForEditing = loadQuoteForEditing;
