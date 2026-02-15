import { relations } from "drizzle-orm/relations";
import { users, userStreaks, userProgress, meditations } from "./schema";

export const userStreaksRelations = relations(userStreaks, ({one}) => ({
	user: one(users, {
		fields: [userStreaks.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userStreaks: many(userStreaks),
	userProgresses: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({one}) => ({
	user: one(users, {
		fields: [userProgress.userId],
		references: [users.id]
	}),
	meditation: one(meditations, {
		fields: [userProgress.meditationId],
		references: [meditations.id]
	}),
}));

export const meditationsRelations = relations(meditations, ({many}) => ({
	userProgresses: many(userProgress),
}));