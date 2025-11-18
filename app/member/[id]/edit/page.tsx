import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignatureEnabledField from "@/components/members/SignatureEnabledField";
import { connectMongo } from "@/lib/mongoose";
import { Member } from "@/models/member";
import { updateMember } from "@/app/members/actions";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectMongo();
  const doc = await Member.findById(id).lean();
  if (!doc) {
    return (
      <div className="space-y-6">
        <div className="text-red-600">Member not found</div>
        <Link href="/members" className="text-sm text-muted-foreground">
          Back to Members
        </Link>
      </div>
    );
  }

  const submitUpdate = async (fd: FormData) => {
    "use server";
    await updateMember(fd);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Member</h1>
        <Link href="/members" className="text-sm text-muted-foreground">
          Back to Members
        </Link>
      </div>

      <form action={submitUpdate} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <input type="hidden" name="id" defaultValue={String(doc._id)} />
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" required defaultValue={doc.firstName} />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" required defaultValue={doc.lastName} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required defaultValue={doc.email} />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" name="phoneNumber" required defaultValue={doc.phoneNumber} />
        </div>
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" name="designation" required defaultValue={doc.designation} />
        </div>
        <SignatureEnabledField defaultChecked={!!doc.signatureEnabled} />

        <div className="md:col-span-3">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}