import { supabase } from '@/lib/supabase';
import type { AddExpenseRequest, AddExpenseResponse, ExpenseRow, ExpensesResponse } from '@/services/types';

const EXPENSES_TABLE = 'expenses';

function normalizeExpense(expense: Partial<ExpenseRow> & Record<string, unknown>): ExpenseRow {
  return {
    id: String(expense.id ?? ''),
    date: String(expense.date ?? ''),
    category: String(expense.category ?? 'Other'),
    description: String(expense.description ?? ''),
    field: String(expense.field ?? 'N/A'),
    amount: Number(expense.amount ?? 0),
    user_id: expense.user_id ? String(expense.user_id) : undefined,
    farm_id: expense.farm_id ? String(expense.farm_id) : null,
    notes: expense.notes ? String(expense.notes) : undefined,
    created_at: expense.created_at ? String(expense.created_at) : undefined,
    farm_name: expense.farm_name ? String(expense.farm_name) : undefined,
  };
}

export async function getExpenses(userId?: string | null): Promise<ExpensesResponse> {
  let query = supabase
    .from(EXPENSES_TABLE)
    .select('*')
    .order('date', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []).map((expense: Record<string, unknown>) => {
    const normalized = normalizeExpense(expense as Partial<ExpenseRow> & Record<string, unknown>);
    return { ...normalized, farm_name: normalized.farm_name ?? 'Farm' };
  });

  const byCategory = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + row.amount;
    return acc;
  }, {});

  return {
    rows,
    total: rows.reduce((sum, row) => sum + row.amount, 0),
    byCategory: Object.entries(byCategory).map(([name, value]) => ({
      name,
      value,
      color: ['#16a34a', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#14b8a6', '#f97316', '#0ea5e9', '#84cc16', '#64748b'][Object.keys(byCategory).indexOf(name) % 10],
    })),
  };
}

export async function addExpense(payload: AddExpenseRequest): Promise<AddExpenseResponse> {
  const { data, error } = await supabase
    .from(EXPENSES_TABLE)
    .insert({
      user_id: payload.user_id,
      farm_id: payload.farm_id,
      category: payload.category,
      amount: payload.amount,
      date: payload.date,
      notes: payload.notes,
      description: payload.description,
      field: payload.field,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  const expense = normalizeExpense(data as Partial<ExpenseRow> & Record<string, unknown>);
  return { expense: { ...expense, farm_name: expense.farm_name ?? 'Farm' }, total: 0 };
}

export async function updateExpense(id: string, payload: AddExpenseRequest): Promise<ExpenseRow> {
  const { data, error } = await supabase
    .from(EXPENSES_TABLE)
    .update({
      farm_id: payload.farm_id,
      category: payload.category,
      amount: payload.amount,
      date: payload.date,
      notes: payload.notes,
      description: payload.description,
      field: payload.field,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  const expense = normalizeExpense(data as Partial<ExpenseRow> & Record<string, unknown>);
  return { ...expense, farm_name: expense.farm_name ?? 'Farm' };
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from(EXPENSES_TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
