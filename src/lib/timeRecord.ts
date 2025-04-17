
import { TimeRecord, User, GeoLocation } from "@/types";
import { timeRecords } from "./mock-data";
import { getCurrentPreciseTime } from "./utils/time";

// Get all time records
export async function getAllTimeRecords(): Promise<TimeRecord[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return [...timeRecords];
}

// Get time records for a specific user
export async function getUserTimeRecords(userId: string): Promise<TimeRecord[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const records = timeRecords.filter((record) => record.userId === userId);
  return [...records];
}

// Get time records for a date range
export async function getTimeRecordsInRange(
  startDate: Date,
  endDate: Date,
  userId?: string
): Promise<TimeRecord[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const records = timeRecords.filter((record) => {
    const timestamp = new Date(record.timestamp);
    const isInRange = timestamp >= startDate && timestamp <= endDate;
    
    if (userId) {
      return isInRange && record.userId === userId;
    }
    
    return isInRange;
  });
  
  return [...records];
}

// Create a new time record
export async function createTimeRecord(
  user: User,
  type: "check-in" | "check-out" | "break-start" | "break-end",
  location: GeoLocation,
  device: "web" | "mobile" | "totem" | "qrcode" = "web",
  timestamp = getCurrentPreciseTime()
): Promise<TimeRecord> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700));
  
  const newRecord: TimeRecord = {
    id: `${timeRecords.length + 1}`,
    userId: user.id,
    type,
    timestamp,
    location,
    device,
  };
  
  // In a real app, we would save this to a database
  // Here we'll just add it to our mock data
  timeRecords.push(newRecord);
  
  return newRecord;
}

// Edit a time record (admin only)
export async function editTimeRecord(
  recordId: string,
  adminId: string,
  updates: Partial<TimeRecord>,
  editReason: string
): Promise<TimeRecord> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const recordIndex = timeRecords.findIndex((r) => r.id === recordId);
  
  if (recordIndex === -1) {
    throw new Error("Registro não encontrado");
  }
  
  const updatedRecord = {
    ...timeRecords[recordIndex],
    ...updates,
    edited: true,
    editedBy: adminId,
    editReason,
  };
  
  // In a real app, we would update the database
  // Here we'll just update our mock data
  timeRecords[recordIndex] = updatedRecord;
  
  return updatedRecord;
}

// Get the latest time record for a user
export async function getLatestTimeRecord(userId: string): Promise<TimeRecord | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const userRecords = timeRecords.filter((record) => record.userId === userId);
  
  if (userRecords.length === 0) {
    return null;
  }
  
  // Sort by timestamp (newest first)
  userRecords.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  return userRecords[0];
}

// Get today's time records for a user
export async function getTodayTimeRecords(userId: string): Promise<TimeRecord[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const records = timeRecords.filter((record) => {
    const timestamp = new Date(record.timestamp);
    return record.userId === userId && timestamp >= today && timestamp < tomorrow;
  });
  
  // Sort by timestamp (oldest first)
  records.sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
  
  return records;
}

// Calculate next expected action for a user
export function getNextExpectedAction(todayRecords: TimeRecord[]): "check-in" | "break-start" | "break-end" | "check-out" | null {
  if (todayRecords.length === 0) {
    return "check-in";
  }
  
  const lastRecord = todayRecords[todayRecords.length - 1];
  
  switch (lastRecord.type) {
    case "check-in":
      return "break-start";
    case "break-start":
      return "break-end";
    case "break-end":
      return "check-out";
    case "check-out":
      return null; // Day complete
    default:
      return "check-in";
  }
}
