
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Calendar, 
  AlertCircle 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TimeRecord } from "@/types";
import { calculateWorkHours, formatHoursToDisplay } from "@/lib/utils/time";
import { useTimeRecord } from "@/contexts/TimeRecordContext";

export function WorkSummaryCard() {
  const { todayRecords, isLoading } = useTimeRecord();
  const [workHours, setWorkHours] = useState(0);
  const [progress, setProgress] = useState(0);
  const targetHours = 8; // Standard working hours
  
  useEffect(() => {
    if (todayRecords.length > 0) {
      const checkInRecord = todayRecords.find(record => record.type === 'check-in');
      const checkOutRecord = todayRecords.find(record => record.type === 'check-out');
      const breakStartRecord = todayRecords.find(record => record.type === 'break-start');
      const breakEndRecord = todayRecords.find(record => record.type === 'break-end');
      
      const checkIn = checkInRecord ? new Date(checkInRecord.timestamp) : null;
      const checkOut = checkOutRecord ? new Date(checkOutRecord.timestamp) : new Date();
      const breakStart = breakStartRecord ? new Date(breakStartRecord.timestamp) : null;
      const breakEnd = breakEndRecord ? new Date(breakEndRecord.timestamp) : null;
      
      const hours = calculateWorkHours(checkIn, checkOut, breakStart, breakEnd);
      setWorkHours(hours);
      setProgress(Math.min(100, (hours / targetHours) * 100));
    } else {
      setWorkHours(0);
      setProgress(0);
    }
  }, [todayRecords]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Resumo do Dia</CardTitle>
        <CardDescription>
          Sumário das horas trabalhadas hoje
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Horas Trabalhadas</p>
                <p className="text-2xl font-bold">{formatHoursToDisplay(workHours)}</p>
              </div>
              
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1 bg-success/20">
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm">Entrada</span>
                </div>
                <p className="text-lg font-medium mt-1">
                  {todayRecords.find(r => r.type === 'check-in') 
                    ? new Date(todayRecords.find(r => r.type === 'check-in')!.timestamp).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false
                      }) 
                    : '-'}
                </p>
              </div>
              
              <div className="rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1 bg-warning/20">
                    <ArrowDownRight className="h-4 w-4 text-warning" />
                  </div>
                  <span className="text-sm">Saída</span>
                </div>
                <p className="text-lg font-medium mt-1">
                  {todayRecords.find(r => r.type === 'check-out') 
                    ? new Date(todayRecords.find(r => r.type === 'check-out')!.timestamp).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false
                      }) 
                    : '-'}
                </p>
              </div>
            </div>
            
            {workHours < targetHours && todayRecords.find(r => r.type === 'check-out') && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span>Faltam {formatHoursToDisplay(targetHours - workHours)} para a jornada completa</span>
              </div>
            )}
            
            {workHours > targetHours && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <AlertCircle className="h-4 w-4 text-success" />
                <span>Você tem {formatHoursToDisplay(workHours - targetHours)} de horas extras hoje</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
