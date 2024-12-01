import { PrismaClient, TypeContract } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const contracts = await prisma.contract.findMany({
    where: {
      isScanned: true,
      type: TypeContract.OTHER,
      contractCreator: null,
      contractTxHash: null
    },
    take: 5
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
});
