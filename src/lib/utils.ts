import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function safeQuerySelector({
  parent,
  selector,
  limit = 50,
  current = 0,
}: {
  parent?: HTMLElement | Document;
  selector: string;
  limit?: number;
  current?: number;
}): Promise<HTMLElement | null> {
  if (current > limit) {
    return null;
  }
  const searchPivotElm = parent || document.body;

  const result = searchPivotElm.querySelector(selector);
  if (result) {
    return result as HTMLElement;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return await safeQuerySelector({
    selector,
    limit,
    current: current + 1,
    parent: searchPivotElm,
  });
}

export async function safeQuerySelectorAll({
  parent,
  selector,
  limit = 50,
  current = 0,
}: {
  parent?: HTMLElement | Document;
  selector: string;
  limit?: number;
  current?: number;
}): Promise<HTMLElement[] | null> {
  if (current > limit) {
    return null;
  }

  const searchPivotElm = parent || document.body;

  const result = searchPivotElm.querySelectorAll(selector);
  if (result.length > 0) {
    return Array.from(result) as HTMLElement[];
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return await safeQuerySelectorAll({
    selector,
    limit,
    current: current + 1,
    parent: searchPivotElm,
  });
}

export async function delay(ms = 3000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
