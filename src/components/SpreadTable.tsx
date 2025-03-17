
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
}

const SpreadTable = ({ data, onDataChange }: SpreadTableProps) => {
  const [tableData, setTableData] = useState<SpreadTableRowProps[]>(data);
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});

  const handleEdit = (id: string) => {
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

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border animate-fade-in shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Faixa de Exposição</TableHead>
              <TableHead className="font-semibold">Spread Increase</TableHead>
              <TableHead className="font-semibold">Total Spread</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} className="transition-colors">
                <TableCell>
                  {editingRows[row.id] ? (
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={row.exposureMin}
                        onChange={(e) => handleChange(row.id, 'exposureMin', e.target.value)}
                        className="w-[120px]"
                      />
                      <span>a</span>
                      <Input 
                        value={row.exposureMax}
                        onChange={(e) => handleChange(row.id, 'exposureMax', e.target.value)}
                        className="w-[120px]"
                      />
                    </div>
                  ) : (
                    <span>{row.exposureMin} a {row.exposureMax}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingRows[row.id] ? (
                    <Input 
                      value={row.spreadIncrease}
                      onChange={(e) => handleChange(row.id, 'spreadIncrease', e.target.value)}
                    />
                  ) : (
                    row.spreadIncrease
                  )}
                </TableCell>
                <TableCell>
                  {editingRows[row.id] ? (
                    <Input 
                      value={row.totalSpread}
                      onChange={(e) => handleChange(row.id, 'totalSpread', e.target.value)}
                    />
                  ) : (
                    row.totalSpread
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(row.id)}
                  >
                    {editingRows[row.id] ? "Salvar" : "Editar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button 
        onClick={handleAddRow} 
        variant="outline" 
        size="sm" 
        className="mt-2"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Adicionar Range
      </Button>
    </div>
  );
};

export default SpreadTable;
