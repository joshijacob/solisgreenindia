// engine.js - The Rule & Pricing Engine

function calculateProjectCost(params) {
    const { capacity, panelProduct, inverterProduct, roofType, customRoofCost, profitMargin, phase, district, manualPanelQty, dealerCommission, netMeterScope, ksebScope, systemType, batteryProduct, manualInverterQty } = params;
    
    const db = getMasterData();
    const boms = getBOMTemplates();
    
    // Helper to check phase compatibility
    function isPhaseCompatible(itemName) {
        if (!itemName) return true;
        const name = itemName.toLowerCase();

        // 1. Uni Direction Meter rule (Uses Inverter Phase)
        if (name.includes('uni dir') || name.includes('uni-dir') || name.includes('unidir')) {
            const invPhase = inverterProduct && inverterProduct.phase ? inverterProduct.phase : 'Single Phase';
            if (invPhase === 'Single Phase' && (name.includes('three phase') || name.includes('3 phase') || name.includes('3-phase'))) return false;
            if (invPhase === 'Three Phase' && (name.includes('single phase') || name.includes('1 phase') || name.includes('1-phase'))) return false;
            return true;
        }

        // 2. Net Meter rule (Uses KSEB Connection Phase)
        if (name.includes('net meter') || name.includes('net energy')) {
            if (phase === 'Single Phase' && (name.includes('three phase') || name.includes('3 phase') || name.includes('3-phase'))) return false;
            if (phase === 'Three Phase' && (name.includes('single phase') || name.includes('1 phase') || name.includes('1-phase'))) return false;
            return true;
        }

        // 3. Default Rule for all other items (Uses KSEB Connection Phase)
        if (phase === 'Single Phase' && (name.includes('three phase') || name.includes('3 phase') || name.includes('3-phase'))) return false;
        if (phase === 'Three Phase' && (name.includes('single phase') || name.includes('1 phase') || name.includes('1-phase'))) return false;
        
        return true;
    }
    
    // Find BOM Template
    const sysBoms = boms[systemType] || {};
    const bom = sysBoms[capacity];
    if (!bom) {
        throw new Error(`Template Not Found for capacity: ${capacity}. Please contact Administrator.`);
    }

    // Clone and Normalize BOM to dynamically swap missing phase meters
    const activeBom = { ...bom };
    const invPhase = inverterProduct && inverterProduct.phase ? inverterProduct.phase : 'Single Phase';

    for (const key in activeBom) {
        const lowerKey = key.toLowerCase();
        
        // Uni Directional Meter Substitution (Based on Inverter Phase)
        if (lowerKey.includes('uni dir') || lowerKey.includes('uni-dir') || lowerKey.includes('unidir')) {
            if (invPhase === 'Three Phase' && (lowerKey.includes('1 ph') || lowerKey.includes('single phase'))) {
                const replacement = Object.keys(db.supply).find(k => (k.toLowerCase().includes('uni dir') || k.toLowerCase().includes('uni-dir') || k.toLowerCase().includes('unidir')) && (k.toLowerCase().includes('3 ph') || k.toLowerCase().includes('three phase')));
                if (replacement) { activeBom[replacement] = activeBom[key]; delete activeBom[key]; }
            } else if (invPhase === 'Single Phase' && (lowerKey.includes('3 ph') || lowerKey.includes('three phase'))) {
                const replacement = Object.keys(db.supply).find(k => (k.toLowerCase().includes('uni dir') || k.toLowerCase().includes('uni-dir') || k.toLowerCase().includes('unidir')) && (k.toLowerCase().includes('1 ph') || k.toLowerCase().includes('single phase')));
                if (replacement) { activeBom[replacement] = activeBom[key]; delete activeBom[key]; }
            }
        }
        
        // Net Meter Substitution (Based on KSEB Phase)
        if (lowerKey.includes('net meter') || lowerKey.includes('net energy')) {
            if (phase === 'Three Phase' && (lowerKey.includes('1 ph') || lowerKey.includes('single phase'))) {
                const replacement = Object.keys(db.supply).find(k => (k.toLowerCase().includes('net meter') || k.toLowerCase().includes('net energy')) && (k.toLowerCase().includes('3 ph') || k.toLowerCase().includes('three phase')));
                if (replacement) { activeBom[replacement] = activeBom[key]; delete activeBom[key]; }
            } else if (phase === 'Single Phase' && (lowerKey.includes('3 ph') || lowerKey.includes('three phase'))) {
                const replacement = Object.keys(db.supply).find(k => (k.toLowerCase().includes('net meter') || k.toLowerCase().includes('net energy')) && (k.toLowerCase().includes('1 ph') || k.toLowerCase().includes('single phase')));
                if (replacement) { activeBom[replacement] = activeBom[key]; delete activeBom[key]; }
            }
        }
    }

    const panelWattage = panelProduct.wattage || 540;
    const capacityKw = parseFloat(capacity.replace('kW', ''));
    const pmLookup = db.profitMargins && db.profitMargins[systemType] ? db.profitMargins[systemType][capacity] : 15;
    const effectiveProfitMargin = profitMargin !== null ? profitMargin : pmLookup;
    const recommendedPanels = Math.ceil((capacityKw * 1000) / panelWattage);
    const actualPanels = manualPanelQty ? parseInt(manualPanelQty) : recommendedPanels;
    
    // Installed DC Capacity & Ratio
    const dcCapacityKw = (actualPanels * panelWattage) / 1000;
    
    // Inverter Qty Logic
    let inverterQty = 1;
    if (systemType === 'Micro Inverter') {
        const defaultRatio = inverterProduct && inverterProduct.panelsPerInverter ? inverterProduct.panelsPerInverter : 1;
        inverterQty = manualInverterQty ? parseInt(manualInverterQty) : Math.ceil(actualPanels / defaultRatio);
    }
    
    // Get precise Inverter AC Capacity from the selected inverter product
    let acCapacityKw = capacityKw;
    if (inverterProduct && inverterProduct.capacity) {
        acCapacityKw = parseFloat(inverterProduct.capacity.replace('kW', '')) || capacityKw;
    }
    const ratio = dcCapacityKw / (acCapacityKw * inverterQty);

    const detailedBOM = [];
    let totalBase = 0;
    
    function addItem(name, category, qty, rate, group) {
        if (!qty) return;
        const base = rate * qty;
        
        detailedBOM.push({
            name, category, qty, rate, base, group
        });
        totalBase += base;
    }

    // 1. Panels
    const pricePerPanel = (panelProduct.price || 0) * panelWattage;
    addItem(`Solar Panel - ${panelProduct.brand} ${panelProduct.wattage}W`, 'Supply', actualPanels, pricePerPanel, 'panels');

    // 2. Inverter
    addItem(`Grid Tie Inverter - ${inverterProduct ? inverterProduct.brand : ''} ${inverterProduct ? inverterProduct.capacity : ''}`, 'Supply', inverterQty, inverterProduct ? inverterProduct.price : 0, 'inverter'); 

    // 2b. Battery
    if (systemType === 'Hybrid' && batteryProduct) {
        addItem(`Battery - ${batteryProduct.brand} ${batteryProduct.capacity}`, 'Supply', 1, batteryProduct.price, 'battery');
    }

    // 3. BOS (Supply)
    if (db.supply) {
        for (const item in db.supply) {
            if (!isPhaseCompatible(item)) continue;

            const lowerName = item.toLowerCase();
            if (netMeterScope === 'KSEB' && (lowerName.includes('net meter') || lowerName.includes('net energy'))) continue;
            
            // Micro Inverter DC component removal
            if (systemType === 'Micro Inverter' && (lowerName.includes('dc cable') || lowerName.includes('dcdb') || lowerName.includes('mc-4'))) {
                continue;
            }
            // Hybrid dynamic additions
            if (systemType !== 'Hybrid' && (lowerName.includes('battery rack') || lowerName.includes('changeover switch') || lowerName.includes('cable for battery'))) {
                continue;
            }
            // Micro dynamic additions
            if (systemType !== 'Micro Inverter' && (lowerName.includes('trunk cable') || lowerName.includes('trunk end cap') || lowerName.includes('disconnect tool'))) {
                continue;
            }

            let qty = activeBom[item] || 0;
            
            // Dynamic Injections
            if (systemType === 'Hybrid') {
                if (lowerName.includes('battery rack')) qty = 1;
                if (lowerName.includes('changeover switch')) qty = 1;
                if (lowerName.includes('cable for battery')) qty = 5;
            }
            if (systemType === 'Micro Inverter') {
                if (lowerName.includes('trunk cable')) qty = inverterQty;
                if (lowerName.includes('trunk end cap')) qty = 1;
                if (lowerName.includes('disconnect tool')) qty = 1;
            }
            
            // Scale structure items based on panel count vs recommended
            const scaleFactor = actualPanels / recommendedPanels;
            const scalableItems = ['Middle Clamp', 'End Clamp', 'Aluminium Rail', 'Alen Bolt', 'Spring Nut', 'MC-4 Connector', 'Structure Materials'];
            if (scalableItems.includes(item) && qty > 0) {
                qty = qty * scaleFactor;
                if (item !== 'Structure Materials') {
                    qty = Math.ceil(qty);
                } else {
                    qty = Number(qty.toFixed(2));
                }
            }

            if (qty > 0) {
                addItem(item, 'Supply', qty, db.supply[item].price, 'bos');
            }
        }
    }

    // 4. Services (Labour, Transport, Govt Fees)
    if (db.service) {
        for (const item in db.service) {
            if (!isPhaseCompatible(item)) continue;

            const lowerName = item.toLowerCase();
            if (ksebScope === 'Customer' && (lowerName.includes('kseb fees') || lowerName.includes('kseb payment'))) continue;
            
            let qty = activeBom[item] || 0;
            if (qty > 0) {
                let price = db.service[item].price;
                
                // Dynamic KSEB Fee Calculation
                if (lowerName.includes('kseb fees') || lowerName.includes('kseb payment')) {
                    const invCapacityKw = inverterProduct && inverterProduct.capacity ? parseFloat(inverterProduct.capacity.replace('kW', '')) : capacityKw;
                    price = 1000 + (1180 * invCapacityKw);
                    qty = 1; // Enforce single quantity for the project fee
                }
                
                addItem(item, 'Service', qty, price, 'services');
            }
        }
    }

    // 5. Custom Roof Structure
    if (roofType !== 'Concrete Flat' && customRoofCost) {
        const customCost = parseFloat(customRoofCost) || 0;
        if (customCost > 0) {
            addItem('Custom Roof Structure', 'Supply', 1, customCost, 'bos');
        }
    }

    let ratioStatus = 'green';
    if (ratio > db.ratioLimits.maxGreen && ratio <= db.ratioLimits.maxYellow) ratioStatus = 'yellow';
    if (ratio > db.ratioLimits.maxYellow) ratioStatus = 'red';

    // Apply Target Profit (calculated BEFORE Dealer Commission is added)
    const marginAmount = parseFloat(params.targetProfit) || 0;

    // Add Dealer Commission
    const dealerComm = parseFloat(dealerCommission) || 0;
    if (dealerComm > 0) {
        addItem('Dealer Commission (Pass-through)', 'Service', 1, dealerComm, 'commission');
    }

    // Final Selling Base
    const sellingBase = totalBase + marginAmount;

    // Composite GST (70% @ 5%, 30% @ 18%) calculated on Selling Base
    const supplyBase = sellingBase * 0.70;
    const supplyGst = supplyBase * 0.05;
    
    const serviceBase = sellingBase * 0.30;
    const serviceGst = serviceBase * 0.18;
    
    const totalGst = supplyGst + serviceGst;

    const compositeBOM = {
        supply: {
            name: 'Solar Power Generating System (Supply @ 70%)',
            base: supplyBase,
            gst: supplyGst,
            landing: supplyBase + supplyGst,
            icon: '<i class="fa-solid fa-solar-panel text-primary me-2"></i>'
        },
        service: {
            name: 'Construction of Solar Power Generating System (Service @ 30%)',
            base: serviceBase,
            gst: serviceGst,
            landing: serviceBase + serviceGst,
            icon: '<i class="fa-solid fa-helmet-safety text-warning me-2"></i>'
        }
    };

    return {
        acCapacityKw,
        dcCapacityKw,
        actualPanels,
        inverterQty,
        ratio,
        ratioStatus,
        detailedBOM,
        compositeBOM,
        rawBase: totalBase,
        marginPercent: 0,
        marginAmount: marginAmount,
        totalBase: sellingBase,
        totalGst,
        totalLanding: sellingBase + totalGst
    };
}
