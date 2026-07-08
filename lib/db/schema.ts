import { pgTable, pgEnum, serial, integer, text, boolean, timestamp, jsonb, date, unique, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

/* ─── Enums ─── */

export const sceneTypeEnum = pgEnum('scene_type', ['hook', 'body', 'cta']);
export const cameraTechniqueEnum = pgEnum('camera_technique', [
  'drone_aerial_reveal',
  'drone_orbit',
  'walkthrough_steadicam',
  'dolly_zoom',
  'static_wide_establish',
  'rack_focus_detail',
  'pov_handheld_product',
  'pov_gimbal_follow',
]);
export const continuityTypeEnum = pgEnum('continuity_type', ['continuous', 'match_cut', 'hard_cut']);
export const voiceModeEnum = pgEnum('voice_mode', ['voiceover_only', 'on_camera_dialogue', 'none']);
export const jobStatusEnum = pgEnum('job_status', ['pending', 'processing', 'done', 'failed']);
export const researchStatusEnum = pgEnum('research_status', ['fresh', 'stale']);
export const assetTypeEnum = pgEnum('asset_type', ['image', 'video_frame', 'audio', 'reference_photo']);
export const musicSourceEnum = pgEnum('music_source', ['jamendo', 'freesound']);
export const productionStatusEnum = pgEnum('production_status', ['draft', 'active', 'completed', 'archived']);

/* ─── Tables (order: parent-first, no forward FK refs to break TS inference) ─── */

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  niche: text('niche').notNull(),
  targetPlatforms: text('target_platforms').array().notNull().default(sql`'{}'`),
  language: text('language').notNull().default('id'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const formatPresets = pgTable('format_presets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  platform: text('platform').notNull(),
  ratio: text('ratio').notNull(),
  durationRange: text('duration_range'),
  captionStyle: text('caption_style'),
});

export const researchReports = pgTable('research_reports', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  summary: text('summary').notNull(),
  rawFindings: jsonb('raw_findings'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  status: researchStatusEnum('status').notNull().default('fresh'),
});

export const musicTracks = pgTable('music_tracks', {
  id: serial('id').primaryKey(),
  source: musicSourceEnum('source').notNull(),
  externalId: text('external_id').notNull(),
  licenseUrl: text('license_url'),
  licenseType: text('license_type').notNull(),
  commercialSafe: boolean('commercial_safe').notNull().default(false),
  downloadUrl: text('download_url'),
}, (t) => ({
  uniqueTrack: unique('uq_music_track').on(t.source, t.externalId),
}));

export const contentPlans = pgTable('content_plans', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  durationDays: integer('duration_days').notNull().default(7),
  generatedFromReportId: integer('generated_from_report_id').references(() => researchReports.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const productions = pgTable('productions', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  contentPlanId: integer('content_plan_id').references(() => contentPlans.id, { onDelete: 'set null' }),
  platform: text('platform').notNull(),
  formatPresetId: integer('format_preset_id').references(() => formatPresets.id),
  hasCharacter: boolean('has_character').notNull().default(false),
  voiceMode: voiceModeEnum('voice_mode').notNull().default('none'),
  status: productionStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  sceneId: integer('scene_id').references((): AnyPgColumn => scenes.id, { onDelete: 'set null' }),
  type: assetTypeEnum('type').notNull(),
  cloudinaryUrl: text('cloudinary_url').notNull(),
  cloudinaryPublicId: text('cloudinary_public_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/* ─── Scenes ─── */

export const scenes = pgTable('scenes', {
  id: serial('id').primaryKey(),
  productionId: integer('production_id').notNull().references(() => productions.id, { onDelete: 'cascade' }),
  sceneNumber: integer('scene_number').notNull(),
  sceneType: sceneTypeEnum('scene_type').notNull(),
  cameraTechnique: cameraTechniqueEnum('camera_technique').notNull(),
  continuityType: continuityTypeEnum('continuity_type').notNull(),
  chainAssetId: integer('chain_asset_id').references(() => assets.id, { onDelete: 'set null' }),
  imagePrompt: text('image_prompt').notNull(),
  videoPrompt: text('video_prompt').notNull(),
  scriptNarration: text('script_narration'),
  musicTrackId: integer('music_track_id').references(() => musicTracks.id, { onDelete: 'set null' }),
  durationSeconds: integer('duration_seconds').notNull().default(15),
  maxWords: integer('max_words').notNull().default(30),
  speechPace: text('speech_pace').notNull().default('normal'),
}, (t) => ({
  uniqueSceneNumber: unique('uq_scene_number').on(t.productionId, t.sceneNumber),
}));

/* ─── Personas ─── */

export const personas = pgTable('personas', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  referenceImageAssetId: integer('reference_image_asset_id').references(() => assets.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/* ─── Jobs & Logs ─── */

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  relatedId: integer('related_id'),
  status: jobStatusEnum('status').notNull().default('pending'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const apiUsageLog = pgTable('api_usage_log', {
  id: serial('id').primaryKey(),
  provider: text('provider').notNull(),
  date: date('date').notNull(),
  requestCount: integer('request_count').notNull().default(0),
}, (t) => ({
  uniqueUsage: unique('uq_api_usage').on(t.provider, t.date),
}));

/* ─── Relations ─── */

export const projectsRelations = relations(projects, ({ many }) => ({
  personas: many(personas),
  researchReports: many(researchReports),
  contentPlans: many(contentPlans),
  productions: many(productions),
  assets: many(assets),
}));

export const personasRelations = relations(personas, ({ one }) => ({
  project: one(projects, { fields: [personas.projectId], references: [projects.id] }),
  referenceImageAsset: one(assets, { fields: [personas.referenceImageAssetId], references: [assets.id] }),
}));

export const researchReportsRelations = relations(researchReports, ({ one }) => ({
  project: one(projects, { fields: [researchReports.projectId], references: [projects.id] }),
}));

export const contentPlansRelations = relations(contentPlans, ({ one, many }) => ({
  project: one(projects, { fields: [contentPlans.projectId], references: [projects.id] }),
  generatedFromReport: one(researchReports, { fields: [contentPlans.generatedFromReportId], references: [researchReports.id] }),
  productions: many(productions),
}));

export const productionsRelations = relations(productions, ({ one, many }) => ({
  project: one(projects, { fields: [productions.projectId], references: [projects.id] }),
  contentPlan: one(contentPlans, { fields: [productions.contentPlanId], references: [contentPlans.id] }),
  formatPreset: one(formatPresets, { fields: [productions.formatPresetId], references: [formatPresets.id] }),
  scenes: many(scenes),
}));

export const scenesRelations = relations(scenes, ({ one }) => ({
  production: one(productions, { fields: [scenes.productionId], references: [productions.id] }),
  chainAsset: one(assets, { fields: [scenes.chainAssetId], references: [assets.id] }),
  musicTrack: one(musicTracks, { fields: [scenes.musicTrackId], references: [musicTracks.id] }),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  project: one(projects, { fields: [assets.projectId], references: [projects.id] }),
  scene: one(scenes, { fields: [assets.sceneId], references: [scenes.id] }),
}));
