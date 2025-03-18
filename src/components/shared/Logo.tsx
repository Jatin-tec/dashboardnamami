
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue">
        <span className="text-lg font-bold text-brand-gold">CS</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold leading-none text-foreground">Clean</span>
        <span className="text-sm font-medium leading-none text-brand-gold">City</span>
      </div>
    </div>
  );
};

export default Logo;
