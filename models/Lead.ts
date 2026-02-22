import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILead extends Document {
  nama: string;
  rating: number;
  jumlahUlasan: number;
  noTelp: string;
  alamat: string;
  status: "Prospek" | "Belum Prospek" | "Belum Diproses";
  keyword: string;
  lokasi: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    nama: { type: String, required: true },
    rating: { type: Number, default: 0 },
    jumlahUlasan: { type: Number, default: 0 },
    noTelp: { type: String, default: "" },
    alamat: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Prospek", "Belum Prospek", "Belum Diproses"],
      default: "Belum Diproses",
    },
    keyword: { type: String, default: "" },
    lokasi: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hindari re-compile model saat hot reload Next.js
const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;