'use server';

import { getApiUsageStatus } from '@/lib/ai/usage';

export async function fetchApiUsageStatus() {
  return getApiUsageStatus();
}
