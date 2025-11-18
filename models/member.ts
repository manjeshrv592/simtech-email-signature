import mongoose, { Schema, Model, Document } from "mongoose";

export interface MemberDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  signatureEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<MemberDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    signatureEnabled: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

export const Member: Model<MemberDocument> =
  mongoose.models.Member || mongoose.model<MemberDocument>("Member", MemberSchema);