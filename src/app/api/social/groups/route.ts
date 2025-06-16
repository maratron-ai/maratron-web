import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET() {
  try {
    const groups = await prisma.runGroup.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" },
    });
    const mapped = groups.map((g) => ({
      ...g,
      memberCount: g._count.members,
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
