// pages/api/runs/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
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
        userId, // use userId as sent from the client
      } = req.body;

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
          // Connect this run with the user using the provided userId
          user: { connect: { id: userId } },
        },
      });

      return res.status(201).json(newRun);
    } catch (error) {
      console.error("Error creating run:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error creating run",
      });
    }
  } else if (req.method === "GET") {
    try {
      const runs = await prisma.run.findMany();
      return res.status(200).json(runs);
    } catch (error) {
      console.error("Error fetching runs:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error fetching runs",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
