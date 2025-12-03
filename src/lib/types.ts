export interface Expense {
	id: string;
	amount: number;
	comment: string;
	createdAt: Date;
	createdBy: string;
}

export interface BudgetConfig {
	monthlyAllocation: number;
	weeklyTarget: number;
}

export interface WeekSummary {
	weekStart: Date;
	weekEnd: Date;
	spent: number;
	target: number;
	remaining: number;
}

export interface MonthSummary {
	monthStart: Date;
	monthEnd: Date;
	spent: number;
	allocation: number;
	remaining: number;
}
