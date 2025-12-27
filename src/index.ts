import { initDB } from "./db/sqlite";
initDB().then(() => {
  console.log("Database initialized");
}).catch((err) => {
  console.error("Failed to initialize database:", err);
});