import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Data reciev", data);
    return NextResponse.json(
      {
        transaction: "Data received",
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Data Error received");
    return NextResponse.json(
      {
        message: "error",
        error: (err as Error).message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
