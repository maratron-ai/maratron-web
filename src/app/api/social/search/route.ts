import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q) return NextResponse.json([]);
  const tokens = q.split(/\s+/).filter(Boolean);
  try {
    const profiles = await prisma.socialProfile.findMany({
      where: {
        AND: tokens.map((t) => ({
          OR: [
            { username: { contains: t, mode: "insensitive" } },
            { user: { name: { contains: t, mode: "insensitive" } } },
          ],
        })),
      },
      include: {
        user: { select: { name: true, avatarUrl: true, _count: { select: { runs: true } } } },
        _count: { select: { followers: true, following: true, posts: true } },
      },
      take: 10,
    });

    const results = await Promise.all(
      profiles.map(async (p) => {
        const total = await prisma.run.aggregate({
          where: { userId: p.userId },
          _sum: { distance: true },
        });
        return {
          id: p.id,
          userId: p.userId,
          username: p.username,
          bio: p.bio,
          profilePhoto: p.profilePhoto,
          avatarUrl: p.user.avatarUrl,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          name: p.user.name,
          runCount: p.user._count.runs,
          totalDistance: total._sum.distance ?? 0,
          followerCount: p._count.followers,
          followingCount: p._count.following,
          postCount: p._count.posts,
        };
      })
    );

    return NextResponse.json(results);
  } catch (err) {
    console.error("Error searching profiles", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
