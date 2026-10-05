import mongoose, { Schema, Document, Model } from "mongoose";

// Experiment 6: Inventory & Schema Mutation Audit Log Model
export interface IInventoryLog extends Document {
  eventType: "SCHEMA_VALIDATION" | "HOOK_TRIGGERED" | "DOCUMENT_SAVED" | "STOCK_MUTATION" | "VIRTUAL_RESOLVED";
  targetId: string;
  sku: string;
  message: string;
  details: Record<string, any>;
  timestamp: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    eventType: {
      type: String,
      required: true,
      enum: ["SCHEMA_VALIDATION", "HOOK_TRIGGERED", "DOCUMENT_SAVED", "STOCK_MUTATION", "VIRTUAL_RESOLVED"],
      default: "DOCUMENT_SAVED",
    },
    targetId: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      default: "N/A",
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const InventoryLog: Model<IInventoryLog> =
  mongoose.models.InventoryLog || mongoose.model<IInventoryLog>("InventoryLog", InventoryLogSchema);

export default InventoryLog;
