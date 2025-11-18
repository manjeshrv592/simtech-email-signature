import { listMembers, deleteMember } from "./actions";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StatusToaster from "@/components/common/StatusToaster";
import { EditIcon, Trash2 } from "lucide-react";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const pageSize = Number(sp.pageSize ?? 10);
  const { members, totalPages } = await listMembers(page, pageSize);
  const success = sp.success;
  const error = sp.error;

  type MemberItem = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    designation: string;
    signatureEnabled: boolean;
  };

  // No inline edit; updates handled on dedicated edit page

  const submitDelete = async (fd: FormData) => {
    "use server";
    await deleteMember(fd);
  };

  return (
    <div className="space-y-6 p-6">
      <StatusToaster success={success} error={error} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Company Members</h1>
        <Link href="/member/create">
          <Button>Create Member</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Signature</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m: MemberItem) => (
            <TableRow key={m._id}>
              <TableCell>{m.firstName}</TableCell>
              <TableCell>{m.lastName}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.phoneNumber}</TableCell>
              <TableCell>{m.designation}</TableCell>
              <TableCell>{m.signatureEnabled ? "Yes" : "No"}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/member/${m._id}/edit`}>
                  <Button variant="outline">
                    <EditIcon />
                  </Button>
                </Link>
                <form action={submitDelete} className="inline">
                  <input type="hidden" name="id" value={String(m._id)} />
                  <Button type="submit" variant="destructive">
                    <Trash2 />
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {members.length > 0 && totalPages > 1 && (
        <Pagination className="justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  page > 1
                    ? `/members?page=${page - 1}&pageSize=${pageSize}`
                    : undefined
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`/members?page=${i + 1}&pageSize=${pageSize}`}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={
                  page < totalPages
                    ? `/members?page=${page + 1}&pageSize=${pageSize}`
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
