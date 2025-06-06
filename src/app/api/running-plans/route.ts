import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.runningPlan.findMany();
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error fetching plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, weeks, planData, name } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const derivedWeeks =
      weeks ?? planData?.weeks ?? planData?.schedule?.length ?? null;

    if (derivedWeeks === null || Number.isNaN(Number(derivedWeeks))) {
      return NextResponse.json({ error: "Weeks is required" }, { status: 400 });
    }

    const count = await prisma.runningPlan.count({ where: { userId } });
    const defaultName = `Training Plan ${count + 1}`;

    const newPlan = await prisma.runningPlan.create({
      data: {
        user: { connect: { id: userId } },
        weeks: Number(derivedWeeks),
        planData,
        name: name || defaultName,
      },
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating running plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error creating plan" },
      { status: 500 }
    );
  }
}
