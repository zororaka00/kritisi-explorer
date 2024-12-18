import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
    try {
        const prisma = new PrismaClient();
        const { id }: {
            id: number;
        } = getQuery(event);
        const contract = await prisma.contract.findUnique({
            where: {
                id,
                isScanned: true,
                score: {
                    gte: 0
                }
            }
        });
        return contract ? {
            status: 200,
            message: "Success",
            data: {
                id: id,
                contractAddress: contract?.contractAddress ?? '', 
                contractCreator: contract?.contractCreator ?? '',
                contractTxHash: contract?.contractTxHash ?? '',
                contractName: contract?.contractName ?? '',
                score: contract?.score,
                securityObject: contract?.securityObject,
                chain: contract?.chain,
                date: contract?.createdAt
            }
        } : {
            status: 404,
            message: "Data not found",
            data: null
        };
    } catch (error) {
        return {
            status: 500,
            message: "Internal server error",
            data: null
        };
    }
});
