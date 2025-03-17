
import { useState } from "react";
import { ChevronDownIcon, PercentIcon } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SpreadSelectorProps {
  currentSpread: number;
  onSpreadChange: (value: number) => void;
}

const SPREAD_OPTIONS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.5, 2.0];

const SpreadSelector = ({ currentSpread, onSpreadChange }: SpreadSelectorProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Spread Atual:</span>
        <div className="flex items-center bg-secondary/80 px-3 py-1 rounded-lg">
          <PercentIcon className="w-4 h-4 mr-1 text-gray-500" />
          <span className="font-medium">{currentSpread.toFixed(1)}</span>
        </div>
      </div>
      
      <Select 
        value={currentSpread.toString()} 
        onValueChange={(value) => onSpreadChange(parseFloat(value))}
      >
        <SelectTrigger className="w-full glass">
          <SelectValue placeholder="Selecionar spread" />
        </SelectTrigger>
        <SelectContent>
          {SPREAD_OPTIONS.map((spread) => (
            <SelectItem key={spread} value={spread.toString()} className="cursor-pointer">
              {spread.toFixed(1)} %
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SpreadSelector;
