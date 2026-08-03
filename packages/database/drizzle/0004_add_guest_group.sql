ALTER TABLE "guests" ADD COLUMN "guest_group" TEXT NOT NULL DEFAULT 'Family';
CREATE INDEX "guests_guest_group_idx" ON "guests"("guest_group");
