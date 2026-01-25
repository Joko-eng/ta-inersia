import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <div className="allign-center mt-4">
        <Link href="/tracking">
          <Button>Tracking Proyek</Button>
        </Link>
      </div>
    </div>
  );
}
