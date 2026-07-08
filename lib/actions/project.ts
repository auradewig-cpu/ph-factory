'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { projects } from '@/lib/db/schema';
import { createProjectSchema, type CreateProjectInput } from '@/lib/validation/project';
import { desc } from 'drizzle-orm';

export async function createProject(data: CreateProjectInput) {
  const parsed = createProjectSchema.parse(data);

  const [project] = await db
    .insert(projects)
    .values({
      name: parsed.name,
      niche: parsed.niche,
      targetPlatforms: parsed.targetPlatforms,
      language: parsed.language,
    })
    .returning();

  revalidatePath('/projects');
  return project;
}

export async function listProjects() {
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));

  return allProjects;
}

export type ProjectRow = Awaited<ReturnType<typeof listProjects>>[number];
