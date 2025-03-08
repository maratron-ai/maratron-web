// /api/users/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Error fetching users" });
    }
  } else if (req.method === "POST") {
    try {
      console.log("Request body:", req.body);
      const { email } = req.body;

      // Check if email is provided
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if a user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "A user with this email already exists." });
      }

      // Create the new user
      const newUser = await prisma.user.create({
        data: req.body,
      });
      return res.status(201).json(newUser);
    } catch (error: unknown) {
      // Handle known Prisma errors (e.g., unique constraint violation)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res
          .status(409)
          .json({ error: "A user with this email already exists." });
      }
      console.error("Error creating user:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error creating user",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
