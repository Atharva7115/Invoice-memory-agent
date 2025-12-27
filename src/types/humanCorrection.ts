export interface FieldCorrection {
  field: string;
  from: any;
  to: any;
  reason: string;
}

export interface HumanCorrection {
  invoiceId: string;
  vendor: string;
  corrections: FieldCorrection[];
  finalDecision: "approved" | "rejected";
}
