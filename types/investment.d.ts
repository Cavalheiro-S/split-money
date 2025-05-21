export interface Investment {
  id: string;
  userId: string;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currency: 'BRL' | 'USD';
}

export interface CreateInvestmentDTO {
  ticker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currency: 'BRL' | 'USD';
}

export type UpdateInvestmentDTO = Partial<CreateInvestmentDTO>;

export type InvestmentGetResponse = {
  data: Investment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
