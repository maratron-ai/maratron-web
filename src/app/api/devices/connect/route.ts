import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, token, userId } = body;
    if (!provider || !token || !userId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await prisma.deviceConnection.create({
      data: { provider, token, userId },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error connecting device", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error connecting device" },
      { status: 500 }
    );
  }
}
