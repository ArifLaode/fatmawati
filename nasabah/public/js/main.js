// File: js/main.js
import { jsPDF } from "./jspdf.umd.min.js";

function printPDF() {
  const pdf = new jsPDF();
  const table = document.querySelector('.table');

  pdf.autoTable({
    head: [['Kode Akun', 'ID Transaksi', 'Waktu Transaksi', 'Nominal', 'Posisi Saldo']],
    body: convertTableToData(table),
  });

  pdf.save('Laporan_Data.pdf');
}

function convertTableToData(table) {
  const data = [];
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const rowData = [];
    row.querySelectorAll('td').forEach(cell => {
      rowData.push(cell.innerText);
    });
    data.push(rowData);
  });

  return data;
}

export { printPDF };
