export type MemoryType =
  | "vendor-pattern"
  | "correction-rule"
  | "resolution-history";

export interface Memory {
  id: string;

  // What kind of learning this is
  type: MemoryType;

  // Vendor this memory applies to
  vendor: string;

  // Human-readable rule description
  rule: string;

  // Confidence that this rule is safe (0 → 1)
  confidence: number;

  // How many times this rule was successfully used
  usageCount: number;

  // Last time it was applied
  lastUsed: string;
}
