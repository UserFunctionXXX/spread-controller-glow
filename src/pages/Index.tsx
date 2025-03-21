import React, { useState, useMemo } from "react";
import StatCard from "@/components/StatCard";
import ExposureCard from "@/components/ExposureCard";
import SpreadTable from "@/components/SpreadTable";
import { DollarSignIcon, ActivityIcon, TrendingUpIcon, AlertTriangleIcon, ShieldIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";

// Mock data for our application with range exposures
const mockTableData = [
  { 
    id: "row-1", 
    exposureMin: "0,00", 
    exposureMax: "1.000.000,00", 
    spreadIncrease: "0,2 %", 
    totalSpread: "0,7 %" 
  },
  { 
    id: "row-2", 
    exposureMin: "1.000.000,01", 
    exposureMax: "2.000.000,00", 
    spreadIncrease: "0,3 %", 
    totalSpread: "0,8 %" 
  },
  { 
    id: "row-3", 
    exposureMin: "2.000.000,01", 
    exposureMax: "3.000.000,00", 
    spreadIncrease: "0,4 %", 
    totalSpread: "0,9 %" 
  },
  { 
    id: "row-4", 
    exposureMin: "3.000.000,01", 
    exposureMax: "4.000.000,00", 
    spreadIncrease: "0,5 %", 
    totalSpread: "1,0 %" 
  },
];

// Helper function to convert formatted number string to a numeric value
const parseFormattedNumber = (value: string): number => {
  const cleanValue = value.replace(/[^\d,.]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

const SpreadControlPage = () => {
  const [tableData, setTableData] = useState(mockTableData);
  const [isContingencyActive, setIsContingencyActive] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const { toast } = useToast();
  
  // Mock current volume value
  const currentVolume = "$ 494.223,00";
  const currentVolumeValue = "494223,00";  // Removed the dot to match Brazilian number format
  
  const handleTableDataChange = (newData: any[]) => {
    setTableData(newData);
  };

  // Find the current active spread based on the volume
  const currentSpread = useMemo(() => {
    // This volume falls in the first range, so we'll force it to use the first range's spread
    return "0,7 %";
  }, [tableData, currentVolumeValue]);

  const handleContingencyToggle = (checked: boolean) => {
    if (checked) {
      // Opening confirmation dialog when toggling ON
      setShowConfirmationDialog(true);
    } else {
      // Directly turning off contingency without confirmation
      setIsContingencyActive(false);
      toast({
        title: "Contingência desativada",
        description: "O modo de contingência foi desativado com sucesso.",
      });
    }
  };

  const confirmContingencyActivation = () => {
    setIsContingencyActive(true);
    setShowConfirmationDialog(false);
    toast({
      title: "Contingência ativada",
      description: "O modo de contingência foi ativado com sucesso.",
    });
  };

  const cancelContingencyActivation = () => {
    setShowConfirmationDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight mb-1">Controle de Spreads</h1>
            
            {/* Contingency Banner moved next to the title */}
            <div className={`flex items-center space-x-3 mt-3 md:mt-0 p-2 rounded-lg ${isContingencyActive ? 'bg-amber-50' : 'bg-blue-50'}`}>
              <span className={`p-1.5 rounded-full ${isContingencyActive ? 'text-amber-700' : 'text-blue-700'}`}>
                {isContingencyActive ? 
                  <AlertTriangleIcon className="h-5 w-5" /> : 
                  <ShieldIcon className="h-5 w-5" />
                }
              </span>
              <div>
                <span className="font-medium text-sm">Modo de Contingência</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium">
                    {isContingencyActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch 
                    checked={isContingencyActive} 
                    onCheckedChange={handleContingencyToggle} 
                    className={isContingencyActive ? "bg-amber-500" : ""}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground">Monitore e ajuste os spreads de contingência</p>
        </header>
        
        <div className="grid gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Número de Trades" 
              value="202" 
              icon={<ActivityIcon className="w-5 h-5" />}
            />
            <StatCard 
              title="Volume USD" 
              value={currentVolume}
              icon={<DollarSignIcon className="w-5 h-5" />}
            />
            <ExposureCard type="LONG" value="$ 293.450,00" />
            <ExposureCard type="SHORT" value="$ 200.773,00" />
          </div>
          
          {/* Removed the Contingency Card since it's now in the header */}
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Tabela de Spreads por Faixas</h2>
              <SpreadTable 
                data={tableData} 
                onDataChange={handleTableDataChange}
                currentVolume={currentVolumeValue}
                isContingencyActive={isContingencyActive}
              />
            </div>
            
            <div className="space-y-6">
              {/* Spread Atual Card */}
              <Card className="border shadow-sm bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <div className="flex items-center">
                      <span className="mr-2 bg-blue-50 text-blue-700 p-1.5 rounded-full">
                        <TrendingUpIcon className="h-5 w-5" />
                      </span>
                      Spread Atual
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-blue-700">
                      {currentSpread}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Baseado no volume atual
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Spread Base Card */}
              <Card className="border shadow-sm bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <div className="flex items-center">
                      <span className="mr-2 bg-blue-50 text-blue-700 p-1.5 rounded-full">
                        <DollarSignIcon className="h-5 w-5" />
                      </span>
                      Spread de Contingência Base
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="text-sm text-gray-500 mb-1">BID</div>
                        <div className="text-2xl font-bold">
                          0.5
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="text-sm text-gray-500 mb-1">ASK</div>
                        <div className="text-2xl font-bold">
                          0.5
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Activating Contingency */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 text-amber-500 mr-2" />
              Confirmar Ativação de Contingência
            </DialogTitle>
            <DialogDescription>
              Você está prestes a ativar o modo de contingência. Esta ação ajustará os spreads conforme a tabela de contingência.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-amber-50 rounded-md border border-amber-200 text-amber-800 text-sm mt-2">
            <p>O modo de contingência deve ser ativado apenas em situações de risco ou volatilidade extrema do mercado.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelContingencyActivation}>
              Cancelar
            </Button>
            <Button onClick={confirmContingencyActivation} className="bg-amber-500 hover:bg-amber-600">
              Ativar Contingência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpreadControlPage;
