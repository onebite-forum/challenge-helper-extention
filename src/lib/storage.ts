import { AppData } from "@/type";
import { localExtStorage } from "@webext-core/storage";

const storageKey = "challenge-helper-appdata";

export async function getStorageData(): Promise<AppData | null> {
  const storageData = await localExtStorage.getItem(storageKey);
  if (storageData) {
    return JSON.parse(storageData);
  }
  return null;
}
