import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addExpense, deleteExpense, getExpenses, updateExpense } from '@/services/expenseService';
import type { AddExpenseRequest, ExpenseRow } from '@/services/types';

interface ExpenseContextValue {
  expenses: ExpenseRow[];
  loading: boolean;
  error: string | null;
  refreshExpenses: () => Promise<void>;
  createExpense: (payload: AddExpenseRequest) => Promise<ExpenseRow>;
  updateExpenseItem: (id: string, payload: AddExpenseRequest) => Promise<ExpenseRow>;
  deleteExpenseItem: (id: string) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshExpenses = useCallback(async () => {
    if (!user?.id) {
      setExpenses([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses(user.id);
      setExpenses(response.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load expenses');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void refreshExpenses();
  }, [refreshExpenses]);

  const createExpense = useCallback(async (payload: AddExpenseRequest) => {
    const response = await addExpense({ ...payload, user_id: user?.id });
    setExpenses((current) => [response.expense, ...current]);
    return response.expense;
  }, [user?.id]);

  const updateExpenseItem = useCallback(async (id: string, payload: AddExpenseRequest) => {
    const updated = await updateExpense(id, { ...payload, user_id: user?.id });
    setExpenses((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, [user?.id]);

  const deleteExpenseItem = useCallback(async (id: string) => {
    await deleteExpense(id);
    setExpenses((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo<ExpenseContextValue>(
    () => ({
      expenses,
      loading,
      error,
      refreshExpenses,
      createExpense,
      updateExpenseItem,
      deleteExpenseItem,
    }),
    [createExpense, deleteExpenseItem, error, expenses, loading, refreshExpenses, updateExpenseItem],
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpensesContext() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpensesContext must be used within ExpenseProvider');
  return ctx;
}
