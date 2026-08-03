"use client";

import ClassicTemplate from "@/templates/Classic";
import ModernTemplate from "@/templates/Modern";
import PlayfulTemplate from "@/templates/Playful";
import WeddingTemplate from "@/templates/Wedding";
import { buildTemplateData } from "@/templates/buildTemplateData";
import { buildWeddingTemplateData } from "@/templates/buildWeddingTemplateData";
import type { Invitation } from "@/lib/invitations";

export default function TemplateRenderer({
  invitation,
  templateId,
  guestName,
}: {
  invitation: Invitation;
  templateId?: string | null;
  guestName?: string;
}) {
  if (templateId === "wedding") {
    const weddingData = buildWeddingTemplateData(invitation, guestName);
    return <WeddingTemplate data={weddingData} />;
  }

  const data = buildTemplateData(invitation, guestName);
  switch (templateId) {
    case "modern":
      return <ModernTemplate data={data} />;
    case "playful":
      return <PlayfulTemplate data={data} />;
    default:
      return <ClassicTemplate data={data} />;
  }
}
