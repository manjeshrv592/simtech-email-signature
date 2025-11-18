"use server";

import { connectMongo } from "@/lib/mongoose";
import { Member } from "@/models/member";
import { redirect } from "next/navigation";

export async function createMember(formData: FormData): Promise<void> {
  await connectMongo();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  const signatureEnabled =
    String(formData.get("signatureEnabled") ?? "true").toLowerCase() === "true";

  if (!firstName || !lastName || !email || !phoneNumber || !designation) {
    redirect("/members?error=All%20fields%20are%20required");
  }
  try {
    await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      designation,
      signatureEnabled,
    });
  } catch {
    redirect("/members?error=Failed%20to%20create%20member");
  }
  redirect("/members?success=Member%20created");
}

export async function listMembers(page = 1, pageSize = 10) {
  await connectMongo();
  const total = await Member.countDocuments();
  const docs = await Member.find()
    .sort({ createdAt: -1 })
    .skip(Math.max(0, (page - 1) * pageSize))
    .limit(pageSize)
    .lean();
  const members = docs.map((d) => ({
    _id: String(d._id),
    firstName: d.firstName,
    lastName: d.lastName,
    email: d.email,
    phoneNumber: d.phoneNumber,
    designation: d.designation,
    signatureEnabled: d.signatureEnabled,
  }));
  return { members, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function updateMember(formData: FormData): Promise<void> {
  await connectMongo();
  const id = String(formData.get("id") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  const signatureEnabled =
    String(formData.get("signatureEnabled") ?? "true").toLowerCase() === "true";

  if (!id || !firstName || !lastName || !email || !phoneNumber || !designation) {
    redirect(`/member/${id}/edit?error=All%20fields%20are%20required`);
  }
  try {
    await Member.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      phoneNumber,
      designation,
      signatureEnabled,
    });
  } catch {
    redirect(`/member/${id}/edit?error=Failed%20to%20update%20member`);
  }
  redirect("/members?success=Member%20updated");
}

export async function deleteMember(formData: FormData): Promise<void> {
  await connectMongo();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/members?error=id%20required");
  try {
    await Member.findByIdAndDelete(id);
  } catch {
    redirect("/members?error=Failed%20to%20delete%20member");
  }
  redirect("/members?success=Member%20deleted");
}