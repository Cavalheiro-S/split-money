type Asset = {
    id: string;
    name: string;
    percentage: number;
    color: string;
}

type InvestmentStrategy = {
    assets: Asset[];
    totalInvestment: number;
}

type AssetDistribution = {
    name: string;
    value: number;
    percentage: number;
    color: string;
}

