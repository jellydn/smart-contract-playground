import { config } from "https://deno.land/x/dotenv/mod.ts";
import ky from "https://deno.land/x/ky@v0.23.0/index.js";
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.0.20/dist/ethers.esm.js";

(async () => {
  const { API_URL } = config();
  const { addr, network_id: networkId, abi } = await ky
    // @ts-expect-error  TS2339 [ERROR]: Property 'get' does
    .get(API_URL)
    .json();

  const networkMapping: Record<number, string> = {
    3: "https://ropsten.infura.io/v3/f48d2390e5f6481286e37db0cf443116",
    56: "https://ac-prod1.aircarbon.co:9545",
    97: "https://data-seed-prebsc-1-s1.binance.org:8545",
  };
  console.warn({ addr, networkId, abi });
  const url = networkMapping[networkId];
  
  if(!url) throw new Error(`Not supported yet for ${networkId}`);  
  const provider = new ethers.providers.JsonRpcProvider(url);

  const contract = new ethers.Contract(addr, JSON.parse(abi), provider);
  console.warn(contract);
  // @ts-expect-error TS2339 [ERROR]: Property 'getWhitelist' does not exist on type 'Contract'.
  const value = await contract.getSecTokenTypes();

  console.warn(value);
})();
