import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-3">
      <div className="flex items-center justify-center size-14">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="size-14"
        >
          <defs>
            <path
              id="circlePath"
              d="
                M 10, 50
                a 40,40 0 1,1 80,0
                a 40,40 0 1,1 -80,0
              "
              fill="none"
            />
          </defs>
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="#16a34a"
            strokeWidth="4"
            fill="#16a34a"
          />
           <circle
            cx="50"
            cy="50"
            r="42"
            fill="white"
          />
           <circle
            cx="50"
            cy="50"
            r="36"
            fill="#facc15"
          />
          <text fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.5">
            <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
              SANGGUNIANG KABATAAN
            </textPath>
          </text>
          
          <g>
            <text 
              x="36" 
              y="62" 
              textAnchor="middle" 
              fontSize="36" 
              fontWeight="bold"
              fontFamily="sans-serif"
              fill="#0054A6"
              style={{fontStyle: 'italic'}}
            >
              S
            </text>
            <text 
              x="64" 
              y="62" 
              textAnchor="middle" 
              fontSize="36" 
              fontWeight="bold"
              fontFamily="sans-serif"
              fill="#D41E24"
            >
              K
            </text>
          </g>
        </svg>
      </div>
       <div className="flex flex-col">
            <span className="font-headline text-lg font-bold leading-tight">BAKAKENG CENTRAL</span>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">SANGGUNIANG KABATAAN</span>
        </div>
    </Link>
  );
}
