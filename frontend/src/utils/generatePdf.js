import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates an official farmX Soil Health & Farm Advisory Card PDF.
 */
export function generateFarmAdvisoryPdf({
  farmerName = 'Farmer',
  village = 'Karnataka',
  crop = 'Crop',
  acres = 1,
  season = 'Kharif',
  fertilizerData = { urea: 80, dap: 40, mop: 30 },
  customAdvice = ''
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(34, 197, 94); // Green 500
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('farmX | Digital Farm & Soil Advisory Card', 14, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Government of Karnataka Supported Agricultural Decision System', 14, 23);

  // Date and Doc ID
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const slipNo = 'FX-REC-' + Math.floor(100000 + Math.random() * 900000);
  doc.text(`Card No: ${slipNo}  |  Date: ${today}`, pageWidth - 14, 23, { align: 'right' });

  // Farmer Details Section
  doc.setTextColor(33, 37, 41);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Farmer & Field Profile', 14, 38);

  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 42, pageWidth - 28, 26, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Farmer Name: ${farmerName}`, 18, 50);
  doc.text(`Village / Location: ${village}`, 18, 58);
  doc.text(`Cultivated Crop: ${crop}`, 110, 50);
  doc.text(`Land Holding: ${acres} Acre(s)  |  Season: ${season}`, 110, 58);

  // Fertilizer Schedule Table
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Scientific N-P-K Fertilizer Application Schedule', 14, 78);

  const ureaTotal = fertilizerData.urea || 80;
  const dapTotal = fertilizerData.dap || 40;
  const mopTotal = fertilizerData.mop || 30;

  const tableData = [
    [
      'Basal Dose (At Sowing / Planting)',
      Math.round(ureaTotal * 0.33) + ' kg',
      dapTotal + ' kg (Full Dose)',
      Math.round(mopTotal * 0.5) + ' kg',
      'Incorporate 3-5 cm below seed level during land preparation.'
    ],
    [
      '1st Top Dressing (30 Days After Sowing)',
      Math.round(ureaTotal * 0.33) + ' kg',
      'Nil',
      'Nil',
      'Apply during active vegetative tillering. Ensure adequate soil moisture.'
    ],
    [
      '2nd Top Dressing (50-60 Days / Flowering)',
      Math.round(ureaTotal * 0.34) + ' kg',
      'Nil',
      Math.round(mopTotal * 0.5) + ' kg',
      'Apply at panicle/flowering initiation for maximum grain weight.'
    ],
    [
      'Total Requirement (' + acres + ' Acre)',
      ureaTotal + ' kg',
      dapTotal + ' kg',
      mopTotal + ' kg',
      'Recommended balanced nutrient dosage for optimum yield.'
    ]
  ];

  autoTable(doc, {
    startY: 82,
    head: [['Stage / Application Window', 'Urea (N)', 'DAP (P)', 'MOP (K)', 'Method of Application']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [22, 101, 52], // Dark Green
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 9, cellPadding: 4 },
    footStyles: { fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' }
  });

  let currentY = doc.lastAutoTable.finalY + 12;

  // Advisory / Precautions Section
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Agronomic Precautions & Weather Advisory', 14, currentY);

  currentY += 6;
  doc.setFillColor(254, 243, 199); // Warm yellow
  doc.roundedRect(14, currentY, pageWidth - 28, 30, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(146, 64, 14);
  const adviceText = customAdvice || 
    '1. Do not apply fertilizer or foliar spray if rain is forecast within 6 hours.\n' +
    '2. Best spraying window: Early morning 6:00 AM - 9:00 AM when wind speed is under 12 km/h.\n' +
    '3. Avoid broadcasting urea during midday heat to minimize ammonia volatilization loss.\n' +
    '4. For pest and blight alerts, consult local Raitha Samparka Kendra before chemical purchase.';
  
  doc.text(adviceText, 18, currentY + 7);

  currentY += 38;

  // Emergency KVK Helplines Section
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(33, 37, 41);
  doc.text('4. Emergency Krishi Vigyan Kendra (KVK) & Kisan Helplines', 14, currentY);

  const helplineData = [
    ['Kisan Call Centre (Toll Free All-India)', '1800-180-1551', 'Daily 6:00 AM - 10:00 PM (Kannada Support)'],
    ['University of Agricultural Sciences (UAS) Bengaluru', '080-23330153', 'GKVK Campus, Bellary Road, Bengaluru'],
    ['University of Agricultural Sciences (UAS) Dharwad', '0836-2214420', 'Krishi Nagar, Dharwad, Karnataka'],
    ['Karnataka State Agril. Produce Processing Corp (KAPPEC)', '080-22262272', 'Market yards and APMC assistance']
  ];

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Institution / Organization', 'Helpline / Contact', 'Operating Information']],
    body: helplineData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('farmX Agricultural Technologies | Generated for Farmer Welfare | raitamitra.karnataka.gov.in', 14, footerY);

  // Save / Download
  const filename = `farmX_Advisory_${crop.replace(/\s+/g, '_')}_${today}.pdf`;
  doc.save(filename);
}
