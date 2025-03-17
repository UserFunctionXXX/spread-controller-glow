
import React from "react";

interface SpreadTableRowProps {
  exposure: string;
  spreadIncrease: string;
  totalSpread: string;
}

interface SpreadTableProps {
  data: SpreadTableRowProps[];
}

const SpreadTable = ({ data }: SpreadTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border animate-fade-in shadow-sm">
      <table className="spreadsheet-table">
        <thead>
          <tr>
            <th className="font-semibold">Exposição</th>
            <th className="font-semibold">Spread Increase</th>
            <th className="font-semibold">Total Spread</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="transition-colors">
              <td>{row.exposure}</td>
              <td>{row.spreadIncrease}</td>
              <td>{row.totalSpread}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpreadTable;
