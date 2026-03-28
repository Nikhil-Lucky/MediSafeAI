import { findDrug, findInteractions, diseaseContraindications, type Drug, type DrugInteraction } from "@/data/drugDatabase";

export type AgeGroup = "child" | "adult" | "elderly";
export type RiskLevel = "low" | "moderate" | "high";

export interface Warning {
  type: "interaction" | "allergy" | "age" | "contraindication" | "side-effect";
  severity: "mild" | "moderate" | "severe";
  title: string;
  description: string;
  explanation: string;
  drugs: string[];
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  warnings: Warning[];
  drugDetails: Drug[];
  summary: string;
}

function ageGroupToRange(group: AgeGroup): { min: number; max: number; label: string } {
  switch (group) {
    case "child": return { min: 0, max: 15, label: "children" };
    case "adult": return { min: 16, max: 64, label: "adults" };
    case "elderly": return { min: 65, max: 120, label: "elderly patients" };
  }
}

export function analyzeRisk(
  drugNames: string[],
  ageGroup: AgeGroup,
  allergies: string[],
  conditions: string[]
): RiskResult {
  const warnings: Warning[] = [];
  const drugs: Drug[] = [];
  let score = 0;

  // Resolve drugs
  for (const name of drugNames) {
    const drug = findDrug(name);
    if (drug) drugs.push(drug);
  }

  // 1. Drug-Drug Interactions
  const foundInteractions = findInteractions(drugNames);
  for (const interaction of foundInteractions) {
    const severityScore = interaction.severity === "severe" ? 30 : interaction.severity === "moderate" ? 18 : 8;
    score += severityScore;
    warnings.push({
      type: "interaction",
      severity: interaction.severity,
      title: `${interaction.drugs[0]} + ${interaction.drugs[1]}: ${interaction.description}`,
      description: interaction.description,
      explanation: interaction.mechanism,
      drugs: [...interaction.drugs],
    });
  }

  // 2. Allergy checks
  const normalizedAllergies = allergies.map(a => a.toLowerCase().trim()).filter(Boolean);
  for (const drug of drugs) {
    for (const flag of drug.allergyFlags) {
      if (normalizedAllergies.some(a => flag.includes(a) || a.includes(flag))) {
        score += 35;
        warnings.push({
          type: "allergy",
          severity: "severe",
          title: `Allergy alert: ${drug.name}`,
          description: `${drug.name} contains or is related to "${flag}", which matches your allergy profile.`,
          explanation: `Patients with a known allergy to ${flag} should avoid ${drug.name} as it may trigger an allergic reaction ranging from mild rash to life-threatening anaphylaxis.`,
          drugs: [drug.name],
        });
        break;
      }
    }
  }

  // 3. Age restrictions
  const ageRange = ageGroupToRange(ageGroup);
  for (const drug of drugs) {
    if (drug.ageRestrictions) {
      const { min, max, warning: ageWarning } = drug.ageRestrictions;
      if ((min && ageRange.max < min) || (max && ageRange.min > max)) {
        score += 25;
        warnings.push({
          type: "age",
          severity: "severe",
          title: `Age restriction: ${drug.name}`,
          description: ageWarning,
          explanation: `${drug.name} has specific age-related risks. ${ageWarning} This is especially important for ${ageRange.label}.`,
          drugs: [drug.name],
        });
      }
    }
  }

  // Elderly additional risk for certain drug categories
  if (ageGroup === "elderly") {
    for (const drug of drugs) {
      if (["NSAID", "NSAID / Antiplatelet"].includes(drug.category)) {
        score += 10;
        warnings.push({
          type: "age",
          severity: "moderate",
          title: `Elderly caution: ${drug.name}`,
          description: `NSAIDs carry increased risk of GI bleeding and kidney damage in elderly patients.`,
          explanation: `Age-related decline in kidney function and GI mucosal integrity makes elderly patients more vulnerable to NSAID side effects. Consider lower doses or alternatives.`,
          drugs: [drug.name],
        });
      }
    }
  }

  // 4. Disease contraindications
  for (const condition of conditions) {
    const contraDrugs = diseaseContraindications[condition];
    if (contraDrugs) {
      for (const drug of drugs) {
        if (contraDrugs.map(d => d.toLowerCase()).includes(drug.name.toLowerCase())) {
          score += 22;
          warnings.push({
            type: "contraindication",
            severity: "severe",
            title: `${drug.name} contraindicated with ${condition}`,
            description: `${drug.name} should be avoided or used with extreme caution in patients with ${condition}.`,
            explanation: `${drug.name} can worsen ${condition} or cause dangerous complications. The drug's mechanism of action directly conflicts with the pathophysiology of this condition.`,
            drugs: [drug.name],
          });
        }
      }
    }
  }

  // 5. Serious side effects awareness (lower weight)
  for (const drug of drugs) {
    if (drug.seriousSideEffects.length > 2) {
      score += 5;
    }
  }

  // Normalize score
  score = Math.min(100, Math.max(0, score));

  // Determine level
  let level: RiskLevel = "low";
  if (score >= 60) level = "high";
  else if (score >= 30) level = "moderate";

  // Sort warnings by severity
  const severityOrder = { severe: 0, moderate: 1, mild: 2 };
  warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Generate summary
  const summary = generateSummary(drugNames, warnings, level, score);

  return { score, level, warnings, drugDetails: drugs, summary };
}

function generateSummary(drugs: string[], warnings: Warning[], level: RiskLevel, score: number): string {
  const drugList = drugs.join(", ");
  const severeCount = warnings.filter(w => w.severity === "severe").length;
  const moderateCount = warnings.filter(w => w.severity === "moderate").length;

  if (level === "high") {
    return `High risk detected (score: ${score}/100) for the combination of ${drugList}. Found ${severeCount} critical and ${moderateCount} moderate warning(s). Consult a healthcare provider before proceeding.`;
  } else if (level === "moderate") {
    return `Moderate risk detected (score: ${score}/100) for ${drugList}. Some caution is advised. Review the warnings below and consider discussing with your pharmacist or doctor.`;
  }
  return `Low risk detected (score: ${score}/100) for ${drugList}. No major concerns identified, but always follow prescribed dosages and consult your healthcare provider if symptoms arise.`;
}
