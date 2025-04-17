
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'manager';
  department?: string;
  position?: string;
  avatar?: string;
  createdAt: Date;
}

export interface TimeRecord {
  id: string;
  userId: string;
  type: 'check-in' | 'check-out' | 'break-start' | 'break-end';
  timestamp: Date;
  location?: GeoLocation;
  device: 'web' | 'mobile' | 'totem' | 'qrcode';
  edited?: boolean;
  editedBy?: string;
  editReason?: string;
  approved?: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
}

export interface WorkSchedule {
  id: string;
  userId: string;
  weekDay: number; // 0-6, where 0 is Sunday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakStart?: string; // HH:mm format
  breakEnd?: string; // HH:mm format
}

export interface Absence {
  id: string;
  userId: string;
  date: Date;
  reason: string;
  justified: boolean;
  approvedBy?: string;
  documentUrl?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'employee' | 'department' | 'company';
  period: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'excel' | 'csv';
  targetId?: string; // userId or departmentId if applicable
  createdAt: Date;
  createdBy: string;
  url: string;
}
