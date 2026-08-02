CREATE TYPE "rsvp_status" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED', 'WAITLISTED');

CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "email_verified" TIMESTAMPTZ,
  "image" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ
);

CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

CREATE TABLE "accounts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "provider_account_id" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT
);

CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

CREATE TABLE "sessions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_token" TEXT NOT NULL UNIQUE,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires" TIMESTAMPTZ NOT NULL
);

CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");
CREATE INDEX "sessions_session_token_idx" ON "sessions"("session_token");

CREATE TABLE "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

CREATE TABLE "projects" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "event_date" TIMESTAMPTZ,
  "location" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ
);

CREATE INDEX "projects_user_id_idx" ON "projects"("user_id");
CREATE INDEX "projects_deleted_at_idx" ON "projects"("deleted_at");

CREATE TABLE "templates" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "name" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ
);

CREATE INDEX "templates_user_id_idx" ON "templates"("user_id");
CREATE INDEX "templates_deleted_at_idx" ON "templates"("deleted_at");

CREATE TABLE "invitations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID NOT NULL REFERENCES "projects"("id"),
  "template_id" UUID REFERENCES "templates"("id"),
  "message" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "sent_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ
);

CREATE INDEX "invitations_project_id_idx" ON "invitations"("project_id");
CREATE INDEX "invitations_template_id_idx" ON "invitations"("template_id");
CREATE INDEX "invitations_deleted_at_idx" ON "invitations"("deleted_at");

CREATE TABLE "guests" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "invitation_id" UUID NOT NULL REFERENCES "invitations"("id"),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "personalized_link" TEXT NOT NULL UNIQUE,
  "rsvp_status" rsvp_status DEFAULT 'PENDING' NOT NULL,
  "view_count" INTEGER DEFAULT 0 NOT NULL,
  "last_viewed_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ
);

CREATE INDEX "guests_invitation_id_idx" ON "guests"("invitation_id");
CREATE INDEX "guests_email_idx" ON "guests"("email");
CREATE INDEX "guests_personalized_link_idx" ON "guests"("personalized_link");
CREATE INDEX "guests_rsvp_status_idx" ON "guests"("rsvp_status");
CREATE INDEX "guests_deleted_at_idx" ON "guests"("deleted_at");

CREATE TABLE "rsvps" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "guest_id" UUID NOT NULL REFERENCES "guests"("id"),
  "status" rsvp_status DEFAULT 'PENDING' NOT NULL,
  "dietary_restrictions" TEXT,
  "plus_ones" INTEGER DEFAULT 0 NOT NULL,
  "message" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ
);

CREATE INDEX "rsvps_guest_id_idx" ON "rsvps"("guest_id");
CREATE INDEX "rsvps_status_idx" ON "rsvps"("status");
CREATE INDEX "rsvps_deleted_at_idx" ON "rsvps"("deleted_at");
