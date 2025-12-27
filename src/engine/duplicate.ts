import { Invoice } from "../types/invoice";
import { Memory } from "../types/memory";
import { AuditStep } from "../types/decisionResult";

/**
 * Detect whether an invoice is likely a duplicate.
 */
export function detectDuplicate(
  invoice: Invoice,
  pastInvoices: Invoice[]
): {
  isDuplicate: boolean;
  auditStep: AuditStep;
} {
  for (const past of pastInvoices) {
    if (
      past.vendor === invoice.vendor &&
      past.fields.invoiceNumber === invoice.fields.invoiceNumber
    ) {
      const auditStep: AuditStep = {
        step: "decide",
        timestamp: new Date().toISOString(),
        details: `Duplicate detected: invoice number ${invoice.fields.invoiceNumber} already processed for vendor ${invoice.vendor}`
      };

      return {
        isDuplicate: true,
        auditStep
      };
    }
  }

  return {
    isDuplicate: false,
    auditStep: {
      step: "decide",
      timestamp: new Date().toISOString(),
      details: "No duplicate invoice detected"
    }
  };
}
