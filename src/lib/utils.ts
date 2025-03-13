import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function HandleErrorMessage(e: unknown, title?: string) {
  if (e instanceof Error) {
    toast.error(`${title}: ${e.message}`);
  } else {
    console.log(e);
    toast.error(`${title}`);
  }
}

export function HandleThrowError(e: unknown): Error {
  if (e instanceof Error) {
    throw new Error(`${e.message}`);
  } else {
    console.log(e);
    throw new Error("An unexpected error occurred");
  }
}
