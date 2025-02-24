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
import { useRouter } from "next/navigation";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { ISwapPreview } from "@/types/types";
import SwapPreview from "./SwapPreview";
import LoadingSpinner from "./LoadingSpinner";

const mockMerchant = {
  name: "Digital Store",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdhYtWBgnMqfyhfutTV7abFT6oHhk1T8RInQ&s",
};

const mockTokens = [
  { symbol: "BONK", name: "Bonk", balance: "1000000" },
  { symbol: "SOL", name: "Solana", balance: "1.5" },
  { symbol: "USDC", name: "USD Coin", balance: "100" },
];
const PaymentPage = () => {
  const [amount, setAmount] = useState<number>();
  const [selectedToken, setSelectedToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<ISwapPreview>();
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);

  const router = useRouter();

  useDebouncedEffect(
    () => {
      if (amount && selectedToken) {
        setIsPriceLoading(true);
        fetchQuote(amount * 1000000000);
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Payment completed successfully");
      const txDetails = {
        paidAmount: "20",
        paidToken: "SOL",
        receivedAmount: "19",
        merchantName: "john",
        txHash: "dnbfn f",
      };
      localStorage.setItem("txDetails", JSON.stringify(txDetails));
      router.push("/success");
    } catch (error) {
      console.log(error);
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
