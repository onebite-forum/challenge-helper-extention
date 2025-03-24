export default function logger(message: string | number, depth = 0) {
  if (process.env.NODE_ENV !== "development") return;

  const prefix = "[ONEBITE]";
  console.log(prefix, `${"  ".repeat(depth)}${message}`);
}
