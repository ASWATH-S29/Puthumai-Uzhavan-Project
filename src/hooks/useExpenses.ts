import { useCallback } from 'react';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useApiMutation } from '@/hooks/useApiMutation';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '@/services/expenseService';
import type {
  AddExpenseRequest,
  AddExpenseResponse,
  ExpenseRow,
  ExpensesResponse,
} from '@/services/types';

export function useExpenses(userId?: string | null) {
  return useApiQuery<ExpensesResponse>(() => getExpenses(userId), Boolean(userId));
}

export function useAddExpense() {
  return useApiMutation<AddExpenseResponse, AddExpenseRequest>(useCallback(addExpense, []));
}

export function useUpdateExpense() {
  return useApiMutation<ExpenseRow, { id: string; payload: AddExpenseRequest }>(useCallback(async ({ id, payload }) => updateExpense(id, payload), []));
}

export function useDeleteExpense() {
  return useApiMutation<void, string>(useCallback(async (id: string) => { await deleteExpense(id); }, []));
}
