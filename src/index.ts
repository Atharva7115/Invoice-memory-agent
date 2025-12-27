import { initDB } from "./db/sqlite";
import { recallMemory } from "./engine/recall";
import { applyMemory } from "./engine/apply";
import { decideNextAction } from "./engine/decide";
import { learnFromHumanFeedback } from "./engine/learn";
import { detectDuplicate } from "./engine/duplicate";

import { Invoice } from "./types/invoice";
import { HumanCorrection } from "./types/humanCorrection";

// Track invoices processed in this run (for duplicate detection)
const processedInvoices: Invoice[] = [];

/**
 * Process a single invoice (NO learning here)
 */
async function processInvoice(invoice: Invoice) {
  const auditTrail: any[] = [];

  //  Recall
  const recallResult = await recallMemory(invoice.vendor);
  auditTrail.push(recallResult.auditStep);

  //  Duplicate detection
  const duplicateCheck = detectDuplicate(invoice, processedInvoices);
  auditTrail.push(duplicateCheck.auditStep);

  if (duplicateCheck.isDuplicate) {
    return {
      normalizedInvoice: invoice,
      proposedCorrections: [],
      requiresHumanReview: true,
      reasoning:
        "Duplicate invoice detected; skipped corrections and learning.",
      confidenceScore: 0,
      memoryUpdates: [],
      auditTrail
    };
  }

  //  Apply memory
  const applyResult = applyMemory(invoice, recallResult.memories);
  auditTrail.push(...applyResult.auditSteps);

  //  Decide
  const decision = decideNextAction(
    applyResult.appliedConfidence,
    applyResult.proposedCorrections
  );
  auditTrail.push(decision.auditStep);

  // Mark invoice as processed 
  processedInvoices.push(invoice);

  return {
    normalizedInvoice: applyResult.updatedInvoice,
    proposedCorrections: applyResult.proposedCorrections,
    requiresHumanReview: decision.requiresHumanReview,
    reasoning: decision.reasoning,
    confidenceScore: decision.decisionConfidence,
    memoryUpdates: [],
    auditTrail
  };
}


  //Demo runner – shows learning over time correctly
 
async function runDemo() {
  await initDB();

  
  // Invoice 1 (cold start)
 
  const invoice1: Invoice = {
    invoiceId: "INV-A-001",
    vendor: "Supplier GmbH",
    fields: {
      invoiceNumber: "INV-2024-001",
      serviceDate: null,
      lineItems: []
    },
    confidence: 0.78,
    rawText: "Leistungsdatum: 01.01.2024"
  };

  console.log("\n Processing INV-A-001 (cold start)");
  const result1 = await processInvoice(invoice1);
  console.log(JSON.stringify(result1, null, 2));

  
  // Human feedback for Invoice 1
  
  const feedback1: HumanCorrection = {
    invoiceId: "INV-A-001",
    vendor: "Supplier GmbH",
    corrections: [
      {
        field: "serviceDate",
        from: null,
        to: "2024-01-01",
        reason: "Leistungsdatum found in rawText"
      }
    ],
    finalDecision: "approved"
  };

  console.log("\n Learning from human feedback (INV-A-001)");
  const learnResult = await learnFromHumanFeedback(feedback1);
  console.log(learnResult.memoryUpdates);

 
  // Invoice 2 (after learning)
  
  const invoice2: Invoice = {
    invoiceId: "INV-A-002",
    vendor: "Supplier GmbH",
    fields: {
      invoiceNumber: "INV-2024-002",
      serviceDate: null,
      lineItems: []
    },
    confidence: 0.82,
    rawText: "Leistungsdatum: 15.01.2024"
  };

  console.log("\n Processing INV-A-002 (after learning)");
  const result2 = await processInvoice(invoice2);
  console.log(JSON.stringify(result2, null, 2));
}

runDemo().catch((err) => {
  console.error(" Error during demo run:", err);
});
