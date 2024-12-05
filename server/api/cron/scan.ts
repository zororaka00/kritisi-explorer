import { ChainEnum, PrismaClient, TypeContract } from '@prisma/client';

interface ContractSourceResponse {
  status: string;
  message: string;
  result: Array<{
    ContractName: string;
    Proxy: string;
    [key: string]: any;
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
        isScanned: false,
      },
      take: 10,
      orderBy: {
        createdAt: 'asc'
      }
    });
    if (contracts.length > 0) {
      var isLoopInterval = false;
      var indexInterval = 0;
      const config = useRuntimeConfig();
      const etherscanApiKey = config.etherscanApiKey as string;
      const arbiscanApiKey = config.arbiscanApiKey as string;
      const basescanApiKey = config.basescanApiKey as string;
      const optimismApiKey = config.optimismApiKey as string;

      const getApiEndpoint = (chain: ChainEnum) => {
        switch (chain) {
          case ChainEnum.ETHEREUM:
            return `https://api.etherscan.io/api?module=contract&action=getsourcecode&apikey=${etherscanApiKey}`;
          case ChainEnum.ARBITRUM:
            return `https://api.arbiscan.io/api?module=contract&action=getsourcecode&apikey=${arbiscanApiKey}`;
          case ChainEnum.BASE:
            return `https://api.basescan.org/api?module=contract&action=getsourcecode&apikey=${basescanApiKey}`;
          case ChainEnum.OPTIMISM:
            return `https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&apikey=${optimismApiKey}`;
          default:
            throw new Error('Unsupported chain');
        }
      };

      var goInterval = setInterval(async () => {
        if (!isLoopInterval) {
          isLoopInterval = true;
          if (indexInterval >= contracts.length) {
            clearInterval(goInterval);
            return "Scan completed";
          } else {
            const contract = contracts[indexInterval];
            try {
              const apiEndpoint = getApiEndpoint(contract.chain);
              const response = await $fetch<ContractSourceResponse>(`${apiEndpoint}&address=${contract.contractAddress}`);
              
              if (response.status === '1') {
                await prisma.contract.update({
                  where: { id: contract.id },
                  data: { 
                    contractName: response.result[0].ContractName,
                    dataObject: response.result,
                    type: response.result[0].Proxy === '1' ? TypeContract.PROXY : TypeContract.OTHER,
                    isScanned: true
                  }
                });
                isLoopInterval = false;
                indexInterval++;
              } else {
                setTimeout(() => {
                  isLoopInterval = false;
                  indexInterval++;
                }, 3000);
              }
            } catch (error) {
              setTimeout(() => {
                isLoopInterval = false;
                indexInterval++;
              }, 3000);
            }
          }
        }
      }, 200);
    } else {
      return "No contract to scan";
    }
  } else {
    return "Unauthorized";
  }
});
