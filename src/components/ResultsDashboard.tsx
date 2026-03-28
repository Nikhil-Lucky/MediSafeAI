import { motion } from "framer-motion";
import { 
  AlertTriangle, Shield, Activity, RotateCcw, Copy, Zap, 
  HeartPulse, Pill, UserX, Ban, CheckCircle2, ArrowRight,
  TrendingUp, ClipboardCheck, Stethoscope
} from "lucide-react";
import { RiskMeter } from "@/components/RiskMeter";
import { WarningCard } from "@/components/WarningCard";
import { Button } from "@/components/ui/button";
import type { RiskResult } from "@/lib/riskEngine";
import { toast } from "sonner";

interface ResultsDashboardProps {
  result: RiskResult;
  selectedDrugs: string[];
  onReset: () => void;
}

const stagger = {
  container: { transition: { staggerChildren: 0.08 } },
  item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } },
};

export function ResultsDashboard({ result, selectedDrugs, onReset }: ResultsDashboardProps) {
  const bannerConfig = {
    high: { bg: "bg-risk-high/10 border-risk-high/25", text: "text-risk-high", icon: <AlertTriangle className="h-5 w-5" /> },
    moderate: { bg: "bg-risk-moderate/10 border-risk-moderate/25", text: "text-risk-moderate", icon: <Activity className="h-5 w-5" /> },
    low: { bg: "bg-risk-low/10 border-risk-low/25", text: "text-risk-low", icon: <Shield className="h-5 w-5" /> },
  }[result.level];

  const handleCopy = () => {
    const text = `MediSafe AI Risk Report\n\nScore: ${result.score}/100 (${result.level})\nDrugs: ${selectedDrugs.join(", ")}\n\n${result.summary}\n\nWarnings:\n${result.warnings.map(w => `- [${w.severity}] ${w.title}`).join("\n")}\n\nRecommended Actions:\n${result.recommendedActions.map(a => `- ${a}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    toast.success("Report copied to clipboard");
  };

  const breakdownItems = [
    { label: "Interaction Risk", value: result.breakdown.interaction, max: 70, icon: <Zap className="h-3.5 w-3.5" />, color: "bg-risk-high" },
    { label: "Allergy Risk", value: result.breakdown.allergy, max: 60, icon: <UserX className="h-3.5 w-3.5" />, color: "bg-risk-high" },
    { label: "Age Risk", value: result.breakdown.age, max: 40, icon: <HeartPulse className="h-3.5 w-3.5" />, color: "bg-risk-moderate" },
    { label: "Condition Risk", value: result.breakdown.condition, max: 50, icon: <Ban className="h-3.5 w-3.5" />, color: "bg-risk-moderate" },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger.container}
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={stagger.item} className="text-center space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">Risk Assessment Report</h2>
        <p className="text-sm text-muted-foreground">
          Analysis for: {selectedDrugs.join(" · ")}
        </p>
      </motion.div>

      {/* Severity Banner */}
      <motion.div variants={stagger.item} className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border ${bannerConfig.bg}`}>
        <span className={bannerConfig.text}>{bannerConfig.icon}</span>
        <span className={`font-semibold text-sm ${bannerConfig.text}`}>{result.severityBanner}</span>
      </motion.div>

      {/* Risk Score Card */}
      <motion.div variants={stagger.item} className="bg-card rounded-2xl border border-border/60 shadow-[var(--shadow-elevated)] p-8 flex justify-center">
        <RiskMeter score={result.score} level={result.level} />
      </motion.div>

      {/* Summary */}
      <motion.div variants={stagger.item} className="bg-card rounded-xl border border-border/60 shadow-[var(--shadow-card)] p-5">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Summary Assessment</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* Critical Interaction */}
      {result.criticalInteraction && (
        <motion.div variants={stagger.item} className="bg-risk-high/5 rounded-xl border border-risk-high/20 p-5">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-risk-high mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-risk-high mb-1">Most Critical Interaction</h3>
              <p className="text-base font-display font-bold text-foreground">
                {result.criticalInteraction.drugs[0]} + {result.criticalInteraction.drugs[1]}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{result.criticalInteraction.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Risk Breakdown */}
      <motion.div variants={stagger.item} className="bg-card rounded-xl border border-border/60 shadow-[var(--shadow-card)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Risk Breakdown
        </h3>
        <div className="space-y-3">
          {breakdownItems.map(item => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.icon} {item.label}
                </span>
                <span className="text-xs font-semibold text-foreground">{item.value} pts</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${item.value > 0 ? item.color : "bg-muted"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <motion.div variants={stagger.item} className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-risk-moderate" />
            Warnings ({result.warnings.length})
          </h3>
          <div className="space-y-2.5">
            {result.warnings.map((w, i) => (
              <WarningCard key={`${w.title}-${i}`} warning={w} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Drug Details */}
      {result.drugDetails.length > 0 && (
        <motion.div variants={stagger.item} className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" />
            Drug Details
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.drugDetails.map(drug => (
              <div key={drug.name} className="bg-card rounded-xl border border-border/60 shadow-[var(--shadow-card)] p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-foreground">{drug.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {drug.category}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Common Side Effects</p>
                    <div className="flex flex-wrap gap-1">
                      {drug.commonSideEffects.map(se => (
                        <span key={se} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{se}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Serious Side Effects</p>
                    <div className="flex flex-wrap gap-1">
                      {drug.seriousSideEffects.map(se => (
                        <span key={se} className="text-[10px] px-2 py-0.5 rounded-full bg-risk-high/10 text-risk-high">{se}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommended Actions */}
      <motion.div variants={stagger.item} className="bg-primary/5 rounded-xl border border-primary/15 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" />
          Recommended Actions
        </h3>
        <ul className="space-y-2">
          {result.recommendedActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              {action}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Actions */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button onClick={onReset} size="lg" className="gap-2 h-12 px-8 text-sm font-semibold shadow-lg">
          <RotateCcw className="h-4 w-4" />
          New Analysis
        </Button>
        <Button onClick={handleCopy} variant="outline" size="lg" className="gap-2 h-12 px-8 text-sm font-semibold">
          <Copy className="h-4 w-4" />
          Copy Report
        </Button>
      </motion.div>

      {/* Disclaimer */}
      <motion.p variants={stagger.item} className="text-center text-xs text-muted-foreground max-w-md mx-auto pt-2">
        <AlertTriangle className="inline h-3 w-3 mr-1" />
        This tool is for medication safety awareness only and does not replace professional medical advice.
      </motion.p>
    </motion.div>
  );
}
