import Link from 'next/link';
import { Sprout } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-3">
        <div className="bg-primary rounded-full p-2 flex items-center justify-center">
            <Sprout className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
            <span className="font-headline text-lg font-bold leading-tight">BAKAKENG CENTRAL</span>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">BARANGAY</span>
        </div>
    </Link>
  );
}
