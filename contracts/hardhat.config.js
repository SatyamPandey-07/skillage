require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: require("path").join(__dirname, "../.env.local") });

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: { evmVersion: "cancun" },
  },
  networks: {
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.BACKEND_SIGNER_PK],
      chainId: 84532,
    },
  },
  etherscan: {
    apiKey: {
      "base-sepolia": process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};
