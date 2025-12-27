import { dbPromise } from "../db/sqlite";
import { Memory } from "../types/memory";

export async function getMemoriesForVendor(
  vendor: string
): Promise<Memory[]> {
  const db = await dbPromise;

  const rows = await db.all<Memory[]>(
    `SELECT * FROM memory WHERE vendor = ?`,
    vendor
  );

  return rows;
}


export async function createMemory(memory: Memory): Promise<void> {
  const db = await dbPromise;

  await db.run(
    `
    INSERT INTO memory (
      id,
      vendor,
      type,
      rule,
      confidence,
      usageCount,
      lastUsed
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    memory.id,
    memory.vendor,
    memory.type,
    memory.rule,
    memory.confidence,
    memory.usageCount,
    memory.lastUsed
  );
}


export async function updateMemory(
  memoryId: string,
  confidenceChange: number
): Promise<void> {
  const db = await dbPromise;

  await db.run(
    `
    UPDATE memory
    SET
      confidence = MIN(MAX(confidence + ?, 0), 1),
      usageCount = usageCount + 1,
      lastUsed = ?
    WHERE id = ?
    `,
    confidenceChange,
    new Date().toISOString(),
    memoryId
  );
}
