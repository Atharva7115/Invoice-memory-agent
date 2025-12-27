 Invoice Memory Agent
Purpose

This project implements a memory-based learning layer for invoice processing.
The system learns from human-approved corrections and applies that learning to future invoices from the same vendor.

The focus is on decision logic and learning behavior, not OCR or extraction.

Design & Logic

The system follows a simple pipeline:

Invoice → Recall → Apply → Decide → Learn


Recall: Fetch vendor-specific memory rules

Apply: Check if those rules fit the current invoice

Decide: Auto, suggest, or send for human review based on confidence

Learn: Update memory only after human approval

Each step is isolated and explainable.

Learning Behavior

Memory is created only after human-approved corrections

Repeated approvals increase confidence

Rejections decrease confidence

Low-confidence rules are ignored

Duplicate invoices do not create memory

This prevents unsafe or incorrect learning.

Persistence

Learned memory is stored using SQLite

Memory persists across runs

The database file (memory.db) is ignored from Git

Folder Structure
src/
├── db/
│   └── sqlite.ts        # SQLite setup and schema
├── engine/
│   ├── recall.ts        # Recall vendor memory
│   ├── apply.ts         # Apply memory safely
│   ├── decide.ts        # Decision logic
│   ├── learn.ts         # Learning from human feedback
│   └── duplicate.ts    # Duplicate detection
├── memory/
│   └── memoryStore.ts  # Memory CRUD operations
├── types/
│   ├── invoice.ts
│   ├── memory.ts
│   ├── humanCorrection.ts
│   └── decisionResult.ts
└── index.ts             # End-to-end demo runner

Output

For each invoice, the system returns:

normalized invoice

proposed corrections

human review decision

reasoning

confidence score

audit trail

Tech Stack

TypeScript (strict)

Node.js

SQLite

No external AI or agent frameworks are used.

How to Run
npm install
npm run dev


For a clean demo:

del memory.db
npm run dev

Summary

This project demonstrates how a system can learn from past human decisions and gradually improve automation while remaining safe and explainable.