import { AuditStep } from "../types/decisionResult";

export interface DecisionOutput {
  requiresHumanReview: boolean;
  reasoning: string;
  decisionConfidence: number;
  auditStep: AuditStep;
}


// Decide whether invoice can be auto-accepted or needs human review.

export function decideNextAction(
  appliedConfidence: number,
  proposedCorrections: string[]
): DecisionOutput {
  let requiresHumanReview = true;
  let reasoning = "";
  let decisionConfidence = appliedConfidence;

  // No corrections applied → nothing learned yet
  if (proposedCorrections.length === 0) {
    reasoning =
      "No applicable memory rules found; invoice requires human review.";
    decisionConfidence = 0;
  }
  // High confidence → safe to auto-accept
  else if (appliedConfidence >= 0.85) {
    requiresHumanReview = false;
    reasoning =
      "High confidence vendor-specific memory applied; safe to auto-accept.";
  }
  // Medium confidence → suggest but verify
  else if (appliedConfidence >= 0.5) {
    reasoning =
      "Memory applied with moderate confidence; human verification recommended.";
  }
  // Low confidence → escalate
  else {
    reasoning =
      "Low confidence memory applied; escalation required to avoid risk.";
  }

  const auditStep: AuditStep = {
    step: "decide",
    timestamp: new Date().toISOString(),
    details: reasoning
  };

  return {
    requiresHumanReview,
    reasoning,
    decisionConfidence,
    auditStep
  };
}
