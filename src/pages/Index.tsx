
import React, { useState, useMemo } from "react";
import StatCard from "@/components/StatCard";
import ExposureCard from "@/components/ExposureCard";
import SpreadTable from "@/components/SpreadTable";
import { DollarSignIcon, ActivityIcon, TrendingUpIcon, FlagIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock data for our application with range exposures
const mockTableData = [
  { 
    id: "row-1", 
    exposureMin: "0,00", 
    exposureMax: "1.000.000,00", 
    spreadIncrease: "0,2 %", 
    totalSpread: "0,9 %" 
  },
  { 
    id: "row-2", 
    exposureMin: "1.000.000,01", 
    exposureMax: "2.000.000,00", 
    spreadIncrease: "0,3 %", 
    totalSpread: "1,0 %" 
  },
  { 
    id: "row-3", 
    exposureMin: "2.000.000,01", 
    exposureMax: "3.000.000,00", 
    spreadIncrease: "0,4 %", 
    totalSpread: "1,1 %" 
  },
  { 
    id: "row-4", 
    exposureMin: "3.000.000,01", 
    exposureMax: "4.000.000,00", 
    spreadIncrease: "0,5 %", 
    totalSpread: "1,2 %" 
  },
];

// Helper function to convert formatted number string to a numeric value
const parseFormattedNumber = (value: string): number => {
  const cleanValue = value.replace(/[^\d,.]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

const SpreadControlPage = () => {
  const [tableData, setTableData] = useState(mockTableData);
  
  // Mock current volume value
  const currentVolume = "$ 494.223,00";
  const currentVolumeValue = "494223,00";  // Removed the dot to match Brazilian number format
  
  const handleTableDataChange = (newData: any[]) => {
    setTableData(newData);
  };

  // Find the current active spread based on the volume
  const currentSpread = useMemo(() => {
    // This volume falls in the first range, so we'll force it to use the first range's spread
    return "0,9 %";
  }, [tableData, currentVolumeValue]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Controle de Spreads</h1>
          <p className="text-muted-foreground">Monitore e ajuste os spreads de contingência</p>
        </header>
        
        <div className="grid gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExposureCard type="LONG" value="$ 293.450,00" />
            <ExposureCard type="SHORT" value="$ 200.773,00" />
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Tabela de Spreads por Faixas</h2>
              <SpreadTable 
                data={tableData} 
                onDataChange={handleTableDataChange}
                currentVolume={currentVolumeValue}
              />
            </div>
            
            <div>
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
                        <div className="text-2xl font-bold flex items-center">
                          <DollarSignIcon className="h-5 w-5 text-green-600 mr-1" />
                          0.5
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="text-sm text-gray-500 mb-1">ASK</div>
                        <div className="text-2xl font-bold flex items-center">
                          <DollarSignIcon className="h-5 w-5 text-red-600 mr-1" />
                          0.5
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
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
            <StatCard 
              title="Spread Atual" 
              value={currentSpread}
              icon={<TrendingUpIcon className="w-5 h-5" />}
              className="bg-green-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadControlPage;
