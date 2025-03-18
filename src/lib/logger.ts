export default function logger(message: string | number, depth = 0) {
  const prefix = "[ONEBITE]";
  console.log(prefix, `${"  ".repeat(depth)}${message}`);
}
