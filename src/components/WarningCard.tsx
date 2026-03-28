import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, ChevronDown, ChevronUp, Pill, HeartPulse, UserX, Ban, MessageCircle } from "lucide-react";
import type { Warning } from "@/lib/riskEngine";

const typeIcons: Record<Warning["type"], React.ReactNode> = {
  interaction: <Pill className="h-4 w-4" />,
  allergy: <UserX className="h-4 w-4" />,
  age: <HeartPulse className="h-4 w-4" />,
  contraindication: <Ban className="h-4 w-4" />,
  "side-effect": <AlertTriangle className="h-4 w-4" />,
};

const severityConfig: Record<Warning["severity"], { border: string; bg: string; badge: string; icon: string }> = {
  severe: { border: "border-risk-high/25", bg: "bg-risk-high/5", badge: "bg-risk-high text-white", icon: "text-risk-high" },
  moderate: { border: "border-risk-moderate/25", bg: "bg-risk-moderate/5", badge: "bg-risk-moderate text-white", icon: "text-risk-moderate" },
  mild: { border: "border-border", bg: "bg-card", badge: "bg-muted text-muted-foreground", icon: "text-muted-foreground" },
};

interface WarningCardProps {
  warning: Warning;
  index: number;
}

export function WarningCard({ warning, index }: WarningCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[warning.severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={`rounded-xl border ${config.border} ${config.bg} transition-all hover:shadow-md`}
    >
      <button
        className="w-full flex items-start gap-3 p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`mt-0.5 ${config.icon}`}>{typeIcons[warning.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${config.badge}`}>
              {warning.severity}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize tracking-wide">{warning.type.replace("-", " ")}</span>
          </div>
          <h4 className="text-sm font-semibold text-foreground leading-snug">{warning.title}</h4>
        </div>
        <div className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 ml-7 space-y-2">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-accent/40 border border-border/40">
                <MessageCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Why is this important?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{warning.explanation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
