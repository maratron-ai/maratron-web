// app/api/runs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = await context
    const { id } = params
    const run = await prisma.run.findUnique({
      where: { id },
    });
    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }
    return NextResponse.json(run, { status: 200 });
  } catch (error) {
    console.error("Error fetching run:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error fetching run" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { params } = await context
    const { id } = params
    const updatedRun = await prisma.run.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedRun, { status: 200 });
  } catch (error) {
    console.error("Error updating run:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error updating run" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = await context
    const { id } = params
    await prisma.run.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Run deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting run:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error deleting run" },
      { status: 500 }
    );
  }
}

