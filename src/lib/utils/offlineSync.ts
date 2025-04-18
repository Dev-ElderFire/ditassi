
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { TimeRecord, GeoLocation } from "@/types";

// Sync pending time records to Supabase
export async function syncPendingTimeRecords() {
  try {
    // Get pending records from localStorage
    const pendingRecordsJson = localStorage.getItem('pending_time_records');
    if (!pendingRecordsJson) return [];

    const pendingRecords = JSON.parse(pendingRecordsJson);
    const syncedRecords = [];

    for (const record of pendingRecords) {
      // Convert GeoLocation to Json compatible format
      let locationJson = null;
      if (record.location) {
        locationJson = {
          latitude: record.location.latitude,
          longitude: record.location.longitude,
          accuracy: record.location.accuracy,
          address: record.location.address
        };
      }

      // Insert record to Supabase
      const { data, error } = await supabase
        .from('time_records')
        .insert([{
          id: record.id || uuidv4(),
          user_id: record.userId,
          timestamp: record.timestamp,
          type: record.type,
          device: record.device,
          location: locationJson,
          offline_id: record.id,
          synced: true
        }]);

      if (error) {
        console.error("Failed to sync record:", error);
        continue;
      }

      syncedRecords.push(data);
    }

    // Clear synced records from localStorage
    localStorage.setItem('pending_time_records', JSON.stringify([]));
    return syncedRecords;
  } catch (err) {
    console.error("Error syncing pending records:", err);
    return [];
  }
}

// Store time record locally when offline
export function storeTimeRecordLocally(record: TimeRecord) {
  try {
    // Get existing pending records
    const pendingRecordsJson = localStorage.getItem('pending_time_records');
    const pendingRecords = pendingRecordsJson ? JSON.parse(pendingRecordsJson) : [];
    
    // Add new record
    pendingRecords.push(record);
    
    // Save back to localStorage
    localStorage.setItem('pending_time_records', JSON.stringify(pendingRecords));
    
    return true;
  } catch (err) {
    console.error("Error storing record locally:", err);
    return false;
  }
}
