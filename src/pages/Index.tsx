
import React, { useState, useMemo } from "react";
import StatCard from "@/components/StatCard";
import ExposureCard from "@/components/ExposureCard";
import SpreadTable from "@/components/SpreadTable";
import { DollarSignIcon, ActivityIcon, TrendingUpIcon } from "lucide-react";

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
  // Remove any non-numeric characters except the decimal point
  // Replace comma with dot for decimal parsing
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
    // Parse volume to number for comparison
    const volumeNumeric = parseFormattedNumber(currentVolumeValue);
    console.log("Volume numeric:", volumeNumeric);
    
    // Find the range that contains the current volume
    const activeRange = tableData.find(row => {
      const min = parseFormattedNumber(row.exposureMin);
      const max = parseFormattedNumber(row.exposureMax);
      console.log(`Checking range: ${min} - ${max}, Is volume in range: ${volumeNumeric >= min && volumeNumeric <= max}`);
      return volumeNumeric >= min && volumeNumeric <= max;
    });
    
    console.log("Active range:", activeRange);
    // Return the total spread if found, otherwise a default value
    return activeRange ? activeRange.totalSpread : "N/A";
  }, [tableData, currentVolumeValue]);

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
              currentVolume={currentVolumeValue}
            />
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
              className={currentSpread !== "N/A" ? "bg-green-50" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadControlPage;
