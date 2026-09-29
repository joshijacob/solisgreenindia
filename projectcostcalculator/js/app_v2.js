// app.js - Sales Dashboard Interactions

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof syncFirebaseToLocal === 'function') await syncFirebaseToLocal();

    const form = document.getElementById('sales-form');
    const capacitySelect = document.getElementById('capacity');
    
    // Panel Selectors
    const brandSelect = document.getElementById('panelBrand');
    const techSelect = document.getElementById('panelTech');
    const certSelect = document.getElementById('panelCert');
    const wattSelect = document.getElementById('panelWatt');
    
    // Inverter Selectors
    const invBrandSelect = document.getElementById('inverterBrand');
    const invCapSelect = document.getElementById('inverterCap');
    const invPhaseSelect = document.getElementById('inverterPhase');

    const panelQtyInput = document.getElementById('panelQty');
    const panelQtyHelp = document.getElementById('panelQtyHelp');
    
    // Roof Type Logic
    const roofTypeSelect = document.getElementById('roofType');
    const customRoofWrapper = document.getElementById('customRoofWrapper');
    roofTypeSelect.addEventListener('change', () => {
        if (roofTypeSelect.value !== 'Concrete Flat') {
            customRoofWrapper.classList.remove('d-none');
        } else {
            customRoofWrapper.classList.add('d-none');
            document.getElementById('customRoofCost').value = '';
        }
    });

    const db = getMasterData();
    const activePanels = db.panelProducts.filter(p => p.status === 'Active');
    const activeInverters = db.inverterProducts.filter(p => p.status === 'Active');

    // Get BOMs
    const boms = getBOMTemplates();

    // Init Brands
    const brands = [...new Set(activePanels.map(p => p.brand))];
    brands.forEach(b => brandSelect.add(new Option(b, b)));

    const systemTypeSelect = document.getElementById('systemType');
    const batteryWrapper = document.getElementById('batteryWrapper');
    const batterySelect = document.getElementById('batteryProduct');
    const manualInverterQtyWrapper = document.getElementById('manualInverterQtyWrapper');
    
    // Init Batteries
    if (db.batteryProducts) {
        db.batteryProducts.filter(p => p.status === 'Active').forEach(b => {
            batterySelect.add(new Option(`${b.brand} ${b.capacity} - ${b.type}`, b.id));
        });
    }

    // Dynamic UI based on System Type
    systemTypeSelect.addEventListener('change', () => {
        const sysType = systemTypeSelect.value;
        
        // Show/Hide Battery
        if (sysType === 'Hybrid') {
            batteryWrapper.classList.remove('d-none');
            batterySelect.required = true;
        } else {
            batteryWrapper.classList.add('d-none');
            batterySelect.required = false;
            batterySelect.value = '';
        }
        
        // Show/Hide Manual Inverter Qty
        if (sysType === 'Micro Inverter') {
            manualInverterQtyWrapper.classList.remove('d-none');
        } else {
            manualInverterQtyWrapper.classList.add('d-none');
            document.getElementById('manualInverterQty').value = '';
        }

        // Reset Inverter Selection
        invBrandSelect.innerHTML = '<option value="">Select...</option>';
        invCapSelect.innerHTML = '<option value="">Select...</option>';
        invPhaseSelect.innerHTML = '<option value="">Select...</option>';
        invCapSelect.disabled = true;
        invPhaseSelect.disabled = true;
        
        // Update Project Capacities based on BOMs for this System Type
        capacitySelect.innerHTML = '<option value="">Select...</option>';
        if (boms[sysType]) {
            const caps = Object.keys(boms[sysType]).sort((a,b) => parseFloat(a) - parseFloat(b));
            caps.forEach(c => capacitySelect.add(new Option(c, c)));
        }
        
        // Filter Inverters by Type
        const filteredInverters = activeInverters.filter(p => p.systemType === sysType || (!p.systemType && sysType === 'On-Grid'));
        const invBrands = [...new Set(filteredInverters.map(p => p.brand))];
        invBrands.forEach(b => invBrandSelect.add(new Option(b, b)));
    });
    
    // Initialize Inverters on load
    systemTypeSelect.dispatchEvent(new Event('change'));

    // Inverter Cascading
    invBrandSelect.addEventListener('change', () => {
        invCapSelect.innerHTML = '<option value="">Select...</option>';
        invPhaseSelect.innerHTML = '<option value="">Select...</option>';
        invCapSelect.disabled = true;
        invPhaseSelect.disabled = true;
        const brand = invBrandSelect.value;
        if (brand) {
            const sysType = systemTypeSelect.value;
            const caps = [...new Set(activeInverters.filter(p => p.brand === brand && (p.type === sysType || (!p.type && sysType === 'On-Grid'))).map(p => p.capacity))];
            // Custom sort for kW capacities (3kW, 5kW, etc.)
            caps.sort((a,b) => parseFloat(a) - parseFloat(b)).forEach(c => invCapSelect.add(new Option(c, c)));
            invCapSelect.disabled = false;
        }
    });

    invCapSelect.addEventListener('change', () => {
        invPhaseSelect.innerHTML = '<option value="">Select...</option>';
        invPhaseSelect.disabled = true;
        const brand = invBrandSelect.value;
        const cap = invCapSelect.value;
        if (brand && cap) {
            const sysType = systemTypeSelect.value;
            const phases = [...new Set(activeInverters.filter(p => p.brand === brand && p.capacity === cap && (p.type === sysType || (!p.type && sysType === 'On-Grid'))).map(p => p.phase))];
            phases.forEach(p => {
                if(p) invPhaseSelect.add(new Option(p, p));
            });
            invPhaseSelect.disabled = false;
            
            // Auto-select phase
            const capKw = parseFloat(cap.replace('kW', ''));
            const defaultPhase = capKw <= 5 ? 'Single Phase' : 'Three Phase';
            if (phases.includes(defaultPhase)) {
                invPhaseSelect.value = defaultPhase;
            } else if (phases.length > 0) {
                invPhaseSelect.value = phases[0]; // fallback
            }
        }
    });

    // Cascading Logic
    brandSelect.addEventListener('change', () => {
        techSelect.innerHTML = '<option value="">Select...</option>';
        certSelect.innerHTML = '<option value="">Select...</option>';
        wattSelect.innerHTML = '<option value="">Select...</option>';
        techSelect.disabled = true;
        certSelect.disabled = true;
        wattSelect.disabled = true;
        
        const brand = brandSelect.value;
        if (brand) {
            const techs = [...new Set(activePanels.filter(p => p.brand === brand).map(p => p.technology))];
            techs.forEach(t => techSelect.add(new Option(t, t)));
            techSelect.disabled = false;
        }
        updateRecommendedPanels();
    });

    techSelect.addEventListener('change', () => {
        certSelect.innerHTML = '<option value="">Select...</option>';
        wattSelect.innerHTML = '<option value="">Select...</option>';
        certSelect.disabled = true;
        wattSelect.disabled = true;
        
        const brand = brandSelect.value;
        const tech = techSelect.value;
        if (tech) {
            const certs = [...new Set(activePanels.filter(p => p.brand === brand && p.technology === tech).map(p => p.certification))];
            certs.forEach(c => certSelect.add(new Option(c, c)));
            certSelect.disabled = false;
        }
        updateRecommendedPanels();
    });

    certSelect.addEventListener('change', () => {
        wattSelect.innerHTML = '<option value="">Select...</option>';
        wattSelect.disabled = true;
        
        const brand = brandSelect.value;
        const tech = techSelect.value;
        const cert = certSelect.value;
        if (cert) {
            const watts = [...new Set(activePanels.filter(p => p.brand === brand && p.technology === tech && p.certification === cert).map(p => p.wattage))];
            watts.sort((a,b) => a-b).forEach(w => wattSelect.add(new Option(`${w}W`, w)));
            wattSelect.disabled = false;
        }
        updateRecommendedPanels();
    });

    wattSelect.addEventListener('change', updateRecommendedPanels);
    capacitySelect.addEventListener('change', () => {
        updateRecommendedPanels();
        // Optionally auto-select inverter capacity if it matches exactly
        if (invBrandSelect.value) {
            const cap = capacitySelect.value;
            const options = Array.from(invCapSelect.options).map(o => o.value);
            if (options.includes(cap)) {
                invCapSelect.value = cap;
                // Dispatch change event to trigger inverter phase population
                invCapSelect.dispatchEvent(new Event('change'));
            }
        }
        
        // Auto-calculate Target Profit (10000 per kW) and Default KSEB Phase
        const capValue = capacitySelect.value;
        if (capValue) {
            const capacityKw = parseFloat(capValue.replace('kW', ''));
            document.getElementById('targetProfit').value = capacityKw * 10000;
            
            // Auto-select KSEB Connection Phase
            const phaseSelect = document.getElementById('phase');
            phaseSelect.value = capacityKw <= 5 ? 'Single Phase' : 'Three Phase';
        }
    });

    // Auto-calculate recommended panels
    function updateRecommendedPanels() {
        const capacity = capacitySelect.value;
        const watt = wattSelect.value;
        
        if (capacity && watt) {
            const capacityKw = parseFloat(capacity.replace('kW', ''));
            const recommended = Math.ceil((capacityKw * 1000) / parseFloat(watt));
            
            panelQtyInput.placeholder = `${recommended}`;
            panelQtyHelp.innerText = `(Recommended: ${recommended})`;
        } else {
            panelQtyInput.placeholder = "Auto-calculated";
            panelQtyHelp.innerText = "";
        }
    }
    
    // --- Edit Quote Loader Logic ---
    const editQuoteId = sessionStorage.getItem('solis_edit_quote_id');
    const editQuoteParamsStr = sessionStorage.getItem('solis_edit_quote_params');
    
    if (editQuoteId && editQuoteParamsStr) {
        try {
            const p = JSON.parse(editQuoteParamsStr);
            
            // Set simple fields
            document.getElementById('customerName').value = p.customerName || '';
            document.getElementById('contactNumber').value = p.contactNumber || '';
            document.getElementById('district').value = p.district || 'Kottayam';
            document.getElementById('specialNotes').value = p.specialNotes || '';
            
            // New fields
            if (p.systemType) {
                const sysTypeSelect = document.getElementById('systemType');
                sysTypeSelect.value = p.systemType;
                sysTypeSelect.dispatchEvent(new Event('change'));
            }
            if (p.batteryProduct && document.getElementById('batteryProduct')) {
                document.getElementById('batteryProduct').value = p.batteryProduct.id;
            }
            if (p.manualInverterQty && document.getElementById('manualInverterQty')) {
                document.getElementById('manualInverterQty').value = p.manualInverterQty;
            }

            document.getElementById('capacity').value = p.capacity || '';
            document.getElementById('roofType').value = p.roofType || '';
            document.getElementById('netMeterScope').value = p.netMeterScope || '';
            document.getElementById('ksebScope').value = p.ksebScope || '';
            document.getElementById('dealerCommission').value = p.dealerCommission || 0;
            document.getElementById('targetProfit').value = p.targetProfit || '';
            
            // Trigger capacity change to set dependent logic (like kseb phase, though we'll override it next if needed)
            document.getElementById('capacity').dispatchEvent(new Event('change'));
            document.getElementById('phase').value = p.phase || 'Single Phase';

            // Handle Inverter Cascading
            if (p.inverterProduct) {
                invBrandSelect.value = p.inverterProduct.brand;
                invBrandSelect.dispatchEvent(new Event('change'));
                invCapSelect.value = p.inverterProduct.capacity;
                invCapSelect.dispatchEvent(new Event('change'));
                invPhaseSelect.value = p.inverterProduct.phase;
            }
            
            // Handle Panel Cascading
            if (p.panelProduct) {
                brandSelect.value = p.panelProduct.brand;
                brandSelect.dispatchEvent(new Event('change'));
                techSelect.value = p.panelProduct.technology;
                techSelect.dispatchEvent(new Event('change'));
                certSelect.value = p.panelProduct.certification;
                certSelect.dispatchEvent(new Event('change'));
                wattSelect.value = p.panelProduct.wattage;
                wattSelect.dispatchEvent(new Event('change'));
            }

            // Update UI for Edit Mode
            const submitBtn = document.getElementById('submitQuoteBtn');
            const cancelBtn = document.getElementById('cancelEditBtn');
            if(submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-pen-to-square me-2"></i> UPDATE PROJECT';
            if(cancelBtn) {
                cancelBtn.classList.remove('d-none');
                cancelBtn.addEventListener('click', () => {
                    sessionStorage.removeItem('solis_edit_quote_id');
                    sessionStorage.removeItem('solis_edit_quote_params');
                    window.location.reload();
                });
            }
            
            // Add a visual indicator to the top of the page
            const container = document.querySelector('.container.mt-5');
            if (container) {
                const editBanner = document.createElement('div');
                editBanner.className = 'alert alert-warning text-center fw-bold shadow-sm mb-4';
                editBanner.innerHTML = `<i class="fa-solid fa-pen-to-square me-2"></i> EDIT MODE ACTIVE: You are currently modifying an existing saved quote. Click 'Update Project' to save changes over the original quote.`;
                container.insertBefore(editBanner, container.firstChild);
            }
            
        } catch (e) {
            console.error("Error loading quote for edit:", e);
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
        
        const selectedPanel = activePanels.find(p => p.brand === brand && p.technology === tech && p.certification === cert && p.wattage === watt);
        
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
            selectedInverter = activeInverters.find(p => p.brand === invBrand && p.capacity === invCap);
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
            ksebScope: document.getElementById('ksebScope').value
        };

        try {
            // Run the Rule Engine
            const result = calculateProjectCost(params);
            
            // Save to Firebase (fire and forget)
            if (typeof saveQuoteToFirebase === 'function') {
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
                }, typeof editQuoteId !== 'undefined' ? editQuoteId : null);
            }

            // Format currency
            const fmt = (val) => new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0
            }).format(val);

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
                rowsHtml += `
                <tr>
                    <td class="fw-medium">${item.icon} ${item.name}</td>
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
});
