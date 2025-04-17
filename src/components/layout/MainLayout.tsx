
import React, { useState } from "react";
import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  User,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  Home,
  FileText,
  BriefcaseBusiness,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

export function MainLayout() {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logout();
  };

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation links based on user role
  const navigationLinks = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "employee", "manager"],
    },
    {
      title: "Registro de Ponto",
      href: "/clock",
      icon: Clock,
      roles: ["admin", "employee", "manager"],
    },
    {
      title: "Meu Histórico",
      href: "/history",
      icon: Calendar,
      roles: ["admin", "employee", "manager"],
    },
    {
      title: "Justificativas",
      href: "/justifications",
      icon: FileText,
      roles: ["admin", "employee", "manager"],
    },
    {
      title: "Funcionários",
      href: "/employees",
      icon: Users,
      roles: ["admin", "manager"],
    },
    {
      title: "Relatórios",
      href: "/reports",
      icon: BarChart2,
      roles: ["admin", "manager"],
    },
    {
      title: "Departamentos",
      href: "/departments",
      icon: BriefcaseBusiness,
      roles: ["admin"],
    },
    {
      title: "Alertas",
      href: "/alerts",
      icon: AlertTriangle,
      roles: ["admin", "manager"],
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  const filteredLinks = navigationLinks.filter((link) =>
    link.roles.includes(authState.user?.role || "")
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden"
        size="icon"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar/Navigation */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transition-transform duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center px-4 py-4">
            <h1 className="text-xl font-bold text-white">Hora Certa</h1>
          </div>
          <Separator className="bg-sidebar-border" />

          {/* Navigation Links */}
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="flex flex-col gap-1">
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeSidebarIfMobile}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    location.pathname === link.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.title}</span>
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* User Profile & Logout */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarImage src={authState.user?.avatar} />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {authState.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {authState.user?.name || "Usuário"}
                </p>
                <p className="text-xs text-sidebar-foreground/70">
                  {authState.user?.role === "admin"
                    ? "Administrador"
                    : authState.user?.role === "manager"
                    ? "Gestor"
                    : "Funcionário"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
