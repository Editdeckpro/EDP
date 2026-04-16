import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSecondsToMinutes(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesPart = minutes > 0 ? `${minutes} min` : "";
  const secondsPart = remainingSeconds > 0 ? `${remainingSeconds} sec` : "";

  return [minutesPart, secondsPart].filter(Boolean).join(" ");
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("File could not be read as Base64 string."));
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file); // Reads the file as Base64
  });
}

export const apiProviders = ["nano_banana", "openai", "ideogram"] as const;
export const apiProviderSelect = [
  { name: "Ultra", value: "nano_banana" },
  { name: "Studio", value: "openai" },
  { name: "Mural", value: "ideogram" },
] as const;
