// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@lib/prisma";
// import bcrypt from "bcrypt"; // Uncomment if/ when we hash passwords

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Look up the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // In a production app, compare the provided password with the stored hashed password:
      // const passwordValid = await bcrypt.compare(password, user.password);
      // if (!passwordValid) {
      //   return res.status(401).json({ error: "Invalid email or password" });
      // }

      // For demonstration, we assume the provided password is valid.
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Server error",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
