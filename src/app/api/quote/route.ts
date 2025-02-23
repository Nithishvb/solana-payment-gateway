import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const inputMint = url.searchParams.get("inputMint");
    const outputMint = url.searchParams.get("outputMint");
    const amount = url.searchParams.get("amount");

    const response = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`
    );
    const data = await response.json();

    return NextResponse.json(
      {
        data,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "error",
        error: (err as Error).message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
