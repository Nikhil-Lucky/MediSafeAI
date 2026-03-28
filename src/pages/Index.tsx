import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, AlertTriangle, Sparkles, ArrowRight, RotateCcw, Check, Loader2 } from "lucide-react";
import { DrugInput } from "@/components/DrugInput";
import { RiskMeter } from "@/components/RiskMeter";
import { WarningCard } from "@/components/WarningCard";
import { analyzeRisk, type AgeGroup, type RiskResult } from "@/lib/riskEngine";
import { diseaseContraindications } from "@/data/drugDatabase";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const conditions = Object.keys(diseaseContraindications);

const Index = () => {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [allergies, setAllergies] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (selectedDrugs.length === 0) return;
    setIsAnalyzing(true);
    // Simulate brief analysis delay for UX
    setTimeout(() => {
      const allergyList = allergies.split(",").map(a => a.trim()).filter(Boolean);
      const res = analyzeRisk(selectedDrugs, ageGroup, allergyList, selectedConditions);
      setResult(res);
      setIsAnalyzing(false);
    }, 1200);
  }, [selectedDrugs, ageGroup, allergies, selectedConditions]);

  const handleReset = () => {
    setSelectedDrugs([]);
    setAgeGroup("adult");
    setAllergies("");
    setSelectedConditions([]);
    setResult(null);
  };

  const toggleCondition = (c: string) => {
    setSelectedConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">MedGuard</h1>
            <p className="text-xs text-muted-foreground">Personalized Medication Risk Analysis</p>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] px-2 py-1 rounded-full bg-accent text-accent-foreground font-medium">
              SDG 3 · Good Health
            </span>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-5">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Hero - tighter */}
              <div className="text-center space-y-2 pb-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"
                >
                  <Activity className="h-6 w-6 text-primary" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Check Your Medication Safety
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-sm">
                  Enter your medicines and health details to receive a personalized risk assessment
                  with clear explanations.
                </p>
              </div>

              {/* Form - stronger card */}
              <div className="bg-card rounded-xl border border-border/80 shadow-[var(--shadow-elevated)] p-6 space-y-6">
                <DrugInput selectedDrugs={selectedDrugs} onDrugsChange={setSelectedDrugs} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age Group */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Age Group</label>
                    <Select value={ageGroup} onValueChange={(v) => setAgeGroup(v as AgeGroup)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="child">Child (0–15)</SelectItem>
                        <SelectItem value="adult">Adult (16–64)</SelectItem>
                        <SelectItem value="elderly">Elderly (65+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Allergies */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Known Allergies</label>
                    <Input
                      value={allergies}
                      onChange={e => setAllergies(e.target.value)}
                      placeholder="e.g. penicillin, nsaid"
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated (optional)</p>
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Existing Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map(c => {
                      const isSelected = selectedConditions.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleCondition(c)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-card text-muted-foreground border-border hover:border-primary/50"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Analyze button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={selectedDrugs.length === 0 || isAnalyzing}
                  className="w-full h-12 text-base font-semibold gap-2 shadow-md"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing medication safety...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Risk
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {/* Disclaimer */}
              <p className="text-center text-xs text-muted-foreground max-w-md mx-auto">
                <AlertTriangle className="inline h-3 w-3 mr-1" />
                This tool does not replace professional medical advice. Always consult your healthcare provider.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Results header */}
              <div className="text-center space-y-2">
                <h2 className="text-xl font-display font-bold text-foreground">Risk Assessment Results</h2>
                <p className="text-sm text-muted-foreground">
                  Analyzing: {selectedDrugs.join(", ")}
                </p>
              </div>

              {/* Risk Meter */}
              <div className="bg-card rounded-xl border shadow-sm p-8 flex justify-center">
                <RiskMeter score={result.score} level={result.level} />
              </div>

              {/* Summary */}
              <div className="bg-card rounded-xl border shadow-sm p-5">
                <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-risk-moderate" />
                    Warnings ({result.warnings.length})
                  </h3>
                  <div className="space-y-3">
                    {result.warnings.map((w, i) => (
                      <WarningCard key={`${w.title}-${i}`} warning={w} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Drug details */}
              {result.drugDetails.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-display font-semibold text-foreground">Drug Details</h3>
                  <div className="grid gap-3">
                    {result.drugDetails.map(drug => (
                      <div key={drug.name} className="bg-card rounded-xl border shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-foreground">{drug.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                            {drug.category}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Common side effects:</span>{" "}
                            {drug.commonSideEffects.join(", ")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Serious side effects:</span>{" "}
                            {drug.seriousSideEffects.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center">
                <Button onClick={handleReset} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  New Analysis
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
