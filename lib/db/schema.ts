import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const dashboardCases = pgTable('dashboard_cases', {
  id: serial('id').primaryKey(),
  caseNumber: text('case_number').notNull().unique(),
  institution: text('institution').notNull(),
  issue: text('issue').notNull(),
  severity: text('severity').notNull().default('Medium'),
  status: text('status').notNull().default('Open'),
  owner: text('owner').notNull().default('Unassigned'),
  progress: integer('progress').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
