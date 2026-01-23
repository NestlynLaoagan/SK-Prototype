"use client";

import { useDoc, useFirebase, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { User } from "firebase/auth";
import type { User as UserModel } from "@/lib/types";

export function useUserProfile(user: User | null) {
    const { firestore } = useFirebase();

    const userDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);
    
    const { data: userProfile, isLoading: isProfileLoading, error } = useDoc<UserModel>(userDocRef);

    return { userProfile, isProfileLoading, error };
}
