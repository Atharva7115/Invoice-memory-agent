import { Memory } from "../types/memory";
import { Invoice } from "../types/invoice";
import { AuditStep } from "../types/decisionResult";

export interface ApplyResult {
  updatedInvoice: Invoice;
  proposedCorrections: string[];
  appliedConfidence: number;
  auditSteps: AuditStep[];
}

export function applyMemory(
  invoice: Invoice,
  memories: Memory[]
): ApplyResult {
  const proposedCorrections: string[] = [];
  const auditSteps: AuditStep[] = [];
  let appliedConfidence = 0;

  // its makes  a safe copy so original invoice is untouched
  const updatedInvoice: Invoice = JSON.parse(JSON.stringify(invoice));

  for (const memory of memories) {
   
    // Case 1: Supplier GmbH - serviceDate from Leistungsdatum
 
    if (
      memory.rule.includes("Leistungsdatum") &&
      updatedInvoice.fields.serviceDate == null
    ) {
      const dateMatch = updatedInvoice.rawText.match(
        /\d{2}\.\d{2}\.\d{4}/
      );

      if (dateMatch) {
        updatedInvoice.fields.serviceDate = dateMatch[0];
        proposedCorrections.push(
          "Filled serviceDate using vendor-specific Leistungsdatum pattern"
        );
        appliedConfidence = Math.max(appliedConfidence, memory.confidence);

        auditSteps.push({
          step: "apply",
          timestamp: new Date().toISOString(),
          details: `Applied memory rule: ${memory.rule}`
        });
      }
    }
    
    // Case 2: Parts AG - recover missing currency

    if (
      memory.rule.includes("Currency appears in rawText") &&
      updatedInvoice.fields.currency == null
    ) {
      const currencyMatch = updatedInvoice.rawText.match(/\b(EUR|USD|INR)\b/);

      if (currencyMatch) {
        updatedInvoice.fields.currency = currencyMatch[1];
        proposedCorrections.push(
          "Recovered missing currency from rawText"
        );
        appliedConfidence = Math.max(appliedConfidence, memory.confidence);

        auditSteps.push({
          step: "apply",
          timestamp: new Date().toISOString(),
          details: `Applied memory rule: ${memory.rule}`
        });
      }
    }

  }

  return {
    updatedInvoice,
    proposedCorrections,
    appliedConfidence,
    auditSteps
  };
}
