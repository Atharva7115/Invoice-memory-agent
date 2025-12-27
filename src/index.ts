import { initDB } from "./db/sqlite";
import {
  getMemoriesForVendor,
  createMemory,
  updateMemory
} from "./memory/memoryStore";
import { Memory } from "./types/memory";

async function testMemoryStore() {
  console.log(" Initializing database...");
  await initDB();
  console.log("Database ready");

  const vendor = "Supplier GmbH";

  // 1️ Create a sample memory (based on sample data)
  const sampleMemory: Memory = {
    id: "supplier-service-date",
    vendor,
    type: "vendor-pattern",
    rule: "Leistungsdatum maps to serviceDate",
    confidence: 0.6,
    usageCount: 1,
    lastUsed: new Date().toISOString()
  };

  console.log(" Creating memory...");
  await createMemory(sampleMemory);
  console.log(" Memory created");

  // 2️ Read memories for vendor
  console.log(" Fetching memories for vendor:", vendor);
  const memories = await getMemoriesForVendor(vendor);
  console.log(" Memories found:", memories);

  // 3️ Update memory confidence (simulate human approval)
  console.log(" Updating memory confidence...");
  await updateMemory(sampleMemory.id, 0.1);
  console.log(" Memory updated");

  // 4️ Read again to verify update
  const updatedMemories = await getMemoriesForVendor(vendor);
  console.log(" Updated memories:", updatedMemories);
}

testMemoryStore().catch((err) => {
  console.error(" Error testing memory store:", err);
});
