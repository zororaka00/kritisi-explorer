import { PrismaClient, TypeContract } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cronSecretKey = config.CRON_SECRET_KEY as string;
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
      const arbiscanApiKey = config.arbiscanApiKey as string;
      const contractAddresses = await contracts.map((contract) => contract.contractAddress);
      const contractAddressesString = contractAddresses.join(',');
      $fetch(`https://api.arbiscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contractAddressesString}&apikey=${arbiscanApiKey}`)
      .then(async (response: any) => {
        if (response.status == '1') {
          for (let index = 0; index < response.result.length; index++) {
            const contract = contracts[index];
            await prisma.contract.update({
              where: { id: contract.id },
              data: { contractCreator: response.result[index].contractCreator, contractTxHash: response.result[index].txHash }
            });
          }
          return "Detail completed";
        } else {
          return "Error";
        }
      }).catch(() => {
        return "Error";
      });
    } else {
      return "No contract to get detail";
    }
  } else {
    return "Unauthorized";
  }
});
