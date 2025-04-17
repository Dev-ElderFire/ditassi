
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimeRecord } from "@/contexts/TimeRecordContext";
import { getCurrentLocation } from "@/lib/utils/geo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Check, 
  Loader2, 
  MapPin, 
  Clock, 
  AlertCircle, 
  LogIn, 
  LogOut, 
  Coffee, 
  PlayCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/utils/time";

export default function ClockPage() {
  const { todayRecords, nextAction, recordTimeEntry, isLoading, error } = useTimeRecord();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const { toast } = useToast();

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Check for location permission
  useEffect(() => {
    checkLocation();
  }, []);

  const checkLocation = async () => {
    try {
      setLocationStatus("loading");
      const geoLocation = await getCurrentLocation();
      setLocation({
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude
      });
      setLocationStatus("success");
      setLocationError(null);
    } catch (error) {
      setLocationStatus("error");
      setLocationError("Não foi possível obter sua localização. Verifique as permissões do navegador.");
      console.error("Location error:", error);
    }
  };

  const handleRecordTimeEntry = async () => {
    if (!nextAction) return;
    
    // Check if we have location access
    if (locationStatus !== "success") {
      toast({
        title: "Localização necessária",
        description: "Permita o acesso à sua localização para registrar o ponto.",
        variant: "destructive"
      });
      await checkLocation();
      return;
    }
    
    try {
      const record = await recordTimeEntry(nextAction);
      
      toast({
        title: "Ponto registrado com sucesso!",
        description: `${getActionName(nextAction)} registrado às ${formatTime(new Date(record.timestamp))}`,
        variant: "default"
      });
    } catch (err) {
      toast({
        title: "Erro ao registrar ponto",
        description: err instanceof Error ? err.message : "Ocorreu um erro ao registrar o ponto",
        variant: "destructive"
      });
    }
  };

  const getActionName = (action: "check-in" | "break-start" | "break-end" | "check-out" | null) => {
    switch (action) {
      case "check-in": return "Entrada";
      case "break-start": return "Início de pausa";
      case "break-end": return "Fim de pausa";
      case "check-out": return "Saída";
      default: return "";
    }
  };

  const getActionIcon = (action: "check-in" | "break-start" | "break-end" | "check-out" | null) => {
    switch (action) {
      case "check-in": return <LogIn className="h-6 w-6" />;
      case "break-start": return <Coffee className="h-6 w-6" />;
      case "break-end": return <PlayCircle className="h-6 w-6" />;
      case "check-out": return <LogOut className="h-6 w-6" />;
      default: return <Check className="h-6 w-6" />;
    }
  };

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
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registro de Ponto</h1>
        <p className="text-muted-foreground">
          Registre sua entrada, saída e pausas.
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {formatCurrentTime()}
          </CardTitle>
          <CardDescription>
            {formatCurrentDate()}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          {/* Location Status */}
          <div className="rounded-lg bg-muted p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">Sua Localização</span>
            </div>
            
            {locationStatus === "loading" && (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Obtendo localização...</span>
              </div>
            )}
            
            {locationStatus === "success" && (
              <div className="flex items-center text-success">
                <Check className="h-4 w-4 mr-2" />
                <span>Localização detectada</span>
              </div>
            )}
            
            {locationStatus === "error" && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkLocation}
                className="text-destructive border-destructive/20"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>Permitir acesso</span>
              </Button>
            )}
          </div>
          
          {locationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}
          
          {/* Time Record Button */}
          <div className="pt-4">
            <Button
              className={`w-full h-20 text-xl gap-3 ${!nextAction ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading || !nextAction || locationStatus !== "success"}
              onClick={handleRecordTimeEntry}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  {getActionIcon(nextAction)}
                  <span>{nextAction ? getActionName(nextAction) : "Pontos do Dia Completos"}</span>
                </>
              )}
            </Button>
            
            {!nextAction && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Todos os pontos do dia foram registrados
              </p>
            )}
          </div>
          
          {/* Today's Records Summary */}
          <div className="border rounded-lg mt-6">
            <div className="p-3 border-b bg-muted/50">
              <h3 className="font-medium">Registros de Hoje</h3>
            </div>
            
            <div className="divide-y">
              {todayRecords.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">
                  Nenhum registro para hoje.
                </p>
              ) : (
                todayRecords.map(record => (
                  <div key={record.id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {record.type === "check-in" && <LogIn className="h-5 w-5 text-success" />}
                      {record.type === "break-start" && <Coffee className="h-5 w-5 text-info" />}
                      {record.type === "break-end" && <PlayCircle className="h-5 w-5 text-info" />}
                      {record.type === "check-out" && <LogOut className="h-5 w-5 text-warning" />}
                      <span>
                        {record.type === "check-in" && "Entrada"}
                        {record.type === "break-start" && "Início de Pausa"}
                        {record.type === "break-end" && "Fim de Pausa"}
                        {record.type === "check-out" && "Saída"}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatTime(new Date(record.timestamp))}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
