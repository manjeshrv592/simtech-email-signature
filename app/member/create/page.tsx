import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createMember } from "@/app/members/actions";
import SignatureEnabledField from "@/components/members/SignatureEnabledField";

export default function CreateMemberPage() {
  const submitCreate = async (fd: FormData) => {
    "use server";
    await createMember(fd);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Create Member</h1>
        <Link href="/members" className="text-sm text-muted-foreground">Back to Members</Link>
      </div>

      <form action={submitCreate} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" required />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" name="phoneNumber" required />
        </div>
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" name="designation" required />
        </div>
        <SignatureEnabledField defaultChecked={true} />

        <div className="md:col-span-3">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}