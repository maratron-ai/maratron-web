import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  const { profileId } = await req.json();
  if (!profileId) {
    return NextResponse.json({ error: "profileId required" }, { status: 400 });
  }
  try {
    await prisma.runGroupMember.upsert({
      where: { groupId_socialProfileId: { groupId: id, socialProfileId: profileId } },
      update: {},
      create: { groupId: id, socialProfileId: profileId },
    });
    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    console.error("Error joining group", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  const { id } = ctx.params;
  const { profileId } = await req.json();
  if (!profileId) {
    return NextResponse.json({ error: "profileId required" }, { status: 400 });
  }
  try {
    await prisma.runGroupMember.delete({
      where: { groupId_socialProfileId: { groupId: id, socialProfileId: profileId } },
    });
    return NextResponse.json({});
  } catch (err) {
    console.error("Error leaving group", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
