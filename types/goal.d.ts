interface Goal {
  id: string;
  title: string;
  description: string | null;
  targetAmount: number;
  deadline: string;
  createdAt: string;
  currentAmount: number;
  contributionCount: number;
}

interface GoalContribution {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
}

interface CreateGoalPayload {
  title: string;
  description?: string;
  targetAmount: number;
  deadline: string;
}

interface UpdateGoalPayload {
  id: string;
  title?: string;
  description?: string;
  targetAmount?: number;
  deadline?: string;
}

interface CreateContributionPayload {
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}
