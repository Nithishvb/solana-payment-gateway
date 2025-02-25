'use client';

import { motion } from "framer-motion";
import MerchantCard from "../components/MerchantCard";

const merchants = [
  {
    id: "1",
    name: "Digital Store",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdhYtWBgnMqfyhfutTV7abFT6oHhk1T8RInQ&s",
  },
  {
    id: "2",
    name: "Tech Gadgets",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdhYtWBgnMqfyhfutTV7abFT6oHhk1T8RInQ&s",
  },
  {
    id: "3",
    name: "Web3 Market",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdhYtWBgnMqfyhfutTV7abFT6oHhk1T8RInQ&s",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm font-medium text-primary mb-2">MERCHANTS</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            Choose a Merchant
          </h1>
          <p className="text-white/60">
            Select from our verified merchants to make your payment
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {merchants.map((merchant) => (
            <MerchantCard key={merchant.id} {...merchant} />
          ))}
        </div>
      </main>
    </div>
  );
}
