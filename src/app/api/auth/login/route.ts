// app/api/auth/login/route.ts


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
// import bcrypt from "bcrypt"; // Uncomment if/when you hash passwords

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Look up the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // In a production app, compare the provided password with the stored hashed password:
    // const passwordValid = await bcrypt.compare(password, user.password);
    // if (!passwordValid) {
    //   return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    // }

    // For now, assume the provided password is valid.
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
