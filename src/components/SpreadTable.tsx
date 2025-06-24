
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpreadTableRowProps {
  id: string;
  exposureMin: string;
  exposureMax: string;
  spreadIncrease: string;
  totalSpread: string;
  isEditing?: boolean;
}

interface SpreadTableProps {
  data: SpreadTableRowProps[];
  onDataChange: (data: SpreadTableRowProps[]) => void;
  currentVolume?: string;
  isContingencyActive?: boolean;
}

const parseFormattedNumber = (value: string): number => {
  // Remove currency symbols, spaces and convert commas to dots for decimal
  const cleanValue = value.replace(/[$\s]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

const SpreadTable = ({ 
  data, 
  onDataChange, 
  currentVolume,
  isContingencyActive = false
}: SpreadTableProps) => {
  const [tableData, setTableData] = useState<SpreadTableRowProps[]>(data);
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const volumeValue = currentVolume ? parseFormattedNumber(currentVolume) : 0;

  const hasOverlap = (
    id: string, 
    minValue: number, 
    maxValue: number
  ): boolean => {
    return tableData.some(row => {
      if (row.id === id) return false;
      
      const existingMin = parseFormattedNumber(row.exposureMin);
      const existingMax = parseFormattedNumber(row.exposureMax);
      
      return (
        (minValue >= existingMin && minValue <= existingMax) ||
        (maxValue >= existingMin && maxValue <= existingMax) ||
        (minValue <= existingMin && maxValue >= existingMax)
      );
    });
  };

  const isVolumeInRange = (row: SpreadTableRowProps): boolean => {
    if (!currentVolume) return false;
    
    const min = parseFormattedNumber(row.exposureMin);
    const max = parseFormattedNumber(row.exposureMax);
    
    return volumeValue >= min && volumeValue <= max;
  };

  const handleEdit = (id: string) => {
    if (editingRows[id]) {
      const rowToUpdate = tableData.find(row => row.id === id);
      if (rowToUpdate) {
        const min = parseFormattedNumber(rowToUpdate.exposureMin);
        const max = parseFormattedNumber(rowToUpdate.exposureMax);
        
        if (min >= max) {
          toast({
            title: "Erro de validação",
            description: "O valor mínimo deve ser menor que o valor máximo.",
            variant: "destructive"
          });
          return;
        }
        
        if (hasOverlap(id, min, max)) {
          toast({
            title: "Sobreposição de faixas",
            description: "Esta faixa se sobrepõe a outra faixa existente.",
            variant: "destructive"
          });
          return;
        }
      }
    }
    
    setEditingRows({
      ...editingRows,
      [id]: !editingRows[id]
    });
  };

  const handleChange = (id: string, field: keyof SpreadTableRowProps, value: string) => {
    const updatedData = tableData.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    );
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleAddRow = () => {
    const newRow: SpreadTableRowProps = {
      id: `row-${Date.now()}`,
      exposureMin: "0,00",
      exposureMax: "0,00",
      spreadIncrease: "0,0 %",
      totalSpread: "0,0 %",
      isEditing: true
    };
    
    const newData = [...tableData, newRow];
    setTableData(newData);
    setEditingRows({
      ...editingRows,
      [newRow.id]: true
    });
    onDataChange(newData);
  };

  console.log("Current volume value:", volumeValue);
  tableData.forEach(row => {
    console.log(`Row ${row.id}: Min=${parseFormattedNumber(row.exposureMin)}, Max=${parseFormattedNumber(row.exposureMax)}, IsActive=${isVolumeInRange(row)}`);
  });

  const isFirstRow = (row: SpreadTableRowProps): boolean => {
    return row.exposureMin === "0,00" && row.exposureMax === "1.000.000,00";
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border animate-fade-in shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Faixa de Exposição</TableHead>
              <TableHead className="font-semibold">Spread Increase</TableHead>
              {!isContingencyActive && (
                <TableHead className="w-[100px]">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => {
              const isActive = isVolumeInRange(row);
              const isBlueHighlighted = isFirstRow(row) && !isActive;
              
              return (
                <TableRow 
                  key={row.id} 
                  className={`transition-colors ${
                    isActive 
                      ? "border-l-4 border-l-green-500" 
                      : isBlueHighlighted 
                        ? "border-l-4 border-l-blue-500" 
                        : ""
                  }`}
                  style={{
                    backgroundColor: isActive ? '#87BAFF' : (isBlueHighlighted ? '#EFF6FF' : ''),
                  }}
                >
                  <TableCell>
                    {editingRows[row.id] && !isContingencyActive ? (
                      <div className="flex items-center space-x-2">
                        <Input 
                          value={row.exposureMin}
                          onChange={(e) => handleChange(row.id, 'exposureMin', e.target.value)}
                          className="w-[120px]"
                        />
                        <span className={isActive ? "text-white" : ""}>a</span>
                        <Input 
                          value={row.exposureMax}
                          onChange={(e) => handleChange(row.id, 'exposureMax', e.target.value)}
                          className="w-[120px]"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className={isActive ? "text-white" : (isBlueHighlighted ? "text-blue-700" : "")}>
                          {row.exposureMin} a {row.exposureMax}
                        </span>
                        {isActive && (
                          <span className="ml-2 text-xs px-2 py-1 bg-white text-blue-600 rounded-full font-medium">Ativo</span>
                        )}
                        {isBlueHighlighted && (
                          <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Ativo</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={isActive ? "text-white" : (isBlueHighlighted ? "text-blue-700" : "")}>
                    {editingRows[row.id] && !isContingencyActive ? (
                      <Input 
                        value={row.spreadIncrease}
                        onChange={(e) => handleChange(row.id, 'spreadIncrease', e.target.value)}
                      />
                    ) : (
                      row.spreadIncrease
                    )}
                  </TableCell>
                  {!isContingencyActive && (
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(row.id)}
                        className={
                          isActive 
                            ? "text-white hover:text-gray-200 hover:bg-blue-500/20" 
                            : isBlueHighlighted 
                              ? "text-blue-700 hover:text-blue-800 hover:bg-blue-100" 
                              : ""
                        }
                      >
                        {editingRows[row.id] ? "Salvar" : "Editar"}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {!isContingencyActive && (
        <Button 
          onClick={handleAddRow} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Adicionar Faixas
        </Button>
      )}
    </div>
  );
};

export default SpreadTable;
