// src/app/api/runs/route.ts
"use client";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

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
    } = body;

    const newRun = await prisma.run.create({
      data: {
        date: new Date(date),
        duration,
        distance: Number(distance),
        distanceUnit,
        trainingEnvironment: trainingEnvironment || null,
        pace: pace ? pace.pace : null,
        paceUnit: pace ? pace.unit : null,
        elevationGain: elevationGain ? Number(elevationGain) : null,
        elevationGainUnit:
          elevationGainUnit && elevationGainUnit.trim() !== ""
            ? elevationGainUnit
            : null,
        notes: notes || null,
        user: { connect: { id: userId } },
      },
    });

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
