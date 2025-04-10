
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface ExposureCardProps {
  type: "LONG" | "SHORT";
  value: string;
  className?: string;
}

const ExposureCard = ({ type, value, className }: ExposureCardProps) => {
  const isLong = type === "LONG";
  
  return (
    <div
      className={cn(
        "p-5 rounded-xl shadow-sm animate-slide-in transition-all duration-300 hover:shadow-md glass",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-primary/10"
        )}>
          {isLong ? 
            <ArrowUpIcon className="w-5 h-5 text-primary" /> : 
            <ArrowDownIcon className="w-5 h-5 text-primary" />
          }
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Exposição {type}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ExposureCard;
