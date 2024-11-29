export interface Contract {
    id: number;
    address: string;
    name: string;
    securityScore: number;
    dateAdded: Date;
    description?: string;
    vulnerabilities?: string[];
    auditor?: string;
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