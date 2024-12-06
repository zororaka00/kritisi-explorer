import { ChainEnum } from '@prisma/client';
import { type Chain, createPublicClient, http, PublicClient } from 'viem';
import { arbitrum, base, mainnet, optimism } from 'viem/chains';

export class Web3Utils {
    private publicClient: PublicClient;
    constructor(chain: ChainEnum) {
        let getChain: Chain;
        if (chain == ChainEnum.ARBITRUM) {
            getChain = arbitrum;
        } else if (chain == ChainEnum.OPTIMISM) {
            getChain = optimism;
        } else if (chain == ChainEnum.BASE) {
            getChain = base;
        } else {
            getChain = mainnet;
        }
        this.publicClient = createPublicClient({
            chain: getChain,
            transport: http()
        });
    }
    async isContractAddress(contractAddress: `0x${string}`) {
        try {
            const bytecode = await this.publicClient.getCode({
                address: contractAddress
            });
            return bytecode !== undefined && bytecode !== '0x';
        } catch (error) {
            return false;
        }
    }
}