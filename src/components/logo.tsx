import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-3">
        <Image 
          src="/SK_Logo.png"
          alt="Barangay Bakakeng Central Logo"
          width={56}
          height={56}
          className=""
        />
        <div className="flex flex-col">
            <span className="font-headline text-lg font-bold leading-tight">BAKAKENG CENTRAL</span>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">SANGGUNIANG KABATAAN</span>
        </div>
    </Link>
  );
}
