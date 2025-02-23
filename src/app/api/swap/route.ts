import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      userPublicKey,
      inputMint,
      outputMint,
      inAmount,
      destinationTokenAccount,
    } = await req.json();

    const response = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPublicKey,
        wrapAndUnwrapSol: false,
        inputMint,
        outputMint,
        inAmount,
        slippageBps: 50,
        destinationTokenAccount,
      }),
    });

    const data = await response.json();
    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
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
