import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Pill } from "lucide-react";
import { getDrugNames } from "@/data/drugDatabase";

interface DrugInputProps {
  selectedDrugs: string[];
  onDrugsChange: (drugs: string[]) => void;
}

export function DrugInput({ selectedDrugs, onDrugsChange }: DrugInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const allDrugs = getDrugNames();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return allDrugs
      .filter(d => d.toLowerCase().includes(query.toLowerCase()) && !selectedDrugs.includes(d))
      .slice(0, 8);
  }, [query, selectedDrugs, allDrugs]);

  const showDropdown = isOpen && query.trim().length > 0;

  useEffect(() => { setHighlightedIndex(-1); }, [filtered]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addDrug = useCallback((name: string) => {
    if (!selectedDrugs.includes(name)) {
      onDrugsChange([...selectedDrugs, name]);
    }
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }, [selectedDrugs, onDrugsChange]);

  const removeDrug = (name: string) => {
    onDrugsChange(selectedDrugs.filter(d => d !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setIsOpen(false); return; }
    if (!showDropdown || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        addDrug(filtered[highlightedIndex]);
      }
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-drug-item]");
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div className="space-y-3" ref={containerRef}>
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Pill className="h-4 w-4 text-primary" />
        Medicines
      </label>

      {/* Selected drug chips */}
      <AnimatePresence>
        {selectedDrugs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-2"
          >
            {selectedDrugs.map(drug => (
              <motion.button
                key={drug}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => removeDrug(drug)}
                className="group flex items-center gap-1.5 pl-3 pr-2 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
              >
                <Pill className="h-3 w-3" />
                {drug}
                <X className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search medicines like Dolo 650, Aspirin, Warfarin..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all duration-200"
        />

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border border-border/80 bg-card shadow-[var(--shadow-elevated)] overflow-hidden"
              ref={listRef}
            >
              {filtered.length > 0 ? (
                filtered.map((drug, index) => (
                  <button
                    key={drug}
                    data-drug-item
                    onClick={() => addDrug(drug)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 ${
                      index === highlightedIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent/60 text-foreground"
                    }`}
                  >
                    <Pill className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                    <span>{drug}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  No matching medicine found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-muted-foreground">
        Start typing a medicine name and select from suggestions. You can add multiple medicines.
      </p>
    </div>
  );
}
