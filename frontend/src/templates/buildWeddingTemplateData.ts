import type { Invitation } from "@/lib/invitations";
import type { CmsData, WeddingCmsData } from "@momentscape/database";

export interface WeddingTemplateData {
  name: string;
  slug: string;
  message?: string | null;
  bride: {
    name: string;
    nickname: string;
    parents: string;
    instagram?: string;
    photo?: string;
  };
  groom: {
    name: string;
    nickname: string;
    parents: string;
    instagram?: string;
    photo?: string;
  };
  quote?: string;
  quoteReference?: string;
  story: Array<{ year: string; title: string; description: string }>;
  akad: {
    title: string;
    date: string;
    time: string;
    timezone: string;
    venue: string;
    address: string;
    mapLink: string;
  };
  resepsi: {
    title: string;
    date: string;
    time: string;
    timezone: string;
    venue: string;
    address: string;
    mapLink: string;
  };
  liveStreamUrl?: string;
  gallery: Array<{ url: string; caption: string }>;
  giftAccounts: Array<{ bank: string; accountNumber: string; accountName: string }>;
  giftAddress?: string;
  giftItems: Array<{ name: string; price: string; imageUrl: string }>;
  weddingHashtag?: string;
  guestName?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  headingFont: string;
  bodyFont: string;
}

export function buildWeddingTemplateData(
  invitation: Invitation,
  guestName?: string
): WeddingTemplateData {
  const cms = (invitation.cmsData as CmsData) || {};
  const wedding: WeddingCmsData = cms.wedding || {} as any;
  const design = (invitation.design as any) || {};

  return {
    name: invitation.name,
    slug: invitation.slug,
    message: invitation.message,
    bride: {
      name: wedding.bride?.name || "",
      nickname: wedding.bride?.nickname || "",
      parents: wedding.bride?.parents || "",
      instagram: wedding.bride?.instagram,
      photo: wedding.bride?.photo,
    },
    groom: {
      name: wedding.groom?.name || "",
      nickname: wedding.groom?.nickname || "",
      parents: wedding.groom?.parents || "",
      instagram: wedding.groom?.instagram,
      photo: wedding.groom?.photo,
    },
    quote: wedding.quote,
    quoteReference: wedding.quoteReference,
    story: wedding.story || [],
    akad: {
      title: wedding.akad?.title || "Akad",
      date: wedding.akad?.date || "",
      time: wedding.akad?.time || "",
      timezone: wedding.akad?.timezone || "WIB",
      venue: wedding.akad?.venue || "",
      address: wedding.akad?.address || "",
      mapLink: wedding.akad?.mapLink || "",
    },
    resepsi: {
      title: wedding.resepsi?.title || "Resepsi",
      date: wedding.resepsi?.date || "",
      time: wedding.resepsi?.time || "",
      timezone: wedding.resepsi?.timezone || "WIB",
      venue: wedding.resepsi?.venue || "",
      address: wedding.resepsi?.address || "",
      mapLink: wedding.resepsi?.mapLink || "",
    },
    liveStreamUrl: wedding.liveStreamUrl,
    gallery: wedding.gallery || [],
    giftAccounts: wedding.giftAccounts || [],
    giftAddress: wedding.giftAddress,
    giftItems: wedding.giftItems || [],
    weddingHashtag: wedding.weddingHashtag,
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
