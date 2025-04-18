
import { supabase } from "@/integrations/supabase/client";

// This function can be used to initialize DB triggers if needed
export async function setupDatabaseTriggers() {
  // We'll create these with SQL separately, since they need to be created on the server
  console.log("Database triggers would be set up here");
}

// Helper function to check if a user exists in the usuarios table
export async function checkUserExists(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id')
    .eq('id_auth', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error("Error checking if user exists:", error);
  }
  
  return !!data;
}

// Helper function to create a user profile if it doesn't exist
export async function createUserProfileIfNeeded(
  userId: string, 
  email: string, 
  name: string, 
  role: string = 'employee',
  department?: string,
  position?: string
): Promise<void> {
  try {
    const exists = await checkUserExists(userId);
    
    if (!exists) {
      const { error } = await supabase
        .from('usuarios')
        .insert([{
          id_auth: userId,
          email,
          name,
          role,
          department,
          position
        }]);
      
      if (error) {
        console.error("Error creating user profile:", error);
      }
    }
  } catch (err) {
    console.error("Exception creating user profile:", err);
  }
}
