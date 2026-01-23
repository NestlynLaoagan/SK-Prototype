import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-3">
        <div className="w-14 h-14">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <path id="circlePath" d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"/>
            </defs>
            {/* Outer green circle */}
            <circle cx="100" cy="100" r="98" fill="#1e813c"/>
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="4"/>
            
            {/* SANGGUNIANG KABATAAN text */}
            <g>
                <use xlinkHref="#circlePath" fill="none"/>
                <text fill="white" fontSize="24" fontWeight="bold" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1">
                    <textPath xlinkHref="#circlePath" startOffset="50%" textAnchor="middle">
                        SANGGUNIANG KABATAAN
                    </textPath>
                </text>
            </g>

            {/* Pine tree icon at top */}
            <text x="94" y="45" fontSize="20">🌲</text>

            {/* Inner yellow circle */}
            <circle cx="100" cy="100" r="60" fill="#fecb00"/>
            
            {/* SK figures */}
            <g transform="translate(-10, 0)">
                {/* S figure (blue) */}
                <path d="M90,75 C75,85 75,115 90,125" stroke="#0038a8" strokeWidth="14" fill="none" strokeLinecap="round" />
                <path d="M78,92 C88,82 105,85 105,100 C105,115 88,118 78,108" stroke="#0038a8" strokeWidth="14" fill="none" strokeLinecap="round"/>
            
                {/* K figure (red) */}
                <path d="M120,75 L120,125 M120,100 L135,75 M120,100 L135,125" stroke="#ce1126" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
