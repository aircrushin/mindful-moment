import { pgTable, serial, timestamp, unique, varchar, text, foreignKey, integer, date, boolean, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	displayName: varchar("display_name", { length: 100 }),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const userStreaks = pgTable("user_streaks", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	currentStreak: integer("current_streak").default(0),
	longestStreak: integer("longest_streak").default(0),
	lastMeditationDate: date("last_meditation_date"),
	totalMinutes: integer("total_minutes").default(0),
	totalSessions: integer("total_sessions").default(0),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_streaks_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_streaks_user_id_key").on(table.userId),
]);

export const meditations = pgTable("meditations", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	durationMinutes: integer("duration_minutes").notNull(),
	category: varchar({ length: 50 }).notNull(),
	scenario: varchar({ length: 100 }),
	audioUrl: text("audio_url").notNull(),
	imageUrl: text("image_url"),
	instructor: varchar({ length: 100 }),
	difficulty: varchar({ length: 20 }).default('beginner'),
	isFeatured: boolean("is_featured").default(false),
	playCount: integer("play_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const userProgress = pgTable("user_progress", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	meditationId: integer("meditation_id"),
	durationSeconds: integer("duration_seconds").notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	rating: integer(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_progress_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.meditationId],
			foreignColumns: [meditations.id],
			name: "user_progress_meditation_id_fkey"
		}).onDelete("cascade"),
	check("user_progress_rating_check", sql`(rating >= 1) AND (rating <= 5)`),
]);
