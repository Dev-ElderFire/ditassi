
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimeRecord } from "@/contexts/TimeRecordContext";
import { TimeRecord } from "@/types";
import { formatTime } from "@/lib/utils/time";
import { AlertCircle, Clock, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export function TimeClockCard() {
  const { todayRecords, nextAction, recordTimeEntry, isLoading, error } = useTimeRecord();
  
  const handleRecordTimeEntry = async () => {
    if (!nextAction) return;
    
    try {
      await recordTimeEntry(nextAction);
    } catch (err) {
      console.error("Failed to record time entry:", err);
    }
  };
  
  const getButtonText = () => {
    switch (nextAction) {
      case "check-in":
        return "Registrar Entrada";
      case "break-start":
        return "Iniciar Pausa";
      case "break-end":
        return "Finalizar Pausa";
      case "check-out":
        return "Registrar Saída";
      default:
        return "Pontos do Dia Completos";
    }
  };
  
  const getButtonColor = () => {
    switch (nextAction) {
      case "check-in":
        return "bg-success hover:bg-success/90";
      case "break-start":
        return "bg-info hover:bg-info/90";
      case "break-end":
        return "bg-info hover:bg-info/90";
      case "check-out":
        return "bg-warning hover:bg-warning/90";
      default:
        return "";
    }
  };
  
  const getRecordTypeName = (type: TimeRecord["type"]) => {
    switch (type) {
      case "check-in":
        return "Entrada";
      case "break-start":
        return "Início de Pausa";
      case "break-end":
        return "Fim de Pausa";
      case "check-out":
        return "Saída";
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Registro de Ponto</CardTitle>
        <CardDescription>
          Registre sua entrada, saída e pausas aqui.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              className={`w-full max-w-xs text-white ${getButtonColor()}`}
              size="lg"
              onClick={handleRecordTimeEntry}
              disabled={isLoading || !nextAction}
            >
              <Clock className="mr-2 h-5 w-5" />
              {isLoading ? "Registrando..." : getButtonText()}
            </Button>
          </div>
          
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Registros de Hoje
            </h3>
            
            {isLoading && todayRecords.length === 0 ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border p-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : todayRecords.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Nenhum registro para hoje.
              </p>
            ) : (
              <div className="rounded-md border">
                {todayRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex flex-col space-y-1 border-b p-3 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {getRecordTypeName(record.type)}
                      </span>
                      <span>{formatTime(new Date(record.timestamp))}</span>
                    </div>
                    {record.location && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span className="truncate max-w-[200px]">
                          {record.location.address || 
                           `${record.location.latitude.toFixed(4)}, ${record.location.longitude.toFixed(4)}`}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
