import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
    try {
        var { page, limit, search }: {
            page: number;
            limit: number;
            search: string | null;
        } = getQuery(event);
        search = search ? decodeURIComponent(search) : null;
        const prisma = new PrismaClient();
        page = parseInt(String(page) || '1');
        limit = parseInt(String(limit) || '10');
        limit = limit > 100 ? 100 : limit;
        const allData = await Promise.all([
            await prisma.contract.findMany({
                where: {
                    isScanned: true,
                    score: {
                        gte: 0
                    },
                    ...search ? {
                        OR: [
                            {
                                contractAddress: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                contractName: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    } : { }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    contractAddress: true,
                    contractName: true,
                    score: true,
                    createdAt: true
                }
            }),
            await prisma.contract.count({
                where: {
                    isScanned: true,
                    score: {
                        gte: 0
                    }
                }
            })
        ]);
        return {
            status: 200,
            message: "Success",
            currentPage: page,
            limit: limit,
            totalPages: Math.ceil(allData[1] / limit),
            data: allData[0] ? allData[0].map((contract) => ({
                id: Number(contract.id),
                contractAddress: contract.contractAddress,
                contractName: contract.contractName,
                score: contract.score,
                date: contract.createdAt
            })) : []
        };
    } catch (error) {
        return {
            status: 500,
            message: "Internal server error",
            data: null
        };
    }
});
