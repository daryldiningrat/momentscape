import { pgTable, uuid, text, timestamp, integer, uniqueIndex, index, pgEnum, jsonb } from "drizzle-orm/pg-core";

export const rsvpStatusEnum = pgEnum("rsvp_status", [
  "PENDING",
  "CONFIRMED",
  "DECLINED",
  "WAITLISTED",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    password: text("password").notNull(),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_deleted_at_idx").on(table.deletedAt),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => [
    uniqueIndex("accounts_provider_provider_account_id_key").on(table.provider, table.providerAccountId),
    index("accounts_user_id_idx").on(table.userId),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionToken: text("session_token").notNull().unique(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_session_token_idx").on(table.sessionToken),
  ]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("verification_tokens_identifier_token_key").on(table.identifier, table.token),
  ]
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    title: text("title").notNull(),
    description: text("description"),
    type: text("type").notNull().default("wedding"),
    eventDate: timestamp("event_date", { withTimezone: true }),
    location: text("location"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    index("projects_deleted_at_idx").on(table.deletedAt),
  ]
);

export const templates = pgTable(
  "templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("templates_user_id_idx").on(table.userId),
    index("templates_deleted_at_idx").on(table.deletedAt),
  ]
);

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").notNull().references(() => projects.id),
    templateId: uuid("template_id").references(() => templates.id),
    userId: uuid("user_id").notNull().references(() => users.id),
    name: text("name").notNull().default("Untitled Invitation"),
    slug: text("slug").notNull().unique(),
    message: text("message"),
    status: text("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    sections: jsonb("sections").default([]),
    design: jsonb("design").default({}),
    cmsData: jsonb("cms_data").default({}),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("invitations_project_id_idx").on(table.projectId),
    index("invitations_template_id_idx").on(table.templateId),
    index("invitations_user_id_idx").on(table.userId),
    index("invitations_slug_idx").on(table.slug),
    index("invitations_status_idx").on(table.status),
    index("invitations_deleted_at_idx").on(table.deletedAt),
  ]
);

export const guests = pgTable(
  "guests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invitationId: uuid("invitation_id").notNull().references(() => invitations.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    guestGroup: text("guest_group").notNull().default("Family"),
    personalizedLink: text("personalized_link").notNull().unique(),
    rsvpStatus: rsvpStatusEnum("rsvp_status").default("PENDING").notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("guests_invitation_id_idx").on(table.invitationId),
    index("guests_email_idx").on(table.email),
    index("guests_personalized_link_idx").on(table.personalizedLink),
    index("guests_rsvp_status_idx").on(table.rsvpStatus),
    index("guests_deleted_at_idx").on(table.deletedAt),
  ]
);

export const rsvps = pgTable(
  "rsvps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guestId: uuid("guest_id").notNull().references(() => guests.id),
    status: rsvpStatusEnum("status").default("PENDING").notNull(),
    dietaryRestrictions: text("dietary_restrictions"),
    plusOnes: integer("plus_ones").default(0).notNull(),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("rsvps_guest_id_idx").on(table.guestId),
    index("rsvps_status_idx").on(table.status),
    index("rsvps_deleted_at_idx").on(table.deletedAt),
  ]
);
