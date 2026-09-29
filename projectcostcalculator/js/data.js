const sectionConfigs = [
    {
        id: 'pv-module',
        title: 'PV Module Cost',
        fields: [
            { name: 'brand', label: 'Brand', type: 'text' },
            { name: 'model', label: 'Model', type: 'text' },
            { name: 'technology', label: 'Technology', type: 'select', options: ['Mono PERC', 'TOPCon', 'HJT', 'Bifacial'] },
            { name: 'power', label: 'Power (Wp)', type: 'number' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'purchaseRate', label: 'Purchase Rate', type: 'number' },
            { name: 'discount', label: 'Discount', type: 'number' },
            { name: 'gst', label: 'GST (%)', type: 'number' },
            { name: 'transportation', label: 'Transportation', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'inverter',
        title: 'Solar Inverter Cost',
        fields: [
            { name: 'brand', label: 'Brand', type: 'text' },
            { name: 'model', label: 'Model', type: 'text' },
            { name: 'type', label: 'Type', type: 'select', options: ['String', 'Hybrid', 'Micro Inverter', 'Central'] },
            { name: 'capacity', label: 'Capacity (kW)', type: 'number' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'purchaseCost', label: 'Purchase Cost', type: 'number' },
            { name: 'gst', label: 'GST (%)', type: 'number' },
            { name: 'transportation', label: 'Transportation', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'battery',
        title: 'Battery Storage',
        fields: [
            { name: 'brand', label: 'Brand', type: 'text' },
            { name: 'model', label: 'Model', type: 'text' },
            { name: 'batteryType', label: 'Battery Type', type: 'select', options: ['Lithium', 'LFP', 'Lead Acid', 'Tubular'] },
            { name: 'capacity', label: 'Capacity', type: 'text' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'purchaseCost', label: 'Purchase Cost', type: 'number' },
            { name: 'gst', label: 'GST (%)', type: 'number' },
            { name: 'transportation', label: 'Transportation', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'structure',
        title: 'Module Mounting Structure',
        suggestions: ['Rails', 'Mid Clamp', 'End Clamp', 'Fasteners', 'L Feet', 'Roof Hooks', 'Channel', 'GI Structure', 'Aluminium Structure', 'Foundation Materials'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'structure-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'dc-materials',
        title: 'DC Electrical Materials',
        suggestions: ['DC Cable', 'MC4 Connector', 'String Combiner Box', 'Junction Box', 'Cable Tie', 'Flexible Pipe', 'Warning Labels', 'Conduit', 'Glands', 'Lugs'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'dc-list' },
            { name: 'specification', label: 'Specification', type: 'text' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'ac-materials',
        title: 'AC Electrical Materials',
        suggestions: ['AC Cable', 'ACDB', 'MCCB', 'MCB', 'SPD', 'Isolator', 'Energy Meter', 'Distribution Board', 'Conduit', 'Cable Tray'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'ac-list' },
            { name: 'specification', label: 'Specification', type: 'text' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'earthing',
        title: 'Earthing',
        suggestions: ['Earth Pit', 'GI Pipe', 'Copper Rod', 'Earth Wire', 'Earth Electrode', 'Earth Enhancement Compound', 'Earth Chamber'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'earthing-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'lightning',
        title: 'Lightning Protection',
        suggestions: ['Lightning Arrestor', 'Support Pole', 'Down Conductor', 'Clamps', 'Accessories'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'lightning-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'monitoring',
        title: 'Monitoring System',
        suggestions: ['WiFi Dongle', 'LAN Dongle', 'Data Logger', 'Communication Cable', 'Gateway', 'Monitoring Device'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'monitoring-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'supplier', label: 'Supplier', type: 'text' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'labour',
        title: 'Labour Cost',
        suggestions: ['Structure Installation', 'Panel Installation', 'Electrical Installation', 'Civil Work', 'Testing', 'Commissioning', 'Engineer', 'Supervisor', 'Helpers', 'Crane', 'Scaffolding', 'Safety Equipment'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'labour-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'rate', label: 'Rate', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'transportation',
        title: 'Transportation',
        suggestions: ['Material Transport', 'Vehicle Hire', 'Loading', 'Unloading', 'Fuel', 'Toll', 'Driver', 'Courier'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'transport-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'site-expenses',
        title: 'Site Expenses',
        suggestions: ['Food', 'Accommodation', 'Travel', 'Local Purchase', 'Site Office', 'Internet', 'Safety', 'Cleaning', 'Miscellaneous'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'site-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'govt-charges',
        title: 'Government Charges',
        suggestions: ['Net Meter Charges', 'Inspection Fees', 'Application Fees', 'Electrical Inspector Fees', 'Utility Charges'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'govt-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'tools-rental',
        title: 'Tools Rental',
        suggestions: ['Scaffolding', 'Crane', 'Ladder', 'Drilling Machine', 'Welding Machine', 'Safety Kit'],
        fields: [
            { name: 'description', label: 'Description', type: 'datalist', list: 'tools-list' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    },
    {
        id: 'miscellaneous',
        title: 'Miscellaneous',
        fields: [
            { name: 'description', label: 'Description', type: 'text' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'unitCost', label: 'Unit Cost', type: 'number' },
            { name: 'total', label: 'Total', type: 'number', readonly: true }
        ]
    }
];

// Contingency is a special case handled directly in app.js
