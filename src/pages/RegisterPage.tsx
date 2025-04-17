
import React from "react";
import { Navigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { Clock } from "lucide-react";

export default function RegisterPage() {
  const { authState } = useAuth();

  // Redirect if already logged in
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="rounded-full bg-primary p-3 mb-4">
          <Clock className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-center tracking-tight">Hora Certa</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Crie sua conta para acessar o sistema
        </p>
      </div>
      <RegisterForm />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Hora Certa. Todos os direitos reservados.
      </p>
    </div>
  );
}
