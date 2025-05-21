import { CreateInvestmentDTO, Investment, InvestmentGetResponse, UpdateInvestmentDTO } from '@/types/investment';
import { ApiService } from './base.service';

export class InvestmentService extends ApiService {

    static async getAll(): Promise<InvestmentGetResponse> {
        const response = await this.request<InvestmentGetResponse>('/investment?page=1&limit=1000&currency=BRL');
        return response;
    }

    static async create(data: CreateInvestmentDTO): Promise<Investment> {
        const response = await this.request<Investment>('/investment', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response;
    }

    static async update(id: string, data: UpdateInvestmentDTO): Promise<Investment> {
        const response = await this.request<Investment>(`/investment/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return response;
    }

    static async delete(id: string): Promise<void> {
        await this.request(`/investment/${id}`, {
            method: 'DELETE',
        });
    }
}
