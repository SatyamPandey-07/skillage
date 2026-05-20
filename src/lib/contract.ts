import { ethers } from "ethers";

const ABI = [
  "function getCertsByLearner(address learner) external view returns (uint256[])",
  "function certificates(uint256) external view returns (string topic, string difficulty, uint8 score, uint256 issuedAt, address learner)",
  "function totalSupply() external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
];

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.RPC_URL ?? "https://sepolia.base.org");
}

function getContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) throw new Error("CONTRACT_ADDRESS not set");
  return new ethers.Contract(address, ABI, signerOrProvider ?? getProvider());
}

export interface CertData {
  tokenId: number;
  topic: string;
  difficulty: string;
  score: number;
  issuedAt: number;
  learner: string;
}

export async function getCertsByAddress(address: string): Promise<CertData[]> {
  const contract = getContract();
  const tokenIds: bigint[] = await contract.getCertsByLearner(address);

  const certs = await Promise.all(
    tokenIds.map(async (id) => {
      const cert = await contract.certificates(id);
      return {
        tokenId: Number(id),
        topic: cert.topic,
        difficulty: cert.difficulty,
        score: Number(cert.score),
        issuedAt: Number(cert.issuedAt),
        learner: cert.learner,
      } as CertData;
    })
  );

  return certs;
}

export function getBackendSigner() {
  const pk = process.env.BACKEND_SIGNER_PK;
  if (!pk) throw new Error("BACKEND_SIGNER_PK not set");
  return new ethers.Wallet(pk, getProvider());
}
