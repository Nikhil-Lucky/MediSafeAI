import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, ChevronDown, ChevronUp, Pill, HeartPulse, UserX, Ban } from "lucide-react";
import type { Warning } from "@/lib/riskEngine";

const typeIcons: Record<Warning["type"], React.ReactNode> = {
  interaction: <Pill className="h-4 w-4" />,
  allergy: <UserX className="h-4 w-4" />,
  age: <HeartPulse className="h-4 w-4" />,
  contraindication: <Ban className="h-4 w-4" />,
  "side-effect": <AlertTriangle className="h-4 w-4" />,
};

const severityStyles: Record<Warning["severity"], string> = {
  severe: "border-risk-high/30 bg-risk-high/5",
  moderate: "border-risk-moderate/30 bg-risk-moderate/5",
  mild: "border-border bg-card",
};

const severityBadge: Record<Warning["severity"], string> = {
  severe: "bg-risk-high text-white",
  moderate: "bg-risk-moderate text-white",
  mild: "bg-muted text-muted-foreground",
};

interface WarningCardProps {
  warning: Warning;
  index: number;
}

export function WarningCard({ warning, index }: WarningCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`rounded-lg border p-4 ${severityStyles[warning.severity]} transition-all`}
    >
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mt-0.5 text-foreground/70">{typeIcons[warning.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityBadge[warning.severity]}`}>
              {warning.severity}
            </span>
            <span className="text-xs text-muted-foreground capitalize">{warning.type.replace("-", " ")}</span>
          </div>
          <h4 className="text-sm font-semibold text-foreground leading-tight">{warning.title}</h4>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 ml-7 space-y-2"
        >
          <div className="flex items-start gap-2 p-3 rounded-md bg-accent/50">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Why is this important?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{warning.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
