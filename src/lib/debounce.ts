export default function debounce(callback: (...args: any[]) => void, delay = 100) {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => callback(...args), delay);
  };
}
