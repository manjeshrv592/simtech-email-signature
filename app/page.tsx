import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="text-lg">Add members</div>
      <Link href="/members">
        <Button>Go to Members</Button>
      </Link>
    </div>
  );
}
