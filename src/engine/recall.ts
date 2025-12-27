import { getMemoriesForVendor } from "../memory/memoryStore";
import { Memory } from "../types/memory";
import { AuditStep } from "../types/decisionResult";


 // Recall relevant memory for a given invoice.
 
 
export async function recallMemory(
  vendor: string
): Promise<{
  memories: Memory[];
  auditStep: AuditStep;
}> {
  //  Fetch all memories learned for this vendor
  const allMemories = await getMemoriesForVendor(vendor);

  // Ignores memories that are too weak to be useful
  const usableMemories = allMemories.filter(
    (memory) => memory.confidence >= 0.4
  );

  // sort by confidence descending
  usableMemories.sort((a, b) => b.confidence - a.confidence);

 // Create audit log entry
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
