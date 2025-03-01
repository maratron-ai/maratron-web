// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id as string },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: error instanceof Error ? error.message : "Error fetching user" });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: id as string },
        data: req.body,
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: error instanceof Error ? error.message : "Error updating user" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.user.delete({
        where: { id: id as string },
      });
      return res.status(200).json({ message: "User deleted" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: error instanceof Error ? error.message : "Error deleting user" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
