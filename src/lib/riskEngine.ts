import { findDrug, findInteractions, diseaseContraindications, type Drug, type DrugInteraction } from "@/data/drugDatabase";

export type AgeGroup = "child" | "teen" | "adult" | "elderly";
export type RiskLevel = "low" | "moderate" | "high";

export interface Warning {
  type: "interaction" | "allergy" | "age" | "contraindication" | "side-effect";
  severity: "mild" | "moderate" | "severe";
  title: string;
  description: string;
  explanation: string;
  drugs: string[];
}

export interface RiskBreakdown {
  interaction: number;
  allergy: number;
  age: number;
  condition: number;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  warnings: Warning[];
  drugDetails: Drug[];
  summary: string;
  breakdown: RiskBreakdown;
  severityBanner: string;
  recommendedActions: string[];
  criticalInteraction?: { drugs: [string, string]; description: string };
}

export function ageToGroup(age: number): AgeGroup {
  if (age <= 12) return "child";
  if (age <= 17) return "teen";
  if (age <= 64) return "adult";
  return "elderly";
}

export function ageCategoryLabel(group: AgeGroup): string {
  switch (group) {
    case "child": return "Child (0–12)";
    case "teen": return "Teen (13–17)";
    case "adult": return "Adult (18–64)";
    case "elderly": return "Elderly (65+)";
  }
}

function ageGroupToRange(group: AgeGroup): { min: number; max: number; label: string } {
  switch (group) {
    case "child": return { min: 0, max: 12, label: "children" };
    case "teen": return { min: 13, max: 17, label: "teenagers" };
    case "adult": return { min: 18, max: 64, label: "adults" };
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
  const breakdown: RiskBreakdown = { interaction: 0, allergy: 0, age: 0, condition: 0 };
  let score = 0;
  let criticalInteraction: RiskResult["criticalInteraction"] = undefined;

  for (const name of drugNames) {
    const drug = findDrug(name);
    if (drug) drugs.push(drug);
  }

  // Extra medicine penalty
  if (drugNames.length > 1) {
    score += (drugNames.length - 1) * 5;
  }

  // 1. Drug-Drug Interactions
  const foundInteractions = findInteractions(drugNames);
  for (const interaction of foundInteractions) {
    const severityScore = interaction.severity === "severe" ? 35 : interaction.severity === "moderate" ? 20 : 10;
    score += severityScore;
    breakdown.interaction += severityScore;
    warnings.push({
      type: "interaction",
      severity: interaction.severity,
      title: `${interaction.drugs[0]} + ${interaction.drugs[1]}: ${interaction.description}`,
      description: interaction.description,
      explanation: interaction.mechanism,
      drugs: [...interaction.drugs],
    });
    if (!criticalInteraction || (interaction.severity === "severe" && !criticalInteraction)) {
      criticalInteraction = { drugs: interaction.drugs, description: interaction.description };
    }
  }

  // 2. Allergy checks
  const normalizedAllergies = allergies.map(a => a.toLowerCase().trim()).filter(Boolean);
  for (const drug of drugs) {
    for (const flag of drug.allergyFlags) {
      if (normalizedAllergies.some(a => flag.includes(a) || a.includes(flag))) {
        score += 30;
        breakdown.allergy += 30;
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
        score += 20;
        breakdown.age += 20;
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

  if (ageGroup === "elderly") {
    for (const drug of drugs) {
      if (["NSAID", "NSAID / Antiplatelet", "NSAID / Analgesic"].includes(drug.category)) {
        score += 10;
        breakdown.age += 10;
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
          score += 25;
          breakdown.condition += 25;
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

  // 5. Side effects awareness
  for (const drug of drugs) {
    if (drug.seriousSideEffects.length > 2) {
      score += 5;
    }
  }

  score = Math.min(100, Math.max(0, score));

  let level: RiskLevel = "low";
  if (score >= 60) level = "high";
  else if (score >= 30) level = "moderate";

  const severityOrder = { severe: 0, moderate: 1, mild: 2 };
  warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const summary = generateSummary(drugNames, warnings, level, score);
  const severityBanner = level === "high" ? "Seek medical advice urgently" : level === "moderate" ? "Use with caution" : "Safe to review";
  const recommendedActions = generateActions(warnings, level);

  return { score, level, warnings, drugDetails: drugs, summary, breakdown, severityBanner, recommendedActions, criticalInteraction };
}

function generateActions(warnings: Warning[], level: RiskLevel): string[] {
  const actions: string[] = [];
  if (level === "high") {
    actions.push("Consult your healthcare provider before taking these medicines together");
    actions.push("Avoid combining these medicines without medical supervision");
  }
  if (warnings.some(w => w.type === "allergy")) {
    actions.push("Verify allergy information with your doctor");
  }
  if (warnings.some(w => w.type === "age")) {
    actions.push("Recheck age-specific dosage and safety guidelines");
  }
  if (warnings.some(w => w.type === "contraindication")) {
    actions.push("Review condition-specific risks with your pharmacist");
  }
  if (level === "moderate") {
    actions.push("Consider discussing these findings with your pharmacist");
  }
  if (level === "low") {
    actions.push("Follow prescribed dosages and monitor for any side effects");
  }
  actions.push("Always inform your healthcare provider about all medications you take");
  return actions;
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
