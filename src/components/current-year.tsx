"use client";

import { useState, useEffect } from 'react';

export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Return the year if it's been set, otherwise render nothing.
  // This ensures the server render and initial client render are identical.
  return (
    <>{year}</>
  );
}
