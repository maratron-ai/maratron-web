// pages/api/runs/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const run = await prisma.run.findUnique({
        where: { id: id as string },
      });
      if (!run) {
        return res.status(404).json({ error: "Run not found" });
      }
      return res.status(200).json(run);
    } catch (error) {
      console.error("Error fetching run:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error fetching run",
      });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedRun = await prisma.run.update({
        where: { id: id as string },
        data: req.body,
      });
      return res.status(200).json(updatedRun);
    } catch (error) {
      console.error("Error updating run:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error updating run",
      });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.run.delete({
        where: { id: id as string },
      });
      return res.status(200).json({ message: "Run deleted" });
    } catch (error) {
      console.error("Error deleting run:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error deleting run",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
