"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { UGFProvider } from "@tychilabs/react-ugf";
import { AuthProvider } from "@/src/context/AuthContext";

const BASE_SEPOLIA = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia.base.org"] } },
};

export function Providers({ children }: { children: React.ReactNode }) {
  // Provide the default app ID as a robust production fallback to prevent crashing if the env var is missing or unloaded
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmpee4fmo005n0clbs8xouegq";

  const inner =
    privyAppId && privyAppId !== "clxxxxxxxxxxxxxx" ? (
      <PrivyProvider
        appId={privyAppId}
        config={{
          loginMethods: ["email", "wallet"],
          appearance: { theme: "dark", accentColor: "#6366f1" },
          defaultChain: BASE_SEPOLIA as any,
          supportedChains: [BASE_SEPOLIA as any],
        }}
      >
        <UGFProvider>{children}</UGFProvider>
      </PrivyProvider>
    ) : (
      <>{children}</>
    );

  return <AuthProvider>{inner}</AuthProvider>;
}
