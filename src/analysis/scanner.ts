import { calculateShannonEntropy } from './entropy';

// 1. Define Context Regex (Words that imply danger)
const SENSITIVE_KEYS = /((?:api_?key|secret|token|password|pwd|auth|credential|private))/i;

// 2. Define Dynamic Thresholds
const BASE_THRESHOLD = 4.5;       // High bar for random variables
const SENSITIVE_THRESHOLD = 3.2;  // Low bar for "named" secrets

// The Naughty List (Dummy Keys)
const DUMMY_VALUES = new Set([
    'password', 'changeme', '123456', 'admin', 'test', 
    'sk_test_123', 'your_api_key'
]);

// Regex: Finds "var = 'string'" or "key: 'string'"
// Matches: const apiKey = "..." OR apiKey: "..."
// Group 1: Variable Name
// Group 2: Quote type (' or ")
// Group 3: The Content
const ASSIGNMENT_REGEX = /(?:const|let|var|api_key|token|secret|password|auth)\s+([a-zA-Z0-9_]+)\s*[:=]\s*(["'])(.*?)\2/g;

export interface ScanResult {
  range: [number, number]; // Start/End index of the value inside the file
  type: 'HIGH_ENTROPY' | 'DUMMY_KEY';
  message: string;
}

export function scanText(text: string): ScanResult[] {
  const results: ScanResult[] = [];
  let match;
  
  ASSIGNMENT_REGEX.lastIndex = 0;

  console.log("--- Smart Scan Active ---");

  while ((match = ASSIGNMENT_REGEX.exec(text)) !== null) {
    const varName = match[1]; // e.g. "stripeKey"
    const value = match[3];   // e.g. "sk_live_..."
    
    // Calculate locations
    const matchStart = match.index;
    const valueStart = matchStart + match[0].lastIndexOf(value);
    const valueEnd = valueStart + value.length;

    const lowerValue = value.toLowerCase();

    // Check 1: Dummy (No change here)
    if (DUMMY_VALUES.has(lowerValue) || lowerValue.includes('placeholder')) {
      results.push({
        range: [valueStart, valueEnd],
        type: 'DUMMY_KEY',
        message: `⚠️ Weak Key Detected`
      });
      continue;
    }

    // Check 2: Smart Entropy
    const entropy = calculateShannonEntropy(value);
    const isSensitiveVar = SENSITIVE_KEYS.test(varName);

    // DYNAMIC DECISION LOGIC
    // If variable name looks dangerous, use LOWER threshold.
    // If variable name looks safe, use HIGHER threshold.
    const effectiveThreshold = isSensitiveVar ? SENSITIVE_THRESHOLD : BASE_THRESHOLD;

    console.log(`Var: ${varName} | Entropy: ${entropy.toFixed(2)} | Threshold: ${effectiveThreshold}`);

    if (entropy > effectiveThreshold && value.length >= 12) {
      results.push({
        range: [valueStart, valueEnd],
        type: 'HIGH_ENTROPY',
        message: `🔐 Secret Detected (Entropy: ${entropy.toFixed(2)})`
      });
    }
  }

  return results;
}

// Simple debounce function to prevent rapid-fire scanning
export function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function(this: any, ...args: any[]) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}