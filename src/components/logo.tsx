import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-3">
      <div className="flex items-center justify-center size-14 text-primary">
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
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <text fill="currentColor" fontSize="9" fontWeight="bold" letterSpacing="0.5">
            <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
              SANGGUNIANG KABATAAN • BAKAKENG CENTRAL
            </textPath>
          </text>
          
          <text 
            x="50" 
            y="58" 
            textAnchor="middle" 
            fontSize="40" 
            fontWeight="bold"
            fontFamily="monospace"
            fill="currentColor"
          >
            SK
          </text>
        </svg>
      </div>
       <div className="flex flex-col">
            <span className="font-headline text-lg font-bold leading-tight">BAKAKENG CENTRAL</span>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">SANGGUNIANG KABATAAN</span>
        </div>
    </Link>
  );
}
