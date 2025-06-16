"use client";
import Image from "next/image";
import Link from "next/link";
import type { SocialProfile } from "@maratypes/social";
import { Card } from "@components/ui";

interface Props {
  members: SocialProfile[];
}

export default function GroupMembers({ members }: Props) {
  if (members.length === 0) return null;
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Members</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {members.map((m) => (
          <Card key={m.id} className="p-3 flex items-center gap-3">
            <Image
              src={m.avatarUrl || "/default_profile.png"}
              alt={m.username}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <Link href={`/u/${m.username}`} className="font-semibold hover:underline">
              {m.name ?? m.username}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
