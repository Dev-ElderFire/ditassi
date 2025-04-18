
import { TimeRecord } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Syncs a local time record to Supabase
 */
export async function syncTimeRecord(record: TimeRecord): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Format the record for insertion
    const formattedRecord = {
      id: record.id,
      user_id: record.userId,
      type: record.type,
      timestamp: record.timestamp.toISOString(),
      device: record.device,
      location: record.location as Json,
      offline_id: record.id, // Use the local ID for tracking
      synced: true
    };

    // Insert the record into Supabase
    const { error } = await supabase
      .from('time_records')
      .insert(formattedRecord);

    if (error) {
      console.error("Error syncing record to Supabase:", error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception during sync:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during sync'
    };
  }
}

/**
 * Syncs all pending local records to Supabase
 */
export async function syncPendingRecords(pendingRecords: TimeRecord[]): Promise<{
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}> {
  const results = {
    success: true,
    synced: 0,
    failed: 0,
    errors: [] as string[]
  };

  // Process each record individually to handle partial success
  for (const record of pendingRecords) {
    const { success, error } = await syncTimeRecord(record);
    
    if (success) {
      results.synced++;
    } else {
      results.failed++;
      if (error) {
        results.errors.push(`Error with record ${record.id}: ${error}`);
      }
    }
  }
  
  // Consider the overall operation successful if at least one record was synced
  results.success = results.synced > 0;
  
  return results;
}
