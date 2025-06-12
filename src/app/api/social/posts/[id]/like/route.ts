import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  const { userProfileId } = await req.json();
  const { id } = ctx.params;
  try {
    const like = await prisma.like.upsert({
      where: { postId_userProfileId: { postId: id, userProfileId } },
      update: {},
      create: { postId: id, userProfileId },
    });
    return NextResponse.json(like, { status: 201 });
  } catch (err) {
    console.error("Error liking", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: { id: string } }) {
  const { userProfileId } = await req.json();
  const { id } = ctx.params;
  try {
    await prisma.like.delete({
      where: { postId_userProfileId: { postId: id, userProfileId } },
    });
    return NextResponse.json({});
  } catch (err) {
    console.error("Error unliking", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
