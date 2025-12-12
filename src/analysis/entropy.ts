/**
 * Calculates the Shannon Entropy of a string.
 * High entropy = Randomness (likely a secret).
 * Low entropy = Predictability (likely a word).
 */
export function calculateShannonEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;

  const frequencies = new Map<string, number>();
  for (const char of str) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  let entropy = 0;
  for (const count of frequencies.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}