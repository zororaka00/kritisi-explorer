export interface IContract {
    id: number,
    contractAddress: `0x${string}`,
    contractName: string,
    score: number,
    date: string
}

export interface IDetailContract {
    id: number,
    contractAddress: `0x${string}`,
    contractCreator: `0x${string}`,
    contractTxHash: `0x${string}`,
    contractName: string,
    score: number,
    securityObject: string,
    date: string
}
  
export interface AuditResult {
    score: number;
    high: {
        issue: string;
        suggestion: string;
        code_highlight: string;
    }[];
    medium: {
        issue: string;
        suggestion: string;
        code_highlight: string;
    }[];
    low: {
        issue: string;
    }[];
}