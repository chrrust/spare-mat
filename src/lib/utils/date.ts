/**
 * Get the start of the current month (1st day, 00:00:00)
 */
export function getMonthStart(date: Date = new Date()): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Get the end of the current month (last day, 23:59:59)
 */
export function getMonthEnd(date: Date = new Date()): Date {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Get the start of the current week (Monday, 00:00:00)
 * Uses ISO week (Monday = first day)
 */
export function getWeekStart(date: Date = new Date()): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);
	return new Date(d.getFullYear(), d.getMonth(), diff, 0, 0, 0, 0);
}

/**
 * Get the end of the current week (Sunday, 23:59:59)
 */
export function getWeekEnd(date: Date = new Date()): Date {
	const start = getWeekStart(date);
	return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
	return date >= start && date <= end;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
	return date.toLocaleDateString('nb-NO', {
		day: 'numeric',
		month: 'short'
	});
}

/**
 * Format currency in NOK
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('nb-NO', {
		style: 'currency',
		currency: 'NOK',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}

/**
 * Get week number in month (1-based)
 */
export function getWeekOfMonth(date: Date = new Date()): number {
	const monthStart = getMonthStart(date);
	const weekStart = getWeekStart(date);
	const monthWeekStart = getWeekStart(monthStart);

	const diffTime = weekStart.getTime() - monthWeekStart.getTime();
	const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));

	return diffWeeks + 1;
}
