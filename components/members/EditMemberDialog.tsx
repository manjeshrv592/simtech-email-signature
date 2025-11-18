"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SignatureEnabledField from "@/components/members/SignatureEnabledField";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Member = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  signatureEnabled: boolean;
};

export default function EditMemberDialog({
  member,
  onSubmit,
}: {
  member: Member;
  onSubmit: (formData: FormData) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <form
          action={onSubmit}
          onSubmit={() => setOpen(false)}
          className="grid grid-cols-1 gap-4"
        >
          <input type="hidden" name="id" defaultValue={member._id} />
          <div>
            <Label htmlFor="firstName-edit">First Name</Label>
            <Input id="firstName-edit" name="firstName" required defaultValue={member.firstName} />
          </div>
          <div>
            <Label htmlFor="lastName-edit">Last Name</Label>
            <Input id="lastName-edit" name="lastName" required defaultValue={member.lastName} />
          </div>
          <div>
            <Label htmlFor="email-edit">Email</Label>
            <Input id="email-edit" name="email" type="email" required defaultValue={member.email} />
          </div>
          <div>
            <Label htmlFor="phoneNumber-edit">Phone Number</Label>
            <Input id="phoneNumber-edit" name="phoneNumber" required defaultValue={member.phoneNumber} />
          </div>
          <div>
            <Label htmlFor="designation-edit">Designation</Label>
            <Input id="designation-edit" name="designation" required defaultValue={member.designation} />
          </div>
          <SignatureEnabledField defaultChecked={member.signatureEnabled} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}