"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Home, Receipt } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Receipt, label: "Transactions", path: "/transactions" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-lg border-t border-white/10 px-6 py-3 md:top-0 md:bottom-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Solana Pay
          </span>
        </div>
        <div className="flex items-center space-x-6">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => router.push(path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === path
                  ? "text-primary bg-white/5"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
          <div>
            <WalletMultiButton style={{
              background: "#5c6ac4",
              padding: "5px 20px",
              height: "40px",
              borderRadius: "7px"
            }} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
