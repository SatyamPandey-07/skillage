export const UGF_ERRORS: Record<string, string> = {
  UNSUPPORTED_TESTNET_ROUTE: "Network issue — only Base Sepolia is supported.",
  QUOTE_ERROR: "Couldn't get a gas quote. Try again in a moment.",
  NO_PROVIDER: "Wallet not connected. Please reconnect.",
  SETTLEMENT_ERROR: "Payment authorization failed. Check your MockUSD balance.",
  EXECUTION_ERROR: "Transaction stopped before completion. Try again.",
  COMPLETION_TIMEOUT: "Confirmation timed out. Check BaseScan for your tx.",
};

export function ugfErrorMessage(code: string): string {
  return UGF_ERRORS[code] ?? "Something went wrong. Please try again.";
}
