import { getMemoriesForVendor } from "../memory/memoryStore";
import { Memory } from "../types/memory";
import { AuditStep } from "../types/decisionResult";

/**
 * Recall relevant memory for a given invoice.
 * This does NOT apply memory, it only selects candidates.
 */
export async function recallMemory(
  vendor: string
): Promise<{
  memories: Memory[];
  auditStep: AuditStep;
}> {
  // 1️⃣ Fetch all memories learned for this vendor
  const allMemories = await getMemoriesForVendor(vendor);

  // 2️⃣ Ignore memories that are too weak to be useful
  const usableMemories = allMemories.filter(
    (memory) => memory.confidence >= 0.4
  );

  // 3️⃣ Prioritize memories with higher confidence
  usableMemories.sort((a, b) => b.confidence - a.confidence);

  // 4️⃣ Create audit log entry
  const auditStep: AuditStep = {
    step: "recall",
    timestamp: new Date().toISOString(),
    details: `Recalled ${usableMemories.length} memory rules for vendor ${vendor}`
  };

  return {
    memories: usableMemories,
    auditStep
  };
}
