import { connectMongo } from "@/lib/mongoose";
import { Member } from "@/models/member";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  await connectMongo();
  const count = await Member.countDocuments();
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <Card className="p-6">
        <div className="text-sm text-muted-foreground">Total Members</div>
        <div className="text-3xl font-bold">{count}</div>
      </Card>
    </div>
  );
}