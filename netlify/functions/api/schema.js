import { pgTable, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  status: text('status').notNull().default('draft'), // 'draft' or 'published'
  themePreset: text('theme_preset').notNull().default('minimal'),
  themeOverrides: text('theme_overrides').notNull().default('{}'), // JSON encoded
  sections: text('sections').notNull().default('[]'), // JSON encoded array
  views: integer('views').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  pageId: integer('page_id').notNull().references(() => pages.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
