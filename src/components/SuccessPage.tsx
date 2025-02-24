"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TransactionDetails {
  paidAmount: string;
  paidToken: string;
  receivedAmount: string;
  merchantName: string;
  txHash: string;
}
const SuccessPage = () => {
  const router = useRouter();

  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);

  useEffect(() => {
    const storedTxDetails = localStorage.getItem("txDetails");
    if (storedTxDetails) {
      setTxDetails(JSON.parse(storedTxDetails));
    }else{
      router.push("/");
    }
  }, [router]);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="merchant-card space-y-6"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-white">
            Payment Successful 🎉
          </h1>
          <p className="text-white/80">Your transaction has been confirmed</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 bg-white/5 rounded-lg p-6"
        >
          <div className="flex justify-between items-center">
            <span className="text-white/70">Paid</span>
            <span className="text-white font-medium">
              {txDetails && txDetails.paidAmount} {txDetails && txDetails.paidToken}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70">Received</span>
            <span className="text-white font-medium">
              {txDetails && txDetails.receivedAmount} USDC
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70">Merchant</span>
            <span className="text-white font-medium">
              {txDetails && txDetails.merchantName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70">Transaction</span>
            <a
              href={`https://explorer.solana.com/tx/${txDetails && txDetails.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              View on Explorer
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            variant="secondary"
            className="w-full sm:w-auto hover:bg-secondary/90 transition-colors"
            asChild
          >
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
