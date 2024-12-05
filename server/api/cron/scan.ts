import { ChainEnum, PrismaClient, TypeContract } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cronSecretKey = config.CRON_SECRET_KEY as string;
  const { secret } = getQuery(event);
  if (secret == cronSecretKey) {
    const prisma = new PrismaClient();
    const contracts = await prisma.contract.findMany({
      where: {
        isScanned: false,
        chain: ChainEnum.ARBITRUM
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
      const arbiscanApiKey = config.arbiscanApiKey as string;
      var goInterval = setInterval(async () => {
        if (!isLoopInterval) {
          isLoopInterval = true;
          if (indexInterval >= contracts.length) {
            clearInterval(goInterval);
            return "Scan completed";
          } else {
            const contract = contracts[indexInterval];
            $fetch(`https://api.arbiscan.io/api?module=contract&action=getsourcecode&address=${contract.contractAddress}&apikey=${arbiscanApiKey}`)
            .then(async (response: any) => {
              if (response.status == '1') {
                await prisma.contract.update({
                  where: { id: contract.id },
                  data: { 
                    contractName: response.result[0].ContractName,
                    dataObject: response.result,
                    type: response.result[0].Proxy == '1' ? TypeContract.PROXY : TypeContract.OTHER,
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
            }).catch(() => {
              setTimeout(() => {
                isLoopInterval = false;
                indexInterval++;
              }, 3000);
            });
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
