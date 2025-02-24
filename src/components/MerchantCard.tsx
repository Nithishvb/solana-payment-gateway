"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MerchantCardProps {
  id: string;
  name: string;
  logo: string;
}

const MerchantCard = ({ id, name, logo }: MerchantCardProps) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="merchant-card group cursor-pointer"
    >
      <div className="shimmer group-hover:animate-shimmer" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
            <Image
              src={logo}
              alt={name}
              height={100}
              width={200}
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="font-medium text-lg text-white">{name}</p>
            <p className="text-sm text-white/60">Verified Merchant</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/pay/${id}`)}
          className="px-6 py-2 rounded-lg bg-primary text-white font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
        >
          Pay Now
        </button>
      </div>
    </motion.div>
  );
};

export default MerchantCard;
