
import { TimeRecord } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface OfflineRecord extends Omit<TimeRecord, 'id'> {
  offline_id: string;
}

export const saveOfflineRecord = async (record: Omit<TimeRecord, 'id'>) => {
  const offlineRecord: OfflineRecord = {
    ...record,
    offline_id: uuidv4(),
  };
  
  const records = await getOfflineRecords();
  records.push(offlineRecord);
  localStorage.setItem('offlineRecords', JSON.stringify(records));
  
  return offlineRecord;
};

export const getOfflineRecords = async (): Promise<OfflineRecord[]> => {
  const records = localStorage.getItem('offlineRecords');
  return records ? JSON.parse(records) : [];
};

export const removeOfflineRecord = async (offline_id: string) => {
  const records = await getOfflineRecords();
  const updatedRecords = records.filter(r => r.offline_id !== offline_id);
  localStorage.setItem('offlineRecords', JSON.stringify(updatedRecords));
};

export const syncOfflineRecords = async () => {
  const records = await getOfflineRecords();
  
  for (const record of records) {
    try {
      // Mapeando as propriedades para o formato esperado pelo Supabase
      const { error } = await supabase
        .from('time_records')
        .insert({
          user_id: record.userId,
          type: record.type,
          timestamp: record.timestamp,
          location: record.location,
          device: record.device,
          offline_id: record.offline_id,
          synced: true
        });
      
      if (!error) {
        await removeOfflineRecord(record.offline_id);
      }
    } catch (error) {
      console.error('Failed to sync record:', error);
    }
  }
};

export const isOnline = () => {
  return navigator.onLine;
};
