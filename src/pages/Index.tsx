
import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import ExposureCard from "@/components/ExposureCard";
import SpreadTable from "@/components/SpreadTable";
import SpreadSelector from "@/components/SpreadSelector";
import { DollarSignIcon, ActivityIcon } from "lucide-react";

// Mock data for our application
const mockTableData = [
  { exposure: "BTC/USD", spreadIncrease: "0.2 %", totalSpread: "0.9 %" },
  { exposure: "ETH/USD", spreadIncrease: "0.3 %", totalSpread: "1.0 %" },
  { exposure: "SOL/USD", spreadIncrease: "0.1 %", totalSpread: "0.8 %" },
  { exposure: "AVAX/USD", spreadIncrease: "0.4 %", totalSpread: "1.1 %" },
  { exposure: "XRP/USD", spreadIncrease: "0.2 %", totalSpread: "0.9 %" },
];

const SpreadControlPage = () => {
  const [currentSpread, setCurrentSpread] = useState(0.7);
  
  const handleSpreadChange = (newSpread: number) => {
    setCurrentSpread(newSpread);
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
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Tabela de Spreads</h2>
            <SpreadTable data={mockTableData} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <ExposureCard type="LONG" value="$ 293.450,00" />
            <ExposureCard type="SHORT" value="$ 200.773,00" />
          </div>
          
          <div className="mt-8 max-w-xs">
            <SpreadSelector 
              currentSpread={currentSpread} 
              onSpreadChange={handleSpreadChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadControlPage;
