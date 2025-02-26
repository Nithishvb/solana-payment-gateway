import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const inputMint = url.searchParams.get("inputMint");
    const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const amount = url.searchParams.get("amount");

    const response = await fetch(
      `https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`
    );
    const data = await response.json();

    if (data) {
      const inputAmount = Number(data.inAmount) / LAMPORTS_PER_SOL;
      const outputAmount = (parseInt(data.outAmount) / (10 ** 6));
      const slippage = data.slippageBps / 100;
      const priceImpact = (Number(data.priceImpactPct) * 100).toFixed(2);

      const networkFee: number =
        data.routePlan.reduce(
          (
            acc: number,
            step: {
              swapInfo: {
                feeAmount: number;
              };
            }
          ) => {
            return acc + Number(step.swapInfo.feeAmount);
          },
          0
        ) / 1_000_000_000;

      return NextResponse.json(
        {
          inputAmount,
          outputAmount,
          slippage,
          priceImpact,
          networkFee,
          inputToken: "SOL",
          outputToken: "USDC"
        },
        {
          status: 200,
        }
      );
    }
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
