import { PrismaClient } from "@prisma/client";
import { isAddress } from "sol-type-check";

export default defineEventHandler(async (event) => {
    try {
        const prisma = new PrismaClient();
        const { contractAddress }: {
            contractAddress: string;
        } = getQuery(event);
        if (isAddress(contractAddress)) {
            const contract = await prisma.contract.findUnique({
                where: {
                    contractAddress: contractAddress.toLowerCase(),
                    isScanned: true,
                    score: {
                        gte: 0
                    }
                }
            });
            return {
                status: 200,
                message: "Success",
                data: contract ? {
                    id: Number(contract?.id),
                    contractAddress: contract?.contractAddress,
                    contractName: contract?.contractName,
                    score: contract?.score,
                    securityObject: contract?.securityObject,
                    date: contract?.createdAt
                } : null
            };
        } else {
            return {
                status: 400,
                message: "Invalid contract address",
                data: null
            };
        }
    } catch (error) {
        return {
            status: 500,
            message: "Internal server error",
            data: null
        };
    }
});
