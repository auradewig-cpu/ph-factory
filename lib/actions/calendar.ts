'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { productions, projects, formatPresets } from '@/lib/db/schema';
import { eq, desc, isNotNull } from 'drizzle-orm';

export async function setSchedule(productionId: number, date: string | null) {
  await db
    .update(productions)
    .set({ scheduledPublishAt: date ? new Date(date) : null })
    .where(eq(productions.id, productionId));

  revalidatePath('/calendar');
}

export async function listScheduledProductions() {
  const rows = await db
    .select({
      id: productions.id,
      platform: productions.platform,
      status: productions.status,
      scheduledPublishAt: productions.scheduledPublishAt,
      presetName: formatPresets.name,
      presetRatio: formatPresets.ratio,
      projectName: projects.name,
      projectId: projects.id,
    })
    .from(productions)
    .leftJoin(formatPresets, eq(productions.formatPresetId, formatPresets.id))
    .leftJoin(projects, eq(productions.projectId, projects.id))
    .where(isNotNull(productions.scheduledPublishAt))
    .orderBy(desc(productions.scheduledPublishAt));

  return rows;
}
