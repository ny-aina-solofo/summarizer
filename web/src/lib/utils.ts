import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const summaryType = [
  {
    label: "Detailed summary",
    value: "detailed",
  },

  {
    label: "Concise summary",
    value: "concise",
  },
]

export const pages = [
  {
    label: "All pages",
    value: "all",
  },

  {
    label: "Custom range",
    value: "custom",
  },
]
