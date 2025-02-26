import { NextResponse } from "next/server";
import {
  Connection,
  // Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { createJupiterApiClient } from "@jup-ag/api";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token";

const connection = new Connection('https://api.testnet.solana.com', 'confirmed');
// const feePayer = Keypair.generate();

export async function POST(req: Request) {
  try {
    const { userPublicKey, inputMint, outputMint, inAmount, merchantAddress } =
      await req.json();

    const buyer = new PublicKey(userPublicKey);
    const merchant = new PublicKey(merchantAddress);
    const inputMintKey = new PublicKey(inputMint);
    const outputMintKey = new PublicKey(outputMint);

    const jupiterQuoteApi = createJupiterApiClient();

    const quoteResponse = await jupiterQuoteApi.quoteGet({
      inputMint: inputMintKey.toBase58(),
      outputMint: outputMintKey.toBase58(),
      amount: inAmount.toString(),
      swapMode: "ExactIn",
    });

    if (!quoteResponse || !quoteResponse.routePlan.length) {
      return NextResponse.json(
        {
          error: "No swap route found",
        },
        { status: 500 }
      );
    }

    const buyerTokenAccount = await getAssociatedTokenAddress(
      inputMintKey,
      buyer
    );
    const merchantTokenAccount = await getAssociatedTokenAddress(
      inputMintKey,
      merchant
    );

    const transferInstruction = createTransferInstruction(
      buyerTokenAccount,
      merchantTokenAccount,
      buyer,
      inAmount
    );

    const { setupInstructions } = await jupiterQuoteApi.swapInstructionsPost({
      swapRequest: {
        userPublicKey: userPublicKey,
        quoteResponse: quoteResponse,
      },
    });

    const transactionInstructions: TransactionInstruction[] =
      setupInstructions.map((instruction) => {
        return new TransactionInstruction({
          keys: instruction.accounts.map((account) => {
            return {
              pubkey: new PublicKey(account.pubkey),
              isSigner: account.isSigner,
              isWritable: account.isWritable,
            };
          }),
          programId: new PublicKey(instruction.programId),
          data: Buffer.from(instruction.data, "utf-8"),
        });
      });

    const transaction = new Transaction().add(
      transferInstruction,
      ...transactionInstructions
    );

    const recentBlockhash = await getRecentBlockhash(connection);

    transaction.recentBlockhash = recentBlockhash;
    transaction.feePayer = buyer;

    const serializedTransaction = transaction
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString("base64");

    return NextResponse.json(
      {
        transaction: serializedTransaction,
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


async function getRecentBlockhash(connection: Connection) {
  const blockhashInfo = await connection.getRecentBlockhash();
  return blockhashInfo.blockhash;
}