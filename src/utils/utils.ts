import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

export const camelCaseToSentenceCase = (str: string) => {
  // Insert a space before each uppercase letter
  let result = str.replace(/([A-Z])/g, " $1");

  // Convert the entire string to lowercase
  result = result.toLowerCase();

  // Capitalize the first letter of the string
  result = result.charAt(0).toUpperCase() + result.slice(1);

  return result;
};

export const dataUrlToBase64 = (dataUrl: string): string => {
  return dataUrl.split(",")[1];
};

export const nameToKeyMap: { [key: string]: string } = {
  API: "api",
  Code: "code",
  Condition: "condition",
  File: "file",
  Image: "image",
};
