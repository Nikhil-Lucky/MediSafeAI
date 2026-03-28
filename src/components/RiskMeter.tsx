import { motion } from "framer-motion";
import type { RiskLevel } from "@/lib/riskEngine";

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
}

export function RiskMeter({ score, level }: RiskMeterProps) {
  const colorClass = level === "high" ? "text-risk-high" : level === "moderate" ? "text-risk-moderate" : "text-risk-low";
  const bgClass = level === "high" ? "bg-risk-high" : level === "moderate" ? "bg-risk-moderate" : "bg-risk-low";
  const label = level === "high" ? "High Risk" : level === "moderate" ? "Moderate Risk" : "Low Risk";

  // SVG arc for the gauge
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-28">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={level === "high" ? "hsl(var(--risk-high))" : level === "moderate" ? "hsl(var(--risk-moderate))" : "hsl(var(--risk-low))"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        {/* Score number */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <span className={`text-4xl font-bold font-display ${colorClass}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-3"
      >
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${bgClass} text-white`}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse-ring" />
          {label}
        </span>
      </motion.div>
    </div>
  );
}
