import React from "react";
import { motion } from "framer-motion";
import { ISwapPreview } from "@/types/types";

const SwapPreview = ({ quoteData }: { quoteData: ISwapPreview }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 rounded-lg p-4 space-y-2"
    >
      <p className="text-sm text-white/60">Swap Preview</p>
      <p className="text-white">
        {quoteData.inputAmount.toFixed(2)} {quoteData.inputToken} →{" "}
        {quoteData.outputAmount.toFixed(2)} {quoteData.outputToken}
      </p>
      <p className="text-sm text-white/60">
        Network Fee: {quoteData.networkFee}
      </p>
      <p className="text-sm text-white/60">
        Slippage: {quoteData.slippage}
      </p>
    </motion.div>
  );
};

export default SwapPreview;
