import type { Invitation } from "@/lib/invitations";
import type { CmsData } from "@momentscape/database";
import type { TemplateData } from "./types";

export function buildTemplateData(
  invitation: Invitation,
  guestName?: string
): TemplateData {
  const cms = (invitation.cmsData as CmsData) || {};
  const event = cms.event || {} as any;
  const venue = cms.venue || {} as any;
  const host = cms.host || {} as any;
  const design = (invitation.design as any) || {};

  return {
    name: invitation.name,
    slug: invitation.slug,
    sections: ((invitation.sections || []) as any[]).map((s: any) => ({
      id: s.id || "",
      type: s.type || "custom",
      title: s.title || "",
      content: s.content || "",
      visible: s.visible !== false,
    })),
    message: invitation.message,
    eventTitle: event.title || "",
    eventTagline: event.tagline || "",
    eventName: event.eventName || "",
    eventDate: event.eventDate || "",
    eventTime: event.eventTime || "",
    timezone: event.timezone || "",
    venueName: venue.name || "",
    venueAddress: venue.address || "",
    venueNote: venue.note || "",
    hostPrimaryName: host.primaryName || "",
    hostPartnerName: host.partnerName || "",
    guestName,
    colors: {
      primary: design.colors?.primary || "#d4a574",
      secondary: design.colors?.secondary || "#8b7355",
      accent: design.colors?.accent || "#c9a96e",
      background: design.colors?.background || "#faf8f5",
      text: design.colors?.text || "#2d2d2d",
    },
    headingFont: design.fontFamily || "Georgia",
    bodyFont: design.fonts?.body || "Georgia",
  };
}
