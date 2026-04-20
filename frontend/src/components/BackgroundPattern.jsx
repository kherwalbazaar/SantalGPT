export default function BackgroundPattern() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="text-earthyGreen"
      >
        <defs>
          <pattern
            id="mandala"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            {/* Traditional Santali handloom-inspired geometric pattern */}
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Diagonal cross pattern (handloom weave) */}
            <line x1="20" y1="20" x2="180" y2="180" stroke="currentColor" strokeWidth="0.5" />
            <line x1="180" y1="20" x2="20" y2="180" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Diamond patterns */}
            <polygon
              points="100,40 160,100 100,160 40,100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <polygon
              points="100,60 140,100 100,140 60,100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            
            {/* Corner decorative elements */}
            <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="180" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="20" cy="180" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="180" cy="180" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Small dots at intersections */}
            <circle cx="100" cy="40" r="2" fill="currentColor" />
            <circle cx="100" cy="160" r="2" fill="currentColor" />
            <circle cx="40" cy="100" r="2" fill="currentColor" />
            <circle cx="160" cy="100" r="2" fill="currentColor" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#mandala)" />
      </svg>
    </div>
  );
}
