import { motion } from "framer-motion";
import type { RiskLevel } from "@/lib/riskEngine";

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
}

export function RiskMeter({ score, level }: RiskMeterProps) {
  const label = level === "high" ? "High Risk" : level === "moderate" ? "Moderate Risk" : "Low Risk";
  const color = level === "high" ? "hsl(var(--risk-high))" : level === "moderate" ? "hsl(var(--risk-moderate))" : "hsl(var(--risk-low))";
  const colorClass = level === "high" ? "text-risk-high" : level === "moderate" ? "text-risk-moderate" : "text-risk-low";
  const bgClass = level === "high" ? "bg-risk-high" : level === "moderate" ? "bg-risk-moderate" : "bg-risk-low";

  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-32">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Gradient defs */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--risk-low))" />
              <stop offset="50%" stopColor="hsl(var(--risk-moderate))" />
              <stop offset="100%" stopColor="hsl(var(--risk-high))" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Background arc */}
          <path
            d="M 20 105 A 80 80 0 0 1 180 105"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.path
            d="M 20 105 A 80 80 0 0 1 180 105"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter="url(#glow)"
          />
        </svg>
        {/* Score */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className={`text-5xl font-bold font-display ${colorClass}`}>{score}</span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">out of 100</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4"
      >
        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold ${bgClass} text-white shadow-lg`}>
          <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
          {label}
        </span>
      </motion.div>
    </div>
  );
}
