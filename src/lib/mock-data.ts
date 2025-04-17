
import { User, TimeRecord, Department, WorkSchedule, Absence, Report } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@horacerta.com",
    role: "admin",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao@horacerta.com",
    role: "employee",
    department: "Desenvolvimento",
    position: "Desenvolvedor Frontend",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: new Date("2023-02-15"),
  },
  {
    id: "3",
    name: "Maria Souza",
    email: "maria@horacerta.com",
    role: "manager",
    department: "Recursos Humanos",
    position: "Gerente de RH",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    createdAt: new Date("2023-01-10"),
  },
  {
    id: "4",
    name: "Carlos Ferreira",
    email: "carlos@horacerta.com",
    role: "employee",
    department: "Contabilidade",
    position: "Contador",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    createdAt: new Date("2023-03-05"),
  },
  {
    id: "5",
    name: "Ana Paula Costa",
    email: "ana@horacerta.com",
    role: "employee",
    department: "Desenvolvimento",
    position: "Desenvolvedora Backend",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    createdAt: new Date("2023-03-20"),
  },
];

// Mock Departments
export const departments: Department[] = [
  {
    id: "1",
    name: "Desenvolvimento",
    managerId: "3",
  },
  {
    id: "2",
    name: "Recursos Humanos",
    managerId: "3",
  },
  {
    id: "3",
    name: "Contabilidade",
  },
  {
    id: "4",
    name: "Marketing",
  },
];

// Generate today's date at 8:00, 12:00, 13:00, and 18:00
const today = new Date();
const checkInTime = new Date(today);
checkInTime.setHours(8, 0, 0, 0);

const breakStartTime = new Date(today);
breakStartTime.setHours(12, 0, 0, 0);

const breakEndTime = new Date(today);
breakEndTime.setHours(13, 0, 0, 0);

const checkOutTime = new Date(today);
checkOutTime.setHours(18, 0, 0, 0);

// Yesterday's date
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayCheckIn = new Date(yesterday);
yesterdayCheckIn.setHours(8, 0, 0, 0);

const yesterdayBreakStart = new Date(yesterday);
yesterdayBreakStart.setHours(12, 0, 0, 0);

const yesterdayBreakEnd = new Date(yesterday);
yesterdayBreakEnd.setHours(13, 0, 0, 0);

const yesterdayCheckOut = new Date(yesterday);
yesterdayCheckOut.setHours(18, 0, 0, 0);

// Mock Time Records
export const timeRecords: TimeRecord[] = [
  // Today's records for user 2
  {
    id: "1",
    userId: "2",
    type: "check-in",
    timestamp: checkInTime,
    device: "web",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  {
    id: "2",
    userId: "2",
    type: "break-start",
    timestamp: breakStartTime,
    device: "web",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  {
    id: "3",
    userId: "2",
    type: "break-end",
    timestamp: breakEndTime,
    device: "web",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  {
    id: "4",
    userId: "2",
    type: "check-out",
    timestamp: checkOutTime,
    device: "web",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  
  // Yesterday's records for user 2
  {
    id: "5",
    userId: "2",
    type: "check-in",
    timestamp: yesterdayCheckIn,
    device: "mobile",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 15,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  {
    id: "6",
    userId: "2",
    type: "break-start",
    timestamp: yesterdayBreakStart,
    device: "mobile",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 15,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  {
    id: "7",
    userId: "2",
    type: "break-end",
    timestamp: yesterdayBreakEnd,
    device: "mobile",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 15,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  {
    id: "8",
    userId: "2",
    type: "check-out",
    timestamp: yesterdayCheckOut,
    device: "mobile",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 15,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  
  // Today's records for user 5
  {
    id: "9",
    userId: "5",
    type: "check-in",
    timestamp: new Date(checkInTime.getTime() + 15 * 60000), // 8:15
    device: "web",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  {
    id: "10",
    userId: "5",
    type: "break-start",
    timestamp: breakStartTime,
    device: "web",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
  {
    id: "11",
    userId: "5",
    type: "break-end",
    timestamp: breakEndTime,
    device: "web",
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10,
      address: "Avenida Paulista, 1000, São Paulo, SP",
    },
  },
];

// Mock Work Schedules
export const workSchedules: WorkSchedule[] = [
  // João's schedule (Monday-Friday, 8-18 with 1h lunch break)
  {
    id: "1",
    userId: "2",
    weekDay: 1, // Monday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  {
    id: "2",
    userId: "2",
    weekDay: 2, // Tuesday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  {
    id: "3",
    userId: "2",
    weekDay: 3, // Wednesday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  {
    id: "4",
    userId: "2",
    weekDay: 4, // Thursday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  {
    id: "5",
    userId: "2",
    weekDay: 5, // Friday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  
  // Ana's schedule
  {
    id: "6",
    userId: "5",
    weekDay: 1, // Monday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  {
    id: "7",
    userId: "5",
    weekDay: 2, // Tuesday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  {
    id: "8",
    userId: "5",
    weekDay: 3, // Wednesday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  {
    id: "9",
    userId: "5",
    weekDay: 4, // Thursday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  {
    id: "10",
    userId: "5",
    weekDay: 5, // Friday
    startTime: "08:00",
    endTime: "18:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
];

// Mock absences
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

export const absences: Absence[] = [
  {
    id: "1",
    userId: "2",
    date: lastWeek,
    reason: "Consulta médica",
    justified: true,
    approvedBy: "3",
    documentUrl: "/docs/atestado-123.pdf",
  },
  {
    id: "2",
    userId: "5",
    date: new Date(lastWeek.getTime() - 2 * 24 * 60 * 60 * 1000),
    reason: "Problema familiar",
    justified: true,
    approvedBy: "3",
  },
];

// Mock reports
export const reports: Report[] = [
  {
    id: "1",
    name: "Relatório de Ponto - João Silva - Março 2023",
    type: "employee",
    period: "monthly",
    format: "pdf",
    targetId: "2",
    createdAt: new Date("2023-04-01"),
    createdBy: "3",
    url: "/reports/joao-marco-2023.pdf",
  },
  {
    id: "2",
    name: "Relatório de Ponto - Desenvolvimento - Março 2023",
    type: "department",
    period: "monthly",
    format: "excel",
    targetId: "1",
    createdAt: new Date("2023-04-01"),
    createdBy: "3",
    url: "/reports/dev-marco-2023.xlsx",
  },
  {
    id: "3",
    name: "Relatório de Ponto - Empresa - Março 2023",
    type: "company",
    period: "monthly",
    format: "pdf",
    createdAt: new Date("2023-04-01"),
    createdBy: "1",
    url: "/reports/empresa-marco-2023.pdf",
  },
];
