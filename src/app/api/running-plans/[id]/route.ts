import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { params } = await context
    const { id } = params
    const plan = await prisma.runningPlan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error fetching plan" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { params } = await context
    const { id } = params
    const updated = await prisma.runningPlan.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error updating plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { params } = await context
    const { id } = params
    await prisma.runningPlan.delete({ where: { id } });
    return NextResponse.json({ message: "Plan deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error deleting plan" },
      { status: 500 }
    );
  }
}
