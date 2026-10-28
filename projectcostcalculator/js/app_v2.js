// app_v2.js - Sales Dashboard Interactions & Robust Cascading Engine

// Helper to retrieve master data safely and immediately
function getSafeMasterData() {
    if (typeof getMasterData === 'function') {
        try {
            const d = getMasterData();
            if (d && d.panelProducts && d.panelProducts.length > 0) return d;
        } catch(e) {}
    }
    if (typeof DEFAULT_MASTER_DATA !== 'undefined' && DEFAULT_MASTER_DATA.panelProducts) {
        return DEFAULT_MASTER_DATA;
    }
    return null;
}

function getSafeBOMTemplates() {
    if (typeof getBOMTemplates === 'function') {
        try {
            const b = getBOMTemplates();
            if (b && b['On-Grid']) return b;
        } catch(e) {}
    }
    if (typeof DEFAULT_BOM_TEMPLATES !== 'undefined') {
        return DEFAULT_BOM_TEMPLATES;
    }
    return null;
}

// Global variables accessible across module - initialized immediately from safe source
let db = getSafeMasterData();
let activePanels = (db && db.panelProducts ? db.panelProducts : []).filter(p => !p.status || p.status.toLowerCase() === 'active');
if (activePanels.length === 0 && typeof DEFAULT_MASTER_DATA !== 'undefined') {
    activePanels = DEFAULT_MASTER_DATA.panelProducts;
}

let activeInverters = (db && db.inverterProducts ? db.inverterProducts : []).filter(p => !p.status || p.status.toLowerCase() === 'active');
if (activeInverters.length === 0 && typeof DEFAULT_MASTER_DATA !== 'undefined') {
    activeInverters = DEFAULT_MASTER_DATA.inverterProducts;
}

let boms = getSafeBOMTemplates();

// Refresh active arrays helper
function refreshActiveCatalogs() {
    db = getSafeMasterData();
    if (db && db.panelProducts && db.panelProducts.length > 0) {
        activePanels = db.panelProducts.filter(p => !p.status || p.status.toLowerCase() === 'active');
    }
    if (db && db.inverterProducts && db.inverterProducts.length > 0) {
        activeInverters = db.inverterProducts.filter(p => !p.status || p.status.toLowerCase() === 'active');
    }
    boms = getSafeBOMTemplates();
}

// --- Cascading Functions (Attached to window for both inline onchange and listener execution) ---

window.handlePanelBrandChange = function() {
    const brandSelect = document.getElementById('panelBrand');
    const techSelect = document.getElementById('panelTech');
    const certSelect = document.getElementById('panelCert');
    const wattSelect = document.getElementById('panelWatt');
    if (!brandSelect || !techSelect || !certSelect || !wattSelect) return;

    // Never disable dropdowns - keep them interactive at all times
    techSelect.disabled = false;
    certSelect.disabled = false;
    wattSelect.disabled = false;

    if (!activePanels || activePanels.length === 0) {
        refreshActiveCatalogs();
    }

    const brand = brandSelect.value;
    const prevTech = techSelect.value;
    techSelect.innerHTML = '<option value="">Select...</option>';

    if (!brand) {
        ['TOPCon', 'Bifacial', 'Mono PERC'].forEach(t => techSelect.add(new Option(t, t)));
        if (prevTech && Array.from(techSelect.options).some(o => o.value === prevTech)) {
            techSelect.value = prevTech;
        } else {
            techSelect.selectedIndex = 1;
        }
        window.handlePanelTechChange();
        return;
    }

    const brandPanels = activePanels.filter(p => p.brand === brand);
    let techs = [...new Set(brandPanels.map(p => p.technology).filter(Boolean))];
    if (techs.length === 0) {
        techs = ['TOPCon', 'Bifacial', 'Mono PERC'];
    }
    techs.forEach(t => techSelect.add(new Option(t, t)));

    // Retain previous tech if available in new brand, otherwise auto-select first
    if (prevTech && Array.from(techSelect.options).some(o => o.value === prevTech)) {
        techSelect.value = prevTech;
    } else if (techSelect.options.length > 1) {
        techSelect.selectedIndex = 1;
    }

    window.handlePanelTechChange();
};

window.handlePanelTechChange = function() {
    const brandSelect = document.getElementById('panelBrand');
    const techSelect = document.getElementById('panelTech');
    const certSelect = document.getElementById('panelCert');
    const wattSelect = document.getElementById('panelWatt');
    if (!brandSelect || !techSelect || !certSelect || !wattSelect) return;

    certSelect.disabled = false;
    wattSelect.disabled = false;

    if (!activePanels || activePanels.length === 0) {
        refreshActiveCatalogs();
    }

    const brand = brandSelect.value;
    const tech = techSelect.value;
    const prevCert = certSelect.value;
    certSelect.innerHTML = '<option value="">Select...</option>';

    if (!brand || !tech) {
        ['NDCR', 'DCR'].forEach(c => certSelect.add(new Option(c, c)));
        if (prevCert && Array.from(certSelect.options).some(o => o.value === prevCert)) {
            certSelect.value = prevCert;
        } else {
            certSelect.selectedIndex = 1;
        }
        window.handlePanelCertChange();
        return;
    }

    const techPanels = activePanels.filter(p => p.brand === brand && p.technology === tech);
    let certs = [...new Set(techPanels.map(p => p.certification).filter(Boolean))];
    if (certs.length === 0) {
        certs = ['NDCR', 'DCR'];
    }
    certs.forEach(c => certSelect.add(new Option(c, c)));

    // Auto-select NDCR if present, otherwise retain or pick first available certification
    if (prevCert && Array.from(certSelect.options).some(o => o.value === prevCert)) {
        certSelect.value = prevCert;
    } else {
        const ndcrIndex = Array.from(certSelect.options).findIndex(o => o.value === 'NDCR');
        certSelect.selectedIndex = ndcrIndex !== -1 ? ndcrIndex : (certSelect.options.length > 1 ? 1 : 0);
    }

    window.handlePanelCertChange();
};

window.handlePanelCertChange = function() {
    const brandSelect = document.getElementById('panelBrand');
    const techSelect = document.getElementById('panelTech');
    const certSelect = document.getElementById('panelCert');
    const wattSelect = document.getElementById('panelWatt');
    if (!brandSelect || !techSelect || !certSelect || !wattSelect) return;

    wattSelect.disabled = false;

    if (!activePanels || activePanels.length === 0) {
        refreshActiveCatalogs();
    }

    const brand = brandSelect.value;
    const tech = techSelect.value;
    const cert = certSelect.value;
    const prevWatt = wattSelect.value;
    wattSelect.innerHTML = '<option value="">Select...</option>';

    if (!brand || !tech || !cert) {
        [540, 550, 580, 605, 610, 615, 620, 625].forEach(w => wattSelect.add(new Option(w + 'W', w)));
        if (prevWatt && Array.from(wattSelect.options).some(o => o.value === prevWatt)) {
            wattSelect.value = prevWatt;
        } else {
            wattSelect.selectedIndex = 1;
        }
        window.updateRecommendedPanels();
        return;
    }

    const certPanels = activePanels.filter(p => p.brand === brand && p.technology === tech && p.certification === cert);
    let watts = [...new Set(certPanels.map(p => p.wattage).filter(Boolean))].sort((a,b) => a - b);
    if (watts.length === 0) {
        watts = [...new Set(activePanels.filter(p => p.brand === brand).map(p => p.wattage).filter(Boolean))].sort((a,b) => a - b);
    }
    if (watts.length === 0) {
        watts = [540, 550, 580, 605, 610, 615, 620, 625];
    }
    watts.forEach(w => wattSelect.add(new Option(w + 'W', w)));

    // Retain previous watt if exists, otherwise first wattage
    if (prevWatt && Array.from(wattSelect.options).some(o => o.value === String(prevWatt))) {
        wattSelect.value = prevWatt;
    } else if (wattSelect.options.length > 1) {
        wattSelect.selectedIndex = 1;
    }
    window.updateRecommendedPanels();
};

window.handlePanelWattChange = function() {
    window.updateRecommendedPanels();
};

window.updateRecommendedPanels = function() {
    const capacitySelect = document.getElementById('capacity');
    const wattSelect = document.getElementById('panelWatt');
    const panelQtyInput = document.getElementById('panelQty');
    const panelQtyHelp = document.getElementById('panelQtyHelp');
    if (!capacitySelect || !panelQtyInput) return;

    const capacity = capacitySelect.value;
    const watt = wattSelect ? wattSelect.value : null;

    if (capacity && watt) {
        const capacityKw = parseFloat(capacity.replace('kW', ''));
        const recommended = Math.ceil((capacityKw * 1000) / parseFloat(watt));
        panelQtyInput.placeholder = '' + recommended;
        if (panelQtyHelp) panelQtyHelp.innerText = '(Recommended: ' + recommended + ')';
    } else {
        panelQtyInput.placeholder = 'Auto-calculated';
        if (panelQtyHelp) panelQtyHelp.innerText = '';
    }
};

window.handleInverterBrandChange = function() {
    const invBrandSelect = document.getElementById('inverterBrand');
    const invCapSelect = document.getElementById('inverterCap');
    const invPhaseSelect = document.getElementById('inverterPhase');
    const systemTypeSelect = document.getElementById('systemType');
    const capacitySelect = document.getElementById('capacity');
    if (!invBrandSelect || !invCapSelect || !invPhaseSelect) return;

    invCapSelect.disabled = false;
    invPhaseSelect.disabled = false;

    if (!activeInverters || activeInverters.length === 0) {
        refreshActiveCatalogs();
    }

    const brand = invBrandSelect.value;
    const prevCap = invCapSelect.value;
    invCapSelect.innerHTML = '<option value="">Select...</option>';
    invPhaseSelect.innerHTML = '<option value="">Select...</option>';

    if (!brand) {
        ['3kW', '5kW', '8kW', '10kW'].forEach(c => invCapSelect.add(new Option(c, c)));
        ['Single Phase', 'Three Phase'].forEach(ph => invPhaseSelect.add(new Option(ph, ph)));
        return;
    }

    const sysType = systemTypeSelect ? systemTypeSelect.value : 'On-Grid';
    const matching = activeInverters.filter(p => p.brand === brand && (p.type === sysType || (!p.type && sysType === 'On-Grid')));
    let caps = [...new Set(matching.map(p => p.capacity).filter(Boolean))].sort((a,b) => parseFloat(a) - parseFloat(b));

    if (caps.length === 0) {
        caps = ['3kW', '5kW', '8kW', '10kW'];
    }
    caps.forEach(c => invCapSelect.add(new Option(c, c)));

    // Auto-select: match Project Capacity if exists, otherwise first option
    const projCap = capacitySelect ? capacitySelect.value : prevCap;
    const matchingCapOpt = Array.from(invCapSelect.options).find(o => o.value === projCap);
    if (matchingCapOpt) {
        invCapSelect.value = projCap;
    } else if (invCapSelect.options.length > 1) {
        invCapSelect.selectedIndex = 1;
    }
    window.handleInverterCapChange();
};

window.handleInverterCapChange = function() {
    const invBrandSelect = document.getElementById('inverterBrand');
    const invCapSelect = document.getElementById('inverterCap');
    const invPhaseSelect = document.getElementById('inverterPhase');
    const systemTypeSelect = document.getElementById('systemType');
    if (!invBrandSelect || !invCapSelect || !invPhaseSelect) return;

    invPhaseSelect.disabled = false;

    if (!activeInverters || activeInverters.length === 0) {
        refreshActiveCatalogs();
    }

    const brand = invBrandSelect.value;
    const cap = invCapSelect.value;
    const prevPhase = invPhaseSelect.value;
    invPhaseSelect.innerHTML = '<option value="">Select...</option>';

    if (!brand || !cap) {
        ['Single Phase', 'Three Phase'].forEach(ph => invPhaseSelect.add(new Option(ph, ph)));
        if (prevPhase && Array.from(invPhaseSelect.options).some(o => o.value === prevPhase)) {
            invPhaseSelect.value = prevPhase;
        } else {
            invPhaseSelect.selectedIndex = 1;
        }
        return;
    }

    const sysType = systemTypeSelect ? systemTypeSelect.value : 'On-Grid';
    const matching = activeInverters.filter(p => p.brand === brand && p.capacity === cap && (p.type === sysType || (!p.type && sysType === 'On-Grid')));
    let phases = [...new Set(matching.map(p => p.phase).filter(Boolean))];

    if (phases.length === 0) {
        phases = ['Single Phase', 'Three Phase'];
    }
    phases.forEach(ph => invPhaseSelect.add(new Option(ph, ph)));

    // Auto-select default phase: Single Phase for <= 5kW, Three Phase for > 5kW
    const capKw = parseFloat(cap.replace('kW', '')) || 3;
    const defaultPhase = capKw <= 5 ? 'Single Phase' : 'Three Phase';
    if (Array.from(invPhaseSelect.options).some(o => o.value === defaultPhase)) {
        invPhaseSelect.value = defaultPhase;
    } else if (invPhaseSelect.options.length > 1) {
        invPhaseSelect.selectedIndex = 1;
    }
};

window.handleInverterPhaseChange = function() {
    // Inverter phase explicitly confirmed
};

window.handleCapacityChange = function() {
    const capacitySelect = document.getElementById('capacity');
    const invBrandSelect = document.getElementById('inverterBrand');
    const invCapSelect = document.getElementById('inverterCap');
    const phaseSelect = document.getElementById('phase');
    const targetProfitInput = document.getElementById('targetProfit');

    const capValue = capacitySelect ? capacitySelect.value : '';
    if (capValue) {
        const capacityKw = parseFloat(capValue.replace('kW', '')) || 3;
        if (targetProfitInput) targetProfitInput.value = capacityKw * 10000;
        if (phaseSelect) phaseSelect.value = capacityKw <= 5 ? 'Single Phase' : 'Three Phase';

        // Auto-sync Inverter Capacity if Inverter Brand is selected
        if (invBrandSelect && invBrandSelect.value && invCapSelect && !invCapSelect.disabled) {
            const hasOption = Array.from(invCapSelect.options).some(o => o.value === capValue);
            if (hasOption) {
                invCapSelect.value = capValue;
                window.handleInverterCapChange();
            }
        }
    }
    window.updateRecommendedPanels();
};

window.handleSystemTypeChange = function() {
    const systemTypeSelect = document.getElementById('systemType');
    const batteryWrapper = document.getElementById('batteryWrapper');
    const batterySelect = document.getElementById('batteryProduct');
    const manualInverterQtyWrapper = document.getElementById('manualInverterQtyWrapper');
    const capacitySelect = document.getElementById('capacity');
    const invBrandSelect = document.getElementById('inverterBrand');
    if (!systemTypeSelect) return;

    const sysType = systemTypeSelect.value || 'On-Grid';

    if (batteryWrapper && batterySelect) {
        if (sysType === 'Hybrid') {
            batteryWrapper.classList.remove('d-none');
            batterySelect.required = true;
        } else {
            batteryWrapper.classList.add('d-none');
            batterySelect.required = false;
            batterySelect.value = '';
        }
    }

    if (manualInverterQtyWrapper) {
        if (sysType === 'Micro Inverter') {
            manualInverterQtyWrapper.classList.remove('d-none');
        } else {
            manualInverterQtyWrapper.classList.add('d-none');
            const manualInvQty = document.getElementById('manualInverterQty');
            if (manualInvQty) manualInvQty.value = '';
        }
    }

    // Populate capacities from BOM templates
    if (capacitySelect) {
        const prevCap = capacitySelect.value;
        capacitySelect.innerHTML = '<option value="">Select...</option>';
        if (boms && boms[sysType] && Object.keys(boms[sysType]).length > 0) {
            const caps = Object.keys(boms[sysType]).sort((a,b) => parseFloat(a) - parseFloat(b));
            caps.forEach(c => capacitySelect.add(new Option(c, c)));
        } else {
            ['3kW', '5kW', '8kW', '10kW'].forEach(c => capacitySelect.add(new Option(c, c)));
        }
        if (prevCap && Array.from(capacitySelect.options).some(o => o.value === prevCap)) {
            capacitySelect.value = prevCap;
        } else if (capacitySelect.options.length > 1) {
            capacitySelect.selectedIndex = 1;
        }
    }

    // Populate Inverter Brands for this system type
    if (invBrandSelect) {
        const prevInvBrand = invBrandSelect.value;
        invBrandSelect.innerHTML = '<option value="">Select...</option>';
        const filteredInverters = activeInverters.filter(p => (p.type === sysType || p.systemType === sysType || (!p.type && !p.systemType && sysType === 'On-Grid')));
        const invBrands = [...new Set(filteredInverters.map(p => p.brand).filter(Boolean))];
        if (invBrands.length === 0) {
            ['Solis', 'Deye', 'Growatt', 'GoodWe', 'Sungrow', 'Sofar', 'Ksolare'].forEach(b => invBrandSelect.add(new Option(b, b)));
        } else {
            invBrands.forEach(b => invBrandSelect.add(new Option(b, b)));
        }
        if (prevInvBrand && Array.from(invBrandSelect.options).some(o => o.value === prevInvBrand)) {
            invBrandSelect.value = prevInvBrand;
            window.handleInverterBrandChange();
        } else {
            const invCapSelect = document.getElementById('inverterCap');
            const invPhaseSelect = document.getElementById('inverterPhase');
            if (invCapSelect) { invCapSelect.innerHTML = '<option value="">Select...</option>'; invCapSelect.disabled = true; }
            if (invPhaseSelect) { invPhaseSelect.innerHTML = '<option value="">Select...</option>'; invPhaseSelect.disabled = true; }
        }
    }

    window.handleCapacityChange();
};

async function initApp() {
    const form = document.getElementById('sales-form');
    if (!form) return;

    // Ensure all form elements are in scope
    const brandSelect = document.getElementById('panelBrand');
    const techSelect = document.getElementById('panelTech');
    const certSelect = document.getElementById('panelCert');
    const wattSelect = document.getElementById('panelWatt');
    const invBrandSelect = document.getElementById('inverterBrand');
    const invCapSelect = document.getElementById('inverterCap');
    const invPhaseSelect = document.getElementById('inverterPhase');
    const systemTypeSelect = document.getElementById('systemType');
    const capacitySelect = document.getElementById('capacity');
    const panelQtyInput = document.getElementById('panelQty');
    const panelQtyHelp = document.getElementById('panelQtyHelp');
    const batterySelect = document.getElementById('batteryProduct');
    const roofTypeSelect = document.getElementById('roofType');
    const customRoofWrapper = document.getElementById('customRoofWrapper');

    // Load Master Data & BOM Templates safely
    db = (typeof getMasterData === 'function' ? getMasterData() : null) || window.DEFAULT_MASTER_DATA;
    activePanels = (db && db.panelProducts ? db.panelProducts : []).filter(p => !p.status || p.status.toLowerCase() === 'active');
    if (activePanels.length === 0 && window.DEFAULT_MASTER_DATA) {
        activePanels = window.DEFAULT_MASTER_DATA.panelProducts;
    }

    activeInverters = (db && db.inverterProducts ? db.inverterProducts : []).filter(p => !p.status || p.status.toLowerCase() === 'active');
    if (activeInverters.length === 0 && window.DEFAULT_MASTER_DATA) {
        activeInverters = window.DEFAULT_MASTER_DATA.inverterProducts;
    }

    boms = (typeof getBOMTemplates === 'function' ? getBOMTemplates() : null) || window.DEFAULT_BOM_TEMPLATES;

    // Populate Panel Brands
    if (brandSelect) {
        const prevBrand = brandSelect.value;
        const brands = [...new Set(activePanels.map(p => p.brand).filter(Boolean))];
        brandSelect.innerHTML = '';
        const listToUse = brands.length > 0 ? brands : ['Adani', 'Waaree', 'Tata Power', 'Premier Energies', 'Emmvee'];
        listToUse.forEach(b => brandSelect.add(new Option(b, b)));
        if (prevBrand && listToUse.includes(prevBrand)) {
            brandSelect.value = prevBrand;
        } else {
            brandSelect.value = 'Adani';
        }
    }

    // Populate Battery Products
    if (batterySelect && db && db.batteryProducts) {
        batterySelect.innerHTML = '<option value="">Select Battery...</option>';
        db.batteryProducts.filter(p => !p.status || p.status.toLowerCase() === 'active').forEach(b => {
            batterySelect.add(new Option(`${b.brand} ${b.capacity} - ${b.type}`, b.id));
        });
    }

    // Bind Roof Type Toggle
    if (roofTypeSelect && customRoofWrapper) {
        roofTypeSelect.addEventListener('change', () => {
            if (roofTypeSelect.value !== 'Concrete Flat') {
                customRoofWrapper.classList.remove('d-none');
            } else {
                customRoofWrapper.classList.add('d-none');
                const customRoofCost = document.getElementById('customRoofCost');
                if (customRoofCost) customRoofCost.value = '';
            }
        });
    }

    // Attach Event Listeners to Form Selectors

    if (systemTypeSelect) systemTypeSelect.addEventListener('change', window.handleSystemTypeChange);
    if (capacitySelect) capacitySelect.addEventListener('change', window.handleCapacityChange);
    if (brandSelect) brandSelect.addEventListener('change', window.handlePanelBrandChange);
    if (techSelect) techSelect.addEventListener('change', window.handlePanelTechChange);
    if (certSelect) certSelect.addEventListener('change', window.handlePanelCertChange);
    if (wattSelect) wattSelect.addEventListener('change', window.handlePanelWattChange);
    if (invBrandSelect) invBrandSelect.addEventListener('change', window.handleInverterBrandChange);
    if (invCapSelect) invCapSelect.addEventListener('change', window.handleInverterCapChange);
    if (invPhaseSelect) invPhaseSelect.addEventListener('change', window.handleInverterPhaseChange);

    // Initial Trigger on load - ensure ALL dropdowns are active and cascaded
    if (brandSelect && !brandSelect.value) brandSelect.value = 'Adani';
    if (systemTypeSelect && !systemTypeSelect.value) systemTypeSelect.value = 'On-Grid';
    if (capacitySelect && !capacitySelect.value) capacitySelect.value = '3kW';
    if (invBrandSelect && !invBrandSelect.value) invBrandSelect.value = 'Solis';

    window.handleSystemTypeChange();
    window.handlePanelBrandChange();
    window.handleInverterBrandChange();

    // Initialize Role-Aware Sales Executive Control:
    // Sales Executive: auto-populated from login identity and locked/readonly.
    // Admin / Non-Sales: activated dropdown to select any Sales Executive.
    await setupSalesExecutiveControl();

    // --- Quote Revision & Edit Loader Logic ---
    const quoteMode = sessionStorage.getItem('solis_quote_mode'); // 'revise' or 'edit'
    const editQuoteId = sessionStorage.getItem('solis_edit_quote_id');
    const parentQuoteId = sessionStorage.getItem('solis_parent_quote_id');
    const rootQuoteId = sessionStorage.getItem('solis_root_quote_id') || parentQuoteId;
    const parentRevNum = parseInt(sessionStorage.getItem('solis_parent_rev') || '0', 10);
    const nextRevNum = parseInt(sessionStorage.getItem('solis_next_rev') || '1', 10);
    const nextRevLabel = sessionStorage.getItem('solis_next_rev_label') || `Rev-${String(nextRevNum).padStart(2, '0')}`;
    const custName = sessionStorage.getItem('solis_customer_name') || 'Customer';
    const editQuoteParamsStr = sessionStorage.getItem('solis_edit_quote_params');

    if ((quoteMode === 'revise' || editQuoteId) && editQuoteParamsStr) {
        try {
            const p = JSON.parse(editQuoteParamsStr);

            if (p.salesExecutive && document.getElementById('salesExecutive')) {
                const execEl = document.getElementById('salesExecutive');
                if (execEl.tagName === 'SELECT') {
                    let match = Array.from(execEl.options).find(o => o.value.toLowerCase() === p.salesExecutive.toLowerCase());
                    if (match) {
                        execEl.value = match.value;
                    } else {
                        const opt = document.createElement('option');
                        opt.value = p.salesExecutive;
                        opt.textContent = `${p.salesExecutive} (Original)`;
                        execEl.appendChild(opt);
                        execEl.value = p.salesExecutive;
                    }
                } else {
                    // For sales user, retain their login identity or set if empty
                    if (!execEl.value) execEl.value = p.salesExecutive;
                }
            }
            if (p.customerName) document.getElementById('customerName').value = p.customerName;
            if (p.contactNumber) document.getElementById('contactNumber').value = p.contactNumber;
            if (p.district) document.getElementById('district').value = p.district;
            if (p.specialNotes) document.getElementById('specialNotes').value = p.specialNotes;

            if (p.systemType && systemTypeSelect) {
                systemTypeSelect.value = p.systemType;
                window.handleSystemTypeChange();
            }

            if (p.batteryProduct && batterySelect) {
                batterySelect.value = p.batteryProduct.id;
            }

            if (p.manualInverterQty && document.getElementById('manualInverterQty')) {
                document.getElementById('manualInverterQty').value = p.manualInverterQty;
            }

            if (p.capacity && capacitySelect) {
                capacitySelect.value = p.capacity;
                window.handleCapacityChange();
            }

            if (p.roofType && roofTypeSelect) {
                roofTypeSelect.value = p.roofType;
                roofTypeSelect.dispatchEvent(new Event('change'));
            }

            if (p.customRoofCost && document.getElementById('customRoofCost')) {
                document.getElementById('customRoofCost').value = p.customRoofCost;
            }

            if (p.netMeterScope) document.getElementById('netMeterScope').value = p.netMeterScope;
            if (p.ksebScope) document.getElementById('ksebScope').value = p.ksebScope;
            if (p.dealerCommission !== undefined) document.getElementById('dealerCommission').value = p.dealerCommission;
            if (p.targetProfit !== undefined) document.getElementById('targetProfit').value = p.targetProfit;
            if (p.phase) document.getElementById('phase').value = p.phase;

            // Inverter cascading reload
            if (p.inverterProduct && invBrandSelect) {
                invBrandSelect.value = p.inverterProduct.brand;
                window.handleInverterBrandChange();
                if (invCapSelect) invCapSelect.value = p.inverterProduct.capacity;
                window.handleInverterCapChange();
                if (invPhaseSelect) invPhaseSelect.value = p.inverterProduct.phase;
            }

            // Panel cascading reload
            if (p.panelProduct && brandSelect) {
                brandSelect.value = p.panelProduct.brand;
                window.handlePanelBrandChange();
                if (techSelect) techSelect.value = p.panelProduct.technology;
                window.handlePanelTechChange();
                if (certSelect) certSelect.value = p.panelProduct.certification;
                window.handlePanelCertChange();
                if (wattSelect) wattSelect.value = p.panelProduct.wattage;
                window.handlePanelWattChange();
            }

            if (p.manualPanelQty && document.getElementById('panelQty')) {
                document.getElementById('panelQty').value = p.manualPanelQty;
            }

            const submitBtn = document.getElementById('submitQuoteBtn');
            const cancelBtn = document.getElementById('cancelEditBtn');
            const container = document.querySelector('.container.mt-5') || document.querySelector('#sales-form')?.parentElement;

            if (quoteMode === 'revise') {
                if (submitBtn) {
                    submitBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate me-2"></i> RE-CALCULATE & SAVE ${nextRevLabel}`;
                    submitBtn.className = 'btn btn-success btn-lg w-100 fw-bold shadow-sm';
                }
                if (cancelBtn) cancelBtn.classList.add('d-none');

                if (container) {
                    const revBanner = document.createElement('div');
                    revBanner.className = 'alert alert-success border-success-subtle shadow-sm mb-4 rounded-3 p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2';
                    revBanner.innerHTML = `
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <span class="badge bg-success fw-bold font-mono px-2 py-1">${nextRevLabel} ACTIVE</span>
                                <h6 class="fw-bold mb-0 text-dark">Re-calculating Quote for ${custName}</h6>
                            </div>
                            <p class="mb-0 small text-dark opacity-90">
                                <i class="fa-solid fa-shield-halved text-success me-1"></i> Original quote <strong>(Rev-${String(parentRevNum).padStart(2, '0')})</strong> remains locked with its original rates. This calculation will be saved as <strong>${nextRevLabel}</strong> using today's live equipment prices.
                            </p>
                        </div>
                        <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3 text-nowrap" id="cancelRevisionModeBtn">
                            <i class="fa-solid fa-xmark me-1"></i> Cancel Revision
                        </button>
                    `;
                    container.insertBefore(revBanner, container.firstChild);
                    document.getElementById('cancelRevisionModeBtn')?.addEventListener('click', () => {
                        sessionStorage.removeItem('solis_quote_mode');
                        sessionStorage.removeItem('solis_parent_quote_id');
                        sessionStorage.removeItem('solis_root_quote_id');
                        sessionStorage.removeItem('solis_parent_rev');
                        sessionStorage.removeItem('solis_next_rev');
                        sessionStorage.removeItem('solis_next_rev_label');
                        sessionStorage.removeItem('solis_customer_name');
                        sessionStorage.removeItem('solis_edit_quote_params');
                        window.location.reload();
                    });
                }
            } else {
                if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-pen-to-square me-2"></i> UPDATE PROJECT';
                if (cancelBtn) {
                    cancelBtn.classList.remove('d-none');
                    cancelBtn.addEventListener('click', () => {
                        sessionStorage.removeItem('solis_quote_mode');
                        sessionStorage.removeItem('solis_edit_quote_id');
                        sessionStorage.removeItem('solis_edit_quote_params');
                        window.location.reload();
                    });
                }

                if (container) {
                    const editBanner = document.createElement('div');
                    editBanner.className = 'alert alert-warning text-center fw-bold shadow-sm mb-4';
                    editBanner.innerHTML = `<i class="fa-solid fa-pen-to-square me-2"></i> EDIT MODE ACTIVE: You are currently modifying an existing saved quote. Click 'Update Project' to save changes over the original quote.`;
                    container.insertBefore(editBanner, container.firstChild);
                }
            }
        } catch (e) {
            console.error('Error loading quote for edit/revision:', e);
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide previous results or errors
        const resultScreen = document.getElementById('result-screen');
        const errorAlert = document.getElementById('error-alert');
        const ratioAlert = document.getElementById('ratio-alert');
        
        resultScreen.classList.add('d-none');
        errorAlert.classList.add('d-none');
        ratioAlert.classList.add('d-none');
        ratioAlert.classList.remove('alert-success', 'alert-warning', 'alert-danger');

        // Find the specific panel product
        const brand = brandSelect.value;
        const tech = techSelect.value;
        const cert = certSelect.value;
        const watt = parseFloat(wattSelect.value);
        
        let selectedPanel = activePanels.find(p => p.brand === brand && p.technology === tech && p.certification === cert && p.wattage === watt);
        if (!selectedPanel) {
            selectedPanel = activePanels.find(p => p.brand === brand && p.wattage === watt) || activePanels.find(p => p.brand === brand);
        }
        
        if (!selectedPanel) {
            errorAlert.innerText = "Error: Selected panel product not found in database.";
            errorAlert.classList.remove('d-none');
            return;
        }

        // Find the specific inverter product matching brand, capacity and explicitly selected phase
        const invBrand = invBrandSelect.value;
        const invCap = invCapSelect.value;
        const invPhase = invPhaseSelect.value;
        
        let selectedInverter = activeInverters.find(p => p.brand === invBrand && p.capacity === invCap && p.phase === invPhase);
        
        // If not found strictly, fallback (shouldn't happen with strict dropdown)
        if (!selectedInverter) {
            selectedInverter = activeInverters.find(p => p.brand === invBrand && p.capacity === invCap) || activeInverters.find(p => p.brand === invBrand);
        }
        
        if (!selectedInverter) {
            errorAlert.innerText = `Error: Selected Inverter (${invBrand} ${invCap}) not found in database.`;
            errorAlert.classList.remove('d-none');
            return;
        }

        // Gather parameters
        const systemType = document.getElementById('systemType').value;
        const batteryId = document.getElementById('batteryProduct').value;
        const batteryProduct = batteryId && db.batteryProducts ? db.batteryProducts.find(b => b.id === batteryId) : null;
        const manualInverterQty = document.getElementById('manualInverterQty').value;

        const salesExecEl = document.getElementById('salesExecutive');
        const salesExecVal = salesExecEl ? salesExecEl.value.trim() : (sessionStorage.getItem('solis_user_name') || '');
        if (!salesExecVal) {
            errorAlert.innerText = "Please select or enter a Sales Executive Name.";
            errorAlert.classList.remove('d-none');
            salesExecEl?.focus();
            return;
        }

        const params = {
            systemType: systemType,
            batteryProduct: batteryProduct,
            manualInverterQty: manualInverterQty,
            capacity: capacitySelect.value,
            customerName: document.getElementById('customerName').value,
            contactNumber: document.getElementById('contactNumber').value,
            specialNotes: document.getElementById('specialNotes').value,
            panelProduct: selectedPanel,
            inverterProduct: selectedInverter,
            roofType: document.getElementById('roofType').value,
            customRoofCost: document.getElementById('customRoofCost').value,
            phase: document.getElementById('phase').value,
            district: document.getElementById('district').value,
            manualPanelQty: panelQtyInput.value,
            dealerCommission: document.getElementById('dealerCommission').value,
            targetProfit: document.getElementById('targetProfit').value,
            netMeterScope: document.getElementById('netMeterScope').value,
            ksebScope: document.getElementById('ksebScope').value,
            salesExecutive: salesExecVal
        };

        try {
            // Run the Rule Engine
            const result = calculateProjectCost(params);
            
            // Save to Firebase (Revision Control & In-Place Edit)
            if (typeof saveQuoteToFirebase === 'function') {
                if (quoteMode === 'revise') {
                    // Save as brand new document with incremented revision (Rev-01, Rev-02)
                    saveQuoteToFirebase({
                        parameters: params,
                        revision: nextRevNum,
                        revisionLabel: nextRevLabel,
                        parentQuoteId: parentQuoteId,
                        rootQuoteId: rootQuoteId,
                        summary: {
                            totalBase: result.totalBase,
                            totalGst: result.totalGst,
                            totalLanding: result.totalLanding,
                            acCapacityKw: result.acCapacityKw,
                            dcCapacityKw: result.dcCapacityKw
                        },
                        detailedBOM: result.detailedBOM,
                        compositeBOM: result.compositeBOM
                    }, null); // null means ADD NEW DOCUMENT in Firestore (Original is never overwritten)

                    // Clean up session storage
                    sessionStorage.removeItem('solis_quote_mode');
                    sessionStorage.removeItem('solis_parent_quote_id');
                    sessionStorage.removeItem('solis_root_quote_id');
                    sessionStorage.removeItem('solis_parent_rev');
                    sessionStorage.removeItem('solis_next_rev');
                    sessionStorage.removeItem('solis_next_rev_label');
                    sessionStorage.removeItem('solis_customer_name');
                    sessionStorage.removeItem('solis_edit_quote_params');

                    // Display success notification above result
                    const revAlert = document.getElementById('revisionSuccessAlert');
                    if (revAlert) {
                        revAlert.innerHTML = `<i class="fa-solid fa-circle-check text-success me-2"></i> Successfully generated new revision: <strong class="badge bg-success font-mono fs-6 mx-1">${nextRevLabel}</strong>! Original quote (Rev-${String(parentRevNum).padStart(2, '0')}) remains permanently locked. <a href="quotes_dashboard.html" class="btn btn-sm btn-outline-success rounded-pill px-3 ms-2 fw-bold">View in Quotes Dashboard &rarr;</a>`;
                        revAlert.classList.remove('d-none');
                    }
                } else if (quoteMode === 'edit' && editQuoteId) {
                    // In-place edit of existing quote
                    saveQuoteToFirebase({
                        parameters: params,
                        summary: {
                            totalBase: result.totalBase,
                            totalGst: result.totalGst,
                            totalLanding: result.totalLanding,
                            acCapacityKw: result.acCapacityKw,
                            dcCapacityKw: result.dcCapacityKw
                        },
                        detailedBOM: result.detailedBOM,
                        compositeBOM: result.compositeBOM
                    }, editQuoteId);

                    sessionStorage.removeItem('solis_quote_mode');
                    sessionStorage.removeItem('solis_edit_quote_id');
                    sessionStorage.removeItem('solis_edit_quote_params');
                } else {
                    // Standard brand new quote (Rev-00)
                    saveQuoteToFirebase({
                        parameters: params,
                        revision: 0,
                        revisionLabel: 'Rev-00',
                        summary: {
                            totalBase: result.totalBase,
                            totalGst: result.totalGst,
                            totalLanding: result.totalLanding,
                            acCapacityKw: result.acCapacityKw,
                            dcCapacityKw: result.dcCapacityKw
                        },
                        detailedBOM: result.detailedBOM,
                        compositeBOM: result.compositeBOM
                    }, null);
                }
            }

            // Format currency
            const fmt = (val) => new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0
            }).format(val);

            // Populate Meta Summary Strip
            if (document.getElementById('res-customer-name')) {
                document.getElementById('res-customer-name').innerText = params.customerName || 'N/A';
            }
            if (document.getElementById('res-customer-contact')) {
                document.getElementById('res-customer-contact').innerText = params.contactNumber ? `(Ph: ${params.contactNumber})` : '';
            }
            if (document.getElementById('res-sales-exec')) {
                document.getElementById('res-sales-exec').innerText = params.salesExecutive || 'Sales Executive';
            }

            // Populate Result Screen
            document.getElementById('res-capacity').innerText = `${result.acCapacityKw} kW`;
            document.getElementById('res-dc-capacity').innerText = `${result.dcCapacityKw.toFixed(2)} kWp`;
            document.getElementById('res-panels').innerText = `${result.actualPanels} x ${brand} ${watt}W`;
            document.getElementById('res-inverter').innerText = `${result.inverterQty || 1} x ${params.inverterProduct.brand} ${params.inverterProduct.capacity}`;
            
            // Populate Summary BOM Table
            const tbody = document.getElementById('res-bom-tbody');
            let rowsHtml = '';
            
            const icons = {
                panels: '<i class="fa-solid fa-solar-panel text-primary me-2"></i>',
                inverter: '<i class="fa-solid fa-bolt text-warning me-2"></i>',
                bos: '<i class="fa-solid fa-boxes-stacked text-info me-2"></i>',
                services: '<i class="fa-solid fa-helmet-safety text-danger me-2"></i>'
            };
            
            for (const key in result.compositeBOM) {
                const item = result.compositeBOM[key];
                if (!item || typeof item !== 'object' || !item.name) continue;
                rowsHtml += `
                <tr>
                    <td class="fw-medium">${item.icon || ''} ${item.name}</td>
                    <td class="text-end fw-bold">${fmt(item.base)}</td>
                    <td class="text-end text-danger">${fmt(item.gst)}</td>
                    <td class="text-end fw-bold">${fmt(item.landing)}</td>
                </tr>
                `;
            }
            tbody.innerHTML = rowsHtml;

            // Populate Totals
            document.getElementById('res-total-base').innerText = fmt(result.totalBase);
            document.getElementById('res-total-gst').innerText = fmt(result.totalGst);
            document.getElementById('res-total-landing').innerText = fmt(result.totalLanding);

            // Populate Admin Verification Detailed BOM
            const detailedTbody = document.getElementById('res-detailed-tbody');
            let detailedHtml = '';
            for (const item of result.detailedBOM) {
                detailedHtml += `
                <tr>
                    <td class="fw-medium">${item.name}</td>
                    <td><span class="badge bg-secondary">${item.category}</span></td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-end">${fmt(item.rate)}</td>
                    <td class="text-end fw-bold">${fmt(item.base)}</td>
                </tr>
                `;
            }
            
            // Add Margin Breakdown
            detailedHtml += `
                <tr class="table-light">
                    <td colspan="4" class="text-end fw-bold text-muted">Raw Cost (Before Profit):</td>
                    <td class="text-end fw-bold">${fmt(result.rawBase)}</td>
                </tr>
                <tr class="table-warning">
                    <td colspan="4" class="text-end fw-bold text-dark">Profit Margin (${result.marginPercent}%):</td>
                    <td class="text-end fw-bold text-dark">${fmt(result.marginAmount)}</td>
                </tr>
                <tr class="table-primary">
                    <td colspan="4" class="text-end fw-bold">Final Selling Base Cost:</td>
                    <td class="text-end fw-bold">${fmt(result.totalBase)}</td>
                </tr>
            `;
            
            detailedTbody.innerHTML = detailedHtml;

            // Ratio Alert
            const ratioPercent = (result.ratio * 100).toFixed(1);
            if (result.ratioStatus === 'green') {
                ratioAlert.classList.add('alert-success');
                document.getElementById('ratio-text').innerText = `Optimal DC/AC Ratio: ${ratioPercent}%`;
            } else if (result.ratioStatus === 'yellow') {
                ratioAlert.classList.add('alert-warning');
                document.getElementById('ratio-text').innerText = `High DC/AC Ratio: ${ratioPercent}% (Slightly Overloaded)`;
            } else {
                ratioAlert.classList.add('alert-danger');
                document.getElementById('ratio-text').innerText = `Critical DC/AC Ratio: ${ratioPercent}% (Manager Approval Required)`;
            }
            ratioAlert.classList.remove('d-none');

            // Save Quote to LocalStorage for Admin Reference
            const quote = {
                id: 'QT-' + Date.now(),
                date: new Date().toISOString(),
                params: params,
                result: result
            };
            const savedQuotes = JSON.parse(localStorage.getItem('solis-quotes') || '[]');
            savedQuotes.push(quote);
            localStorage.setItem('solis-quotes', JSON.stringify(savedQuotes));

            // Show Result Screen
            resultScreen.classList.remove('d-none');

        } catch (error) {
            // Show Error Alert if Template not found or engine fails
            errorAlert.innerText = error.message;
            errorAlert.classList.remove('d-none');
        }
    });

    // Non-blocking background sync from Cloud Firestore
    if (typeof syncFirebaseToLocal === 'function') {
        syncFirebaseToLocal().then(updated => {
            if (updated) {
                console.log("Cloud master data updated, refreshing live catalog...");
            }
        }).catch(e => console.warn("Background cloud sync note:", e));
    }
}

// Ensure initApp runs reliably in all browser execution contexts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


// ============================================================================
// ROLE-AWARE SALES EXECUTIVE CONTROL IMPLEMENTATION
// - Sales Executive (role: 'sales'): Auto-filled from login identity and locked (readonly).
// - Admin / Leadership (role: 'admin' / 'super_admin'): Activated dropdown to choose
//   a Sales Executive from Firestore / team database.
// ============================================================================
async function setupSalesExecutiveControl() {
    const execInput = document.getElementById('salesExecutive');
    const badgeEl = document.getElementById('salesExecRoleBadge');
    const helpEl = document.getElementById('salesExecHelpText');
    if (!execInput) return;

    const role = (sessionStorage.getItem('solis_user_role') || localStorage.getItem('solis_user_role') || 'sales').toLowerCase();
    const storedEmail = (sessionStorage.getItem('solis_user_email') || localStorage.getItem('solis_user_email') || '').toLowerCase();
    let storedName = sessionStorage.getItem('solis_user_name') || localStorage.getItem('solis_user_name') || '';

    if (!storedName || storedName.includes('@')) {
        storedName = (typeof window.resolveSalesExecutiveName === 'function')
            ? window.resolveSalesExecutiveName(storedEmail)
            : 'Sales Executive';
        sessionStorage.setItem('solis_user_name', storedName);
    }

    const isSalesUser = (role === 'sales' || role === 'sales_executive');

    if (isSalesUser) {
        // --- CASE 1: LOGGED-IN SALES EXECUTIVE ---
        // Automatically show name as per login, locked/readonly
        execInput.value = storedName;
        execInput.readOnly = true;
        execInput.classList.add('bg-light');
        execInput.style.cursor = 'not-allowed';
        execInput.title = `Auto-assigned to your login identity: ${storedName}`;

        if (badgeEl) {
            badgeEl.className = 'badge rounded-pill bg-success-subtle text-success border border-success-subtle';
            badgeEl.innerHTML = '<i class="fa-solid fa-user-check me-1"></i>Logged in';
        }
        if (helpEl) {
            helpEl.innerHTML = `<i class="fa-solid fa-lock text-muted me-1"></i>Auto-assigned to your account (${storedName})`;
        }
    } else {
        // --- CASE 2: ADMIN / SUPER ADMIN / LEADERSHIP / NON-SALES ---
        // Activate dropdown to choose a Sales Executive
        if (badgeEl) {
            badgeEl.className = 'badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle';
            badgeEl.innerHTML = '<i class="fa-solid fa-users-gear me-1"></i>Admin: Choose Rep';
        }
        if (helpEl) {
            helpEl.innerHTML = 'Select the Sales Executive who owns or is credited for this proposal.';
        }

        // Replace the input with a select dropdown
        const select = document.createElement('select');
        select.id = 'salesExecutive';
        select.name = 'salesExecutive';
        select.className = 'form-select form-select-lg fw-semibold';
        select.required = true;
        select.innerHTML = '<option value="" disabled selected>-- Choose Sales Executive --</option>';

        execInput.replaceWith(select);

        // Populate options from team database and Firestore
        await populateSalesExecutiveDropdown(select);

        // Handle custom representative creation on the fly
        select.addEventListener('change', function() {
            if (this.value === '__custom__') {
                const customName = prompt('Enter Sales Executive Name:');
                if (customName && customName.trim()) {
                    const cleanName = customName.trim();
                    let match = Array.from(this.options).find(o => o.value.toLowerCase() === cleanName.toLowerCase());
                    if (!match) {
                        const opt = document.createElement('option');
                        opt.value = cleanName;
                        opt.textContent = `${cleanName} (Custom)`;
                        this.appendChild(opt);
                        opt.selected = true;
                    } else {
                        match.selected = true;
                    }
                } else {
                    this.value = '';
                }
            }
        });
    }
}

async function populateSalesExecutiveDropdown(selectEl) {
    if (!selectEl) return;

    const candidates = new Map(); // key (lowercase) -> { name, role, isSales }

    // 1. Known team members from VALID_USERS (in auth.js)
    if (typeof VALID_USERS !== 'undefined' && Array.isArray(VALID_USERS)) {
        VALID_USERS.forEach(u => {
            if (u.name) {
                candidates.set(u.name.toLowerCase(), {
                    name: u.name,
                    role: u.role || 'sales',
                    isSales: (u.role === 'sales')
                });
            }
        });
    }

    // 2. Users from localStorage cache (solis_users_db)
    try {
        const localDb = JSON.parse(localStorage.getItem('solis_users_db') || '[]');
        if (Array.isArray(localDb)) {
            localDb.forEach(u => {
                if (u.name && u.status !== 'inactive') {
                    const isSales = (u.role === 'sales' || u.role === 'sales_executive');
                    candidates.set(u.name.toLowerCase(), {
                        name: u.name,
                        role: u.role || 'sales',
                        isSales: isSales
                    });
                }
            });
        }
    } catch(e) {}

    // Ensure our core team reps are always present
    if (!candidates.has('joshi jacob')) {
        candidates.set('joshi jacob', { name: 'Joshi Jacob', role: 'sales', isSales: true });
    }
    if (!candidates.has('kannan deepu')) {
        candidates.set('kannan deepu', { name: 'Kannan Deepu', role: 'sales', isSales: true });
    }
    if (!candidates.has('solis super admin')) {
        candidates.set('solis super admin', { name: 'Solis Super Admin', role: 'super_admin', isSales: false });
    }

    renderOptions();

    // 3. Asynchronous sync with Cloud Firestore REST API in case new users were registered
    try {
        const FB_USER_URL = "https://firestore.googleapis.com/v1/projects/studio-5037599641-c95bb/databases/(default)/documents/solis/userManagement?key=AIzaSyB8XGJKxo9jTJDB7UtMpQBuoCT_wqHdEfQ";
        fetch(FB_USER_URL).then(r => r.json()).then(data => {
            if (data && data.fields && data.fields.usersJson && data.fields.usersJson.stringValue) {
                const cloudUsers = JSON.parse(data.fields.usersJson.stringValue);
                let addedAny = false;
                cloudUsers.forEach(u => {
                    if (u.name && u.status !== 'inactive') {
                        const key = u.name.toLowerCase();
                        if (!candidates.has(key)) {
                            const isSales = (u.role === 'sales' || u.role === 'sales_executive');
                            candidates.set(key, {
                                name: u.name,
                                role: u.role || 'sales',
                                isSales: isSales
                            });
                            addedAny = true;
                        }
                    }
                });
                if (addedAny) {
                    renderOptions();
                }
            }
        }).catch(() => {});
    } catch(e) {}

    function renderOptions() {
        const currentVal = selectEl.value;
        selectEl.innerHTML = '<option value="" disabled selected>-- Choose Sales Executive --</option>';

        const salesGroup = document.createElement('optgroup');
        salesGroup.label = 'Sales Executives';

        const adminGroup = document.createElement('optgroup');
        adminGroup.label = 'Management / Direct';

        const otherGroup = document.createElement('optgroup');
        otherGroup.label = 'Other';

        Array.from(candidates.values()).forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.name;
            opt.textContent = u.name;
            if (u.isSales) {
                salesGroup.appendChild(opt);
            } else if (u.role === 'super_admin' || u.role === 'admin') {
                opt.textContent = `${u.name} (Direct Admin)`;
                adminGroup.appendChild(opt);
            } else {
                otherGroup.appendChild(opt);
            }
        });

        if (salesGroup.children.length > 0) selectEl.appendChild(salesGroup);
        if (adminGroup.children.length > 0) selectEl.appendChild(adminGroup);
        if (otherGroup.children.length > 0) selectEl.appendChild(otherGroup);

        const customOpt = document.createElement('option');
        customOpt.value = '__custom__';
        customOpt.textContent = '+ Enter Other / Custom Name...';
        selectEl.appendChild(customOpt);

        if (currentVal && Array.from(selectEl.options).some(o => o.value === currentVal)) {
            selectEl.value = currentVal;
        }
    }
}
window.setupSalesExecutiveControl = setupSalesExecutiveControl;
