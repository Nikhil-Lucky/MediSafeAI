export interface Drug {
  name: string;
  category: string;
  commonSideEffects: string[];
  seriousSideEffects: string[];
  contraindications: string[];
  ageRestrictions?: { min?: number; max?: number; warning: string };
  allergyFlags: string[];
}

export interface DrugInteraction {
  drugs: [string, string];
  severity: "mild" | "moderate" | "severe";
  description: string;
  mechanism: string;
}

export const drugDatabase: Drug[] = [
  {
    name: "Aspirin",
    category: "NSAID / Antiplatelet",
    commonSideEffects: ["Stomach upset", "Heartburn", "Nausea"],
    seriousSideEffects: ["GI bleeding", "Tinnitus", "Allergic reaction"],
    contraindications: ["Active GI bleeding", "Hemophilia", "Severe liver disease"],
    ageRestrictions: { min: 16, warning: "Risk of Reye's syndrome in children under 16" },
    allergyFlags: ["aspirin", "nsaid", "salicylate"],
  },
  {
    name: "Ibuprofen",
    category: "NSAID",
    commonSideEffects: ["Stomach pain", "Nausea", "Dizziness"],
    seriousSideEffects: ["GI bleeding", "Kidney damage", "Heart attack risk"],
    contraindications: ["Severe heart failure", "Active GI ulcer", "Severe kidney disease"],
    ageRestrictions: { min: 6, warning: "Not recommended for children under 6 months" },
    allergyFlags: ["nsaid", "ibuprofen"],
  },
  {
    name: "Warfarin",
    category: "Anticoagulant",
    commonSideEffects: ["Bruising", "Minor bleeding"],
    seriousSideEffects: ["Major hemorrhage", "Skin necrosis", "Purple toe syndrome"],
    contraindications: ["Pregnancy", "Active bleeding", "Recent surgery"],
    allergyFlags: ["warfarin", "coumarin"],
  },
  {
    name: "Metformin",
    category: "Antidiabetic",
    commonSideEffects: ["Nausea", "Diarrhea", "Stomach cramps"],
    seriousSideEffects: ["Lactic acidosis", "Vitamin B12 deficiency"],
    contraindications: ["Severe kidney disease", "Liver disease", "Alcoholism"],
    allergyFlags: ["metformin", "biguanide"],
  },
  {
    name: "Lisinopril",
    category: "ACE Inhibitor",
    commonSideEffects: ["Dry cough", "Dizziness", "Headache"],
    seriousSideEffects: ["Angioedema", "Hyperkalemia", "Kidney failure"],
    contraindications: ["Pregnancy", "Bilateral renal artery stenosis", "Angioedema history"],
    allergyFlags: ["ace inhibitor", "lisinopril"],
  },
  {
    name: "Amoxicillin",
    category: "Antibiotic",
    commonSideEffects: ["Diarrhea", "Nausea", "Rash"],
    seriousSideEffects: ["Anaphylaxis", "C. difficile infection", "Stevens-Johnson syndrome"],
    contraindications: ["Penicillin allergy"],
    allergyFlags: ["penicillin", "amoxicillin", "beta-lactam"],
  },
  {
    name: "Atorvastatin",
    category: "Statin",
    commonSideEffects: ["Muscle pain", "Headache", "Nausea"],
    seriousSideEffects: ["Rhabdomyolysis", "Liver damage", "Type 2 diabetes risk"],
    contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding"],
    allergyFlags: ["statin", "atorvastatin"],
  },
  {
    name: "Omeprazole",
    category: "Proton Pump Inhibitor",
    commonSideEffects: ["Headache", "Nausea", "Diarrhea"],
    seriousSideEffects: ["Bone fractures", "C. difficile", "Magnesium deficiency"],
    contraindications: [],
    allergyFlags: ["omeprazole", "ppi"],
  },
  {
    name: "Metoprolol",
    category: "Beta Blocker",
    commonSideEffects: ["Fatigue", "Dizziness", "Cold extremities"],
    seriousSideEffects: ["Severe bradycardia", "Heart block", "Bronchospasm"],
    contraindications: ["Severe bradycardia", "Heart block", "Cardiogenic shock", "Asthma"],
    allergyFlags: ["beta blocker", "metoprolol"],
  },
  {
    name: "Prednisone",
    category: "Corticosteroid",
    commonSideEffects: ["Weight gain", "Mood changes", "Insomnia"],
    seriousSideEffects: ["Osteoporosis", "Diabetes", "Immunosuppression", "Adrenal suppression"],
    contraindications: ["Systemic fungal infections", "Live vaccines"],
    allergyFlags: ["corticosteroid", "prednisone"],
  },
  {
    name: "Ciprofloxacin",
    category: "Fluoroquinolone Antibiotic",
    commonSideEffects: ["Nausea", "Diarrhea", "Dizziness"],
    seriousSideEffects: ["Tendon rupture", "Peripheral neuropathy", "Aortic dissection"],
    ageRestrictions: { min: 18, warning: "Risk of joint/tendon damage in children" },
    contraindications: ["Myasthenia gravis"],
    allergyFlags: ["fluoroquinolone", "ciprofloxacin"],
  },
  {
    name: "Acetaminophen",
    category: "Analgesic / Antipyretic",
    commonSideEffects: ["Nausea"],
    seriousSideEffects: ["Liver failure (overdose)", "Severe skin reactions"],
    contraindications: ["Severe liver disease"],
    allergyFlags: ["acetaminophen", "paracetamol"],
  },
  {
    name: "Paracetamol",
    category: "Analgesic / Antipyretic",
    commonSideEffects: ["Nausea"],
    seriousSideEffects: ["Liver failure (overdose)", "Severe skin reactions"],
    contraindications: ["Severe liver disease"],
    allergyFlags: ["acetaminophen", "paracetamol"],
  },
  {
    name: "Dolo 650",
    category: "Analgesic / Antipyretic",
    commonSideEffects: ["Nausea", "Stomach upset"],
    seriousSideEffects: ["Liver damage (overdose)"],
    contraindications: ["Severe liver disease"],
    allergyFlags: ["paracetamol"],
  },
  {
    name: "Dolo 500",
    category: "Analgesic / Antipyretic",
    commonSideEffects: ["Nausea", "Stomach upset"],
    seriousSideEffects: ["Liver damage (overdose)"],
    contraindications: ["Severe liver disease"],
    allergyFlags: ["paracetamol"],
  },
  {
    name: "Cetirizine",
    category: "Antihistamine",
    commonSideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
    seriousSideEffects: ["Severe allergic reaction"],
    contraindications: [],
    allergyFlags: ["cetirizine", "antihistamine"],
  },
  {
    name: "Azithromycin",
    category: "Macrolide Antibiotic",
    commonSideEffects: ["Nausea", "Diarrhea", "Abdominal pain"],
    seriousSideEffects: ["QT prolongation", "Liver damage", "C. difficile"],
    contraindications: ["Liver disease"],
    allergyFlags: ["azithromycin", "macrolide"],
  },
  {
    name: "Crocin",
    category: "Analgesic / Antipyretic",
    commonSideEffects: ["Nausea"],
    seriousSideEffects: ["Liver damage (overdose)"],
    contraindications: ["Severe liver disease"],
    allergyFlags: ["paracetamol"],
  },
  {
    name: "Combiflam",
    category: "NSAID / Analgesic",
    commonSideEffects: ["Stomach pain", "Nausea", "Dizziness"],
    seriousSideEffects: ["GI bleeding", "Liver damage", "Kidney damage"],
    contraindications: ["Active GI ulcer", "Severe kidney disease"],
    allergyFlags: ["nsaid", "ibuprofen", "paracetamol"],
  },
  {
    name: "Allegra",
    category: "Antihistamine",
    commonSideEffects: ["Headache", "Nausea", "Drowsiness"],
    seriousSideEffects: ["Severe allergic reaction"],
    contraindications: [],
    allergyFlags: ["fexofenadine", "antihistamine"],
  },
  {
    name: "Pantoprazole",
    category: "Proton Pump Inhibitor",
    commonSideEffects: ["Headache", "Diarrhea", "Nausea"],
    seriousSideEffects: ["Bone fractures", "C. difficile", "Magnesium deficiency"],
    contraindications: [],
    allergyFlags: ["pantoprazole", "ppi"],
  },
];

export const interactions: DrugInteraction[] = [
  {
    drugs: ["Aspirin", "Warfarin"],
    severity: "severe",
    description: "Greatly increases bleeding risk",
    mechanism: "Both drugs inhibit clotting through different mechanisms, compounding anticoagulant effects.",
  },
  {
    drugs: ["Aspirin", "Ibuprofen"],
    severity: "moderate",
    description: "Ibuprofen may reduce aspirin's cardioprotective effect",
    mechanism: "Ibuprofen competitively blocks the COX-1 binding site, preventing aspirin from irreversibly inhibiting platelet aggregation.",
  },
  {
    drugs: ["Ibuprofen", "Warfarin"],
    severity: "severe",
    description: "Significantly increases bleeding risk",
    mechanism: "NSAIDs inhibit platelet function and can cause GI erosion, compounding warfarin's anticoagulant effect.",
  },
  {
    drugs: ["Lisinopril", "Metformin"],
    severity: "mild",
    description: "May slightly increase hypoglycemia risk",
    mechanism: "ACE inhibitors can improve insulin sensitivity, potentially enhancing metformin's glucose-lowering effect.",
  },
  {
    drugs: ["Metoprolol", "Lisinopril"],
    severity: "moderate",
    description: "Additive blood pressure lowering effect",
    mechanism: "Both drugs lower blood pressure through different mechanisms, which can cause excessive hypotension.",
  },
  {
    drugs: ["Ciprofloxacin", "Warfarin"],
    severity: "severe",
    description: "Ciprofloxacin increases warfarin's anticoagulant effect",
    mechanism: "Ciprofloxacin inhibits CYP1A2, reducing warfarin metabolism and increasing bleeding risk.",
  },
  {
    drugs: ["Omeprazole", "Metformin"],
    severity: "mild",
    description: "Omeprazole may slightly increase metformin absorption",
    mechanism: "Increased gastric pH can affect metformin absorption kinetics.",
  },
  {
    drugs: ["Prednisone", "Aspirin"],
    severity: "moderate",
    description: "Increased risk of GI bleeding",
    mechanism: "Both drugs can damage the gastric mucosa; corticosteroids also reduce the protective prostaglandin layer.",
  },
  {
    drugs: ["Prednisone", "Metformin"],
    severity: "moderate",
    description: "Prednisone can raise blood glucose, opposing metformin",
    mechanism: "Corticosteroids increase gluconeogenesis and insulin resistance, counteracting metformin's effect.",
  },
  {
    drugs: ["Atorvastatin", "Amoxicillin"],
    severity: "mild",
    description: "Generally safe; minimal interaction expected",
    mechanism: "No significant pharmacokinetic or pharmacodynamic interaction.",
  },
  {
    drugs: ["Ciprofloxacin", "Prednisone"],
    severity: "moderate",
    description: "Increased risk of tendon rupture",
    mechanism: "Both fluoroquinolones and corticosteroids independently weaken tendons; combined use multiplies this risk.",
  },
  {
    drugs: ["Acetaminophen", "Warfarin"],
    severity: "moderate",
    description: "High-dose acetaminophen may enhance warfarin's effect",
    mechanism: "Acetaminophen metabolites may inhibit vitamin K-dependent clotting factor synthesis.",
  },
];

export const diseaseContraindications: Record<string, string[]> = {
  "Asthma": ["Metoprolol", "Aspirin", "Ibuprofen"],
  "Kidney Disease": ["Ibuprofen", "Metformin", "Lisinopril", "Ciprofloxacin"],
  "Liver Disease": ["Acetaminophen", "Metformin", "Atorvastatin"],
  "Heart Failure": ["Ibuprofen", "Metoprolol"],
  "Diabetes": ["Prednisone"],
  "Pregnancy": ["Warfarin", "Lisinopril", "Atorvastatin", "Ibuprofen"],
  "Peptic Ulcer": ["Aspirin", "Ibuprofen", "Prednisone"],
  "Myasthenia Gravis": ["Ciprofloxacin"],
};

export function findDrug(name: string): Drug | undefined {
  return drugDatabase.find(d => d.name.toLowerCase() === name.toLowerCase());
}

export function findInteractions(drugNames: string[]): DrugInteraction[] {
  const normalized = drugNames.map(n => n.toLowerCase());
  return interactions.filter(i => {
    const a = i.drugs[0].toLowerCase();
    const b = i.drugs[1].toLowerCase();
    return normalized.includes(a) && normalized.includes(b);
  });
}

export function getDrugNames(): string[] {
  return drugDatabase.map(d => d.name);
}
