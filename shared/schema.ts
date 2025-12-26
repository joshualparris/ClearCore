import { z } from "zod";

// ==========================================
// DATA MODELS (Local Storage)
// ==========================================

export const GuardrailItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  enabled: z.boolean()
});

export const UserSettingsSchema = z.object({
  displayName: z.string().optional(),
  accountabilityName: z.string().optional(),
  accountabilityPhone: z.string().optional(),
  guardrails: z.array(GuardrailItemSchema),
  theme: z.enum(["system", "light", "dark"]),
  lastWeeklyReviewWeek: z.string().optional()
});

export const DailyEntrySchema = z.object({
  dateISO: z.string(),
  completed: z.boolean(),
  notes: z.string().optional(),
  verseId: z.string(),
  identityId: z.string()
});

export const ResponseActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["move", "pray", "connect", "journal", "worship", "practical"])
});

export const LogEntrySchema = z.object({
  id: z.string(),
  createdAtISO: z.string(),
  halt: z.object({
    hungry: z.boolean(),
    angry: z.boolean(),
    lonely: z.boolean(),
    tired: z.boolean()
  }),
  urgeStrength: z.number().min(1).max(5),
  triggerNote: z.string(),
  chosenResponse: ResponseActionSchema,
  outcome: z.enum(["win", "slip", "neutral"])
});

export const WeeklyReviewSchema = z.object({
  weekISO: z.string(), // "2025-W01"
  completedAtISO: z.string(),
  wins: z.array(z.string()),
  triggerPatterns: z.string(),
  gratitude: z.string(),
  nextWeekFocus: z.string(),
  guardrailsReviewed: z.boolean()
});

export const SlipResponseSchema = z.object({
  id: z.string(),
  slipTimestampISO: z.string(),
  confessionNote: z.string(),
  graceReceived: z.boolean(),
  lessonLearned: z.string(),
  repairAction: z.string(),
  accountabilityContacted: z.boolean(),
  prayerNote: z.string().optional()
});

export const AppStateSchema = z.object({
  settings: UserSettingsSchema,
  daily: z.record(DailyEntrySchema), // Keyed by dateISO
  logs: z.array(LogEntrySchema),
  lastSlipAtISO: z.string().optional(),
  weeklyReviews: z.record(WeeklyReviewSchema), // Keyed by weekISO
  slipResponses: z.array(SlipResponseSchema)
});

export type GuardrailItem = z.infer<typeof GuardrailItemSchema>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type DailyEntry = z.infer<typeof DailyEntrySchema>;
export type ResponseAction = z.infer<typeof ResponseActionSchema>;
export type LogEntry = z.infer<typeof LogEntrySchema>;
export type WeeklyReview = z.infer<typeof WeeklyReviewSchema>;
export type SlipResponse = z.infer<typeof SlipResponseSchema>;
export type AppState = z.infer<typeof AppStateSchema>;
