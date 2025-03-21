
import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import ExposureCard from "@/components/ExposureCard";
import SpreadTable from "@/components/SpreadTable";
import { DollarSignIcon, ActivityIcon } from "lucide-react";

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

const SpreadControlPage = () => {
  const [tableData, setTableData] = useState(mockTableData);
  
  const handleTableDataChange = (newData: any[]) => {
    setTableData(newData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Controle de Spreads</h1>
          <p className="text-muted-foreground">Monitore e ajuste os spreads de contingência</p>
        </header>
        
        <div className="grid gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExposureCard type="LONG" value="$ 293.450,00" />
            <ExposureCard type="SHORT" value="$ 200.773,00" />
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Tabela de Spreads por Faixas</h2>
            <SpreadTable 
              data={tableData} 
              onDataChange={handleTableDataChange} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <StatCard 
              title="Número de Trades" 
              value="202" 
              icon={<ActivityIcon className="w-5 h-5" />}
            />
            <StatCard 
              title="Volume USD" 
              value="$ 494.223,00" 
              icon={<DollarSignIcon className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadControlPage;
