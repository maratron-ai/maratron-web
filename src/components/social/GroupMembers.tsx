"use client";
import Image from "next/image";
import type { SocialProfile } from "@maratypes/social";
import { Card } from "@components/ui";

interface Props {
  members: SocialProfile[];
}

export default function GroupMembers({ members }: Props) {
  if (members.length === 0) return null;
  const visible = members.slice(0, 5);
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Members</h2>
      <div className="flex items-center gap-2">
        {visible.map((m) => (
          <Card key={m.id} className="p-1 rounded-full">
            <Image
              src={m.user?.avatarUrl || m.profilePhoto || m.avatarUrl || "/default_profile.png"}
              alt={m.username}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          </Card>
        ))}
        {members.length > 5 && <span className="text-xl">...</span>}
      </div>
    </div>
  );
}
