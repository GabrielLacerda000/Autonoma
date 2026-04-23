import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  json,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';

export const platformEnum = pgEnum('platform', ['linkedin', 'twitter', 'blog']);

export const stageEnum = pgEnum('stage', ['draft', 'edited', 'seo']);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  niche: text('niche').notNull(),
  targetAudience: text('target_audience'),
  toneOfVoice: text('tone_of_voice'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const trends = pgTable('trends', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  keywords: json('keywords'),
  source: text('source'),
  score: integer('score'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contentCalendars = pgTable('content_calendars', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const calendarItems = pgTable('calendar_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  calendarId: uuid('calendar_id')
    .notNull()
    .references(() => contentCalendars.id, { onDelete: 'cascade' }),
  publishDate: date('publish_date').notNull(),
  topic: text('topic').notNull(),
  angle: text('angle'),
  platform: platformEnum('platform').notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  calendarItemId: uuid('calendar_item_id')
    .notNull()
    .references(() => calendarItems.id, { onDelete: 'cascade' }),
  version: integer('version').notNull().default(1),
  stage: stageEnum('stage').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
