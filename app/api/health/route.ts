import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import mongoose from "mongoose";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.length === 0) {
      return NextResponse.json(
        { status: "error", error: "MONGODB_URI missing" },
        { status: 500 }
      );
    }
    await connectMongo();
    return NextResponse.json({
      status: "ok",
      db: "connected",
      readyState: mongoose.connection.readyState,
    });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}