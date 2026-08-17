import { useCallback } from 'react';
import { useApiMutation, useApiQuery } from '@/hooks';
import { createFarm, deleteFarm, getFarms, updateFarm } from '@/services/farmService';
import type { FarmCreatePayload, FarmRecord, FarmUpdatePayload } from '@/services/types';

export function useFarms(ownerId?: string | null) {
  const query = useApiQuery<FarmRecord[]>(() => getFarms(ownerId), Boolean(ownerId));

  const create = useApiMutation<FarmRecord, FarmCreatePayload>(useCallback(
    async (payload: FarmCreatePayload) => createFarm(payload),
    [],
  ));

  const update = useApiMutation<FarmRecord, { id: string; payload: FarmUpdatePayload }>(useCallback(
    async ({ id, payload }) => updateFarm(id, payload),
    [],
  ));

  const remove = useApiMutation<void, string>(useCallback(async (id: string) => {
    await deleteFarm(id);
  }, []));

  return {
    ...query,
    create,
    update,
    remove,
  };
}
