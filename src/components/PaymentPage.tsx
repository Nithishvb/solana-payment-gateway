"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { ISwapPreview } from "@/types/types";
import SwapPreview from "./SwapPreview";
import LoadingSpinner from "./LoadingSpinner";
import { Connection, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const mockMerchant = {
  name: "Digital Store",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdhYtWBgnMqfyhfutTV7abFT6oHhk1T8RInQ&s",
};

const mockTokens = [
  { symbol: "BONK", name: "Bonk", balance: "1000000" },
  { symbol: "SOL", name: "Solana", balance: "1.5" },
  { symbol: "USDC", name: "USD Coin", balance: "100" },
];

const SOLANA_RPC = "https://api.testnet.solana.com";
const connection = new Connection(SOLANA_RPC, "confirmed");

const PaymentPage = () => {
  const [amount, setAmount] = useState<number>();
  const [selectedToken, setSelectedToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<ISwapPreview>();
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);

  // const router = useRouter();
  const { wallet } = useWallet();

  useDebouncedEffect(
    () => {
      if (amount && selectedToken) {
        setIsPriceLoading(true);
        fetchQuote(amount * LAMPORTS_PER_SOL);
      }
    },
    500,
    [amount, selectedToken]
  );

  const fetchQuote = async (amount: number) => {
    try {
      const inputMint = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
      const response = await fetch(
        `/api/quote?inputMint=${inputMint}&&amount=${amount}`
      );
      const data = await response.json();
      setQuoteData(data);
      setIsPriceLoading(false);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/swap', {
        method: "POST",
        body: JSON.stringify({
          userPublicKey: "",
          inputMint: "", 
          outputMint: "", 
          inAmount: ((amount || 0) * LAMPORTS_PER_SOL), 
          merchantAddress: ""
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { transaction } = await response.json();
      const recoveredTransaction = Transaction.from(Buffer.from(transaction, "base64"));

      // const feePayerKeypair = Keypair.fromSecretKey(Buffer.from(feePayer, "base64"));

      if(wallet){
        const signature = await wallet.adapter.sendTransaction(recoveredTransaction, connection);
        await connection.confirmTransaction(signature);
        // const signature = await sendAndConfirmTransaction(connection , recoveredTransaction, [wallet], {
        //   commitment: "confirmed"
        // });
        console.log("Transaction sent:", signature);
      }
      
      // const txDetails = {
      //   paidAmount: "20",
      //   paidToken: "SOL",
      //   receivedAmount: "19",
      //   merchantName: "john",
      //   txHash: "dnbfn f",
      // };
      // localStorage.setItem("txDetails", JSON.stringify(txDetails));
      // router.push("/success");
    } catch (error) {
      console.log((error as Error).message);
      toast.error("Payment failed. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <div className="merchant-card mb-8">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <Image
                  src={mockMerchant.logo}
                  alt={mockMerchant.name}
                  height={200}
                  width={200}
                  className="h-12 w-12 object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {mockMerchant.name}
                </h1>
                <p className="text-white/60">Payment Details</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="payment-card space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Select Token</label>
                <Select onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className="bg-white/5 border-white/10 text-white focus:outline-none rounded-md"
                />
              </div>
            </div>
            {
              isPriceLoading && (
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>
              )
            }
            {quoteData && !isPriceLoading && <SwapPreview quoteData={quoteData} />}
            <Button
              onClick={handlePayment}
              disabled={isLoading || !amount || !selectedToken}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};
export default PaymentPage;
