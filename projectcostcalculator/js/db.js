// db.js - Simulated Backend for Master Data & BOM Templates

const DEFAULT_MASTER_DATA = {
    SUPPLY_CATEGORIES: [
        'Structural Materials',
        'Hardware & Connectors',
        'DC Cables',
        'AC Cables',
        'DB & Meter Box',
        'Energy Meters',
        'Earthing Materials',
        'PVC Fittings',
        'Uncategorized'
    ],
    ratioLimits: {
        maxGreen: 1.3,
        maxYellow: 1.5
    },
    profitMargins: {
        'On-Grid': { '3kW': 15, '5kW': 15, '8kW': 15, '10kW': 15 },
        'Hybrid': { '3kW': 20, '5kW': 20, '8kW': 20, '10kW': 20 },
        'Micro Inverter': { '3kW': 15, '5kW': 15, '8kW': 15, '10kW': 15 }
    },
    // New ERP Array-based Product Master for Panels
    panelProducts: [
    {
        "id": "PAN-AD-TOP-DCR-605",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 605,
        "price": 20,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-DCR-610",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 610,
        "price": 20,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-DCR-615",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 615,
        "price": 20,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-DCR-620",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 620,
        "price": 27.5,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-DCR-625",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 625,
        "price": 20,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-DCR-630",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 630,
        "price": 20,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-NDCR-605",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 605,
        "price": 18,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-NDCR-610",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 610,
        "price": 18,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-NDCR-615",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 615,
        "price": 18,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-NDCR-620",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 620,
        "price": 18,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-NDCR-625",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 625,
        "price": 18,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-TOP-NDCR-630",
        "brand": "Adani",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 630,
        "price": 18,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-BIF-NDCR-540",
        "brand": "Adani",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 540,
        "price": 19,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-BIF-NDCR-545",
        "brand": "Adani",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 545,
        "price": 19,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-BIF-NDCR-550",
        "brand": "Adani",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 550,
        "price": 19,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-BIF-NDCR-555",
        "brand": "Adani",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 555,
        "price": 19,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-MONO-NDCR-540",
        "brand": "Adani",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 540,
        "price": 18.5,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-MONO-NDCR-545",
        "brand": "Adani",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 545,
        "price": 18.5,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-AD-MONO-DCR-540",
        "brand": "Adani",
        "technology": "Mono PERC",
        "certification": "DCR",
        "wattage": 540,
        "price": 21,
        "gst": 12,
        "supplier": "Adani Solar Direct",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-MONO-NDCR-540",
        "brand": "Waaree",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 540,
        "price": 19,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-MONO-NDCR-545",
        "brand": "Waaree",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 545,
        "price": 19,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-MONO-NDCR-550",
        "brand": "Waaree",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 550,
        "price": 19.5,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-MONO-DCR-540",
        "brand": "Waaree",
        "technology": "Mono PERC",
        "certification": "DCR",
        "wattage": 540,
        "price": 21.5,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-MONO-DCR-545",
        "brand": "Waaree",
        "technology": "Mono PERC",
        "certification": "DCR",
        "wattage": 545,
        "price": 21.5,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-TOP-DCR-580",
        "brand": "Waaree",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 580,
        "price": 22.5,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-TOP-DCR-585",
        "brand": "Waaree",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 585,
        "price": 22.5,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-TOP-NDCR-580",
        "brand": "Waaree",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 580,
        "price": 19.5,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-TOP-NDCR-590",
        "brand": "Waaree",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 590,
        "price": 20,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-BIF-NDCR-540",
        "brand": "Waaree",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 540,
        "price": 19.5,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-WA-BIF-NDCR-545",
        "brand": "Waaree",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 545,
        "price": 19.5,
        "gst": 12,
        "supplier": "Waaree Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-TP-MONO-NDCR-540",
        "brand": "Tata Power",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 540,
        "price": 22,
        "gst": 12,
        "supplier": "Tata Power Solar",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-TP-MONO-NDCR-545",
        "brand": "Tata Power",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 545,
        "price": 22,
        "gst": 12,
        "supplier": "Tata Power Solar",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-TP-MONO-DCR-540",
        "brand": "Tata Power",
        "technology": "Mono PERC",
        "certification": "DCR",
        "wattage": 540,
        "price": 24.5,
        "gst": 12,
        "supplier": "Tata Power Solar",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-TP-MONO-DCR-545",
        "brand": "Tata Power",
        "technology": "Mono PERC",
        "certification": "DCR",
        "wattage": 545,
        "price": 24.5,
        "gst": 12,
        "supplier": "Tata Power Solar",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-TP-TOP-DCR-550",
        "brand": "Tata Power",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 550,
        "price": 25.5,
        "gst": 12,
        "supplier": "Tata Power Solar",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-TP-TOP-DCR-580",
        "brand": "Tata Power",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 580,
        "price": 26,
        "gst": 12,
        "supplier": "Tata Power Solar",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-TP-TOP-NDCR-580",
        "brand": "Tata Power",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 580,
        "price": 22,
        "gst": 12,
        "supplier": "Tata Power Solar",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-TP-BIF-NDCR-540",
        "brand": "Tata Power",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 540,
        "price": 22.5,
        "gst": 12,
        "supplier": "Tata Power Solar",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-PR-MONO-NDCR-540",
        "brand": "Premier Energies",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 540,
        "price": 19.5,
        "gst": 12,
        "supplier": "Premier Energies",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-PR-MONO-NDCR-545",
        "brand": "Premier Energies",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 545,
        "price": 19.5,
        "gst": 12,
        "supplier": "Premier Energies",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-PR-MONO-DCR-540",
        "brand": "Premier Energies",
        "technology": "Mono PERC",
        "certification": "DCR",
        "wattage": 540,
        "price": 21.5,
        "gst": 12,
        "supplier": "Premier Energies",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-PR-TOP-DCR-580",
        "brand": "Premier Energies",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 580,
        "price": 22.5,
        "gst": 12,
        "supplier": "Premier Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-PR-TOP-NDCR-580",
        "brand": "Premier Energies",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 580,
        "price": 19.5,
        "gst": 12,
        "supplier": "Premier Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-PR-BIF-NDCR-540",
        "brand": "Premier Energies",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 540,
        "price": 20,
        "gst": 12,
        "supplier": "Premier Energies",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-EM-MONO-NDCR-540",
        "brand": "Emmvee",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 540,
        "price": 18,
        "gst": 12,
        "supplier": "Emmvee Photovoltaic",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-EM-MONO-NDCR-545",
        "brand": "Emmvee",
        "technology": "Mono PERC",
        "certification": "NDCR",
        "wattage": 545,
        "price": 18.5,
        "gst": 12,
        "supplier": "Emmvee Photovoltaic",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-EM-MONO-DCR-540",
        "brand": "Emmvee",
        "technology": "Mono PERC",
        "certification": "DCR",
        "wattage": 540,
        "price": 20.5,
        "gst": 12,
        "supplier": "Emmvee Photovoltaic",
        "warranty": 12,
        "weight": 27,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-EM-TOP-DCR-580",
        "brand": "Emmvee",
        "technology": "TOPCon",
        "certification": "DCR",
        "wattage": 580,
        "price": 22,
        "gst": 12,
        "supplier": "Emmvee Photovoltaic",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-EM-TOP-NDCR-580",
        "brand": "Emmvee",
        "technology": "TOPCon",
        "certification": "NDCR",
        "wattage": 580,
        "price": 19,
        "gst": 12,
        "supplier": "Emmvee Photovoltaic",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    },
    {
        "id": "PAN-EM-BIF-NDCR-540",
        "brand": "Emmvee",
        "technology": "Bifacial",
        "certification": "NDCR",
        "wattage": 540,
        "price": 19,
        "gst": 12,
        "supplier": "Emmvee Photovoltaic",
        "warranty": 12,
        "weight": 28,
        "length": 2278,
        "width": 1134,
        "status": "Active"
    }
],
    inverterProducts: [
    {
        "id": "INV-SOL-3K-1P",
        "brand": "Solis",
        "capacity": "3kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOL-5K-1P",
        "brand": "Solis",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOL-5K-3P",
        "brand": "Solis",
        "capacity": "5kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOL-8K-3P",
        "brand": "Solis",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOL-10K-3P",
        "brand": "Solis",
        "capacity": "10kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOL-15K-3P",
        "brand": "Solis",
        "capacity": "15kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-DEY-3K-1P",
        "brand": "Deye",
        "capacity": "3kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 16500,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-DEY-5K-1P",
        "brand": "Deye",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-DEY-5K-3P",
        "brand": "Deye",
        "capacity": "5kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-DEY-8K-3P",
        "brand": "Deye",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-DEY-10K-3P",
        "brand": "Deye",
        "capacity": "10kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-DEY-15K-3P",
        "brand": "Deye",
        "capacity": "15kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GRO-3K-1P",
        "brand": "Growatt",
        "capacity": "3kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GRO-5K-1P",
        "brand": "Growatt",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GRO-5K-3P",
        "brand": "Growatt",
        "capacity": "5kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GRO-8K-3P",
        "brand": "Growatt",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GRO-10K-3P",
        "brand": "Growatt",
        "capacity": "10kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GRO-15K-3P",
        "brand": "Growatt",
        "capacity": "15kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GWE-3K-1P",
        "brand": "GoodWe",
        "capacity": "3kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GWE-5K-1P",
        "brand": "GoodWe",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GWE-5K-3P",
        "brand": "GoodWe",
        "capacity": "5kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GWE-8K-3P",
        "brand": "GoodWe",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GWE-10K-3P",
        "brand": "GoodWe",
        "capacity": "10kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-GWE-15K-3P",
        "brand": "GoodWe",
        "capacity": "15kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SUN-3K-1P",
        "brand": "Sungrow",
        "capacity": "3kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SUN-5K-1P",
        "brand": "Sungrow",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SUN-5K-3P",
        "brand": "Sungrow",
        "capacity": "5kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SUN-8K-3P",
        "brand": "Sungrow",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SUN-10K-3P",
        "brand": "Sungrow",
        "capacity": "10kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOF-3K-1P",
        "brand": "Sofar",
        "capacity": "3kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOF-5K-1P",
        "brand": "Sofar",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOF-5K-3P",
        "brand": "Sofar",
        "capacity": "5kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOF-8K-3P",
        "brand": "Sofar",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOF-10K-3P",
        "brand": "Sofar",
        "capacity": "10kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-KSO-3K-1P",
        "brand": "Ksolare",
        "capacity": "3kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-KSO-5K-1P",
        "brand": "Ksolare",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-KSO-5K-3P",
        "brand": "Ksolare",
        "capacity": "5kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-KSO-8K-3P",
        "brand": "Ksolare",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-KSO-10K-3P",
        "brand": "Ksolare",
        "capacity": "10kW",
        "phase": "Three Phase",
        "type": "On-Grid",
        "price": 0,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-DEY-HYB-5K-1P",
        "brand": "Deye",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "Hybrid",
        "price": 85000,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-DEY-HYB-8K-3P",
        "brand": "Deye",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "Hybrid",
        "price": 135000,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOL-HYB-5K-1P",
        "brand": "Solis",
        "capacity": "5kW",
        "phase": "Single Phase",
        "type": "Hybrid",
        "price": 88000,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-SOL-HYB-8K-3P",
        "brand": "Solis",
        "capacity": "8kW",
        "phase": "Three Phase",
        "type": "Hybrid",
        "price": 138000,
        "gst": 18,
        "supplier": "",
        "warranty": 5,
        "status": "Active"
    },
    {
        "id": "INV-ENP-IQ8-MICRO",
        "brand": "Enphase",
        "capacity": "Micro",
        "phase": "Single Phase",
        "type": "Micro Inverter",
        "price": 12000,
        "gst": 18,
        "supplier": "",
        "warranty": 10,
        "status": "Active"
    },
    {
        "id": "INV-HOY-1200-MICRO",
        "brand": "Hoymiles",
        "capacity": "Micro",
        "phase": "Single Phase",
        "type": "Micro Inverter",
        "price": 11000,
        "gst": 18,
        "supplier": "",
        "warranty": 10,
        "status": "Active"
    }
],
    batteryProducts: [
        { id: "BAT-LITH-5KWH", brand: "Loom Solar", type: "Lithium-ion", capacity: "5kWh", price: 110000, gst: 18, status: "Active" },
        { id: "BAT-TUB-150AH", brand: "Luminous", type: "Tubular Lead-Acid", capacity: "150Ah", price: 14000, gst: 28, status: "Active" }
    ],
    supply: {
        'Middle Clamp': { price: 22, gst: 18, category: 'Structural Materials' },
        'End Clamp': { price: 20, gst: 18, category: 'Structural Materials' },
        'Aluminium Rail': { price: 490, gst: 18, category: 'Structural Materials' },
        'Alen Bolt': { price: 10, gst: 18, category: 'Structural Materials' },
        'Spring Nut': { price: 9, gst: 18, category: 'Structural Materials' },
        'MC-4 Connector': { price: 40, gst: 18, category: 'Hardware & Connectors' },
        'Cable Tie': { price: 200, gst: 18, category: 'Hardware & Connectors' },
        'DC Cable Red': { price: 55, gst: 18, category: 'DC Cables' },
        'DC Cable Blk': { price: 55, gst: 18, category: 'DC Cables' },
        'GND BUS BAR': { price: 175, gst: 18, category: 'Hardware & Connectors' },
        'DCDB': { price: 2000, gst: 18, category: 'DB & Meter Box' },
        'PVC Trunk': { price: 150, gst: 18, category: 'PVC Fittings' },
        'ACDB': { price: 1800, gst: 18, category: 'DB & Meter Box' },
        '2P MCB': { price: 270, gst: 18, category: 'DB & Meter Box' },
        '4P MCB': { price: 500, gst: 18, category: 'DB & Meter Box' },
        'AC Cable Red 4 SQ MM': { price: 60, gst: 18, category: 'AC Cables' },
        'AC Cable Black 4 SQ MM': { price: 60, gst: 18, category: 'AC Cables' },
        'AC Cable Red 6 SQ MM': { price: 53, gst: 18, category: 'AC Cables' },
        'AC Cable Black 6 SQ MM': { price: 53, gst: 18, category: 'AC Cables' },
        'GND Cable Green 4 Sqmm': { price: 120, gst: 18, category: 'AC Cables' },
        'GND Cable Green 6 Sqmm': { price: 80, gst: 18, category: 'AC Cables' },
        'GND Cable Green 10 Sqmm': { price: 70, gst: 18, category: 'AC Cables' },
        '25 Cu Down Conductor': { price: 240, gst: 18, category: 'Earthing Materials' },
        '50 Al Down Conductor': { price: 90, gst: 18, category: 'Earthing Materials' },
        '1 PH NET Energy Meter': { price: 4200, gst: 18, category: 'Energy Meters' },
        '3 PH NET Energy Meter': { price: 8050, gst: 18, category: 'Energy Meters' },
        'Isolator Switch': { price: 990, gst: 18, category: 'DB & Meter Box' },
        'Meter Box': { price: 950, gst: 18, category: 'DB & Meter Box' },
        'DBL': { price: 310, gst: 18, category: 'Hardware & Connectors' },
        'Earth ROD': { price: 280, gst: 18, category: 'Earthing Materials' },
        'Drain Box': { price: 370, gst: 18, category: 'Hardware & Connectors' },
        'Earth Compound 10 KG': { price: 220, gst: 18, category: 'Earthing Materials' },
        'LA Single Spike': { price: 610, gst: 18, category: 'Earthing Materials' },
        'PVC Condute 20mm': { price: 61.20, gst: 18, category: 'PVC Fittings' },
        'PVC Elbow 20mm': { price: 2.10, gst: 18, category: 'PVC Fittings' },
        'PVC Bend 20mm': { price: 4.75, gst: 18, category: 'PVC Fittings' },
        'PVC Tee 20mm': { price: 3.00, gst: 18, category: 'PVC Fittings' },
        'PVC Coupling 20mm': { price: 2.50, gst: 18, category: 'PVC Fittings' },
        'Saddles': { price: 0.50, gst: 18, category: 'Hardware & Connectors' },
        'Structure Materials': { price: 9075, gst: 18, category: 'Structural Materials' },
        'Additional Structure Materials': { price: 6000, gst: 18, category: 'Structural Materials' },
        // Hybrid & Micro Inverter specific items
        'Battery Rack (4 Battery)': { price: 3500, gst: 18, category: 'Structural Materials' },
        'Battery Rack (Lithium)': { price: 2000, gst: 18, category: 'Structural Materials' },
        'Changeover Switch (63A)': { price: 1200, gst: 18, category: 'DB & Meter Box' },
        'Heavy DC Cable for Battery (35 sqmm)': { price: 250, gst: 18, category: 'DC Cables' },
        'AC Trunk Cable (Micro Inverter)': { price: 800, gst: 18, category: 'AC Cables' },
        'Trunk End Cap': { price: 250, gst: 18, category: 'Hardware & Connectors' },
        'Disconnect Tool': { price: 150, gst: 18, category: 'Hardware & Connectors' }
    },
    service: {
        'Structur Labour': { price: 7500, gst: 0 },
        'Electrical Labour': { price: 6000, gst: 0 },
        'Electricity': { price: 3025, gst: 0 },
        'KSEB Fees': { price: 6900, gst: 0 },
        'Transportation': { price: 3000, gst: 0 }
    }
};

const DEFAULT_BOM_TEMPLATES = {
    'On-Grid': {
        '3kW': {
            'Middle Clamp': 12, 'End Clamp': 8, 'Aluminium Rail': 4, 'Alen Bolt': 20, 'Spring Nut': 20,
            'MC-4 Connector': 3, 'Cable Tie': 1, 'DC Cable Red': 20, 'DC Cable Blk': 20, 'GND BUS BAR': 1,
            'DCDB': 1, 'PVC Trunk': 1, 'ACDB': 1, '2P MCB': 1, 'AC Cable Red 4 SQ MM': 20, 'AC Cable Black 4 SQ MM': 20,
            'GND Cable Green 6 Sqmm': 40, '50 Al Down Conductor': 25, '1 PH NET Energy Meter': 1, 'Meter Box': 1,
            'DBL': 2, 'Earth ROD': 4, 'Drain Box': 4, 'Earth Compound 10 KG': 2, 'LA Single Spike': 1,
            'PVC Condute 20mm': 25, 'PVC Elbow 20mm': 20, 'PVC Bend 20mm': 20, 'PVC Tee 20mm': 5, 'PVC Coupling 20mm': 20,
            'Saddles': 20, 'Structure Materials': 1, 'Structur Labour': 1, 'Electrical Labour': 1, 'Electricity': 1,
            'KSEB Fees': 1, 'Transportation': 1
        },
        '5kW': {
            'Middle Clamp': 16, 'End Clamp': 8, 'Aluminium Rail': 6, 'Alen Bolt': 30, 'Spring Nut': 30,
            'MC-4 Connector': 4, 'Cable Tie': 1, 'DC Cable Red': 30, 'DC Cable Blk': 30, 'GND BUS BAR': 1,
            'DCDB': 1, 'PVC Trunk': 1, 'ACDB': 1, '2P MCB': 1, 'AC Cable Red 6 SQ MM': 30, 'AC Cable Black 6 SQ MM': 30,
            'GND Cable Green 6 Sqmm': 60, '50 Al Down Conductor': 35, '3 PH NET Energy Meter': 1, 'Meter Box': 1,
            'DBL': 3, 'Earth ROD': 6, 'Drain Box': 6, 'Earth Compound 10 KG': 3, 'LA Single Spike': 1,
            'PVC Condute 20mm': 35, 'PVC Elbow 20mm': 30, 'PVC Bend 20mm': 30, 'PVC Tee 20mm': 8, 'PVC Coupling 20mm': 30,
            'Saddles': 30, 'Structure Materials': 1.5, 'Structur Labour': 1.5, 'Electrical Labour': 1.5, 'Electricity': 1,
            'KSEB Fees': 1, 'Transportation': 1.2
        },
        '8kW': {
            'Middle Clamp': 24, 'End Clamp': 12, 'Aluminium Rail': 8, 'Alen Bolt': 40, 'Spring Nut': 40,
            'MC-4 Connector': 6, 'Cable Tie': 2, 'DC Cable Red': 40, 'DC Cable Blk': 40, 'GND BUS BAR': 2,
            'DCDB': 1, 'PVC Trunk': 2, 'ACDB': 1, '4P MCB': 1, 'AC Cable Red 6 SQ MM': 40, 'AC Cable Black 6 SQ MM': 40,
            'GND Cable Green 10 Sqmm': 40, '50 Al Down Conductor': 40, '3 PH NET Energy Meter': 1, 'Meter Box': 1,
            'DBL': 4, 'Earth ROD': 8, 'Drain Box': 8, 'Earth Compound 10 KG': 4, 'LA Single Spike': 1,
            'PVC Condute 20mm': 45, 'PVC Elbow 20mm': 40, 'PVC Bend 20mm': 40, 'PVC Tee 20mm': 10, 'PVC Coupling 20mm': 40,
            'Saddles': 40, 'Structure Materials': 2.5, 'Structur Labour': 2.5, 'Electrical Labour': 2, 'Electricity': 1,
            'KSEB Fees': 1, 'Transportation': 1.5
        },
        '10kW': {
            'Middle Clamp': 32, 'End Clamp': 12, 'Aluminium Rail': 10, 'Alen Bolt': 50, 'Spring Nut': 50,
            'MC-4 Connector': 8, 'Cable Tie': 2, 'DC Cable Red': 50, 'DC Cable Blk': 50, 'GND BUS BAR': 2,
            'DCDB': 1, 'PVC Trunk': 2, 'ACDB': 1, '4P MCB': 1, 'AC Cable Red 6 SQ MM': 50, 'AC Cable Black 6 SQ MM': 50,
            'GND Cable Green 10 Sqmm': 50, '50 Al Down Conductor': 50, '3 PH NET Energy Meter': 1, 'Meter Box': 1,
            'DBL': 5, 'Earth ROD': 10, 'Drain Box': 10, 'Earth Compound 10 KG': 5, 'LA Single Spike': 1,
            'PVC Condute 20mm': 55, 'PVC Elbow 20mm': 50, 'PVC Bend 20mm': 50, 'PVC Tee 20mm': 12, 'PVC Coupling 20mm': 50,
            'Saddles': 50, 'Structure Materials': 3, 'Structur Labour': 3, 'Electrical Labour': 2.5, 'Electricity': 1,
            'KSEB Fees': 1, 'Transportation': 1.5
        }
    },
    'Hybrid': {
        '3kW': {
            'Middle Clamp': 12, 'End Clamp': 8, 'Aluminium Rail': 4, 'Alen Bolt': 20, 'Spring Nut': 20,
            'MC-4 Connector': 3, 'Cable Tie': 1, 'DC Cable Red': 20, 'DC Cable Blk': 20, 'GND BUS BAR': 1,
            'DCDB': 1, 'PVC Trunk': 1, 'ACDB': 1, '2P MCB': 1, 'AC Cable Red 4 SQ MM': 20, 'AC Cable Black 4 SQ MM': 20,
            'GND Cable Green 6 Sqmm': 40, '50 Al Down Conductor': 25, '1 PH NET Energy Meter': 1, 'Meter Box': 1,
            'DBL': 2, 'Earth ROD': 4, 'Drain Box': 4, 'Earth Compound 10 KG': 2, 'LA Single Spike': 1,
            'PVC Condute 20mm': 25, 'PVC Elbow 20mm': 20, 'PVC Bend 20mm': 20, 'PVC Tee 20mm': 5, 'PVC Coupling 20mm': 20,
            'Saddles': 20, 'Structure Materials': 1, 'Structur Labour': 1, 'Electrical Labour': 1, 'Electricity': 1,
            'KSEB Fees': 1, 'Transportation': 1,
            'Changeover Switch (63A)': 1, 'Heavy DC Cable for Battery (35 sqmm)': 5, 'Battery Rack (4 Battery)': 1
        },
        '5kW': {
            'Middle Clamp': 16, 'End Clamp': 8, 'Aluminium Rail': 6, 'Alen Bolt': 30, 'Spring Nut': 30,
            'MC-4 Connector': 4, 'Cable Tie': 1, 'DC Cable Red': 30, 'DC Cable Blk': 30, 'GND BUS BAR': 1,
            'DCDB': 1, 'PVC Trunk': 1, 'ACDB': 1, '2P MCB': 1, 'AC Cable Red 6 SQ MM': 30, 'AC Cable Black 6 SQ MM': 30,
            'GND Cable Green 6 Sqmm': 60, '50 Al Down Conductor': 35, '3 PH NET Energy Meter': 1, 'Meter Box': 1,
            'DBL': 3, 'Earth ROD': 6, 'Drain Box': 6, 'Earth Compound 10 KG': 3, 'LA Single Spike': 1,
            'PVC Condute 20mm': 35, 'PVC Elbow 20mm': 30, 'PVC Bend 20mm': 30, 'PVC Tee 20mm': 8, 'PVC Coupling 20mm': 30,
            'Saddles': 30, 'Structure Materials': 1.5, 'Structur Labour': 1.5, 'Electrical Labour': 1.5, 'Electricity': 1,
            'KSEB Fees': 1, 'Transportation': 1.2,
            'Changeover Switch (63A)': 1, 'Heavy DC Cable for Battery (35 sqmm)': 5, 'Battery Rack (4 Battery)': 1
        }
    },
    'Micro Inverter': {
        '3kW': {
            'Middle Clamp': 12, 'End Clamp': 8, 'Aluminium Rail': 4, 'Alen Bolt': 20, 'Spring Nut': 20,
            'MC-4 Connector': 3, 'Cable Tie': 1, 'GND BUS BAR': 1,
            'PVC Trunk': 1, 'ACDB': 1, '2P MCB': 1, 'AC Cable Red 4 SQ MM': 20, 'AC Cable Black 4 SQ MM': 20,
            'GND Cable Green 6 Sqmm': 40, '50 Al Down Conductor': 25, '1 PH NET Energy Meter': 1, 'Meter Box': 1,
            'DBL': 2, 'Earth ROD': 4, 'Drain Box': 4, 'Earth Compound 10 KG': 2, 'LA Single Spike': 1,
            'PVC Condute 20mm': 25, 'PVC Elbow 20mm': 20, 'PVC Bend 20mm': 20, 'PVC Tee 20mm': 5, 'PVC Coupling 20mm': 20,
            'Saddles': 20, 'Structure Materials': 1, 'Structur Labour': 1, 'Electrical Labour': 1, 'Electricity': 1,
            'KSEB Fees': 1, 'Transportation': 1,
            'AC Trunk Cable (Micro Inverter)': 10, 'Trunk End Cap': 1, 'Disconnect Tool': 1
        }
    }
};
// Data Access Methods (with guaranteed safe fallbacks)
function getMasterData() {
    try {
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem('solis-master-data');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.panelProducts) && parsed.panelProducts.length > 0 && Array.isArray(parsed.inverterProducts) && parsed.inverterProducts.length > 0 && parsed.supply) {
                    const existingBrands = new Set(parsed.panelProducts.map(p => p.brand));
                    const requiredBrands = ['Adani', 'Waaree', 'Tata Power', 'Premier Energies', 'Emmvee'];
                    const missingRequired = requiredBrands.some(b => !existingBrands.has(b));
                    if (!missingRequired) {
                        return parsed;
                    }
                }
            }
        }
    } catch (e) {
        console.warn('getMasterData parse fallback:', e);
    }
    try { 
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('solis-master-data', JSON.stringify(DEFAULT_MASTER_DATA)); 
        }
    } catch(e){}
    return DEFAULT_MASTER_DATA;
}

function saveMasterData(data) {
    try { 
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('solis-master-data', JSON.stringify(data)); 
        }
    } catch(e){}
    if (typeof pushMasterToFirebase === 'function') pushMasterToFirebase(data);
}

function getBOMTemplates() {
    try {
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem('solis-bom-templates');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed['On-Grid'] && parsed['On-Grid']['3kW']) {
                    return parsed;
                }
            }
        }
    } catch (e) {
        console.warn('getBOMTemplates parse fallback:', e);
    }
    try { 
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('solis-bom-templates', JSON.stringify(DEFAULT_BOM_TEMPLATES)); 
        }
    } catch(e){}
    return DEFAULT_BOM_TEMPLATES;
}

function saveBOMTemplates(data) {
    try { 
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('solis-bom-templates', JSON.stringify(data)); 
        }
    } catch(e){}
    if (typeof pushBOMToFirebase === 'function') pushBOMToFirebase(data);
}


// Centralized Form Dropdowns Configuration (Districts, Roof Types, Electrical Phases, Scopes, and Future Custom Dropdowns)
const DEFAULT_FORM_CONFIG = {
    // 14 Kerala districts in standard order + Others
    districts: [
        "Alappuzha",
        "Ernakulam",
        "Idukki",
        "Kannur",
        "Kasaragod",
        "Kollam",
        "Kottayam",
        "Kozhikode",
        "Malappuram",
        "Palakkad",
        "Pathanamthitta",
        "Thiruvananthapuram",
        "Thrissur",
        "Wayanad",
        "Others"
    ],
    // Roof Types (Non-concrete flat reveals custom roof cost field)
    roofTypes: [
        "Concrete Flat",
        "GI Sheet",
        "Tiled Roof"
    ],
    // Solar Inverter Phases
    inverterPhases: [
        "Single Phase",
        "Three Phase"
    ],
    // KSEB Connection Phases
    ksebPhases: [
        "Single Phase",
        "Three Phase"
    ],
    // Net Meter Scope
    netMeterScopes: [
        "Solis",
        "KSEB"
    ],
    // KSEB Payment Scope
    ksebPaymentScopes: [
        "Solis",
        "Customer"
    ],
    // System Types
    systemTypes: [
        { value: "On-Grid", label: "On-Grid String" },
        { value: "Hybrid", label: "Hybrid (Battery Backup)" },
        { value: "Micro Inverter", label: "Micro Inverter" }
    ],
    // Future / Custom Form Dropdowns:
    // Format: [ { id: "elementId", label: "Display Label", options: ["Option 1", "Option 2"], placeholder: "Select..." } ]
    customDropdowns: []
};

function getFormConfig() {
    try {
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem('solis-form-config');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.districts) && parsed.districts.length > 0) {
                    return parsed;
                }
            }
        }
    } catch(e) {
        console.warn('getFormConfig parse fallback:', e);
    }
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('solis-form-config', JSON.stringify(DEFAULT_FORM_CONFIG));
        }
    } catch(e) {}
    return DEFAULT_FORM_CONFIG;
}

async function saveFormConfig(data) {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('solis-form-config', JSON.stringify(data));
        }
    } catch(e) {}
    if (typeof pushFormConfigToFirebase === 'function') {
        return await pushFormConfigToFirebase(data);
    }
}

// Global window exposure
if (typeof window !== 'undefined') {
    window.getMasterData = getMasterData;
    window.saveMasterData = saveMasterData;
    window.getBOMTemplates = getBOMTemplates;
    window.saveBOMTemplates = saveBOMTemplates;
    window.DEFAULT_MASTER_DATA = DEFAULT_MASTER_DATA;
    window.DEFAULT_BOM_TEMPLATES = DEFAULT_BOM_TEMPLATES;
    window.DEFAULT_FORM_CONFIG = DEFAULT_FORM_CONFIG;
    window.getFormConfig = getFormConfig;
    window.saveFormConfig = saveFormConfig;
}

// Reset logic for ERP Module
try {
    if (typeof localStorage !== 'undefined') {
        let storedData = localStorage.getItem('solis-master-data');
        let needsReset = false;
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (!Array.isArray(parsed.panelProducts) || parsed.panelProducts.length < 10) {
                needsReset = true;
            } else {
                const brands = new Set(parsed.panelProducts.map(p => p.brand));
                if (!brands.has('Waaree') || !brands.has('Tata Power') || !brands.has('Adani') || !brands.has('Premier Energies') || !brands.has('Emmvee')) {
                    needsReset = true;
                }
            }
            if (!Array.isArray(parsed.inverterProducts) || parsed.inverterProducts.length < 10) {
                needsReset = true;
            }
            if (!parsed.supply || !parsed.profitMargins || !parsed.profitMargins['On-Grid']) {
                needsReset = true;
            }
        } else {
            needsReset = true;
        }

        if (needsReset) {
            localStorage.setItem('solis-master-data', JSON.stringify(DEFAULT_MASTER_DATA));
        }

        let bomData = localStorage.getItem('solis-bom-templates');
        let needsBomReset = !bomData;
        if (bomData) {
            const parsed = JSON.parse(bomData);
            if (!parsed['On-Grid'] || !parsed['On-Grid']['3kW']) {
                needsBomReset = true;
            }
        }
        if (needsBomReset) {
            localStorage.setItem('solis-bom-templates', JSON.stringify(DEFAULT_BOM_TEMPLATES));
        }
        if (!localStorage.getItem('solis-form-config')) {
            localStorage.setItem('solis-form-config', JSON.stringify(DEFAULT_FORM_CONFIG));
        }
    }
} catch(e) {}
