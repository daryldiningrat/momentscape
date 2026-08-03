ALTER TABLE "invitations" ADD COLUMN "user_id" UUID;
ALTER TABLE "invitations" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Untitled Invitation';
ALTER TABLE "invitations" ADD COLUMN "slug" TEXT;
ALTER TABLE "invitations" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "invitations" ADD COLUMN "sections" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE "invitations" ADD COLUMN "design" JSONB DEFAULT '{}'::jsonb;

UPDATE "invitations" SET "user_id" = (SELECT "user_id" FROM "projects" WHERE "projects"."id" = "invitations"."project_id" LIMIT 1);
UPDATE "invitations" SET "slug" = 'inv-' || "id";

ALTER TABLE "invitations" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "invitations" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_slug_unique" UNIQUE ("slug");
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");

CREATE INDEX "invitations_user_id_idx" ON "invitations"("user_id");
CREATE INDEX "invitations_slug_idx" ON "invitations"("slug");
CREATE INDEX "invitations_status_idx" ON "invitations"("status");
