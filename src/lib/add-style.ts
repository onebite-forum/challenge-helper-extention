type CSSProperties = {
  [key: string]: string;
};

export function addStyle(elm: HTMLElement, style: CSSProperties) {
  Object.entries(style).forEach(([key, value]) => {
    elm.style.setProperty(key, value);
  });
}
