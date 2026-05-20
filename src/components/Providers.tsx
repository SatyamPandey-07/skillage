"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { UGFProvider } from "@tychilabs/react-ugf";

const BASE_SEPOLIA = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia.base.org"] } },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

  // Skip Privy init if no app ID — prevents prerender crash
  if (!privyAppId || privyAppId === "clxxxxxxxxxxxxxx") {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ["email", "google", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#6366f1",
        },
        defaultChain: BASE_SEPOLIA as any,
        supportedChains: [BASE_SEPOLIA as any],
      }}
    >
      <UGFProvider>{children}</UGFProvider>
    </PrivyProvider>
  );
}
