import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slugify = (str: string) =>
  str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s+]/g, "")
    .replace(/\s+/g, "-");

export const formatLeagueName = (slug: string) => slug.replace(/-/g, " ");
