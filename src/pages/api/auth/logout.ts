// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Here you would normally clear cookies, session tokens, etc.
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Server error",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
