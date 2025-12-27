export interface AuditStep {
  step: "recall" | "apply" | "decide" | "learn";
  timestamp: string;
  details: string;
}

export interface DecisionResult {
  normalizedInvoice: Invoice;
  proposedCorrections: string[];
  requiresHumanReview: boolean;
  reasoning: string;
  confidenceScore: number;
  memoryUpdates: string[];
  auditTrail: AuditStep[];
}
