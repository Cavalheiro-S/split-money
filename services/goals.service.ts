import { ApiService } from './base.service';

export class GoalsService extends ApiService {
  static async getGoals() {
    return this.request<{ message: string; data: Goal[] }>('/goal');
  }

  static async createGoal(payload: CreateGoalPayload) {
    return this.request<{ message: string; data: Goal }>('/goal', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async updateGoal({ id, ...payload }: UpdateGoalPayload) {
    return this.request<{ message: string; data: Goal }>(`/goal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  static async deleteGoal(id: string) {
    return this.request<{ message: string }>(`/goal/${id}`, { method: 'DELETE' });
  }

  static async getContributions(goalId: string) {
    return this.request<{ message: string; data: GoalContribution[] }>(
      `/goal/${goalId}/contribution`
    );
  }

  static async createContribution({ goalId, ...payload }: CreateContributionPayload) {
    return this.request<{ message: string; data: GoalContribution }>(
      `/goal/${goalId}/contribution`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  static async deleteContribution(goalId: string, contribId: string) {
    return this.request<{ message: string }>(
      `/goal/${goalId}/contribution/${contribId}`,
      { method: 'DELETE' }
    );
  }
}
