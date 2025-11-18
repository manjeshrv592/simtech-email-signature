import mongoose, { Mongoose } from "mongoose";

type Cached = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongoose: Cached | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

export async function connectMongo(): Promise<Mongoose> {
  if (cached && cached.conn) return cached.conn;
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.length === 0) throw new Error("MONGODB_URI is not defined");
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(uri);
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}