export function convertToNumber(value: string) {
  if (typeof value !== 'string') return value;
  const lastChar = value.slice(-1);
  let multiplier = 1;
  if (lastChar === 'B') {
    multiplier = 1_000_000_000; // Multiply by 1 billion
  } else if (lastChar === 'M') {
    multiplier = 1_000_000; // Multiply by 1 million
  } else if (lastChar === 'K') {
    multiplier = 1_000; // Multiply by 1 million
  }
  return parseFloat(value) * multiplier;
}
