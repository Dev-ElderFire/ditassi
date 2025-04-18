
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Auth context state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial auth state
export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Login function
export async function login(email: string, password: string): Promise<User> {
  // Login with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw new Error(error.message || "Falha ao fazer login");
  }
  
  if (!data.user) {
    throw new Error("Usuário não encontrado");
  }
  
  // Get user profile from usuarios table
  const { data: profileData, error: profileError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_auth', data.user.id)
    .single();
  
  if (profileError) {
    console.error("Error fetching user profile:", profileError);
  }
  
  // Construct user object
  const user: User = {
    id: data.user.id,
    email: data.user.email || '',
    name: profileData?.name || data.user.email?.split('@')[0] || 'Usuário',
    role: profileData?.role || 'employee',
    department: profileData?.department || undefined,
    position: profileData?.position || undefined,
    createdAt: new Date(data.user.created_at || Date.now()),
  };
  
  return user;
}

// Logout function
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Error during logout:", error);
    throw new Error("Falha ao fazer logout");
  }
}

// Registration function
export async function register(
  name: string,
  email: string,
  password: string,
  role: "admin" | "employee" | "manager" = "employee",
  department?: string,
  position?: string
): Promise<User> {
  // Register with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        department,
        position,
      }
    }
  });
  
  if (error) {
    throw new Error(error.message || "Falha ao registrar usuário");
  }
  
  if (!data.user) {
    throw new Error("Falha ao criar usuário");
  }
  
  // Construct user object
  const user: User = {
    id: data.user.id,
    email: data.user.email || '',
    name,
    role,
    department,
    position,
    createdAt: new Date(data.user.created_at || Date.now()),
  };
  
  return user;
}

// Get current session
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  
  return data.session;
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return null;
  }
  
  // Get user profile from usuarios table
  const { data: profileData } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_auth', data.user.id)
    .single();
  
  // Construct user object
  const user: User = {
    id: data.user.id,
    email: data.user.email || '',
    name: profileData?.name || data.user.email?.split('@')[0] || 'Usuário',
    role: profileData?.role || 'employee',
    department: profileData?.department || undefined,
    position: profileData?.position || undefined,
    createdAt: new Date(data.user.created_at || Date.now()),
  };
  
  return user;
}

// Check user role
export function hasRole(user: User | null, roles: ("admin" | "employee" | "manager")[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
