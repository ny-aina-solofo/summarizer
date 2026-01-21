import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const language = [
  { label: "English", value: "english" },
  { label: "German", value: "german" },
  { label: "French", value: "french" },
  { label: "Italian", value: "italian" },
  { label: "Portuguese", value: "portuguese" },
  { label: "Hindi", value: "hindi" },
  { label: "Spanish", value: "spanish" },
  { label: "Thai", value: "thai" },
]

export const summaryType = [
  {label: "Detailed summary",value: "detailed"},
  {label: "Concise summary",value: "concise"}
]

export const pages = [
  {label: "All pages",value: "all"},
  {label: "Custom range",value: "custom"},
]
