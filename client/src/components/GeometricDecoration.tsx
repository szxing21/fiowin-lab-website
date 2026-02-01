/**
 * GeometricDecoration - Scandinavian-style abstract geometric shapes
 * Provides subtle visual interest with soft pink-blue and blush pink colors
 */

interface GeometricDecorationProps {
  variant?: "hero" | "section" | "corner";
  className?: string;
}

export function GeometricDecoration({ variant = "section", className = "" }: GeometricDecorationProps) {
  if (variant === "hero") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Large circle - top right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl" />
        
        {/* Medium circle - bottom left */}
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-chart-2/15 to-transparent blur-2xl" />
        
        {/* Small accent circle - center */}
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-accent/10 blur-xl" />
      </div>
    );
  }

  if (variant === "corner") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Top left corner accent */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-accent/15 to-transparent blur-2xl" />
      </div>
    );
  }

  // Default section variant
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Subtle background shapes */}
      <div className="absolute top-1/4 right-0 w-48 h-48 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-56 h-56 rounded-full bg-chart-2/5 blur-3xl" />
    </div>
  );
}
