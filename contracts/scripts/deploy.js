const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const SkillChainCert = await ethers.getContractFactory("SkillChainCert");
  const contract = await SkillChainCert.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SkillChainCert deployed to:", address);
  console.log("\nAdd to .env.local:");
  console.log(`CONTRACT_ADDRESS=${address}`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
