
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TimeClockCard } from "@/components/dashboard/TimeClockCard";
import { WorkSummaryCard } from "@/components/dashboard/WorkSummaryCard";
import { RecentActivitiesCard } from "@/components/dashboard/RecentActivitiesCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function DashboardPage() {
  const { authState } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatCurrentDate = () => {
    return currentTime.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Olá, {authState.user?.name.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle de ponto.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-muted-foreground mb-1">
                  {formatCurrentDate()}
                </p>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-2xl font-bold">{formatCurrentTime()}</span>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  Seu cargo:
                </p>
                <p className="font-medium">
                  {authState.user?.position || "Não definido"} 
                  {authState.user?.department ? ` - ${authState.user.department}` : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <TimeClockCard />
        </div>

        <div className="space-y-6">
          <WorkSummaryCard />
        </div>

        <div className="md:col-span-3">
          <RecentActivitiesCard />
        </div>
      </div>
    </div>
  );
}
