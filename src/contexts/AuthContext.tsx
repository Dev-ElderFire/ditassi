
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthState, initialAuthState, login, logout, register, getStoredUser } from "@/lib/auth";
import { User } from "@/types";
import { toast } from "sonner";

// Create context with initial state
const AuthContext = createContext<{
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role?: "admin" | "employee" | "manager", department?: string, position?: string) => Promise<void>;
}>({
  authState: initialAuthState,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        
        const storedUser = getStoredUser();
        
        if (storedUser) {
          console.log("User found in localStorage:", storedUser.name);
          setAuthState({
            user: storedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          console.log("No user found in localStorage");
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Falha ao verificar autenticação",
        });
      } finally {
        setInitialCheckDone(true);
      }
    };
    
    checkAuth();
  }, []);

  // Login handler
  const handleLogin = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await login(email, password);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast.success(`Bem-vindo, ${user.name.split(' ')[0]}!`);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Falha ao fazer login",
      }));
      toast.error("Falha ao fazer login: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      throw error;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      await logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      toast.info("Sessão encerrada com sucesso");
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Falha ao fazer logout",
      }));
      toast.error("Falha ao fazer logout");
    }
  };

  // Register handler
  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "employee" | "manager" = "employee",
    department?: string,
    position?: string
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await register(name, email, password, role, department, position);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast.success(`Conta criada com sucesso! Bem-vindo, ${user.name.split(' ')[0]}!`);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Falha ao registrar",
      }));
      toast.error("Falha ao registrar: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
