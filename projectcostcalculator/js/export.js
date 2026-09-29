// Export Functionality

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('btn-export-excel').addEventListener('click', exportToExcel);
});

function getProjectInfo() {
    return {
        name: document.getElementById('info-project-name').value || 'N/A',
        number: document.getElementById('info-project-number').value || 'N/A',
        customer: document.getElementById('info-customer-name').value || 'N/A',
        location: document.getElementById('info-location').value || 'N/A',
        capacity: document.getElementById('info-capacity').value || 'N/A',
        preparedBy: document.getElementById('info-prepared-by').value || 'N/A',
        date: document.getElementById('info-date').value || 'N/A',
    };
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const info = getProjectInfo();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(13, 71, 161); // Primary blue
    doc.text("Solis EPC - Project Budget Cost Estimation", 40, 40);
    
    // Project Info
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Project Name: ${info.name}`, 40, 70);
    doc.text(`Project No: ${info.number}`, 300, 70);
    doc.text(`Customer: ${info.customer}`, 40, 85);
    doc.text(`Location: ${info.location}`, 300, 85);
    doc.text(`Capacity (kWp): ${info.capacity}`, 40, 100);
    doc.text(`Date: ${info.date}`, 300, 100);
    
    let currentY = 130;

    // Summary Section
    doc.setFontSize(12);
    doc.setTextColor(13, 71, 161);
    doc.text("Cost Summary", 40, currentY);
    currentY += 15;

    const summaryData = [];
    sectionConfigs.forEach(section => {
        const val = document.getElementById(`summary-${section.id}`).innerText;
        summaryData.push([section.title, val]);
    });
    summaryData.push(["Contingency", document.getElementById('summary-contingency').innerText]);
    
    // Grand Total Row
    summaryData.push(["TOTAL PROJECT COST", document.getElementById('grand-total').innerText]);

    doc.autoTable({
        startY: currentY,
        head: [['Section', 'Cost']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [13, 71, 161] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0,0,0], fontStyle: 'bold' },
        willDrawCell: function(data) {
            if (data.row.index === summaryData.length - 1) {
                doc.setFont("helvetica", "bold");
                if (data.section === 'body' && data.column.index === 1) {
                    doc.setTextColor(46, 125, 50); // Success Green
                }
            }
        }
    });

    // Save
    doc.save(`Budget_Estimate_${info.name.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}

function exportToExcel() {
    const wb = XLSX.utils.book_new();
    const info = getProjectInfo();
    
    // 1. Summary Sheet
    const summaryData = [
        ["Solis EPC - Project Budget Cost Estimation"],
        [],
        ["Project Name", info.name, "", "Project No", info.number],
        ["Customer", info.customer, "", "Location", info.location],
        ["Capacity (kWp)", info.capacity, "", "Date", info.date],
        [],
        ["Section", "Cost"]
    ];

    sectionConfigs.forEach(section => {
        const valStr = document.getElementById(`summary-${section.id}`).innerText;
        summaryData.push([section.title, valStr]);
    });
    
    summaryData.push(["Contingency", document.getElementById('summary-contingency').innerText]);
    summaryData.push([]);
    summaryData.push(["TOTAL PROJECT COST", document.getElementById('grand-total').innerText]);

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    // 2. Detailed Sheets for each section
    sectionConfigs.forEach(section => {
        const tbody = document.getElementById(`tbody-${section.id}`);
        if (!tbody) return;
        
        const headers = section.fields.map(f => f.label);
        const rows = [];
        
        tbody.querySelectorAll('tr').forEach(tr => {
            const rowData = [];
            section.fields.forEach(field => {
                const input = tr.querySelector(`[name="${field.name}"]`);
                rowData.push(input ? input.value : '');
            });
            // Only add if row is not completely empty
            if (rowData.some(v => v !== '')) {
                rows.push(rowData);
            }
        });

        if (rows.length > 0) {
            const sheetData = [headers, ...rows];
            const ws = XLSX.utils.aoa_to_sheet(sheetData);
            // Sheet names limit is 31 chars
            const safeTitle = section.title.substring(0, 31).replace(/[\*\?\/\\\[\]]/g, '');
            XLSX.utils.book_append_sheet(wb, ws, safeTitle);
        }
    });

    XLSX.writeFile(wb, `Budget_Estimate_${info.name.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
}
