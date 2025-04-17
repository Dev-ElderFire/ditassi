
/**
 * Utility functions for time calculations and formatting
 */

/**
 * Format a date to display time in HH:MM format
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Format a date to display in DD/MM/YYYY format
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format a date to display in DD/MM/YYYY HH:MM format
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Calculate total working hours between check-in and check-out
 * accounting for breaks
 */
export function calculateWorkHours(
  checkIn: Date | null, 
  checkOut: Date | null, 
  breakStart: Date | null = null, 
  breakEnd: Date | null = null
): number {
  if (!checkIn || !checkOut) return 0;
  
  let totalMs = checkOut.getTime() - checkIn.getTime();
  
  // Subtract break time if available
  if (breakStart && breakEnd) {
    const breakTimeMs = breakEnd.getTime() - breakStart.getTime();
    totalMs -= breakTimeMs;
  }
  
  // Convert milliseconds to hours
  return Math.max(0, totalMs / (1000 * 60 * 60));
}

/**
 * Calculate overtime based on scheduled hours
 */
export function calculateOvertime(
  workHours: number,
  scheduledHours: number
): number {
  return Math.max(0, workHours - scheduledHours);
}

/**
 * Calculate if check-in was late based on scheduled start time
 */
export function isLateCheckIn(
  checkIn: Date,
  scheduledStart: string, // HH:mm format
  toleranceMinutes: number = 5
): boolean {
  const [hours, minutes] = scheduledStart.split(':').map(Number);
  
  const scheduledDate = new Date(checkIn);
  scheduledDate.setHours(hours, minutes, 0, 0);
  
  // Add tolerance
  scheduledDate.setMinutes(scheduledDate.getMinutes() + toleranceMinutes);
  
  return checkIn > scheduledDate;
}

/**
 * Calculate if check-out was early based on scheduled end time
 */
export function isEarlyCheckOut(
  checkOut: Date,
  scheduledEnd: string, // HH:mm format
  toleranceMinutes: number = 5
): boolean {
  const [hours, minutes] = scheduledEnd.split(':').map(Number);
  
  const scheduledDate = new Date(checkOut);
  scheduledDate.setHours(hours, minutes, 0, 0);
  
  // Subtract tolerance
  scheduledDate.setMinutes(scheduledDate.getMinutes() - toleranceMinutes);
  
  return checkOut < scheduledDate;
}

/**
 * Convert hours to hours and minutes display (e.g., 8.5 -> "8h 30m")
 */
export function formatHoursToDisplay(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h ${minutes}m`;
}

/**
 * Get current date and time accurate to the second
 */
export function getCurrentPreciseTime(): Date {
  return new Date();
}

/**
 * Get the day of week from a date (0-6, where 0 is Sunday)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Get the name of the day of week
 */
export function getDayOfWeekName(date: Date): string {
  const days = [
    'Domingo', 
    'Segunda-feira', 
    'Terça-feira', 
    'Quarta-feira', 
    'Quinta-feira', 
    'Sexta-feira', 
    'Sábado'
  ];
  
  return days[date.getDay()];
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Group time records by day
 */
export function groupRecordsByDay<T extends { timestamp: Date }>(records: T[]): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  
  for (const record of records) {
    const dateStr = formatDate(record.timestamp);
    if (!grouped[dateStr]) {
      grouped[dateStr] = [];
    }
    grouped[dateStr].push(record);
  }
  
  return grouped;
}
