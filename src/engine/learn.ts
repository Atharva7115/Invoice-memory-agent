import { HumanCorrection } from "../types/humanCorrection";
import { Memory } from "../types/memory";
import {
  createMemory,
  updateMemory,
  getMemoriesForVendor
} from "../memory/memoryStore";
import { AuditStep } from "../types/decisionResult";


 // Learn from human feedback and update memory store.
 
export async function learnFromHumanFeedback(
  feedback: HumanCorrection
): Promise<{
  memoryUpdates: string[];
  auditStep: AuditStep;
}> {
  const memoryUpdates: string[] = [];

  // Fetch existing memories for vendor
  const existingMemories = await getMemoriesForVendor(feedback.vendor);

  for (const correction of feedback.corrections) {
    const ruleDescription = `${correction.field}: ${correction.reason}`;
    const memoryId = `${feedback.vendor}-${correction.field}`;

    const existingMemory = existingMemories.find(
      (m) => m.id === memoryId
    );

    
    // Case 1: Memory already exists
   
    if (existingMemory) {
      const confidenceChange =
        feedback.finalDecision === "approved" ? 0.1 : -0.2;

      await updateMemory(memoryId, confidenceChange);

      memoryUpdates.push(
        `Updated memory '${existingMemory.rule}' with confidence change ${confidenceChange}`
      );
    }
   
    // Case 2: New learning
  
    else if (feedback.finalDecision === "approved") {
      const newMemory: Memory = {
        id: memoryId,
        vendor: feedback.vendor,
        type: "correction-rule",
        rule: ruleDescription,
        confidence: 0.6,
        usageCount: 1,
        lastUsed: new Date().toISOString()
      };

      await createMemory(newMemory);

      memoryUpdates.push(
        `Created new memory rule: ${ruleDescription}`
      );
    }
  }

  const auditStep: AuditStep = {
    step: "learn",
    timestamp: new Date().toISOString(),
    details: `Processed ${memoryUpdates.length} learning updates for vendor ${feedback.vendor}`
  };

  return {
    memoryUpdates,
    auditStep
  };
}
