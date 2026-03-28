import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, AlertTriangle, Sparkles, ArrowRight, Check, Loader2, Zap, Heart } from "lucide-react";
import { DrugInput } from "@/components/DrugInput";
import { AgeSlider } from "@/components/AgeSlider";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { analyzeRisk, ageToGroup, type RiskResult } from "@/lib/riskEngine";
import { diseaseContraindications } from "@/data/drugDatabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const conditions = Object.keys(diseaseContraindications);

const Index = () => {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [age, setAge] = useState(25);
  const [allergies, setAllergies] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (selectedDrugs.length === 0) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const allergyList = allergies.split(",").map(a => a.trim()).filter(Boolean);
      const ageGroup = ageToGroup(age);
      const res = analyzeRisk(selectedDrugs, ageGroup, allergyList, selectedConditions);
      setResult(res);
      setIsAnalyzing(false);
    }, 1500);
  }, [selectedDrugs, age, allergies, selectedConditions]);

  const handleReset = () => {
    setSelectedDrugs([]);
    setAge(25);
    setAllergies("");
    setSelectedConditions([]);
    setResult(null);
  };

  const loadDemo = (type: "high" | "safe") => {
    if (type === "high") {
      setSelectedDrugs(["Aspirin", "Warfarin", "Ibuprofen"]);
      setAge(72);
      setAllergies("");
      setSelectedConditions(["Peptic Ulcer"]);
    } else {
      setSelectedDrugs(["Cetirizine"]);
      setAge(25);
      setAllergies("");
      setSelectedConditions([]);
    }
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
      <header className="border-b border-border/60 bg-card/70 backdrop-blur-lg sticky top-0 z-50">
        <div className="container max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-display font-bold text-foreground leading-tight">MediSafe AI</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">Personalized Medication Risk Analysis</p>
          </div>
          <div className="ml-auto shrink-0">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-accent text-accent-foreground font-semibold border border-primary/10 flex items-center gap-1">
              <Heart className="h-2.5 w-2.5" />
              SDG 3
            </span>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-5 pb-12">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-5"
            >
              {/* Hero */}
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/15"
                >
                  <Activity className="h-5 w-5 text-primary" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">
                  Check Your Medication Safety
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                  Enter your medicines and health details to receive a personalized risk assessment with clear explanations.
                </p>
              </div>

              {/* Demo buttons */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => loadDemo("high")}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-risk-high/10 text-risk-high border border-risk-high/20 hover:bg-risk-high/15 transition-colors"
                >
                  <Zap className="inline h-3 w-3 mr-1" />
                  Try High Risk Demo
                </button>
                <button
                  onClick={() => loadDemo("safe")}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-risk-low/10 text-risk-low border border-risk-low/20 hover:bg-risk-low/15 transition-colors"
                >
                  <Shield className="inline h-3 w-3 mr-1" />
                  Try Safe Demo
                </button>
              </div>

              {/* Form */}
              <div className="bg-card rounded-2xl border border-border/60 shadow-[var(--shadow-elevated)] p-5 md:p-6 space-y-6">
                <DrugInput selectedDrugs={selectedDrugs} onDrugsChange={setSelectedDrugs} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AgeSlider age={age} onChange={setAge} />

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      Known Allergies
                    </label>
                    <input
                      value={allergies}
                      onChange={e => setAllergies(e.target.value)}
                      placeholder="penicillin, NSAID"
                      className="w-full h-11 px-4 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all duration-200"
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated (optional)</p>
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Existing Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map(c => {
                      const isSelected = selectedConditions.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleCondition(c)}
                          className={`text-xs px-3.5 py-2 rounded-full border transition-all duration-200 flex items-center gap-1.5 font-medium ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Analyze */}
                <Button
                  onClick={handleAnalyze}
                  disabled={selectedDrugs.length === 0 || isAnalyzing}
                  className="w-full h-13 text-base font-semibold gap-2 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  size="lg"
                  style={{ height: 52 }}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing medication safety...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Analyze Risk
                      <ArrowRight className="h-5 w-5" />
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <ResultsDashboard result={result} selectedDrugs={selectedDrugs} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
