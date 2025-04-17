
import React, { createContext, useState, useContext, useEffect } from "react";
import { 
  TimeRecord, 
  User, 
  GeoLocation 
} from "@/types";
import { 
  getTodayTimeRecords, 
  getNextExpectedAction, 
  createTimeRecord,
  getUserTimeRecords
} from "@/lib/timeRecord";
import { useAuth } from "./AuthContext";
import { getCurrentLocation } from "@/lib/utils/geo";

interface TimeRecordContextType {
  todayRecords: TimeRecord[];
  isLoading: boolean;
  error: string | null;
  nextAction: "check-in" | "break-start" | "break-end" | "check-out" | null;
  recordTimeEntry: (type: "check-in" | "break-start" | "break-end" | "check-out", device?: "web" | "mobile" | "totem" | "qrcode") => Promise<TimeRecord>;
  refreshRecords: () => Promise<void>;
  recentRecords: TimeRecord[];
  fetchUserRecords: (userId: string, limit?: number) => Promise<TimeRecord[]>;
}

const TimeRecordContext = createContext<TimeRecordContextType | undefined>(undefined);

export const TimeRecordProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { authState } = useAuth();
  const [todayRecords, setTodayRecords] = useState<TimeRecord[]>([]);
  const [recentRecords, setRecentRecords] = useState<TimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextAction, setNextAction] = useState<"check-in" | "break-start" | "break-end" | "check-out" | null>("check-in");

  // Fetch today's records
  const fetchTodayRecords = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const records = await getTodayTimeRecords(userId);
      setTodayRecords(records);
      
      // Calculate next expected action
      const next = getNextExpectedAction(records);
      setNextAction(next);
      
      return records;
    } catch (err) {
      setError("Falha ao carregar registros de hoje");
      console.error("Failed to fetch today's records:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recent records
  const fetchRecentRecords = async (userId: string, limit = 20) => {
    try {
      const records = await getUserTimeRecords(userId);
      // Sort by timestamp, newest first
      records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const limitedRecords = records.slice(0, limit);
      setRecentRecords(limitedRecords);
      
      return limitedRecords;
    } catch (err) {
      console.error("Failed to fetch recent records:", err);
      return [];
    }
  };

  // Load records when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchTodayRecords(authState.user.id);
      fetchRecentRecords(authState.user.id);
    } else {
      setTodayRecords([]);
      setRecentRecords([]);
      setNextAction("check-in");
    }
  }, [authState.isAuthenticated, authState.user]);

  // Record a new time entry
  const recordTimeEntry = async (
    type: "check-in" | "break-start" | "break-end" | "check-out",
    device: "web" | "mobile" | "totem" | "qrcode" = "web"
  ): Promise<TimeRecord> => {
    if (!authState.user) {
      throw new Error("Usuário não autenticado");
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      // Create record
      const newRecord = await createTimeRecord(
        authState.user,
        type,
        location,
        device
      );
      
      // Refresh today's records
      await fetchTodayRecords(authState.user.id);
      await fetchRecentRecords(authState.user.id);
      
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao registrar ponto");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user records for admin view
  const fetchUserRecords = async (userId: string, limit = 50): Promise<TimeRecord[]> => {
    setIsLoading(true);
    
    try {
      const records = await getUserTimeRecords(userId);
      // Sort by timestamp, newest first
      records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return records.slice(0, limit);
    } catch (err) {
      setError("Falha ao buscar registros do usuário");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh records
  const refreshRecords = async () => {
    if (!authState.user) return;
    
    await fetchTodayRecords(authState.user.id);
    await fetchRecentRecords(authState.user.id);
  };

  return (
    <TimeRecordContext.Provider
      value={{
        todayRecords,
        isLoading,
        error,
        nextAction,
        recordTimeEntry,
        refreshRecords,
        recentRecords,
        fetchUserRecords,
      }}
    >
      {children}
    </TimeRecordContext.Provider>
  );
};

// Custom hook to use time record context
export const useTimeRecord = () => {
  const context = useContext(TimeRecordContext);
  
  if (context === undefined) {
    throw new Error("useTimeRecord must be used within a TimeRecordProvider");
  }
  
  return context;
};
