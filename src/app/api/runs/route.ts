// src/app/api/runs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { calculateVO2MaxJackDaniels } from "@utils/running/jackDaniels";
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

    // Estimate VO2 max from this run and update user only if it's higher
    try {
      const meters =
        distanceUnit === "miles" ? Number(distance) * 1609.34 : Number(distance) * 1000;
      const seconds = parseDuration(duration);
      const vo2 = Math.round(calculateVO2MaxJackDaniels(meters, seconds));
      const user = await prisma.runnerProfile.findUnique({
        where: { id: userId },
        select: { VO2Max: true },
      });
      if (user && (user.VO2Max === null || vo2 > user.VO2Max)) {
        await prisma.runnerProfile.update({ where: { id: userId }, data: { VO2Max: vo2 } });
      }
    } catch (err) {
      console.error("Failed to update VO2Max", err);
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
