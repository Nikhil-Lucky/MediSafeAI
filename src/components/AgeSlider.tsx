import { ageToGroup, ageCategoryLabel } from "@/lib/riskEngine";
import { User, Baby, GraduationCap, Briefcase, Heart } from "lucide-react";

interface AgeSliderProps {
  age: number;
  onChange: (age: number) => void;
}

const groupIcons: Record<string, React.ReactNode> = {
  child: <Baby className="h-4 w-4" />,
  teen: <GraduationCap className="h-4 w-4" />,
  adult: <Briefcase className="h-4 w-4" />,
  elderly: <Heart className="h-4 w-4" />,
};

export function AgeSlider({ age, onChange }: AgeSliderProps) {
  const group = ageToGroup(age);
  const label = ageCategoryLabel(group);
  const pct = (age / 100) * 100;

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <User className="h-4 w-4 text-primary" />
        Age
      </label>

      <div className="space-y-3">
        {/* Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-display text-foreground">{age}</span>
            <span className="text-sm text-muted-foreground">years</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/15">
            {groupIcons[group]}
            {label}
          </span>
        </div>

        {/* Custom slider */}
        <div className="relative pt-1 pb-1">
          <input
            type="range"
            min={0}
            max={100}
            value={age}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-card
              [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--muted)) ${pct}%, hsl(var(--muted)) 100%)`
            }}
          />
          {/* Tick marks */}
          <div className="flex justify-between mt-1.5 px-0.5">
            {[0, 12, 17, 64, 100].map(tick => (
              <span key={tick} className="text-[10px] text-muted-foreground">{tick}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
