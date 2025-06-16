import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(req: NextRequest) {
  const profileId = req.nextUrl.searchParams.get("profileId");
  try {
    const groups = await prisma.runGroup.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" },
    });
    let memberships: Set<string> | null = null;
    if (profileId) {
      const memberRows = await prisma.runGroupMember.findMany({
        where: { socialProfileId: profileId },
        select: { groupId: true },
      });
      memberships = new Set(memberRows.map((m) => m.groupId));
    }
    const mapped = groups.map((g) => ({
      ...g,
      memberCount: g._count.members,
      isMember: memberships ? memberships.has(g.id) : undefined,
    }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Error listing groups", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.name || !data.ownerId) {
    return NextResponse.json(
      { error: "name and ownerId required" },
      { status: 400 }
    );
  }
  try {
    const group = await prisma.runGroup.create({ data });
    return NextResponse.json(group, { status: 201 });
  } catch (err) {
    console.error("Error creating group", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
