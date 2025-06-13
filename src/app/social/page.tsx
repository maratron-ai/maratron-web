import Link from "next/link";
import { Card } from "@components/ui";
import { Users, Activity, User } from "lucide-react";

export default function SocialHomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 bg-background text-foreground space-y-10 pt-8 pb-20">
      <h1 className="text-3xl font-bold">Social Hub</h1>
      <div className="h-1 w-24 mb-6 bg-gradient-to-r from-brand-from to-brand-to rounded" />
      <section>
        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/social/feed">
            <Card className="p-4 flex items-center gap-2 hover:bg-accent-3/10">
              <Activity className="w-5 h-5" />
              <span>Your Feed</span>
            </Card>
          </Link>
          <Link href="/social/search">
            <Card className="p-4 flex items-center gap-2 hover:bg-accent-3/10">
              <Users className="w-5 h-5" />
              <span>Find Runners</span>
            </Card>
          </Link>
          <Link href="/social/profile/edit">
            <Card className="p-4 flex items-center gap-2 hover:bg-accent-3/10">
              <User className="w-5 h-5" />
              <span>Your Profile</span>
            </Card>
          </Link>
        </div>
      </section>
      </main>
    </div>
  );
}
