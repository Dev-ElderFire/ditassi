
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeRecord } from "@/types";
import { formatDateTime } from "@/lib/utils/time";
import { useTimeRecord } from "@/contexts/TimeRecordContext";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Coffee, 
  PlayCircle, 
  Smartphone, 
  Laptop, 
  QrCode, 
  Tablet 
} from "lucide-react";

export function RecentActivitiesCard() {
  const { recentRecords, isLoading } = useTimeRecord();
  
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
  
  const getRecordTypeIcon = (type: TimeRecord["type"]) => {
    switch (type) {
      case "check-in":
        return <LogIn className="h-4 w-4 text-success" />;
      case "break-start":
        return <Coffee className="h-4 w-4 text-info" />;
      case "break-end":
        return <PlayCircle className="h-4 w-4 text-info" />;
      case "check-out":
        return <LogOut className="h-4 w-4 text-warning" />;
    }
  };
  
  const getDeviceIcon = (device: TimeRecord["device"]) => {
    switch (device) {
      case "web":
        return <Laptop className="h-4 w-4 text-muted-foreground" />;
      case "mobile":
        return <Smartphone className="h-4 w-4 text-muted-foreground" />;
      case "totem":
        return <Tablet className="h-4 w-4 text-muted-foreground" />;
      case "qrcode":
        return <QrCode className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Atividades Recentes</CardTitle>
        <CardDescription>
          Últimos registros de ponto
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : recentRecords.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Nenhum registro de ponto encontrado.
          </p>
        ) : (
          <div className="space-y-4">
            {recentRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  {getRecordTypeIcon(record.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {getRecordTypeName(record.type)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(new Date(record.timestamp))}
                    </p>
                    <span className="text-muted-foreground">•</span>
                    {getDeviceIcon(record.device)}
                    <p className="text-xs text-muted-foreground capitalize">
                      {record.device === "qrcode" ? "QR Code" : record.device}
                    </p>
                  </div>
                  
                  {record.edited && (
                    <p className="text-xs text-warning italic">
                      Editado por administrador
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {recentRecords.length > 5 && (
              <div className="pt-2 text-center">
                <Card className="bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
                  <CardContent className="p-2">
                    <p className="text-sm text-muted-foreground">
                      Ver todos os registros
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
