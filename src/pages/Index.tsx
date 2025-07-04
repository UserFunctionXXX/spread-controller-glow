import React, { useState, useMemo } from "react";
import StatCard from "@/components/StatCard";
import ExposureCard from "@/components/ExposureCard";
import SpreadTable from "@/components/SpreadTable";
import { DollarSignIcon, ActivityIcon, TrendingUpIcon, AlertTriangleIcon, ShieldIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
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

const parseFormattedNumber = (value: string): number => {
  const cleanValue = value.replace(/[^\d,.]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

const SpreadControlPage = () => {
  const [tableData, setTableData] = useState(mockTableData);
  const [isContingencyActive, setIsContingencyActive] = useState(false);
  const [contingencyActivatedAt, setContingencyActivatedAt] = useState<Date | null>(null);
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showDeactivationDialog, setShowDeactivationDialog] = useState(false);
  const { toast } = useToast();
  
  const longExposureValue = "$ 293.450,00";
  const shortExposureValue = "$ 200.773,00";
  
  const calculateNetUsd = () => {
    const longValue = parseFormattedNumber(longExposureValue.replace("$ ", ""));
    const shortValue = parseFormattedNumber(shortExposureValue.replace("$ ", ""));
    const netValue = longValue - shortValue;
    return `$ ${netValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',')}`;
  };

  const isNetPositive = () => {
    const longValue = parseFormattedNumber(longExposureValue.replace("$ ", ""));
    const shortValue = parseFormattedNumber(shortExposureValue.replace("$ ", ""));
    return longValue >= shortValue;
  };

  const currentVolume = "$ 494.223,00";
  const currentVolumeValue = "494223,00";

  const handleTableDataChange = (newData: any[]) => {
    setTableData(newData);
  };

  const currentSpread = useMemo(() => {
    return "0,7 %";
  }, [tableData, currentVolumeValue]);

  const handleContingencyToggle = (checked: boolean) => {
    if (checked) {
      setShowActivationDialog(true);
    } else {
      setShowDeactivationDialog(true);
    }
  };

  const confirmContingencyActivation = () => {
    setIsContingencyActive(true);
    setContingencyActivatedAt(new Date());
    setShowActivationDialog(false);
    toast({
      title: "Contingência ativada",
      description: "O modo de contingência foi ativado com sucesso.",
    });
  };

  const cancelContingencyActivation = () => {
    setShowActivationDialog(false);
  };

  const confirmContingencyDeactivation = () => {
    setIsContingencyActive(false);
    setContingencyActivatedAt(null);
    setShowDeactivationDialog(false);
    toast({
      title: "Contingência desativada",
      description: "O modo de contingência foi desativado com sucesso.",
    });
  };

  const cancelContingencyDeactivation = () => {
    setShowDeactivationDialog(false);
  };

  const getNetUsdIcon = () => {
    return isNetPositive() ? 
      <ArrowUpIcon className="w-5 h-5" /> : 
      <ArrowDownIcon className="w-5 h-5" />;
  };

  const formatActivationDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="dark min-h-screen px-4 py-8 md:py-12 text-white" style={{ backgroundColor: '#101010' }}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Controle de Spreads</h1>
            
            <div className={`flex items-center space-x-3 mt-3 md:mt-0 p-2 rounded-lg ${isContingencyActive ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-blue-900/30 border border-blue-700/50'}`}>
              <span className={`p-1.5 rounded-full ${isContingencyActive ? 'text-amber-400' : 'text-blue-400'}`}>
                {isContingencyActive ? 
                  <AlertTriangleIcon className="h-5 w-5" /> : 
                  <ShieldIcon className="h-5 w-5" />
                }
              </span>
              <div>
                <span className="font-medium text-sm text-gray-200">Modo de Contingência</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-300">
                    {isContingencyActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch 
                    checked={isContingencyActive} 
                    onCheckedChange={handleContingencyToggle} 
                    className={isContingencyActive ? "bg-amber-600" : ""}
                  />
                </div>
                {isContingencyActive && contingencyActivatedAt && (
                  <div className="text-xs text-amber-400 mt-1">
                    Ativado em: {formatActivationDateTime(contingencyActivatedAt)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-gray-400">Monitore e ajuste os spreads de contingência</p>
        </header>
        
        <div className="grid gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Número de Trades" 
              value="202" 
              icon={<ActivityIcon className="w-5 h-5" />}
            />
            <ExposureCard type="LONG" value={longExposureValue} />
            <ExposureCard type="SHORT" value={shortExposureValue} />
            <StatCard 
              title="NET USD" 
              value={calculateNetUsd()}
              icon={getNetUsdIcon()}
              className={isNetPositive() ? "bg-success/20 border-success/30" : "bg-danger/20 border-danger/30"}
            />
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-white">Tabela de Spreads por Faixas</h2>
              <SpreadTable 
                data={tableData} 
                onDataChange={handleTableDataChange}
                currentVolume={currentVolumeValue}
                isContingencyActive={isContingencyActive}
              />
            </div>
            
            <div className="space-y-6">
              <Card className={`border border-gray-700 bg-gray-800/50 shadow-sm transition-all duration-300 ${
                isContingencyActive 
                  ? "bg-gray-800/50" 
                  : "bg-gray-800/20 opacity-60 pointer-events-none"
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`flex items-center text-xl font-semibold ${
                    isContingencyActive ? "text-white" : "text-gray-500"
                  }`}>
                    <div className="flex items-center">
                      <span className={`mr-2 p-1.5 rounded-full ${
                        isContingencyActive 
                          ? "bg-blue-900/50 text-blue-400" 
                          : "bg-gray-700/50 text-gray-500"
                      }`}>
                        <TrendingUpIcon className="h-5 w-5" />
                      </span>
                      Spread Atual
                      {!isContingencyActive && (
                        <span className="ml-2 text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">
                          Desabilitado
                        </span>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4">
                    <div className={`text-3xl font-bold ${
                      isContingencyActive ? "text-blue-400" : "text-gray-500"
                    }`}>
                      {currentSpread}
                    </div>
                    <div className={`text-sm mt-1 ${
                      isContingencyActive ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {isContingencyActive ? "Baseado no volume atual" : "Modo contingência inativo"}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-700 shadow-sm" style={{ backgroundColor: '#1B1E20' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl font-semibold text-white">
                    <div className="flex items-center">
                      <span className="mr-2 bg-blue-900/50 text-blue-400 p-1.5 rounded-full">
                        <DollarSignIcon className="h-5 w-5" />
                      </span>
                      Spread de Contingência Base
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-gray-700/50">
                        <div className="text-sm text-gray-400 mb-1">BID</div>
                        <div className="text-2xl font-bold text-white">
                          0.5
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-700/50">
                        <div className="text-sm text-gray-400 mb-1">ASK</div>
                        <div className="text-2xl font-bold text-white">
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

      {/* Modal de confirmação para ativação */}
      <Dialog open={showActivationDialog} onOpenChange={setShowActivationDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <AlertTriangleIcon className="h-5 w-5 text-amber-400 mr-2" />
              Confirmar Ativação de Contingência
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Você está prestes a ativar o modo de contingência. Esta ação ajustará os spreads conforme a tabela de contingência.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-amber-900/30 rounded-md border border-amber-700/50 text-amber-200 text-sm mt-2">
            <p>O modo de contingência deve ser ativado apenas em situações de risco ou volatilidade extrema do mercado.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelContingencyActivation} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Cancelar
            </Button>
            <Button onClick={confirmContingencyActivation} className="bg-amber-600 hover:bg-amber-700">
              Ativar Contingência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação para desativação */}
      <Dialog open={showDeactivationDialog} onOpenChange={setShowDeactivationDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <ShieldIcon className="h-5 w-5 text-blue-400 mr-2" />
              Confirmar Desativação de Contingência
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Você está prestes a desativar o modo de contingência. Os spreads voltarão aos valores normais.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-blue-900/30 rounded-md border border-blue-700/50 text-blue-200 text-sm mt-2">
            <p>Ao desativar o modo de contingência, o sistema retornará aos spreads padrão de operação.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelContingencyDeactivation} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Cancelar
            </Button>
            <Button onClick={confirmContingencyDeactivation} className="bg-blue-600 hover:bg-blue-700">
              Desativar Contingência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpreadControlPage;
