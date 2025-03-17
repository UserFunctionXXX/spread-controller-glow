
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
        "p-5 rounded-xl shadow-sm animate-slide-in transition-all duration-300 hover:shadow-md",
        isLong 
          ? "bg-gradient-to-br from-success/90 to-success text-white" 
          : "bg-gradient-to-br from-danger/90 to-danger text-white",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          isLong ? "bg-white/20" : "bg-white/20"
        )}>
          {isLong ? 
            <ArrowUpIcon className="w-5 h-5 text-white" /> : 
            <ArrowDownIcon className="w-5 h-5 text-white" />
          }
        </div>
        <div>
          <h3 className="text-sm font-medium text-white/80">Exposição {type}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ExposureCard;
