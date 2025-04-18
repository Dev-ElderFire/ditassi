
import React, { createContext, useState, useContext, useEffect } from "react";
import { 
  TimeRecord, 
  User, 
  GeoLocation 
} from "@/types";
import { getCurrentLocation } from "@/lib/utils/geo";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  // Calculate next expected action
  const getNextExpectedAction = (records: TimeRecord[]): "check-in" | "break-start" | "break-end" | "check-out" | null => {
    if (records.length === 0) {
      return "check-in";
    }
    
    const lastRecord = records[records.length - 1];
    
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
  };

  // Fetch today's records
  const fetchTodayRecords = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayISOStart = today.toISOString();
      const tomorrowISOStart = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', todayISOStart)
        .lt('timestamp', tomorrowISOStart)
        .order('timestamp', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform data to match TimeRecord type
      const formattedRecords: TimeRecord[] = data.map((record: any) => ({
        id: record.id,
        userId: record.user_id,
        timestamp: record.timestamp,
        type: record.type,
        device: record.device,
        location: record.location,
      }));
      
      setTodayRecords(formattedRecords);
      
      // Calculate next expected action
      const next = getNextExpectedAction(formattedRecords);
      setNextAction(next);
      
      return formattedRecords;
    } catch (err) {
      console.error("Failed to fetch today's records:", err);
      setError("Falha ao carregar registros de hoje");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recent records
  const fetchRecentRecords = async (userId: string, limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform data to match TimeRecord type
      const formattedRecords: TimeRecord[] = data.map((record: any) => ({
        id: record.id,
        userId: record.user_id,
        timestamp: record.timestamp,
        type: record.type,
        device: record.device,
        location: record.location,
      }));
      
      setRecentRecords(formattedRecords);
      
      return formattedRecords;
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
      
      // Current time
      const timestamp = new Date();
      
      // Insert directly to Supabase
      const { data, error } = await supabase
        .from('time_records')
        .insert([{
          user_id: authState.user.id,
          timestamp: timestamp.toISOString(),
          type,
          device,
          location
        }])
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Format the returned record
      const newRecord: TimeRecord = {
        id: data.id,
        userId: data.user_id,
        timestamp: data.timestamp,
        type: data.type,
        device: data.device,
        location: data.location,
      };
      
      // Refresh today's records
      await fetchTodayRecords(authState.user.id);
      await fetchRecentRecords(authState.user.id);
      
      toast.success(`Ponto registrado com sucesso: ${type}`);
      
      return newRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha ao registrar ponto";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user records for admin view
  const fetchUserRecords = async (userId: string, limit = 50): Promise<TimeRecord[]> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform data to match TimeRecord type
      const formattedRecords: TimeRecord[] = data.map((record: any) => ({
        id: record.id,
        userId: record.user_id,
        timestamp: record.timestamp,
        type: record.type,
        device: record.device,
        location: record.location,
      }));
      
      return formattedRecords;
    } catch (err) {
      console.error("Failed to fetch user records:", err);
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
