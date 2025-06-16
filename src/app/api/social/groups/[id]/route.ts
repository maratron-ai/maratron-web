import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  const profileId = req.nextUrl.searchParams.get("profileId");
  try {
    const group = await prisma.runGroup.findUnique({
      where: { id },
      include: { owner: true, _count: { select: { members: true } } },
    });
    if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });
    let isMember = false;
    if (profileId) {
      const m = await prisma.runGroupMember.findUnique({
        where: { groupId_socialProfileId: { groupId: id, socialProfileId: profileId } },
      });
      isMember = !!m;
    }
    const data = { ...group, memberCount: group._count.members, isMember };
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error getting group", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
