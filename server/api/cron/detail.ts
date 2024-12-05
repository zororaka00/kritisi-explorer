import { PrismaClient, TypeContract, ChainEnum } from '@prisma/client';

interface ContractCreationResponse {
  status: string;
  message: string;
  result: Array<{
    contractAddress: string;
    contractCreator: string;
    txHash: string;
  }>;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cronSecretKey = config.cronSecretKey as string;
  const { secret } = getQuery(event);
  if (secret == cronSecretKey) {
    const prisma = new PrismaClient();
    const contracts = await prisma.contract.findMany({
      where: {
        isScanned: true,
        type: TypeContract.OTHER,
        contractCreator: null,
        contractTxHash: null
      },
      take: 5,
      orderBy: {
        createdAt: 'asc'
      }
    });
    if (contracts.length > 0) {
      const config = useRuntimeConfig();
      const etherscanApiKey = config.etherscanApiKey as string;
      const arbiscanApiKey = config.arbiscanApiKey as string;
      const basescanApiKey = config.basescanApiKey as string;
      const optimismApiKey = config.optimismApiKey as string;

      const getApiEndpoint = (chain: ChainEnum) => {
        switch (chain) {
          case ChainEnum.ETHEREUM:
            return `https://api.etherscan.io/api?module=contract&action=getcontractcreation&apikey=${etherscanApiKey}`;
          case ChainEnum.ARBITRUM:
            return `https://api.arbiscan.io/api?module=contract&action=getcontractcreation&apikey=${arbiscanApiKey}`;
          case ChainEnum.BASE:
            return `https://api.basescan.org/api?module=contract&action=getcontractcreation&apikey=${basescanApiKey}`;
          case ChainEnum.OPTIMISM:
            return `https://api-optimistic.etherscan.io/api?module=contract&action=getcontractcreation&apikey=${optimismApiKey}`;
          default:
            throw new Error('Unsupported chain');
        }
      };

      // Group contracts by chain
      const contractsByChain = contracts.reduce((acc, contract) => {
        if (!acc[contract.chain]) {
          acc[contract.chain] = [];
        }
        acc[contract.chain].push(contract);
        return acc;
      }, {} as Record<ChainEnum, typeof contracts>);

      // Process each chain's contracts separately
      for (const [chain, chainContracts] of Object.entries(contractsByChain)) {
        try {
          const apiEndpoint = getApiEndpoint(chain as ChainEnum);
          const contractAddresses = chainContracts.map(contract => contract.contractAddress);
          const contractAddressesString = contractAddresses.join(',');
          
          const response = await $fetch<ContractCreationResponse>(`${apiEndpoint}&contractaddresses=${contractAddressesString}`);
          
          if (response.status === '1' && response.result.length > 0) {
            for (let i = 0; i < response.result.length; i++) {
              const contract = chainContracts[i];
              const result = response.result[i];
              await prisma.contract.update({
                where: { id: contract.id },
                data: { 
                  contractCreator: result.contractCreator,
                  contractTxHash: result.txHash
                }
              });
            }
          }
        } catch (error) {
          console.error(`Error processing ${chain} contracts:`, error);
          continue;
        }
      }
      return "Detail completed";
    } else {
      return "No contract to get detail";
    }
  } else {
    return "Unauthorized";
  }
});
