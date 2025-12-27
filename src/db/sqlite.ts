import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";

export async function initDB() {
  const db = await sqlite.open({
    filename: "memory.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS memory (
      id TEXT PRIMARY KEY,
      vendor TEXT NOT NULL,
      type TEXT NOT NULL,
      rule TEXT NOT NULL,
      confidence REAL NOT NULL,
      usageCount INTEGER NOT NULL,
      lastUsed TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceId TEXT NOT NULL,
      step TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);

  return db;
}
