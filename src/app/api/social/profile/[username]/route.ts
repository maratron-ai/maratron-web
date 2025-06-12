import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(_req: NextRequest, ctx: { params: { username: string } }) {
  const { username } = ctx.params;
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { username },
      include: {
        user: {
          select: {
            name: true,
            _count: { select: { runs: true } },
          },
        },
        _count: { select: { followers: true, following: true } },
      },
    });
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      bio: profile.bio,
      profilePhoto: profile.profilePhoto,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      name: profile.user.name,
      runCount: profile.user._count.runs,
      followerCount: profile._count.followers,
      followingCount: profile._count.following,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error getting profile", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
