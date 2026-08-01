import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Class-name helper expected by shadcn/Aceternity components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
