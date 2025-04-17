
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TimeRecord } from '@/types';
import { formatDateTime, calculateWorkHours, formatHoursToDisplay } from './time';

interface TimeRecordWithUser extends TimeRecord {
  user?: {
    name: string;
  };
}

export const generateTimeRecordsPDF = (records: TimeRecordWithUser[], userName: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Relatório de Ponto - DiTassi Caffé', 14, 15);
  
  // Add employee info
  doc.setFontSize(12);
  doc.text(`Funcionário: ${userName}`, 14, 25);
  doc.text(`Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
  
  // Group records by day
  const recordsByDay = records.reduce((acc, record) => {
    const date = new Date(record.timestamp).toLocaleDateString('pt-BR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {} as Record<string, TimeRecordWithUser[]>);
  
  // Prepare table data
  const tableData = Object.entries(recordsByDay).map(([date, dayRecords]) => {
    // Sort records by timestamp
    dayRecords.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Find check-in and check-out times
    const checkIn = dayRecords.find(r => r.type === 'check-in');
    const checkOut = dayRecords.find(r => r.type === 'check-out');
    const breakStart = dayRecords.find(r => r.type === 'break-start');
    const breakEnd = dayRecords.find(r => r.type === 'break-end');
    
    // Calculate work hours
    const totalHours = calculateWorkHours(
      checkIn ? new Date(checkIn.timestamp) : null,
      checkOut ? new Date(checkOut.timestamp) : null,
      breakStart ? new Date(breakStart.timestamp) : null,
      breakEnd ? new Date(breakEnd.timestamp) : null
    );
    
    return [
      date,
      checkIn ? formatDateTime(new Date(checkIn.timestamp)) : '-',
      breakStart ? formatDateTime(new Date(breakStart.timestamp)) : '-',
      breakEnd ? formatDateTime(new Date(breakEnd.timestamp)) : '-',
      checkOut ? formatDateTime(new Date(checkOut.timestamp)) : '-',
      formatHoursToDisplay(totalHours)
    ];
  });
  
  // Generate table
  autoTable(doc, {
    head: [['Data', 'Entrada', 'Início Pausa', 'Fim Pausa', 'Saída', 'Total']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [82, 82, 82],
    },
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`ponto-${userName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};
