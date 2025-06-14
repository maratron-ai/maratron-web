// src/app/api/runs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { calculateVDOTJackDaniels } from "@utils/running/jackDaniels";
import { parseDuration } from "@utils/time";

export async function GET() {
  // used to have request: NextRequest as a param
  try {
    const runs = await prisma.run.findMany();
    return NextResponse.json(runs, { status: 200 });
  } catch (error) {
    console.error("Error fetching runs:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error fetching runs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
  const {
      date,
      duration,
      distance,
      distanceUnit,
      trainingEnvironment,
      pace, // expected format: { pace: string, unit: "miles" | "kilometers" } or null
      elevationGain,
      elevationGainUnit,
      notes,
      userId,
      shoeId,
      name,
  } = body;

    const newRun = await prisma.run.create({
      data: {
        date: new Date(date),
        duration,
        distance: Number(distance),
        distanceUnit,
        trainingEnvironment: trainingEnvironment || null,
        name: name || `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${trainingEnvironment ? ` - ${trainingEnvironment}` : ''}`,
        pace: pace ? pace.pace : null,
        paceUnit: pace ? pace.unit : null,
        elevationGain: elevationGain ? Number(elevationGain) : null,
        elevationGainUnit:
          elevationGainUnit && elevationGainUnit.trim() !== ""
            ? elevationGainUnit
            : null,
        notes: notes || null,
        user: { connect: { id: userId } },
        ...(shoeId ? { shoe: { connect: { id: shoeId } } } : {}),
      },
    });

    if (shoeId) {
      const shoe = await prisma.shoe.findUnique({
        where: { id: shoeId },
        select: { distanceUnit: true },
      });
      if (shoe) {
        let increment = Number(distance);
        if (shoe.distanceUnit !== distanceUnit) {
          increment =
            shoe.distanceUnit === "miles"
              ? Number(distance) * 0.621371
              : Number(distance) * 1.60934;
        }
        await prisma.shoe.update({
          where: { id: shoeId },
          data: {
            currentDistance: {
              increment,
            },
          },
        });
      }
    }

    // Estimate VDOT from this run and update user only if it's higher
    try {
      const meters =
        distanceUnit === "miles" ? Number(distance) * 1609.34 : Number(distance) * 1000;
      const seconds = parseDuration(duration);
      const vdot = Math.round(calculateVDOTJackDaniels(meters, seconds));
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { VDOT: true },
      });
      if (user && (user.VDOT === null || vdot > user.VDOT)) {
        await prisma.user.update({ where: { id: userId }, data: { VDOT: vdot } });
      }
    } catch (err) {
      console.error("Failed to update VDOT", err);
    }

    return NextResponse.json(newRun, { status: 201 });
  } catch (error) {
    console.error("Error creating run:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error creating run",
      },
      { status: 500 }
    );
  }
}
