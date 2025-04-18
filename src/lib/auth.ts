
import { User } from "@/types";
import { users } from "./mock-data";
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

// Mock login function
export async function login(email: string, password: string): Promise<User> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Check if user exists (in a real app, we would check password too)
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  
  // In a real app, we would check the password here
  // For demo, we'll just simulate a successful login
  
  // Store in localStorage for persistence
  localStorage.setItem("user", JSON.stringify(user));
  
  // Also store in Supabase if connected
  try {
    const { error } = await supabase
      .from('usuarios')
      .upsert({ 
        id_auth: user.id,
        email: user.email
      }, { 
        onConflict: 'id_auth' 
      });
      
    if (error) {
      console.error("Error saving user to Supabase:", error);
    }
  } catch (err) {
    console.error("Exception saving user to Supabase:", err);
  }
  
  return user;
}

// Mock logout function
export async function logout(): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Remove from localStorage
  localStorage.removeItem("user");
}

// Mock registration function
export async function register(
  name: string,
  email: string,
  password: string,
  role: "admin" | "employee" | "manager" = "employee",
  department?: string,
  position?: string
): Promise<User> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  
  if (userExists) {
    throw new Error("Usuário já existe");
  }
  
  // Create new user (in a real app, this would be stored in a database)
  const newUser: User = {
    id: `${users.length + 1}`,
    name,
    email,
    role,
    department,
    position,
    createdAt: new Date(),
  };
  
  // Store in localStorage for persistence
  localStorage.setItem("user", JSON.stringify(newUser));
  
  // Also store in Supabase if connected
  try {
    const { error } = await supabase
      .from('usuarios')
      .insert({ 
        id_auth: newUser.id,
        email: newUser.email
      });
      
    if (error) {
      console.error("Error saving new user to Supabase:", error);
    }
  } catch (err) {
    console.error("Exception saving new user to Supabase:", err);
  }
  
  return newUser;
}

// Check if user is already logged in
export function getStoredUser(): User | null {
  const userJson = localStorage.getItem("user");
  
  if (!userJson) {
    return null;
  }
  
  try {
    const userData = JSON.parse(userJson);
    // Ensure dates are properly parsed
    userData.createdAt = new Date(userData.createdAt);
    return userData;
  } catch (error) {
    console.error("Failed to parse stored user data", error);
    return null;
  }
}

// Check user role
export function hasRole(user: User | null, roles: ("admin" | "employee" | "manager")[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

// Get all users (admin only function)
export async function getAllUsers(): Promise<User[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return users;
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const user = users.find((u) => u.id === id);
  return user || null;
}
