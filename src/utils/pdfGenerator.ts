import jsPDF from 'jspdf';
import { LoanRequest } from '../types';
import { formatIndonesianDate } from './loanRules';

export function generateLoanCardPDF(loan: LoanRequest): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Theme Colors
  const primaryColor: [number, number, number] = [30, 58, 138]; // Deep Indigo #1e3a8a
  const accentColor: [number, number, number] = [13, 148, 136]; // Teal #0d9488
  const darkTextColor: [number, number, number] = [30, 41, 59]; // Slate 800
  const lightBgColor: [number, number, number] = [248, 250, 252]; // Slate 50
  const borderColor: [number, number, number] = [203, 213, 225]; // Slate 300

  // Header Banner Background
  doc.setFillColor(...primaryColor);
  doc.roundedRect(15, 15, pageWidth - 30, 32, 3, 3, 'F');

  // Institution & Card Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SARPRASHUB - SISTEM MANAJEMEN SARPRAS', 22, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  doc.text('DIVISI PENGELOLAAN SARANA, PRASARANA & INVENTARIS', 22, 33);
  doc.text('Kartu Bukti Izin Pengambilan & Peminjaman Resmi', 22, 39);

  // Status Badge Pill on Header right
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.roundedRect(pageWidth - 65, 21, 45, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(loan.status.toUpperCase(), pageWidth - 42.5, 27.5, { align: 'center' });

  // Main Card Body Container
  const startY = 52;
  doc.setFillColor(...lightBgColor);
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, startY, pageWidth - 30, 225, 3, 3, 'FD');

  // Transaction Code & Barcode Simulation
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(loan.loanCode, 22, startY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Waktu Pengajuan: ${loan.createdAt}`, 22, startY + 18);

  // Simulated Barcode graphic
  const barcodeX = pageWidth - 75;
  const barcodeY = startY + 6;
  doc.setFillColor(30, 41, 59);
  const barWidths = [1, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2];
  let curX = barcodeX;
  for (const bw of barWidths) {
    doc.rect(curX, barcodeY, bw * 0.7, 9, 'F');
    curX += (bw * 0.7) + 0.9;
  }
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(loan.loanCode, barcodeX + 15, barcodeY + 13, { align: 'center' });

  // Divider
  doc.setDrawColor(...borderColor);
  doc.line(22, startY + 23, pageWidth - 22, startY + 23);

  // Section 1: Borrower Information
  let currentY = startY + 31;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('I. DATA IDENTITAS PEMINJAM', 22, currentY);

  currentY += 7;
  const borrowerFields = [
    { label: 'Nama Lengkap', value: loan.borrowerName },
    { label: 'Kategori / Peran', value: `${loan.borrowerRole} (${loan.departmentOrClass || '-'})` },
    { label: 'NIP / NIK / ID', value: loan.borrowerNipOrId },
    { label: 'Kontak WhatsApp', value: loan.borrowerPhone },
    { label: 'Email Resmi', value: loan.borrowerEmail || '-' },
    { label: 'Tujuan Kegiatan', value: loan.purpose },
  ];

  doc.setFontSize(9);
  for (const field of borrowerFields) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(field.label, 25, currentY);
    doc.text(':', 62, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkTextColor);
    if (field.label === 'Tujuan Kegiatan') {
      const splitPurpose = doc.splitTextToSize(field.value, pageWidth - 95);
      doc.text(splitPurpose, 66, currentY);
      currentY += (splitPurpose.length * 4.5);
    } else {
      doc.text(field.value, 66, currentY);
      currentY += 6;
    }
  }

  // Section 2: Schedule & Period
  currentY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('II. WAKTU & DURASI PEMINJAMAN', 22, currentY);

  currentY += 6;
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.roundedRect(22, currentY, pageWidth - 44, 18, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(55, 48, 163);
  doc.text('WAKTU MULAI:', 28, currentY + 7);
  doc.text('BATAS PENGEMBALIAN:', (pageWidth / 2) + 10, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text(
    `${formatIndonesianDate(loan.startDate)} pukul ${loan.startTime || '08:00'} WIB`,
    28,
    currentY + 13
  );
  doc.text(
    `${formatIndonesianDate(loan.endDate)} pukul ${loan.endTime || '16:00'} WIB`,
    (pageWidth / 2) + 10,
    currentY + 13
  );

  // Section 3: Item Table
  currentY += 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('III. DAFTAR SARANA PRASARANA YANG DIPINJAM', 22, currentY);

  currentY += 5;
  // Table Header
  doc.setFillColor(224, 231, 255); // Indigo 100
  doc.rect(22, currentY, pageWidth - 44, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('NO', 25, currentY + 5);
  doc.text('KODE', 35, currentY + 5);
  doc.text('NAMA BARANG / RUANGAN', 65, currentY + 5);
  doc.text('TIPE', pageWidth - 55, currentY + 5);
  doc.text('JUMLAH', pageWidth - 32, currentY + 5);

  currentY += 7;
  doc.setFont('helvetica', 'normal');
  loan.items.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(241, 245, 249);
      doc.rect(22, currentY, pageWidth - 44, 7, 'F');
    }
    doc.setTextColor(...darkTextColor);
    doc.text(String(index + 1), 26, currentY + 5);
    doc.text(item.itemCode || '-', 35, currentY + 5);
    
    // truncate if long
    const cleanName = item.itemName.length > 40 ? item.itemName.substring(0, 38) + '...' : item.itemName;
    doc.text(cleanName, 65, currentY + 5);
    doc.text(item.type === 'ruang' ? 'Ruangan' : 'Barang', pageWidth - 55, currentY + 5);
    doc.text(`${item.quantity} ${item.unit || 'Unit'}`, pageWidth - 32, currentY + 5);
    currentY += 7;
  });

  // Section 4: Terms & Conditions
  currentY += 4;
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.roundedRect(22, currentY, pageWidth - 44, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text('KETENTUAN & SOP PEMINJAMAN:', 26, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  doc.text('1. Tunjukkan kartu peminjaman ini kepada petugas Sarpras saat pengambilan barang / pembukaan kunci ruangan.', 26, currentY + 9);
  doc.text('2. Peminjam bertanggung jawab penuh atas kebersihan, keutuhan, dan keselamatan sarana prasarana yang digunakan.', 26, currentY + 13);
  doc.text('3. Segera laporkan kepada pengelola jika terdapat anomali/kerusakan selama masa penggunaan berlangsung.', 26, currentY + 16.5);

  // Signatures
  currentY += 23;
  const colLeft = 35;
  const colRight = pageWidth - 70;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Peminjam / Pengguna,', colLeft, currentY);
  doc.text('Petugas Bagian Sarpras,', colRight, currentY);

  currentY += 15;
  // Simulated Stamp
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.roundedRect(colRight - 5, currentY - 10, 36, 12, 1, 1, 'D');
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('VERIFIED & APPROVED', colRight + 13, currentY - 3, { align: 'center' });
  doc.setFontSize(6);
  doc.text('SARPRASHUB SYSTEM', colRight + 13, currentY + 0.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text(`( ${loan.borrowerName} )`, colLeft, currentY + 6);
  doc.text(`( ${loan.approvedBy || 'Admin Sarpras'} )`, colRight, currentY + 6);

  // Footer note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Dokumen digital sah dicetak otomatis melalui SarprasHub pada ${new Date().toLocaleString('id-ID')}`,
    pageWidth / 2,
    startY + 221,
    { align: 'center' }
  );

  return doc;
}

export function downloadLoanCardPDF(loan: LoanRequest) {
  const doc = generateLoanCardPDF(loan);
  doc.save(`Kartu_Peminjaman_${loan.loanCode}.pdf`);
}
