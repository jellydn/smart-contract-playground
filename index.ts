import { config, ethers, yargs } from "./deps.ts";

(async () => {
  const { API_URL } = config();
  if (!API_URL) throw new Error("Missing API_URL on .env file.");
  const { addr, network_id: networkId, abi } = await fetch(
    API_URL
  ).then((resp) => resp.json());

  const networkMapping: Record<number, string> = {
    3: "https://ropsten.infura.io/v3/f48d2390e5f6481286e37db0cf443116",
    56: "https://bsc-dataseed.binance.org",
    97: "https://data-seed-prebsc-1-s1.binance.org:8545",
  };
  console.warn({ addr, networkId, abi });
  const url = networkMapping[networkId];

  if (!url) throw new Error(`Not supported yet for ${networkId}`);
  const provider = new ethers.providers.JsonRpcProvider(url, networkId);

  const contract = new ethers.Contract(addr, JSON.parse(abi), provider);
  // deno-lint-ignore no-explicit-any
  (yargs(Deno.args) as any)
    .command(
      "viewer <fnName>",
      "call viewer function from ABI",
      (yargs: {
        positional: (arg0: string, arg1: { describe: string }) => any;
      }) => {
        return yargs.positional("fnName", {
          describe: "Viewer function name",
        });
      },
      // deno-lint-ignore no-explicit-any
      async (argv: any) => {
        console.info(argv);
        // deno-lint-ignore no-explicit-any
        const value = await (contract as any)[argv.fnName]();

        console.warn(value);
      }
    )
    .strictCommands()
    .demandCommand(1).argv;
})();
