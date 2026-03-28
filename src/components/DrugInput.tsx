import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Search, ChevronRight } from "lucide-react";
import { getDrugNames } from "@/data/drugDatabase";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DrugInputProps {
  selectedDrugs: string[];
  onDrugsChange: (drugs: string[]) => void;
}

export function DrugInput({ selectedDrugs, onDrugsChange }: DrugInputProps) {
  const [query, setQuery] = useState("");
  const allDrugs = getDrugNames();

  const filtered = useMemo(() => {
    if (!query.trim()) return allDrugs.filter(d => !selectedDrugs.includes(d));
    return allDrugs.filter(
      d => d.toLowerCase().includes(query.toLowerCase()) && !selectedDrugs.includes(d)
    );
  }, [query, selectedDrugs]);

  const addDrug = (name: string) => {
    onDrugsChange([...selectedDrugs, name]);
    setQuery("");
  };

  const removeDrug = (name: string) => {
    onDrugsChange(selectedDrugs.filter(d => d !== name));
  };

  // Quick analysis: comma-separated
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.includes(",")) {
      e.preventDefault();
      const names = query.split(",").map(s => s.trim()).filter(Boolean);
      const valid = names.filter(n => allDrugs.some(d => d.toLowerCase() === n.toLowerCase()));
      const resolved = valid.map(n => allDrugs.find(d => d.toLowerCase() === n.toLowerCase())!);
      const unique = [...new Set([...selectedDrugs, ...resolved])];
      onDrugsChange(unique);
      setQuery("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        Medicines
      </label>

      {/* Selected drugs */}
      <AnimatePresence>
        {selectedDrugs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-2"
          >
            {selectedDrugs.map(drug => (
              <motion.div
                key={drug}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-3 py-1.5 text-sm"
                  onClick={() => removeDrug(drug)}
                >
                  {drug} ×
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search medicines or enter comma-separated names..."
          className="pl-10"
        />
      </div>

      {/* Dropdown */}
      {query.trim() && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border bg-card shadow-md overflow-hidden"
        >
          {filtered.slice(0, 6).map(drug => (
            <button
              key={drug}
              onClick={() => addDrug(drug)}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between group"
            >
              <span>{drug}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground">
        💡 Quick mode: type comma-separated names and press Enter
      </p>
    </div>
  );
}
