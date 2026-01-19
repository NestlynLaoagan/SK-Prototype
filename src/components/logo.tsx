import Link from 'next/link';
import { UsersRound } from 'lucide-react';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-3">
        {/* Placeholder for SkLogo.png */}
        <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
            <UsersRound className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="font-headline text-2xl font-bold hidden sm:inline-block">BarangayConnect</span>
    </Link>
  );
}
