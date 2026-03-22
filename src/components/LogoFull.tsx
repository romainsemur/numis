import Logo from "./Logo";

interface LogoFullProps {
  size?: number;
  className?: string;
}

export default function LogoFull({ size = 36, className = "" }: LogoFullProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={size} />
      <div className="flex flex-col leading-none">
        <span
          className="text-xl font-bold tracking-wide"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#3E2723",
          }}
        >
          NUMIS
        </span>
        <span
          className="text-[9px] tracking-[0.25em] uppercase"
          style={{ color: "#8D6E63" }}
        >
          Collection
        </span>
      </div>
    </div>
  );
}
